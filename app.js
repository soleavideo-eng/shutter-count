const APP_TITLE = "SHUTTER COUNT PER CANON EOS R";
const TESTED_MODELS = new Set([
  "Canon EOS R5",
  "Canon EOS R6",
  "Canon EOS R6 Mark II",
  "Canon EOS R8",
  "Canon EOS R50",
]);

const MODEL_ROUTING = new Map([
  ["Canon EOS R5", { tier: 1, offset: 0x0af1, width: 4, kind: "lifetime" }],
  ["Canon EOS R6", { tier: 1, offset: 0x0af1, width: 4, kind: "lifetime" }],
  ["Canon EOS R6 Mark II", { tier: 1, offset: 0x0d29, width: 4, kind: "lifetime" }],
  ["Canon EOS R8", { tier: 1, offset: 0x0d29, width: 4, kind: "lifetime" }],
  ["Canon EOS R50", { tier: 1, offset: 0x0d29, width: 4, kind: "lifetime" }],
  ["Canon EOS R3", { tier: 2, offset: 0x0af1, width: 4, kind: "lifetime" }],
  ["Canon EOS R5 Mark II", { tier: 2, offset: 0x069c, width: 4, kind: "lifetime" }],
  ["Canon EOS R1", { tier: 2, offset: 0x086d, width: 2, kind: "imageCount" }],
  ["Canon EOS R6 Mark III", { tier: 2, offset: 0x086d, width: 2, kind: "imageCount" }],
  ["Canon EOS R50 V", { tier: 2, offset: 0x086d, width: 2, kind: "imageCount" }],
]);

const UNSUPPORTED_MODELS = new Set([
  "Canon EOS R",
  "Canon EOS RP",
  "Canon EOS R7",
  "Canon EOS R10",
  "Canon EOS R100",
]);

const MODEL_ALIASES = new Map([
  ["canon eos r", "Canon EOS R"],
  ["canon eos rp", "Canon EOS RP"],
  ["canon eos r3", "Canon EOS R3"],
  ["canon eos r5", "Canon EOS R5"],
  ["canon eos r5 mark ii", "Canon EOS R5 Mark II"],
  ["canon eos r5 mk ii", "Canon EOS R5 Mark II"],
  ["canon eos r5m2", "Canon EOS R5 Mark II"],
  ["canon eos r5 m2", "Canon EOS R5 Mark II"],
  ["canon eos r5 c", "Canon EOS R5 C"],
  ["canon eos r6", "Canon EOS R6"],
  ["canon eos r6 mark ii", "Canon EOS R6 Mark II"],
  ["canon eos r6 mk ii", "Canon EOS R6 Mark II"],
  ["canon eos r6m2", "Canon EOS R6 Mark II"],
  ["canon eos r6 m2", "Canon EOS R6 Mark II"],
  ["canon eos r6mkii", "Canon EOS R6 Mark II"],
  ["canon eos r6 mkii", "Canon EOS R6 Mark II"],
  ["canon eos r6 ii", "Canon EOS R6 Mark II"],
  ["canon eos r6 mark iii", "Canon EOS R6 Mark III"],
  ["canon eos r6 mk iii", "Canon EOS R6 Mark III"],
  ["canon eos r6m3", "Canon EOS R6 Mark III"],
  ["canon eos r6 m3", "Canon EOS R6 Mark III"],
  ["canon eos r6mkiii", "Canon EOS R6 Mark III"],
  ["canon eos r6 mkiii", "Canon EOS R6 Mark III"],
  ["canon eos r6 iii", "Canon EOS R6 Mark III"],
  ["canon eos r7", "Canon EOS R7"],
  ["canon eos r8", "Canon EOS R8"],
  ["canon eos r10", "Canon EOS R10"],
  ["canon eos r1", "Canon EOS R1"],
  ["canon eos r50", "Canon EOS R50"],
  ["canon eos r50 v", "Canon EOS R50 V"],
  ["canon eos r100", "Canon EOS R100"],
  ["canon eos ra", "Canon EOS Ra"],
  ["eos r", "Canon EOS R"],
  ["eos rp", "Canon EOS RP"],
  ["eos r3", "Canon EOS R3"],
  ["eos r5", "Canon EOS R5"],
  ["eos r5 mark ii", "Canon EOS R5 Mark II"],
  ["eos r5 mk ii", "Canon EOS R5 Mark II"],
  ["eos r5m2", "Canon EOS R5 Mark II"],
  ["eos r6", "Canon EOS R6"],
  ["eos r6 mark ii", "Canon EOS R6 Mark II"],
  ["eos r6 mk ii", "Canon EOS R6 Mark II"],
  ["eos r6m2", "Canon EOS R6 Mark II"],
  ["eos r6 mark iii", "Canon EOS R6 Mark III"],
  ["eos r6 mk iii", "Canon EOS R6 Mark III"],
  ["eos r6m3", "Canon EOS R6 Mark III"],
  ["eos r7", "Canon EOS R7"],
  ["eos r8", "Canon EOS R8"],
  ["eos r10", "Canon EOS R10"],
  ["eos r50", "Canon EOS R50"],
  ["eos r50 v", "Canon EOS R50 V"],
  ["eos r100", "Canon EOS R100"],
  ["eos r1", "Canon EOS R1"],
]);

const MODEL_SIMPLE_KEYS = ["model", "cameramodelname"];
const MAKE_SIMPLE_KEYS = ["make"];
const SHUTTER_COUNT_SIMPLE_KEYS = ["shuttercount", "shuttercounter"];
const LOCAL_WASM_URL = new URL(
  "./vendor/@6over3/zeroperl-ts/dist/esm/zeroperl.wasm",
  window.location.href,
).toString();
const FEEDBACK_ENDPOINT = "https://formsubmit.co/ajax/soleavideo@gmail.com";
const DEFAULT_LANG = "it";

