# BedrockDock website

Bedrijfswebsite van BedrockDock: één statische pagina (`index.html`), tweetalig (Engels als basis, Nederlands als vertaling), zonder build-stap.

## Werkwijze

- Werk altijd op de branch `test`.
- Klaar en gecontroleerd? Merge `test` naar `main`. De site publiceert vanaf `main`.

## Lokaal bekijken

Open `index.html` in de browser, of gebruik de Live Server-extensie in VS Code.

## Aanpassen

- Engels is de basistaal: de HTML zelf is Engels. Teksten staan ook in het `<script>`-blok onderaan, in de lijsten `en` en `nl`. Pas een Engelse tekst zowel in de HTML als in `en` aan, en de vertaling in `nl`.
- Het mailadres van het contactformulier staat in dezelfde script-sectie (`TO`).
- Kleuren staan bovenaan in `:root`.
