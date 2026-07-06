const input = document.getElementById('districtInput');
const suggestions = document.getElementById('suggestions');
const stepsWrap = document.getElementById('steps');
const chipsWrap = document.getElementById('districtChips');
const stepDots = document.getElementById('stepDots');
const hud = document.getElementById('hud');
const hudNum = hud.querySelector('.hud-num');
const hudName = hud.querySelector('.hud-name');
const progress = document.getElementById('progress');

const TIER_COLORS = {
  cheapEat: '#5eead4',
  everyday: '#fbbf24',
  notSoEveryday: '#c084fc'
};

const VIENNA_CENTER = [48.2082, 16.3738];

let map = null;
let markersLayer = null;
let markerByTier = {};
let pizzaMarkerByRank = {};
let outlineByNum = {};
let activeOutline = null;
let currentDistrictNumber = null;
let activeKey = null;
let sections = [];
let pendingFlight = null;

/* ---------- Karte ---------- */

function initMap(){
  map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    keyboard: false,
    // Vektor-Pfade weit über den Viewport hinaus zeichnen, damit der
    // Bezirks-Umriss beim Rauszoomen nicht abgeschnitten erscheint.
    renderer: L.svg({ padding: 5 })
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  map.setView(VIENNA_CENTER, 12);
}

/* Auf Touch-Geräten steuert allein das Scrollen die Karte:
   Dragging/Pinch würden sonst das Seiten-Scrollen abfangen. */
function setMapTouchMode(touch){
  if (touch){
    map.dragging.disable();
    map.touchZoom.disable();
  } else {
    map.dragging.enable();
    map.touchZoom.enable();
  }
}

const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
function syncTouchMode(){
  setMapTouchMode(coarsePointer.matches);
}