const translations = {
  it: {
    title: "SHUTTER COUNT PER CANON EOS R",
    subtitle:
      "Lettura locale dei metadati CR3 Canon direttamente nel browser. Il file resta sul dispositivo dell'utente: nessun upload, nessun server, nessun passaggio esterno dei RAW.",
    chooseFile: "Seleziona file",
    clear: "Pulisci",
    formatLabel: "Formato",
    formatValue: "CR3 Canon",
    privacyLabel: "Privacy",
    privacyValue: "elaborazione nel browser",
    dropTitle: "Trascina qui un file .CR3",
    dropText:
      "Oppure usa il pulsante di selezione. L'analisi parte subito e mostra modello, shutter count, stato di lettura, compatibilità e file selezionato senza aprire il pannello debug.",
    readingStatus: "STATO LETTURA",
    ready: "Pronto",
    readyNote:
      "Trascina un file CR3 oppure selezionalo manualmente. ExifTool gira direttamente nel browser.",
    runtimeLoading: "Libreria metadata in caricamento…",
    runtimeReady: "Runtime ExifTool WASM pronto. Moduli e WebAssembly sono serviti localmente.",
    runtimeUnavailable:
      "Runtime ExifTool WASM non disponibile. Verifica che il server statico esponga correttamente i file locali ESM/WASM.",
    model: "MODELLO",
    count: "COUNT",
    compatibility: "COMPATIBILITÀ",
    selectedFile: "FILE SELEZIONATO",
    shutterCountCard: "SHUTTER COUNT",
    noFile: "Nessun file selezionato",
    debug: "DEBUG",
    debugCaption:
      "Area secondaria con chiavi rilevate davvero, mappa semplificata e output ExifTool per troubleshooting.",
    noDebug: "Nessun debug disponibile.",
    feedback: "FEEDBACK",
    feedbackTitle: "Aiutami a capire se l'app funziona davvero",
    feedbackCopy:
      "Invia il tuo feedback insieme ai dati tecnici dell'analisi corrente. Il file CR3 non viene caricato: viene inviato solo un report testuale con il risultato del test.",
    testerName: "Nome",
    testerNamePlaceholder: "Facoltativo",
    replyEmail: "Email",
    replyEmailPlaceholder: "Per eventuale risposta",
    userCameraModel: "Modello fotocamera usato",
    userCameraModelPlaceholder: "Es. Canon EOS R6 Mark II",
    browserDevice: "Browser / dispositivo",
    browserDevicePlaceholder: "Es. Safari su MacBook Air M2",
    testOutcome: "Esito del test",
    selectOption: "Seleziona",
    outcomeOkModelCount: "Modello e count corretti",
    outcomeOkModelMissing: "Modello corretto, count mancante",
    outcomeWrongModel: "Modello sbagliato",
    outcomeWrongCount: "Count sbagliato",
    outcomeRuntimeError: "Errore tecnico / runtime",
    outcomeOther: "Altro",
    countAccuracy: "Il count ti sembra preciso?",
    yes: "Sì",
    no: "No",
    notSure: "Non sono sicuro",
    notAvailable: "Dato non disponibile",
    notPresentInFile: "non presente in questo file",
    notes: "Note utili",
    notesPlaceholder:
      "Scrivi cosa ha funzionato, cosa non ha funzionato, se il count corrisponde, se il modello è corretto, eventuali errori o comportamenti strani.",
    sendFeedback: "Invia feedback",
    firstSendNote:
      "Il primo invio potrebbe richiedere la conferma del servizio email se il form non è ancora stato attivato.",
    sending: "Invio in corso…",
    sent: "Feedback inviato. Controlla la mail di attivazione del form se questo è il primo invio.",
    sendFailed: "Invio non riuscito",
    invalidFile: "File non valido",
    invalidFileNote: "Trascina un file Canon .CR3 valido.",
    analyzing: "Analisi in corso…",
    analyzingCount: "Analisi in corso…",
    checking: "Verifica in corso…",
    analyzingNote:
      "Lettura dei metadati con ExifTool WebAssembly e ricerca robusta di modello e shutter count.",
    invalidCr3: "Il file selezionato non è un file .CR3.",
    unavailableData: "dato non disponibile",
    verificationIncomplete: "verifica non completata",
    readError: "Errore di lettura",
    modelNotDetected: "Modello non rilevato",
    compatibilityNotDetected: "modello non rilevato",
    compatibilitySupported: "offset verificato",
    compatibilityTentative: "offset non verificato",
    compatibilityUnsupported: "modello non supportato",
    compatibilityUntestedR: "modello Canon R non mappato",
    compatibilityOutsideR: "modello fuori serie R",
    partialRead: "Lettura completata con dati parziali",
    readCompletedModelMissing: "Lettura completata con modello non rilevato",
    readCompleted: "Lettura completata",
    readCompletedWithWarning: "Lettura completata con avviso",
    modelUnsupportedStatus: "Modello non supportato",
    offsetReadError: "Errore lettura offset",
    noExplicitModel:
      "Nessun modello esplicito trovato. Il parser ha comunque controllato chiavi semplificate e gruppi ExifTool.",
    supportedModelNote:
      "Modello rilevato: {model}. Offset {offset} verificato. Valore letto dal blocco CameraInfo.",
    supportedFallbackNote:
      "Modello rilevato: {model}. Offset {offset} previsto per questo corpo, ma in questo file il routing byte non è leggibile in modo affidabile. Mostro il valore ExifTool come fallback.",
    tentativeModelNote:
      "Modello rilevato: {model}. Offset {offset} non verificato indipendentemente: il risultato potrebbe essere impreciso e va confermato.",
    imageCountModelNote:
      "Modello rilevato: {model}. Offset {offset} letto come uint16. Potrebbe rappresentare ImageCount e non il lifetime shutter count; può azzerarsi dopo una formattazione.",
    unsupportedRModelNote:
      "Modello rilevato: {model}. Questo corpo Canon EOS R non è ancora supportato. Se vuoi, invia un file campione per la ricerca.",
    unexpectedOffsetValue:
      "Impossibile leggere lo shutter count: valore inatteso all'offset {offset}. Byte raw: {bytes}.",
    missingOffsetBytes:
      "Impossibile leggere lo shutter count: byte mancanti all'offset {offset}. Byte raw: {bytes}.",
    tentativeCountLabel:
      "Shutter count (offset non verificato): {count} — risultato da confermare.",
    outsideRModelNote:
      "Modello rilevato: {model}. Il file non appartiene alla serie Canon EOS R riconosciuta dall'app.",
    runtimeOrigin: "Origine runtime: moduli locali vendorizzati",
    runtimeLabel: "Runtime: ExifTool WebAssembly in browser",
    fileLine: "File",
    sizeLine: "Dimensione",
    errorLine: "Errore",
    noData: "Nessun dato disponibile.",
    modelEvaluation: "Valutazione modello:",
    normalizedModel: "modello normalizzato",
    rawModel: "modello raw",
    rSeries: "serie Canon R",
    testedModel: "modello testato",
    compatibilityLine: "compatibilità",
    foundModelKeys: "Chiavi modello trovate:",
    foundCountKeys: "Chiavi shutter count trovate:",
    routingLine: "routing offset",
    routingSource: "sorgente routing",
    routingBytes: "byte letti",
    routingWarning: "avviso routing",
    routingFallback: "fallback ExifTool",
    simplifiedMap: "Mappa chiavi semplificate:",
    fullRecord: "Record ExifTool completo:",
    primaryCountSource: "sorgente count principale",
    primaryCountSummary: "COUNT principale derivato da {source}",
    shutterCountLine: "ShutterCount",
    none: "nessuna",
    yesShort: "si",
    noShort: "no",
    debugTruncated: "[debug troncato]",
  },
  en: {
    title: "SHUTTER COUNT FOR CANON EOS R",
    subtitle:
      "Local reading of Canon CR3 metadata directly in the browser. The file stays on the user's device: no upload, no server, no external RAW transfer.",
    chooseFile: "Choose file",
    clear: "Clear",
    formatLabel: "Format",
    formatValue: "Canon CR3",
    privacyLabel: "Privacy",
    privacyValue: "processed in browser",
    dropTitle: "Drag a .CR3 file here",
    dropText:
      "Or use the file picker. Analysis starts immediately and shows model, shutter count, read status, compatibility, and selected file without opening the debug panel.",
    readingStatus: "READ STATUS",
    ready: "Ready",
    readyNote: "Drag a CR3 file or choose it manually. ExifTool runs directly in the browser.",
    runtimeLoading: "Metadata runtime loading…",
    runtimeReady: "ExifTool WASM runtime ready. Modules and WebAssembly are served locally.",
    runtimeUnavailable:
      "ExifTool WASM runtime unavailable. Check that the static server is serving local ESM/WASM files correctly.",
    model: "MODEL",
    count: "COUNT",
    compatibility: "COMPATIBILITY",
    selectedFile: "SELECTED FILE",
    shutterCountCard: "SHUTTER COUNT",
    noFile: "No file selected",
    debug: "DEBUG",
    debugCaption:
      "Secondary area with the actual detected keys, simplified key map, and ExifTool output for troubleshooting.",
    noDebug: "No debug data available.",
    feedback: "FEEDBACK",
    feedbackTitle: "Help me understand whether the app really works",
    feedbackCopy:
      "Send your feedback together with the current analysis data. The CR3 file is not uploaded: only a text report with the test result is sent.",
    testerName: "Name",
    testerNamePlaceholder: "Optional",
    replyEmail: "Email",
    replyEmailPlaceholder: "For a possible reply",
    userCameraModel: "Camera model used",
    userCameraModelPlaceholder: "E.g. Canon EOS R6 Mark II",
    browserDevice: "Browser / device",
    browserDevicePlaceholder: "E.g. Safari on MacBook Air M2",
    testOutcome: "Test outcome",
    selectOption: "Select",
    outcomeOkModelCount: "Correct model and count",
    outcomeOkModelMissing: "Correct model, missing count",
    outcomeWrongModel: "Wrong model",
    outcomeWrongCount: "Wrong count",
    outcomeRuntimeError: "Technical / runtime error",
    outcomeOther: "Other",
    countAccuracy: "Does the count look accurate?",
    yes: "Yes",
    no: "No",
    notSure: "Not sure",
    notAvailable: "Data not available",
    notPresentInFile: "not present in this file",
    notes: "Useful notes",
    notesPlaceholder:
      "Describe what worked, what did not work, whether the count matches, whether the model is correct, and any errors or unusual behavior.",
    sendFeedback: "Send feedback",
    firstSendNote:
      "The first submission may require confirmation from the email service if the form has not been activated yet.",
    sending: "Sending…",
    sent: "Feedback sent. Check the activation email for the form if this is the first submission.",
    sendFailed: "Sending failed",
    invalidFile: "Invalid file",
    invalidFileNote: "Drag a valid Canon .CR3 file.",
    analyzing: "Analyzing…",
    analyzingCount: "Analyzing…",
    checking: "Checking…",
    analyzingNote:
      "Reading metadata with ExifTool WebAssembly and performing a robust search for model and shutter count.",
    invalidCr3: "The selected file is not a .CR3 file.",
    unavailableData: "data not available",
    verificationIncomplete: "verification not completed",
    readError: "Read error",
    modelNotDetected: "Model not detected",
    compatibilityNotDetected: "model not detected",
    compatibilitySupported: "verified offset",
    compatibilityTentative: "unverified offset",
    compatibilityUnsupported: "model not supported",
    compatibilityUntestedR: "Canon R model not mapped",
    compatibilityOutsideR: "model outside R series",
    partialRead: "Read completed with partial data",
    readCompletedModelMissing: "Read completed with model not detected",
    readCompleted: "Read completed",
    readCompletedWithWarning: "Read completed with warning",
    modelUnsupportedStatus: "Model not supported",
    offsetReadError: "Offset read error",
    noExplicitModel:
      "No explicit model was found. The parser still checked simplified keys and ExifTool groups.",
    supportedModelNote:
      "Detected model: {model}. Offset {offset} is verified for this body. Value read from the CameraInfo block.",
    supportedFallbackNote:
      "Detected model: {model}. Offset {offset} is expected for this body, but byte routing is not readable reliably in this file. Showing the ExifTool value as fallback.",
    tentativeModelNote:
      "Detected model: {model}. Offset {offset} is not independently verified: the result may be inaccurate and should be confirmed.",
    imageCountModelNote:
      "Detected model: {model}. Offset {offset} is read as uint16. It may represent ImageCount rather than lifetime shutter count and may reset after a card format.",
    unsupportedRModelNote:
      "Detected model: {model}. This Canon EOS R body is not supported yet. Please share a sample file for research.",
    unexpectedOffsetValue:
      "Could not read shutter count: unexpected value at offset {offset}. Raw bytes: {bytes}.",
    missingOffsetBytes:
      "Could not read shutter count: missing bytes at offset {offset}. Raw bytes: {bytes}.",
    tentativeCountLabel:
      "Shutter count (unverified offset): {count} — please confirm this result.",
    outsideRModelNote:
      "Detected model: {model}. The file does not belong to the Canon EOS R series recognized by the app.",
    runtimeOrigin: "Runtime source: vendored local modules",
    runtimeLabel: "Runtime: ExifTool WebAssembly in browser",
    fileLine: "File",
    sizeLine: "Size",
    errorLine: "Error",
    noData: "No data available.",
    modelEvaluation: "Model evaluation:",
    normalizedModel: "normalized model",
    rawModel: "raw model",
    rSeries: "Canon R series",
    testedModel: "tested model",
    compatibilityLine: "compatibility",
    foundModelKeys: "Detected model keys:",
    foundCountKeys: "Detected shutter count keys:",
    routingLine: "offset routing",
    routingSource: "routing source",
    routingBytes: "bytes read",
    routingWarning: "routing warning",
    routingFallback: "ExifTool fallback",
    simplifiedMap: "Simplified key map:",
    fullRecord: "Full ExifTool record:",
    primaryCountSource: "primary count source",
    primaryCountSummary: "Primary COUNT derived from {source}",
    shutterCountLine: "ShutterCount",
    none: "none",
    yesShort: "yes",
    noShort: "no",
    debugTruncated: "[debug truncated]",
  },
};

