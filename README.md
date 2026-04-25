# SHUTTER COUNT PER CANON EOS R

Web app statica browser-only per leggere metadati `.CR3` Canon direttamente nel browser con ExifTool WebAssembly.

Questa build web e' volutamente limitata ai soli modelli Canon EOS R confermati.

## Caratteristiche

- nessun backend
- nessun upload dei file
- parsing locale nel browser
- drag & drop `.CR3`
- UI in italiano con risultati principali evidenti
- debug secondario espandibile
- form feedback con invio email

## Stack scelto

- HTML, CSS e JavaScript modulari
- ExifTool in WebAssembly via package browser-side `@uswriting/exiftool`
- runtime ESM/WASM vendorizzato localmente nel progetto
- nessun bundler obbligatorio per partire subito

Questa scelta permette test rapidi con più persone perché basta pubblicare file statici su un hosting qualunque.

## File

```text
SHUTTER COUNT/
├── app.js
├── index.html
├── README.md
├── styles.css
└── vendor/
```

## Avvio locale

Apri la cartella con un piccolo server statico, ad esempio:

```bash
cd "/Users/solea_macstudio/Documents/SHUTTER COUNT"
python3 serve.py
```

Poi visita:

```text
http://127.0.0.1:8080
```

## Deploy

Puoi pubblicarla come sito statico su:

- Vercel
- Netlify
- GitHub Pages
- qualsiasi web server statico

## Note importanti

- Il file `.CR3` resta nel browser dell'utente.
- I moduli ESM e il file `.wasm` sono inclusi localmente nel progetto.
- Serve un server statico reale: aprire `index.html` direttamente da filesystem non e' consigliato.
- Se il server non serve bene il `.wasm`, il runtime non parte.
- Il form feedback usa un servizio esterno per inoltrare il report testuale del test.
- Al primo invio del form potrebbe essere necessaria la conferma email del servizio.
- Il parser cerca in modo robusto chiavi come `Model`, `[IFD0] Model`, `[Canon] ShutterCount`, `ShutterCount`, `ExposureCount`.

## Compatibilità modelli

Modelli Canon EOS R confermati in questa build web:

- Canon EOS R5
- Canon EOS R6
- Canon EOS R6 Mark II
- Canon EOS R8
- Canon EOS R50

Gli altri modelli serie R non devono essere considerati supportati in questa versione web.