function markerIcon(tier){
  return L.divIcon({
    className: 'spot-marker',
    html: `<span class="dot tier-${tier.key}">${tier.emoji}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

function updateMarkers(d){
  // Alte Marker sanft ausblenden und erst danach entfernen (Crossfade).
  const old = markersLayer;
  if (old){
    old.eachLayer(m => { if (m.setOpacity) m.setOpacity(0); });
    setTimeout(() => map.removeLayer(old), 500);
  }
  markersLayer = L.layerGroup().addTo(map);
  markerByTier = {};
  pizzaMarkerByRank = {};
  TIERS.forEach(tier => {
    const spot = d.spots[tier.key];
    if (!spot.coords) return;
    const marker = L.marker(spot.coords, { icon: markerIcon(tier), opacity: 0 }).addTo(markersLayer);
    marker.bindPopup(
      `<strong>${spot.name}</strong><br>` +
      `<span class="popup-tier">${tier.emoji} ${tier.label} · ${spot.category}</span><br>` +
      `<span class="popup-address">${spot.address}</span>`
    );
    markerByTier[tier.key] = marker;
  });
  // Neue Marker einblenden: Reflow erzwingen, damit die Transition greift.
  Object.values(markerByTier).forEach(m => {
    const el = m.getElement();
    if (el) el.getBoundingClientRect();
    m.setOpacity(1);
  });
}

/* Alle Umrisse einmalig anlegen, solange die Karte ruht: Pfade, die mitten
   in einer flyTo-Animation hinzugefügt werden, projiziert Leaflet falsch und
   sie springen beim Animationsende an ihre Position. Danach wird nur noch
   per CSS-Klasse ein-/ausgeblendet. */
function initDistrictOutlines(){
  L.geoJSON(DISTRICT_GEO, {
    interactive: false,
    style: {
      className: 'district-outline',
      color: '#e3c283',
      weight: 2,
      opacity: 0.9,
      fillColor: '#e3c283',
      fillOpacity: 0.06
    },
    onEachFeature: (feature, layer) => {
      outlineByNum[feature.properties.BEZNR] = layer;
    }
  }).addTo(map);
}

function pizzaMarkerIcon(p){
  return L.divIcon({
    className: 'spot-marker',
    html: `<span class="dot tier-pizza">${p.rank}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

/* Alle Pizzerien des Rankings als nummerierte Marker zeigen (Crossfade wie updateMarkers). */
function updatePizzaMarkers(){
  const old = markersLayer;
  if (old){
    old.eachLayer(m => { if (m.setOpacity) m.setOpacity(0); });
    setTimeout(() => map.removeLayer(old), 500);
  }
  markersLayer = L.layerGroup().addTo(map);
  markerByTier = {};
  pizzaMarkerByRank = {};
  PIZZA_RANKING.forEach(p => {
    const marker = L.marker(p.coords, { icon: pizzaMarkerIcon(p), opacity: 0 }).addTo(markersLayer);
    marker.bindPopup(
      `<strong>#${p.rank} ${p.name}</strong><br>` +
      `<span class="popup-tier">🍕 ${p.category}</span><br>` +
      `<span class="popup-address">${p.address}</span>`
    );
    pizzaMarkerByRank[p.rank] = marker;
  });
  Object.values(pizzaMarkerByRank).forEach(m => {
    const el = m.getElement();
    if (el) el.getBoundingClientRect();
    m.setOpacity(1);
  });
}

function highlightDistrict(num){
  if (activeOutline){
    const el = activeOutline.getElement();
    if (el) el.classList.remove('is-active');
    activeOutline = null;
  }
  if (!num) return;
  const layer = outlineByNum[num];
  if (!layer) return;
  activeOutline = layer;
  const el = layer.getElement();
  if (el) el.classList.add('is-active');
}

function showOverview(d){
  if (activeOutline){
    map.flyToBounds(activeOutline.getBounds(), { padding: [60, 60], duration: 1.2 });
    return;
  }
  const coords = TIERS.map(t => d.spots[t.key].coords).filter(Boolean);
  if (coords.length){
    map.flyToBounds(coords, { padding: [70, 70], maxZoom: 14, duration: 1.2 });
  }
}

function showCity(){
  map.flyTo(VIENNA_CENTER, 12, { duration: 1.2 });
}

function flyToSpot(coords){
  const zoom = 15;
  const isDesktop = window.innerWidth >= 940;
  // Marker versetzt zentrieren, damit er nicht unter der Lokal-Card liegt:
  // Desktop -> Card links, Marker rechts der Mitte; Mobil -> Card unten, Marker oben.
  const offsetPx = isDesktop
    ? L.point(window.innerWidth * 0.15, 0)
    : L.point(0, -window.innerHeight * 0.16);
  const center = map.unproject(map.project(coords, zoom).subtract(offsetPx), zoom);
  map.flyTo(center, zoom, { duration: 1.4, easeLinearity: 0.22 });
}

/* ---------- Rendering ---------- */

function districtLabel(d){
  return `${d.number}. ${d.name}`;
}

function findByDistrict(query){
  const q = query.trim().toLowerCase();
  return DISTRICTS.find(d =>
    districtLabel(d).toLowerCase() === q ||
    d.name.toLowerCase() === q ||
    String(d.number) === q
  );
}

function renderChips(){
  chipsWrap.innerHTML = DISTRICTS.map(d =>
    `<button type="button" data-number="${d.number}" title="${districtLabel(d)}">${d.number}</button>`
  ).join('');
}

function renderDots(){
  stepDots.innerHTML = TIERS.map(tier =>
    `<button type="button" data-tier="${tier.key}" style="--dot:${TIER_COLORS[tier.key]}" title="${tier.label}"></button>`
  ).join('');
}

function chapterHtml(d){
  return `
    <section class="chapter" data-district="${d.number}">
      <div class="chapter-inner">
        <div class="ch-num">${d.number}. Bezirk</div>
        <div class="ch-name">${d.name}</div>
        <div class="ch-rule"></div>
      </div>
    </section>
  `;
}

function starsHtml(rating){
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

function mapLinkHtml(spot){
  const mapsQuery = encodeURIComponent(spot.name + ' ' + spot.address);
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + mapsQuery;
  return `<a class="map-link" href="${mapsUrl}" data-app-url="comgooglemaps://?q=${mapsQuery}" target="_blank" rel="noopener">Auf Google Maps öffnen</a>`;
}

function spotStepHtml(tier, spot, d){
  const stars = starsHtml(spot.rating);

  return `
    <section class="step" data-district="${d.number}" data-tier="${tier.key}">
      <div class="card tier-${tier.key}">
        <div class="card-district">${districtLabel(d)}</div>
        <div class="eyebrow">${tier.emoji} ${tier.label}</div>
        <h2>${spot.name}</h2>
        <div class="category">${spot.category}</div>
        <div class="meta-row">
          <span class="rating"><span class="stars">${stars}</span> ${spot.rating.toFixed(1)}</span>
          <span class="price">${spot.priceLevel}</span>
        </div>
        <p class="description">${spot.description}</p>
        <div class="address">📍 ${spot.address}</div>
        <div class="tags">${spot.tags.map(t => `<span>${t}</span>`).join('')}</div>
        ${mapLinkHtml(spot)}
      </div>
    </section>
  `;
}

function pizzaChapterHtml(){
  return `
    <section class="chapter" data-pizza-chapter>
      <div class="chapter-inner">
        <div class="ch-num">🍕 Das Ranking</div>
        <div class="ch-name">Die besten Pizzerien der Stadt</div>
        <div class="ch-rule"></div>
      </div>
    </section>
  `;
}

function pizzaStepHtml(p){
  return `
    <section class="step" data-pizza="${p.rank}">
      <div class="card tier-pizza">
        <div class="card-district">Pizza-Ranking</div>
        <div class="eyebrow">🍕 Platz ${p.rank} von ${PIZZA_RANKING.length}</div>
        <h2>${p.name}</h2>
        <div class="category">${p.category}</div>
        <div class="meta-row">
          <span class="rating"><span class="stars">${starsHtml(p.rating)}</span> ${p.rating.toFixed(1)}</span>
          <span class="price">${p.priceLevel}</span>
        </div>
        <p class="description">${p.description}</p>
        <div class="address">📍 ${p.address}</div>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        ${mapLinkHtml(p)}
      </div>
    </section>
  `;
}

function renderJourney(){
  stepsWrap.innerHTML =
    DISTRICTS.map(d =>
      chapterHtml(d) + TIERS.map(tier => spotStepHtml(tier, d.spots[tier.key], d)).join('')
    ).join('') +
    pizzaChapterHtml() +
    PIZZA_RANKING.map(pizzaStepHtml).join('');
  sections = Array.from(stepsWrap.querySelectorAll('section'));
}

/* ---------- Scroll-Steuerung ---------- */

function setState(num, tier){
  const key = num ? `${num}:${tier || 'chapter'}` : 'intro';
  if (key === activeKey) return;
  activeKey = key;

  const d = num ? DISTRICTS.find(x => x.number === num) : null;

  if (num !== currentDistrictNumber){
    currentDistrictNumber = num;
    highlightDistrict(d ? d.number : null);
    if (d) updateMarkers(d);
    hud.classList.toggle('visible', !!d);
    stepDots.classList.toggle('visible', !!d);
    if (d){
      hudNum.textContent = d.number;
      hudName.textContent = d.name;
    }
    document.querySelectorAll('.district-chips button').forEach(btn => {
      btn.classList.toggle('active', d && Number(btn.dataset.number) === d.number);
    });
  }

  document.querySelectorAll('#steps .step').forEach(step => {
    step.classList.toggle('active',
      !!d && Number(step.dataset.district) === num && step.dataset.tier === tier);
  });
  document.querySelectorAll('.step-dots button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tier === tier);
  });
  Object.entries(markerByTier).forEach(([tierKey, marker]) => {
    const dot = marker.getElement() && marker.getElement().querySelector('.dot');
    if (dot) dot.classList.toggle('is-active', tierKey === tier);
  });

  // Flug erst im nächsten Frame starten, damit der DOM-Umbau
  // (Marker, Umriss, Reflows) die ersten Animationsframes nicht ruckeln lässt.
  queueFlight(() => {
    if (!d){
      showCity();
    } else if (tier){
      const spot = d.spots[tier];
      if (spot && spot.coords) flyToSpot(spot.coords);
    } else {
      showOverview(d);
    }
  });
}

/* Pizza-Ranking: eigener Modus neben den Bezirken. currentDistrictNumber
   bekommt den Sentinel 'pizza', damit der Wechsel von/zu Bezirken die
   Marker und den Umriss genau einmal umbaut. */
function setPizzaState(rank){
  const key = `pizza:${rank || 'chapter'}`;
  if (key === activeKey) return;
  activeKey = key;

  if (currentDistrictNumber !== 'pizza'){
    currentDistrictNumber = 'pizza';
    highlightDistrict(null);
    updatePizzaMarkers();
    hud.classList.add('visible');
    hudNum.textContent = '🍕';
    hudName.textContent = 'Die besten Pizzerien';
    stepDots.classList.remove('visible');
    document.querySelectorAll('.district-chips button').forEach(btn => {
      btn.classList.remove('active');
    });
  }

  document.querySelectorAll('#steps .step').forEach(step => {
    step.classList.toggle('active', Number(step.dataset.pizza) === rank);
  });
  Object.entries(pizzaMarkerByRank).forEach(([r, marker]) => {
    const dot = marker.getElement() && marker.getElement().querySelector('.dot');
    if (dot) dot.classList.toggle('is-active', Number(r) === rank);
  });

  queueFlight(() => {
    const p = rank && PIZZA_RANKING.find(x => x.rank === rank);
    if (p){
      flyToSpot(p.coords);
    } else {
      map.flyToBounds(PIZZA_RANKING.map(x => x.coords), { padding: [70, 70], duration: 1.2 });
    }
  });
}

function queueFlight(fn){
  pendingFlight = fn;
  requestAnimationFrame(() => {
    if (pendingFlight === fn){
      pendingFlight = null;
      fn();
    }
  });
}

/* Welche Sektion kreuzt gerade die Bildschirmmitte? */
function syncActive(){
  const midline = window.innerHeight * 0.5;
  let current = null;
  for (const el of sections){
    const rect = el.getBoundingClientRect();
    if (rect.top <= midline && rect.bottom > midline){
      current = el;
      break;
    }
  }
  if (current && (current.dataset.pizza || current.hasAttribute('data-pizza-chapter'))){
    setPizzaState(current.dataset.pizza ? Number(current.dataset.pizza) : null);
  } else if (current){
    setState(Number(current.dataset.district), current.dataset.tier || null);
  } else {
    setState(null, null);
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0) + '%';
}

/* Kurze Distanzen smooth scrollen; bei weiten Sprüngen würde das Smooth-
   Scrolling durch alle dazwischenliegenden Bezirke rauschen. Stattdessen:
   Story-Spalte kurz ausblenden, sofort springen, wieder einblenden — den
   sichtbaren Übergang macht der eine Kartenflug zum Ziel. */
const content = document.querySelector('.content');
let teleportTimer = null;

function scrollPageTo(top){
  top = Math.max(top, 0);
  // Schwelle ~ ein Bezirksblock (Kapitel 82vh + 3 Steps à ~100vh):
  // innerhalb eines Bezirks immer smooth, ab Nachbarbezirk teleportieren.
  if (Math.abs(top - window.scrollY) <= window.innerHeight * 4.5){
    window.scrollTo({ top, behavior: 'smooth' });
    return;
  }
  clearTimeout(teleportTimer);
  content.classList.add('is-teleporting');
  teleportTimer = setTimeout(() => {
    // 'instant' statt 'auto': das globale scroll-behavior:smooth würde
    // 'auto' wieder in einen Smooth-Scroll durch alle Bezirke verwandeln.
    window.scrollTo({ top, behavior: 'instant' });
    content.classList.remove('is-teleporting');
  }, 240);
}

function scrollToEl(el){
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
  scrollPageTo(top);
}

function jumpToDistrict(num){
  const chapter = stepsWrap.querySelector(`.chapter[data-district="${num}"]`);
  if (chapter) scrollToEl(chapter);
}

/* Scroll-Events auf einen Abgleich pro Frame drosseln —
   syncActive misst alle Sektionen und wäre pro Event zu teuer. */
let scrollTick = false;
function onScrollSync(){
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    scrollTick = false;
    syncActive();
  });
}

window.addEventListener('scroll', onScrollSync, { passive: true });
window.addEventListener('resize', onScrollSync, { passive: true });

/* ---------- Suche & Navigation ---------- */

function showSuggestions(query){
  const q = query.trim().toLowerCase();
  if (!q){
    suggestions.classList.remove('open');
    suggestions.innerHTML = '';
    return;
  }
  const matches = DISTRICTS.filter(d =>
    districtLabel(d).toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
  );
  if (matches.length === 0){
    suggestions.classList.remove('open');
    suggestions.innerHTML = '';
    return;
  }
  suggestions.innerHTML = matches.map(d =>
    `<div data-number="${d.number}">${districtLabel(d)}</div>`
  ).join('');
  suggestions.classList.add('open');
}

input.addEventListener('input', () => showSuggestions(input.value));

suggestions.addEventListener('click', (e) => {
  const target = e.target.closest('[data-number]');
  if (!target) return;
  const d = DISTRICTS.find(x => x.number === Number(target.dataset.number));
  input.value = districtLabel(d);
  suggestions.classList.remove('open');
  jumpToDistrict(d.number);
});

chipsWrap.addEventListener('click', (e) => {
  const target = e.target.closest('[data-number]');
  if (!target) return;
  const d = DISTRICTS.find(x => x.number === Number(target.dataset.number));
  input.value = districtLabel(d);
  jumpToDistrict(d.number);
});

stepDots.addEventListener('click', (e) => {
  const target = e.target.closest('[data-tier]');
  if (!target || !currentDistrictNumber) return;
  const step = stepsWrap.querySelector(
    `.step[data-district="${currentDistrictNumber}"][data-tier="${target.dataset.tier}"]`);
  if (step) scrollToEl(step);
});

hud.addEventListener('click', () => {
  scrollPageTo(0);
});

document.getElementById('pizzaJump').addEventListener('click', () => {
  const chapter = stepsWrap.querySelector('[data-pizza-chapter]');
  if (chapter) scrollToEl(chapter);
});

/* Auf iOS direkt in die Google-Maps-App: Universal Links aus target="_blank"
   öffnen die App nicht zuverlässig, daher das App-Schema ansteuern und auf
   die Web-URL zurückfallen, wenn die App fehlt (Seite bleibt dann sichtbar).
   Android öffnet die App bereits über den normalen https-Link (App Links). */
function isIOSDevice(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

stepsWrap.addEventListener('click', (e) => {
  const link = e.target.closest('.map-link');
  if (!link || !isIOSDevice()) return;
  e.preventDefault();
  const fallback = setTimeout(() => { window.location.href = link.href; }, 1200);
  const cancel = () => clearTimeout(fallback);
  window.addEventListener('pagehide', cancel, { once: true });
  document.addEventListener('visibilitychange', cancel, { once: true });
  window.location.href = link.dataset.appUrl;
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) {
    suggestions.classList.remove('open');
  }
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    const d = findByDistrict(input.value);
    if (d){
      input.value = districtLabel(d);
      suggestions.classList.remove('open');
      jumpToDistrict(d.number);
    }
  }
});

/* ---------- Start ---------- */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

initMap();
initDistrictOutlines();
syncTouchMode();
if (coarsePointer.addEventListener) coarsePointer.addEventListener('change', syncTouchMode);
renderChips();
renderDots();
renderJourney();
syncActive();