let currentLang = DEFAULT_LANG;

const exiftoolModulePromise = import("@uswriting/exiftool");

const app = document.querySelector("#app");

function t(key, params = {}) {
  let value = translations[currentLang][key] ?? translations[DEFAULT_LANG][key] ?? key;
  Object.entries(params).forEach(([param, replacement]) => {
    value = value.replaceAll(`{${param}}`, replacement);
  });
  return value;
}

app.innerHTML = `
  <main class="page-shell">
    <section class="hero">
      <div>
        <div class="topbar">
          <div class="lang-switch" role="group" aria-label="Language switch">
            <button class="lang-button is-active" id="lang-it" type="button">IT</button>
            <button class="lang-button" id="lang-en" type="button">EN</button>
          </div>
        </div>
        <h1 class="hero-title" id="hero-title">${t("title")}</h1>
        <p class="hero-subtitle" id="hero-subtitle">${t("subtitle")}</p>
      </div>

      <div class="hero-grid">
        <section class="panel drop-panel">
          <div class="drop-zone" id="drop-zone">
            <div>
              <div class="drop-badge">CR3</div>
              <h2 class="drop-title" id="drop-title">${t("dropTitle")}</h2>
              <p class="drop-text" id="drop-text">${t("dropText")}</p>
              <div class="drop-actions">
                <button class="button button-primary" id="choose-file" type="button">${t("chooseFile")}</button>
                <button class="button button-secondary" id="clear-results" type="button">${t("clear")}</button>
              </div>
              <div class="helper-row">
                <span class="pill"><strong id="pill-format-label">${t("formatLabel")}</strong> <span id="pill-format-value">${t("formatValue")}</span></span>
                <span class="pill"><strong id="pill-privacy-label">${t("privacyLabel")}</strong> <span id="pill-privacy-value">${t("privacyValue")}</span></span>
              </div>
            </div>
          </div>
          <input class="hidden-input" id="file-input" type="file" accept=".cr3,.CR3" />
        </section>

        <aside class="panel status-panel">
          <p class="eyebrow" id="status-label">${t("readingStatus")}</p>
          <p class="status-value" id="status-value">${t("ready")}</p>
          <p class="status-note" id="status-note">${t("readyNote")}</p>
          <p class="privacy-note" id="runtime-note">${t("runtimeLoading")}</p>
        </aside>
      </div>
    </section>

    <section class="results-grid">
      <article class="panel result-card">
        <p class="eyebrow" id="model-label">${t("model")}</p>
        <p class="result-value" id="model-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow" id="count-label">${t("count")}</p>
        <p class="result-value" id="count-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow" id="compatibility-label">${t("compatibility")}</p>
        <p class="result-value subtle" id="compatibility-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow" id="file-label">${t("selectedFile")}</p>
        <p class="result-value subtle" id="file-value">${t("noFile")}</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow" id="shutter-count-label">${t("shutterCountCard")}</p>
        <p class="result-value subtle" id="shutter-count-value">—</p>
      </article>
    </section>

    <details class="panel debug-panel" id="debug-panel">
      <summary class="debug-summary">
        <div>
          <p class="eyebrow" id="debug-label">${t("debug")}</p>
          <p class="debug-caption" id="debug-caption">${t("debugCaption")}</p>
        </div>
        <span class="debug-chevron">›</span>
      </summary>
      <div class="debug-content">
        <pre class="debug-output" id="debug-output">${t("noDebug")}</pre>
      </div>
    </details>

    <section class="panel feedback-panel">
      <div class="feedback-header">
        <div>
          <p class="eyebrow" id="feedback-label">${t("feedback")}</p>
          <h2 class="feedback-title" id="feedback-title">${t("feedbackTitle")}</h2>
          <p class="feedback-copy" id="feedback-copy">${t("feedbackCopy")}</p>
        </div>
      </div>

      <form class="feedback-form" id="feedback-form" novalidate>
        <div class="feedback-grid">
          <label class="field">
            <span class="field-label" id="tester-name-label">${t("testerName")}</span>
            <input class="field-input" id="tester-name-input" name="tester_name" type="text" placeholder="${t("testerNamePlaceholder")}" />
          </label>

          <label class="field">
            <span class="field-label" id="reply-email-label">${t("replyEmail")}</span>
            <input class="field-input" id="reply-email-input" name="reply_to" type="email" placeholder="${t("replyEmailPlaceholder")}" />
          </label>

          <label class="field">
            <span class="field-label" id="camera-model-user-label">${t("userCameraModel")}</span>
            <input class="field-input" id="camera-model-user-input" name="camera_model_user" type="text" placeholder="${t("userCameraModelPlaceholder")}" required />
          </label>

          <label class="field">
            <span class="field-label" id="browser-device-label">${t("browserDevice")}</span>
            <input class="field-input" id="browser-device-input" name="browser_device" type="text" placeholder="${t("browserDevicePlaceholder")}" />
          </label>

          <label class="field">
            <span class="field-label" id="test-outcome-label">${t("testOutcome")}</span>
            <select class="field-input" name="test_outcome" required>
              <option value="">${t("selectOption")}</option>
              <option value="ok_model_and_count">${t("outcomeOkModelCount")}</option>
              <option value="ok_model_missing_count">${t("outcomeOkModelMissing")}</option>
              <option value="wrong_model">${t("outcomeWrongModel")}</option>
              <option value="wrong_count">${t("outcomeWrongCount")}</option>
              <option value="runtime_error">${t("outcomeRuntimeError")}</option>
              <option value="other">${t("outcomeOther")}</option>
            </select>
          </label>

          <label class="field">
            <span class="field-label" id="count-accuracy-label">${t("countAccuracy")}</span>
            <select class="field-input" name="count_accuracy" required>
              <option value="">${t("selectOption")}</option>
              <option value="yes">${t("yes")}</option>
              <option value="no">${t("no")}</option>
              <option value="not_sure">${t("notSure")}</option>
              <option value="not_available">${t("notAvailable")}</option>
            </select>
          </label>
        </div>

        <label class="field field-full">
          <span class="field-label" id="notes-label">${t("notes")}</span>
          <textarea
            class="field-input field-textarea"
            id="notes-input"
            name="feedback_notes"
            rows="6"
            placeholder="${t("notesPlaceholder")}"
            required
          ></textarea>
        </label>

        <input type="hidden" name="_subject" value="Feedback SHUTTER COUNT PER CANON EOS R" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="text" name="_honey" class="hidden-input" tabindex="-1" autocomplete="off" />
        <input type="hidden" name="app_page" id="feedback-page" />
        <input type="hidden" name="runtime_origin" id="feedback-runtime-origin" />
        <input type="hidden" name="analyzed_file" id="feedback-file" />
        <input type="hidden" name="detected_model" id="feedback-detected-model" />
        <input type="hidden" name="detected_count" id="feedback-detected-count" />
        <input type="hidden" name="detected_compatibility" id="feedback-detected-compatibility" />
        <input type="hidden" name="detected_status" id="feedback-detected-status" />
        <input type="hidden" name="debug_excerpt" id="feedback-debug" />

        <div class="feedback-actions">
          <button class="button button-primary" id="feedback-submit" type="submit">${t("sendFeedback")}</button>
          <p class="feedback-status" id="feedback-status">${t("firstSendNote")}</p>
        </div>
      </form>
    </section>
  </main>
`;

