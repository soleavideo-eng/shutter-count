# SHUTTER COUNT PER CANON EOS R

Web app statica browser-only per leggere metadati `.CR3` Canon direttamente nel browser con ExifTool WebAssembly.

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
- Il form feedback usa FormSubmit e invia una mail a `soleavideo@gmail.com`.
- Al primo invio del form potrebbe essere necessaria la conferma email del servizio.
- Il parser cerca in modo robusto chiavi come `Model`, `[IFD0] Model`, `[Canon] ShutterCount`, `ShutterCount`, `ExposureCount`.

## Compatibilità modelli

L'app riconosce i modelli Canon EOS R in modo ampio.

Modelli marcati come testati:

- Canon EOS R6 Mark II
- Canon EOS R8

Gli altri modelli serie R vengono mostrati come riconosciuti ma non ancora testati.
