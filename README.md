# BedrockDock website

Bedrijfswebsite van BedrockDock: statische pagina's (`index.html` en `harborlight.html`), tweetalig. Engels staat in de hoofdmap, Nederlands in `nl/`.

## Werkwijze

- Werk altijd op de branch `test`.
- Klaar en gecontroleerd? Merge `test` naar `main`. De site publiceert vanaf `main`.

## Lokaal bekijken

Gebruik de Live Server-extensie in VS Code. Een los geopend bestand werkt ook, maar de taalknop springt dan naar een map in plaats van naar de pagina.

## Aanpassen

- Engels is de basistaal: de HTML in de hoofdmap is Engels.
- De Nederlandse teksten staan in het `<script>`-blok onderaan elke pagina: in `index.html` in de lijst `nl` (met de Engelse versie in `en`), in `harborlight.html` in de lijst `NL`.
- **Na elke wijziging:** draai `node tools/build-nl.js`. Dat maakt `nl/index.html` en `nl/harborlight.html` opnieuw. Pas de bestanden in `nl/` nooit zelf aan.
- Een nieuwe tekst die vertaald moet worden krijgt een `data-i18n="sleutel"` en die sleutel in de NL-lijst. Het script meldt sleutels zonder vertaling.
- In een tekst tussen enkele aanhalingstekens in het script moet een apostrof als `\'` staan (bijvoorbeeld `don\'t`), anders werkt het hele script niet meer.
- Het mailadres van het contactformulier staat in dezelfde script-sectie (`TO`).
- Kleuren staan bovenaan in `:root`.
- `harborlight.html` is de productpagina van Harborlight. Screenshots staan in `img/harborlight/`.
- `img/og-home.png` en `img/og-home-nl.png` zijn de afbeeldingen die je ziet als iemand de homepage deelt.
- Nieuwe pagina? Voeg hem toe aan `sitemap.xml` (met beide talen) en aan `PAGES` in `tools/build-nl.js`.
- Openstaande taken staan in `TODO.md`.