const refs = {
  dropZone: document.querySelector("#drop-zone"),
  fileInput: document.querySelector("#file-input"),
  chooseButton: document.querySelector("#choose-file"),
  clearButton: document.querySelector("#clear-results"),
  statusValue: document.querySelector("#status-value"),
  statusNote: document.querySelector("#status-note"),
  runtimeNote: document.querySelector("#runtime-note"),
  modelValue: document.querySelector("#model-value"),
  countValue: document.querySelector("#count-value"),
  compatibilityValue: document.querySelector("#compatibility-value"),
  fileValue: document.querySelector("#file-value"),
  shutterCountValue: document.querySelector("#shutter-count-value"),
  debugPanel: document.querySelector("#debug-panel"),
  debugOutput: document.querySelector("#debug-output"),
  feedbackForm: document.querySelector("#feedback-form"),
  feedbackSubmit: document.querySelector("#feedback-submit"),
  feedbackStatus: document.querySelector("#feedback-status"),
  feedbackPage: document.querySelector("#feedback-page"),
  feedbackRuntimeOrigin: document.querySelector("#feedback-runtime-origin"),
  feedbackFile: document.querySelector("#feedback-file"),
  feedbackDetectedModel: document.querySelector("#feedback-detected-model"),
  feedbackDetectedCount: document.querySelector("#feedback-detected-count"),
  feedbackDetectedCompatibility: document.querySelector("#feedback-detected-compatibility"),
  feedbackDetectedStatus: document.querySelector("#feedback-detected-status"),
  feedbackDebug: document.querySelector("#feedback-debug"),
  langIt: document.querySelector("#lang-it"),
  langEn: document.querySelector("#lang-en"),
};

