# WIEN — Bezirks-Guide

Ein kuratierter Restaurant-Guide für alle 23 Wiener Bezirke als Scrollytelling-Webapp:
Die Karte ist die Bühne — beim Scrollen geht die Reise durch jeden Bezirk mit je drei Adressen
(💸 Cheap Eat · 🍴 Every Day · ✨ Not So Everyday).

**Live:** https://koarlk.github.io/wien-guide/

## Lokale eintragen

Alle Empfehlungen liegen in [`data.js`](data.js) — pro Bezirk drei Einträge
(`cheapEat`, `everyday`, `notSoEveryday`) mit Name, Kategorie, Bewertung, Preisklasse,
Beschreibung, Adresse, `coords: [Breite, Länge]` und Tags. Viele Einträge sind noch Platzhalter.

## Technik

Statische Webapp ohne Build-Schritt: HTML, CSS, Vanilla JS,
[Leaflet](https://leafletjs.com) mit [CARTO](https://carto.com/attributions) Dark-Tiles.

## Datenquellen

- Bezirksgrenzen: [Stadt Wien — data.wien.gv.at](https://data.wien.gv.at), Lizenz CC BY 4.0 (vereinfacht)
- Kartendaten: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, Tiles © CARTO
