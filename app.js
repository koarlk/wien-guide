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
let districtLayer = null;
let currentDistrictNumber = null;
let activeKey = null;
let sections = [];

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
  markersLayer.clearLayers();
  markerByTier = {};
  TIERS.forEach(tier => {
    const spot = d.spots[tier.key];
    if (!spot.coords) return;
    const marker = L.marker(spot.coords, { icon: markerIcon(tier) }).addTo(markersLayer);
    marker.bindPopup(
      `<strong>${spot.name}</strong><br>` +
      `<span class="popup-tier">${tier.emoji} ${tier.label} · ${spot.category}</span><br>` +
      `<span class="popup-address">${spot.address}</span>`
    );
    markerByTier[tier.key] = marker;
  });
}

function highlightDistrict(num){
  if (districtLayer){
    map.removeLayer(districtLayer);
    districtLayer = null;
  }
  if (!num) return;
  const feature = DISTRICT_GEO.features.find(f => f.properties.BEZNR === num);
  if (!feature) return;
  districtLayer = L.geoJSON(feature, {
    interactive: false,
    style: {
      className: 'district-outline',
      color: '#e3c283',
      weight: 2,
      opacity: 0.9,
      fillColor: '#e3c283',
      fillOpacity: 0.06
    }
  }).addTo(map);
}

function showOverview(d){
  if (districtLayer){
    map.flyToBounds(districtLayer.getBounds(), { padding: [60, 60], duration: 1.2 });
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

function spotStepHtml(tier, spot, d){
  const fullStars = Math.round(spot.rating);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(spot.name + ' ' + spot.address);

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
        <a class="map-link" href="${mapsUrl}" target="_blank" rel="noopener">Auf Google Maps öffnen</a>
      </div>
    </section>
  `;
}

function renderJourney(){
  stepsWrap.innerHTML = DISTRICTS.map(d =>
    chapterHtml(d) + TIERS.map(tier => spotStepHtml(tier, d.spots[tier.key], d)).join('')
  ).join('');
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

  if (!d){
    showCity();
  } else if (tier){
    const spot = d.spots[tier];
    if (spot && spot.coords) flyToSpot(spot.coords);
  } else {
    showOverview(d);
  }
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
  if (current){
    setState(Number(current.dataset.district), current.dataset.tier || null);
  } else {
    setState(null, null);
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0) + '%';
}

function scrollToEl(el){
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}

function jumpToDistrict(num){
  const chapter = stepsWrap.querySelector(`.chapter[data-district="${num}"]`);
  if (chapter) scrollToEl(chapter);
}

window.addEventListener('scroll', syncActive, { passive: true });
window.addEventListener('resize', syncActive, { passive: true });

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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
renderChips();
renderDots();
renderJourney();
syncActive();