let activeToken = 0;
let lastAnalysisSnapshot = {
  runtimeOrigin: t("runtimeOrigin"),
  file: t("noFile"),
  model: "—",
  count: "—",
  compatibility: "—",
  status: t("ready"),
  debugExcerpt: t("noDebug"),
};
let runtimeReady = false;
let runtimeFailed = false;
let currentViewState = "ready";
let lastErrorMessage = "";

primeRuntime();
bindEvents();
applyLanguage();

async function primeRuntime() {
  try {
    await exiftoolModulePromise;
    runtimeReady = true;
    refs.runtimeNote.textContent = t("runtimeReady");
  } catch (error) {
    runtimeFailed = true;
    refs.runtimeNote.textContent = t("runtimeUnavailable");
    refs.runtimeNote.className = "privacy-note is-danger";
    refs.debugPanel.open = true;
    refs.debugOutput.textContent = `Runtime load error:\n${stringifyError(error)}`;
  }
}

function bindEvents() {
  refs.langIt.addEventListener("click", () => setLanguage("it"));
  refs.langEn.addEventListener("click", () => setLanguage("en"));
  refs.chooseButton.addEventListener("click", () => refs.fileInput.click());
  refs.fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeFile(file);
    }
  });
  refs.clearButton.addEventListener("click", clearResults);

  ["dragenter", "dragover"].forEach((eventName) => {
    refs.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      refs.dropZone.classList.add("is-active");
    });
  });

  ["dragleave", "dragend"].forEach((eventName) => {
    refs.dropZone.addEventListener(eventName, () => {
      refs.dropZone.classList.remove("is-active");
    });
  });

  refs.dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    refs.dropZone.classList.remove("is-active");
    const file = [...(event.dataTransfer?.files ?? [])].find(
      (item) => item.name.toLowerCase().endsWith(".cr3"),
    );

    if (file) {
      analyzeFile(file);
      return;
    }

    currentViewState = "invalidFile";
    refs.statusValue.textContent = t("invalidFile");
    refs.statusValue.className = "status-value is-danger";
    refs.statusNote.textContent = t("invalidFileNote");
  });

  refs.feedbackForm.addEventListener("submit", submitFeedback);
  syncFeedbackContext();
}

function clearResults() {
  activeToken += 1;
  refs.fileInput.value = "";
  currentViewState = "ready";
  refs.statusValue.textContent = t("ready");
  refs.statusValue.className = "status-value";
  refs.statusNote.textContent = t("readyNote");
  refs.modelValue.textContent = "—";
  refs.countValue.textContent = "—";
  refs.compatibilityValue.textContent = "—";
  refs.fileValue.textContent = t("noFile");
  refs.shutterCountValue.textContent = "—";
  refs.debugOutput.textContent = t("noDebug");
  lastAnalysisSnapshot = {
    ...lastAnalysisSnapshot,
    runtimeOrigin: t("runtimeOrigin"),
    file: t("noFile"),
    model: "—",
    count: "—",
    compatibility: "—",
    status: t("ready"),
    debugExcerpt: t("noDebug"),
  };
  syncFeedbackContext();
}

async function analyzeFile(file) {
  const token = ++activeToken;

  currentViewState = "analyzing";
  refs.fileValue.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  refs.modelValue.textContent = t("analyzing");
  refs.countValue.textContent = t("analyzingCount");
  refs.compatibilityValue.textContent = t("checking");
  refs.shutterCountValue.textContent = t("analyzingCount");
  refs.statusValue.textContent = t("analyzing");
  refs.statusValue.className = "status-value";
  refs.statusNote.textContent = t("analyzingNote");
  refs.debugOutput.textContent = t("analyzing");

  if (!file.name.toLowerCase().endsWith(".cr3")) {
    applyError(t("invalidCr3"), file, token);
    return;
  }

  try {
    const { parseMetadata } = await exiftoolModulePromise;
    const result = await parseMetadata(file, {
      args: ["-j", "-G", "-n", "-ee3", "-u", "-U", "-api", "RequestAll=3"],
      fetch: runtimeFetch,
      transform: (data) => JSON.parse(data),
    });

    if (token !== activeToken) {
      return;
    }

    if (!result.success) {
      throw new Error(result.error || "ExifTool ha restituito un errore.");
    }

    const record = Array.isArray(result.data) ? result.data[0] : result.data;
    if (!record || typeof record !== "object") {
      throw new Error("Record JSON non valido.");
    }

    const info = extractCameraInfo(record);
    applySuccess(info, record, file);
  } catch (error) {
    applyError(stringifyError(error), file, token);
  }
}

function applySuccess(info, record, file) {
  currentViewState = "success";
  refs.modelValue.textContent = info.model;
  refs.countValue.textContent = info.count;
  refs.compatibilityValue.textContent = info.compatibility;
  refs.shutterCountValue.textContent = info.shutterCount;
  refs.statusValue.textContent = info.status;
  refs.statusValue.className = `status-value ${statusClassFor(info)}`.trim();
  refs.statusNote.textContent = buildStatusNote(info);
  const debugText = formatDebugText(file, record, info);
  refs.debugOutput.textContent = debugText;
  lastAnalysisSnapshot = {
    ...lastAnalysisSnapshot,
    file: `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    model: info.model,
    count: info.count,
    compatibility: info.compatibility,
    status: info.status,
    debugExcerpt: truncateDebug(debugText),
  };
  syncFeedbackContext();
}

function applyError(errorMessage, file, token) {
  if (token !== activeToken) {
    return;
  }

  currentViewState = "error";
  lastErrorMessage = errorMessage;
  refs.modelValue.textContent = t("unavailableData");
  refs.countValue.textContent = t("unavailableData");
  refs.compatibilityValue.textContent = t("verificationIncomplete");
  refs.shutterCountValue.textContent = t("unavailableData");
  refs.statusValue.textContent = t("readError");
  refs.statusValue.className = "status-value is-danger";
  refs.statusNote.textContent = errorMessage;
  refs.debugPanel.open = true;
  const debugText = formatDebugText(file, null, null, errorMessage);
  refs.debugOutput.textContent = debugText;
  lastAnalysisSnapshot = {
    ...lastAnalysisSnapshot,
    file: file ? `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Nessun file selezionato",
    model: t("unavailableData"),
    count: t("unavailableData"),
    compatibility: t("verificationIncomplete"),
    status: t("readError"),
    debugExcerpt: truncateDebug(debugText),
  };
  syncFeedbackContext();
}

function simplifyKey(key) {
  return key
    .trim()
    .replace(/^\[[^\]]+\]\s*/, "")
    .split(":")
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function buildSimpleRecord(record) {
  const output = {};
  Object.entries(record).forEach(([key, value]) => {
    const simpleKey = simplifyKey(key);
    output[simpleKey] ??= [];
    output[simpleKey].push({ key, simpleKey, value });
  });
  return output;
}

function normalizeModelName(model) {
  if (!model) {
    return t("modelNotDetected");
  }

  const clean = String(model).trim().replace(/\s+/g, " ");
  const lowered = clean.toLowerCase();
  const direct = MODEL_ALIASES.get(lowered);
  if (direct) {
    return direct;
  }

  if (/^eos\s+/i.test(clean)) {
    return MODEL_ALIASES.get(`canon ${lowered}`) ?? `Canon ${clean}`;
  }

  return clean;
}

function isCanonRSeriesModel(model) {
  return /^canon\s+eos\s+r([a-z0-9 ]*)$/i.test(model.trim());
}

function collectSources(simpleRecord, keys) {
  return keys.flatMap((key) => simpleRecord[key] ?? []);
}

function pickFirstValue(fields) {
  const found = fields.find((field) => field.value !== null && field.value !== "");
  return found?.value;
}

function formatOffset(offset) {
  return `0x${offset.toString(16).padStart(4, "0")}`;
}

function formatRawBytes(bytes) {
  return bytes.map((value) => (value == null ? "??" : value.toString(16).padStart(2, "0"))).join(" ");
}

function getSourcePriority(key) {
  if (key.startsWith("Track4:")) {
    return 0;
  }
  if (key.startsWith("Canon:")) {
    return 1;
  }
  if (key.startsWith("MakerNotes:")) {
    return 2;
  }
  return 3;
}

function collectCameraInfoBytes(record) {
  const bytes = new Map();
  const regex = /Canon_CameraInfo[^:]*_0x([0-9a-f]{4})$/i;

  Object.entries(record).forEach(([key, value]) => {
    const match = key.match(regex);
    if (!match) {
      return;
    }
    if (!Number.isFinite(value)) {
      return;
    }

    const offset = Number.parseInt(match[1], 16);
    const entry = {
      key,
      offset,
      value: Number(value) & 0xff,
    };

    if (!bytes.has(offset)) {
      bytes.set(offset, []);
    }
    bytes.get(offset).push(entry);
  });

  return bytes;
}

function getByteAt(byteMap, offset) {
  const sources = byteMap.get(offset) ?? [];
  if (!sources.length) {
    return null;
  }
  const selected = [...sources].sort((left, right) => getSourcePriority(left.key) - getSourcePriority(right.key))[0];
  return selected;
}

function readLittleEndianValue(byteMap, offset, width) {
  const entries = [];
  for (let index = 0; index < width; index += 1) {
    entries.push(getByteAt(byteMap, offset + index));
  }

  const rawBytes = entries.map((entry) => (entry ? entry.value : null));
  if (entries.some((entry) => entry === null)) {
    return {
      ok: false,
      reason: "missing",
      rawBytes,
      sources: entries.filter(Boolean).map((entry) => entry.key),
    };
  }

  const value = rawBytes.reduce((total, current, index) => total + (current << (8 * index)), 0);
  return {
    ok: true,
    value,
    rawBytes,
    sources: entries.map((entry) => entry.key),
  };
}

function resolveRoutedCount(record, model, rawShutterCount) {
  const route = MODEL_ROUTING.get(model);
  if (!route) {
    if (UNSUPPORTED_MODELS.has(model)) {
      return {
        mode: "unsupported",
        compatibility: t("compatibilityUnsupported"),
        status: t("modelUnsupportedStatus"),
      };
    }
    return null;
  }

  const byteMap = collectCameraInfoBytes(record);
  const routed = readLittleEndianValue(byteMap, route.offset, route.width);
  const offsetHex = formatOffset(route.offset);

  if (!routed.ok) {
    if (route.tier === 1 && rawShutterCount != null && rawShutterCount !== "") {
      return {
        mode: "fallback",
        compatibility: t("compatibilitySupported"),
        status: t("readCompleted"),
        offsetHex,
        route,
        routedValue: Number(rawShutterCount),
        rawBytesHex: formatRawBytes(routed.rawBytes),
        byteSources: routed.sources,
        warning: t("missingOffsetBytes", { offset: offsetHex, bytes: formatRawBytes(routed.rawBytes) }),
      };
    }

    return {
      mode: "parseError",
      compatibility: route.tier === 1 ? t("compatibilitySupported") : t("compatibilityTentative"),
      status: t("offsetReadError"),
      offsetHex,
      route,
      rawBytesHex: formatRawBytes(routed.rawBytes),
      byteSources: routed.sources,
      warning: t("missingOffsetBytes", { offset: offsetHex, bytes: formatRawBytes(routed.rawBytes) }),
    };
  }

  const routedValue = routed.value;
  if (routedValue <= 0 || routedValue > 500000) {
    if (route.tier === 1 && rawShutterCount != null && rawShutterCount !== "") {
      return {
        mode: "fallback",
        compatibility: t("compatibilitySupported"),
        status: t("readCompleted"),
        offsetHex,
        route,
        routedValue: Number(rawShutterCount),
        rawBytesHex: formatRawBytes(routed.rawBytes),
        byteSources: routed.sources,
        warning: t("unexpectedOffsetValue", { offset: offsetHex, bytes: formatRawBytes(routed.rawBytes) }),
      };
    }

    return {
      mode: "parseError",
      compatibility: route.tier === 1 ? t("compatibilitySupported") : t("compatibilityTentative"),
      status: t("offsetReadError"),
      offsetHex,
      route,
      rawBytesHex: formatRawBytes(routed.rawBytes),
      byteSources: routed.sources,
      warning: t("unexpectedOffsetValue", { offset: offsetHex, bytes: formatRawBytes(routed.rawBytes) }),
    };
  }

  return {
    mode: route.tier === 1 ? "supported" : "tentative",
    compatibility: route.tier === 1 ? t("compatibilitySupported") : t("compatibilityTentative"),
    status: route.tier === 1 ? t("readCompleted") : t("readCompletedWithWarning"),
    offsetHex,
    route,
    routedValue,
    rawBytesHex: formatRawBytes(routed.rawBytes),
    byteSources: routed.sources,
    warning: route.kind === "imageCount" ? t("imageCountModelNote", { model, offset: offsetHex }) : null,
  };
}

function extractCameraInfo(record) {
  const simpleRecord = buildSimpleRecord(record);
  const modelSources = collectSources(simpleRecord, MODEL_SIMPLE_KEYS);
  const makeSources = collectSources(simpleRecord, MAKE_SIMPLE_KEYS);
  const shutterCountSources = collectSources(simpleRecord, SHUTTER_COUNT_SIMPLE_KEYS);

  const rawModel = pickFirstValue(modelSources);
  const rawMake = pickFirstValue(makeSources);
  const effectiveModel = rawModel == null && rawMake ? `${rawMake}` : rawModel;
  const normalizedModel = normalizeModelName(effectiveModel == null ? null : String(effectiveModel));
  const rawShutterCount = pickFirstValue(shutterCountSources);
  const shutterCount =
    rawShutterCount == null || rawShutterCount === "" ? t("notPresentInFile") : String(rawShutterCount);
  const routed = normalizedModel === t("modelNotDetected") ? null : resolveRoutedCount(record, normalizedModel, rawShutterCount);

  let primaryCountSource = null;
  let normalizedCount = t("unavailableData");
  if (routed?.mode === "supported" || routed?.mode === "fallback") {
    primaryCountSource = routed.mode === "fallback" ? t("routingFallback") : `${t("routingLine")} ${routed.offsetHex}`;
    normalizedCount = String(routed.routedValue);
  } else if (routed?.mode === "tentative") {
    primaryCountSource = `${t("routingLine")} ${routed.offsetHex}`;
    normalizedCount = t("tentativeCountLabel", { count: String(routed.routedValue) });
  } else if (!routed && shutterCount !== t("notPresentInFile")) {
    primaryCountSource = "ShutterCount";
    normalizedCount = shutterCount;
  }

  const isRSeries = normalizedModel !== t("modelNotDetected") && isCanonRSeriesModel(normalizedModel);
  const isTested = TESTED_MODELS.has(normalizedModel);

  let compatibility = t("compatibilityNotDetected");
  if (routed?.compatibility) {
    compatibility = routed.compatibility;
  } else if (isRSeries) {
    compatibility = t("compatibilityUntestedR");
  } else if (normalizedModel !== t("modelNotDetected")) {
    compatibility = t("compatibilityOutsideR");
  }

  let status = t("readCompleted");
  if (routed?.status) {
    status = routed.status;
  } else if (normalizedModel === t("modelNotDetected")) {
    status = t("readCompletedModelMissing");
  } else if (normalizedCount === t("unavailableData")) {
    status = t("partialRead");
  }

  return {
    model: normalizedModel,
    rawModel: effectiveModel == null ? null : String(effectiveModel),
    count: normalizedCount,
    shutterCount,
    primaryCountSource,
    compatibility,
    status,
    isRSeries,
    isTested,
    routed,
    modelSources,
    countSources: shutterCountSources,
    shutterCountSources,
    simpleRecord,
  };
}

function buildStatusNote(info) {
  if (!info.rawModel) {
    return t("noExplicitModel");
  }

  if (info.routed?.mode === "supported") {
    return t("supportedModelNote", { model: info.rawModel, offset: info.routed.offsetHex });
  }

  if (info.routed?.mode === "fallback") {
    return t("supportedFallbackNote", { model: info.rawModel, offset: info.routed.offsetHex });
  }

  if (info.routed?.mode === "tentative") {
    if (info.routed.route.kind === "imageCount") {
      return t("imageCountModelNote", { model: info.rawModel, offset: info.routed.offsetHex });
    }
    return t("tentativeModelNote", { model: info.rawModel, offset: info.routed.offsetHex });
  }

  if (info.routed?.mode === "unsupported") {
    return t("unsupportedRModelNote", { model: info.rawModel });
  }

  if (info.routed?.mode === "parseError") {
    return info.routed.warning;
  }

  if (info.isRSeries) {
    return t("unsupportedRModelNote", { model: info.rawModel });
  }

  return t("outsideRModelNote", { model: info.rawModel });
}

function statusClassFor(info) {
  if (info.routed?.mode === "parseError" || info.routed?.mode === "unsupported") {
    return "is-danger";
  }
  if (info.routed?.mode === "tentative") {
    return "is-warning";
  }
  if (info.status === t("partialRead")) {
    return "is-warning";
  }
  if (info.status === t("readCompletedModelMissing")) {
    return "is-warning";
  }
  return "is-success";
}

function formatDebugText(file, record, info, errorMessage = null) {
  const lines = [
    `${t("fileLine")}: ${file?.name ?? "n/d"}`,
    `${t("sizeLine")}: ${file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "n/d"}`,
    t("runtimeLabel"),
    t("runtimeOrigin"),
  ];

  if (errorMessage) {
    lines.push("", `${t("errorLine")}:`, errorMessage);
    return lines.join("\n");
  }

  if (!record || !info) {
    lines.push("", t("noData"));
    return lines.join("\n");
  }

  lines.push(
    "",
    t("modelEvaluation"),
    `- ${t("normalizedModel")}: ${info.model}`,
    `- ${t("rawModel")}: ${info.rawModel ?? "n/d"}`,
    `- ${t("rSeries")}: ${info.isRSeries ? t("yesShort") : t("noShort")}`,
    `- ${t("testedModel")}: ${info.isTested ? t("yesShort") : t("noShort")}`,
    `- ${t("compatibilityLine")}: ${info.compatibility}`,
    `- ${t("primaryCountSource")}: ${info.primaryCountSource ?? "n/d"}`,
    `- ${t("primaryCountSummary", { source: info.primaryCountSource ?? "n/d" })}`,
    `- ${t("routingLine")}: ${info.routed?.offsetHex ?? "n/d"}`,
    `- ${t("routingSource")}: ${info.routed?.byteSources?.join(", ") ?? "n/d"}`,
    `- ${t("routingBytes")}: ${info.routed?.rawBytesHex ?? "n/d"}`,
    `- ${t("routingWarning")}: ${info.routed?.warning ?? "n/d"}`,
    "",
    `- ${t("shutterCountLine")}: ${info.shutterCount}`,
    "",
    t("foundModelKeys"),
    ...(info.modelSources.length
      ? info.modelSources.map((field) => `- ${field.key}: ${String(field.value)}`)
      : [`- ${t("none")}`]),
    "",
    t("foundCountKeys"),
    ...(info.shutterCountSources.length
      ? info.shutterCountSources.map((field) => `- ${field.key}: ${String(field.value)}`)
      : [`- ${t("none")}`]),
    "",
    t("simplifiedMap"),
  );

  Object.keys(info.simpleRecord)
    .sort()
    .forEach((simpleKey) => {
      const originals = info.simpleRecord[simpleKey].map((field) => field.key).join(", ");
      lines.push(`- ${simpleKey}: ${originals}`);
    });

  lines.push("", t("fullRecord"), JSON.stringify(record, null, 2));
  return lines.join("\n");
}

function stringifyError(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function runtimeFetch(input, init) {
  const requested = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const normalized = requested.endsWith("/zeroperl.wasm") || requested === "./zeroperl.wasm";
  return fetch(normalized ? LOCAL_WASM_URL : input, init);
}

function syncFeedbackContext() {
  refs.feedbackPage.value = window.location.href;
  refs.feedbackRuntimeOrigin.value = lastAnalysisSnapshot.runtimeOrigin;
  refs.feedbackFile.value = lastAnalysisSnapshot.file;
  refs.feedbackDetectedModel.value = lastAnalysisSnapshot.model;
  refs.feedbackDetectedCount.value = lastAnalysisSnapshot.count;
  refs.feedbackDetectedCompatibility.value = lastAnalysisSnapshot.compatibility;
  refs.feedbackDetectedStatus.value = lastAnalysisSnapshot.status;
  refs.feedbackDebug.value = lastAnalysisSnapshot.debugExcerpt;
}

function truncateDebug(text) {
  return text.length > 4000 ? `${text.slice(0, 4000)}\n\n${t("debugTruncated")}` : text;
}

async function submitFeedback(event) {
  event.preventDefault();

  if (!refs.feedbackForm.reportValidity()) {
    return;
  }

  refs.feedbackSubmit.disabled = true;
  refs.feedbackStatus.textContent = t("sending");
  refs.feedbackStatus.className = "feedback-status";

  const formData = new FormData(refs.feedbackForm);
  formData.set("runtime_origin", lastAnalysisSnapshot.runtimeOrigin);
  formData.set("analyzed_file", lastAnalysisSnapshot.file);
  formData.set("detected_model", lastAnalysisSnapshot.model);
  formData.set("detected_count", lastAnalysisSnapshot.count);
  formData.set("detected_compatibility", lastAnalysisSnapshot.compatibility);
  formData.set("detected_status", lastAnalysisSnapshot.status);
  formData.set("debug_excerpt", lastAnalysisSnapshot.debugExcerpt);
  formData.set("app_page", window.location.href);
  formData.set("browser_user_agent", navigator.userAgent);
  formData.set("screen_size", `${window.screen.width}x${window.screen.height}`);
  formData.set("_replyto", formData.get("reply_to") || "");

  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === "false") {
      throw new Error(payload.message || t("sendFailed"));
    }

    refs.feedbackStatus.textContent =
      t("sent");
    refs.feedbackStatus.className = "feedback-status is-success";
    refs.feedbackForm.reset();
    syncFeedbackContext();
  } catch (error) {
    refs.feedbackStatus.textContent = `${t("sendFailed")}: ${stringifyError(error)}`;
    refs.feedbackStatus.className = "feedback-status is-danger";
  } finally {
    refs.feedbackSubmit.disabled = false;
  }
}

function setLanguage(lang) {
  if (!translations[lang] || currentLang === lang) {
    return;
  }
  currentLang = lang;
  applyLanguage();
}

function applyLanguage() {
  document.title = t("title");
  refs.langIt.classList.toggle("is-active", currentLang === "it");
  refs.langEn.classList.toggle("is-active", currentLang === "en");
  document.querySelector("#hero-title").textContent = t("title");
  document.querySelector("#hero-subtitle").textContent = t("subtitle");
  document.querySelector("#drop-title").textContent = t("dropTitle");
  document.querySelector("#drop-text").textContent = t("dropText");
  refs.chooseButton.textContent = t("chooseFile");
  refs.clearButton.textContent = t("clear");
  document.querySelector("#pill-format-label").textContent = t("formatLabel");
  document.querySelector("#pill-format-value").textContent = t("formatValue");
  document.querySelector("#pill-privacy-label").textContent = t("privacyLabel");
  document.querySelector("#pill-privacy-value").textContent = t("privacyValue");
  document.querySelector("#status-label").textContent = t("readingStatus");
  document.querySelector("#model-label").textContent = t("model");
  document.querySelector("#count-label").textContent = t("count");
  document.querySelector("#compatibility-label").textContent = t("compatibility");
  document.querySelector("#file-label").textContent = t("selectedFile");
  document.querySelector("#shutter-count-label").textContent = t("shutterCountCard");
  document.querySelector("#debug-label").textContent = t("debug");
  document.querySelector("#debug-caption").textContent = t("debugCaption");
  document.querySelector("#feedback-label").textContent = t("feedback");
  document.querySelector("#feedback-title").textContent = t("feedbackTitle");
  document.querySelector("#feedback-copy").textContent = t("feedbackCopy");
  document.querySelector("#tester-name-label").textContent = t("testerName");
  document.querySelector("#tester-name-input").placeholder = t("testerNamePlaceholder");
  document.querySelector("#reply-email-label").textContent = t("replyEmail");
  document.querySelector("#reply-email-input").placeholder = t("replyEmailPlaceholder");
  document.querySelector("#camera-model-user-label").textContent = t("userCameraModel");
  document.querySelector("#camera-model-user-input").placeholder = t("userCameraModelPlaceholder");
  document.querySelector("#browser-device-label").textContent = t("browserDevice");
  document.querySelector("#browser-device-input").placeholder = t("browserDevicePlaceholder");
  document.querySelector("#test-outcome-label").textContent = t("testOutcome");
  document.querySelector("#count-accuracy-label").textContent = t("countAccuracy");
  document.querySelector("#notes-label").textContent = t("notes");
  document.querySelector("#notes-input").placeholder = t("notesPlaceholder");
  refs.feedbackSubmit.textContent = t("sendFeedback");

  const selects = refs.feedbackForm.querySelectorAll("select");
  const outcomeOptions = selects[0].options;
  outcomeOptions[0].textContent = t("selectOption");
  outcomeOptions[1].textContent = t("outcomeOkModelCount");
  outcomeOptions[2].textContent = t("outcomeOkModelMissing");
  outcomeOptions[3].textContent = t("outcomeWrongModel");
  outcomeOptions[4].textContent = t("outcomeWrongCount");
  outcomeOptions[5].textContent = t("outcomeRuntimeError");
  outcomeOptions[6].textContent = t("outcomeOther");
  const accuracyOptions = selects[1].options;
  accuracyOptions[0].textContent = t("selectOption");
  accuracyOptions[1].textContent = t("yes");
  accuracyOptions[2].textContent = t("no");
  accuracyOptions[3].textContent = t("notSure");
  accuracyOptions[4].textContent = t("notAvailable");

  lastAnalysisSnapshot.runtimeOrigin = t("runtimeOrigin");
  if (lastAnalysisSnapshot.file === translations.it.noFile || lastAnalysisSnapshot.file === translations.en.noFile) {
    lastAnalysisSnapshot.file = t("noFile");
  }

  if (currentViewState === "ready") {
    refs.statusValue.textContent = t("ready");
    refs.statusNote.textContent = t("readyNote");
    refs.fileValue.textContent = t("noFile");
    refs.shutterCountValue.textContent = "—";
    refs.debugOutput.textContent = t("noDebug");
    refs.feedbackStatus.textContent = t("firstSendNote");
  } else if (currentViewState === "invalidFile") {
    refs.statusValue.textContent = t("invalidFile");
    refs.statusNote.textContent = t("invalidFileNote");
  } else if (currentViewState === "analyzing") {
    refs.statusValue.textContent = t("analyzing");
    refs.statusNote.textContent = t("analyzingNote");
    refs.modelValue.textContent = t("analyzing");
    refs.countValue.textContent = t("analyzingCount");
    refs.compatibilityValue.textContent = t("checking");
    refs.shutterCountValue.textContent = t("analyzingCount");
    refs.debugOutput.textContent = t("analyzing");
  } else if (currentViewState === "error") {
    refs.statusValue.textContent = t("readError");
    refs.statusNote.textContent = lastErrorMessage;
    refs.modelValue.textContent = t("unavailableData");
    refs.countValue.textContent = t("unavailableData");
    refs.compatibilityValue.textContent = t("verificationIncomplete");
    refs.shutterCountValue.textContent = t("unavailableData");
  } else if (currentViewState === "success") {
    refs.statusValue.textContent = lastAnalysisSnapshot.status;
  }

  if (runtimeReady) {
    refs.runtimeNote.textContent = t("runtimeReady");
    refs.runtimeNote.className = "privacy-note";
  } else if (runtimeFailed) {
    refs.runtimeNote.textContent = t("runtimeUnavailable");
    refs.runtimeNote.className = "privacy-note is-danger";
  } else {
    refs.runtimeNote.textContent = t("runtimeLoading");
    refs.runtimeNote.className = "privacy-note";
  }

  syncFeedbackContext();
}
