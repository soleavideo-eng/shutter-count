const APP_TITLE = "SHUTTER COUNT PER CANON EOS R";
const TESTED_MODELS = new Set(["Canon EOS R6 Mark II", "Canon EOS R8"]);

const MODEL_ALIASES = new Map([
  ["canon eos r", "Canon EOS R"],
  ["canon eos rp", "Canon EOS RP"],
  ["canon eos r3", "Canon EOS R3"],
  ["canon eos r5", "Canon EOS R5"],
  ["canon eos r5 c", "Canon EOS R5 C"],
  ["canon eos r6", "Canon EOS R6"],
  ["canon eos r6 mark ii", "Canon EOS R6 Mark II"],
  ["canon eos r6 mk ii", "Canon EOS R6 Mark II"],
  ["canon eos r6m2", "Canon EOS R6 Mark II"],
  ["canon eos r6 m2", "Canon EOS R6 Mark II"],
  ["canon eos r6mkii", "Canon EOS R6 Mark II"],
  ["canon eos r6 mkii", "Canon EOS R6 Mark II"],
  ["canon eos r6 ii", "Canon EOS R6 Mark II"],
  ["canon eos r7", "Canon EOS R7"],
  ["canon eos r8", "Canon EOS R8"],
  ["canon eos r10", "Canon EOS R10"],
  ["canon eos r50", "Canon EOS R50"],
  ["canon eos r50 v", "Canon EOS R50 V"],
  ["canon eos r100", "Canon EOS R100"],
  ["canon eos ra", "Canon EOS Ra"],
]);

const MODEL_SIMPLE_KEYS = ["model", "cameramodelname"];
const COUNT_SIMPLE_KEYS = ["shuttercount", "exposurecount", "shuttercounter", "actuationcount"];
const LOCAL_WASM_URL = new URL(
  "./vendor/@6over3/zeroperl-ts/dist/esm/zeroperl.wasm",
  window.location.href,
).toString();
const FEEDBACK_ENDPOINT = "https://formsubmit.co/ajax/soleavideo@gmail.com";

const exiftoolModulePromise = import("@uswriting/exiftool");

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="page-shell">
    <section class="hero">
      <div>
        <h1 class="hero-title">${APP_TITLE}</h1>
        <p class="hero-subtitle">
          Lettura locale dei metadati CR3 Canon direttamente nel browser. Il file resta sul dispositivo dell'utente:
          nessun upload, nessun server, nessun passaggio esterno dei RAW.
        </p>
      </div>

      <div class="hero-grid">
        <section class="panel drop-panel">
          <div class="drop-zone" id="drop-zone">
            <div>
              <div class="drop-badge">CR3</div>
              <h2 class="drop-title">Trascina qui un file .CR3</h2>
              <p class="drop-text">
                Oppure usa il pulsante di selezione. L'analisi parte subito e mostra modello, shutter count,
                stato di lettura, compatibilità e file selezionato senza aprire il pannello debug.
              </p>
              <div class="drop-actions">
                <button class="button button-primary" id="choose-file" type="button">Seleziona file</button>
                <button class="button button-secondary" id="clear-results" type="button">Pulisci</button>
              </div>
              <div class="helper-row">
                <span class="pill"><strong>Formato</strong> CR3 Canon</span>
                <span class="pill"><strong>Privacy</strong> elaborazione nel browser</span>
              </div>
            </div>
          </div>
          <input class="hidden-input" id="file-input" type="file" accept=".cr3,.CR3" />
        </section>

        <aside class="panel status-panel">
          <p class="eyebrow">STATO LETTURA</p>
          <p class="status-value" id="status-value">Pronto</p>
          <p class="status-note" id="status-note">
            Trascina un file CR3 oppure selezionalo manualmente. ExifTool gira direttamente nel browser.
          </p>
          <p class="privacy-note" id="runtime-note">
            Libreria metadata in caricamento…
          </p>
        </aside>
      </div>
    </section>

    <section class="results-grid">
      <article class="panel result-card">
        <p class="eyebrow">MODELLO</p>
        <p class="result-value" id="model-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow">COUNT</p>
        <p class="result-value" id="count-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow">COMPATIBILITÀ</p>
        <p class="result-value subtle" id="compatibility-value">—</p>
      </article>
      <article class="panel result-card">
        <p class="eyebrow">FILE SELEZIONATO</p>
        <p class="result-value subtle" id="file-value">Nessun file selezionato</p>
      </article>
    </section>

    <details class="panel debug-panel" id="debug-panel">
      <summary class="debug-summary">
        <div>
          <p class="eyebrow">DEBUG</p>
          <p class="debug-caption">
            Area secondaria con chiavi rilevate davvero, mappa semplificata e output ExifTool per troubleshooting.
          </p>
        </div>
        <span class="debug-chevron">›</span>
      </summary>
      <div class="debug-content">
        <pre class="debug-output" id="debug-output">Nessun debug disponibile.</pre>
      </div>
    </details>

    <section class="panel feedback-panel">
      <div class="feedback-header">
        <div>
          <p class="eyebrow">FEEDBACK</p>
          <h2 class="feedback-title">Aiutami a capire se l'app funziona davvero</h2>
          <p class="feedback-copy">
            Invia il tuo feedback insieme ai dati tecnici dell'analisi corrente. Il file CR3 non viene caricato:
            viene inviato solo un report testuale con il risultato del test.
          </p>
        </div>
      </div>

      <form class="feedback-form" id="feedback-form" novalidate>
        <div class="feedback-grid">
          <label class="field">
            <span class="field-label">Nome</span>
            <input class="field-input" name="tester_name" type="text" placeholder="Facoltativo" />
          </label>

          <label class="field">
            <span class="field-label">Email</span>
            <input class="field-input" name="reply_to" type="email" placeholder="Per eventuale risposta" />
          </label>

          <label class="field">
            <span class="field-label">Modello fotocamera usato</span>
            <input class="field-input" name="camera_model_user" type="text" placeholder="Es. Canon EOS R6 Mark II" required />
          </label>

          <label class="field">
            <span class="field-label">Browser / dispositivo</span>
            <input class="field-input" name="browser_device" type="text" placeholder="Es. Safari su MacBook Air M2" />
          </label>

          <label class="field">
            <span class="field-label">Esito del test</span>
            <select class="field-input" name="test_outcome" required>
              <option value="">Seleziona</option>
              <option value="ok_model_and_count">Modello e count corretti</option>
              <option value="ok_model_missing_count">Modello corretto, count mancante</option>
              <option value="wrong_model">Modello sbagliato</option>
              <option value="wrong_count">Count sbagliato</option>
              <option value="runtime_error">Errore tecnico / runtime</option>
              <option value="other">Altro</option>
            </select>
          </label>

          <label class="field">
            <span class="field-label">Il count ti sembra preciso?</span>
            <select class="field-input" name="count_accuracy" required>
              <option value="">Seleziona</option>
              <option value="yes">Sì</option>
              <option value="no">No</option>
              <option value="not_sure">Non sono sicuro</option>
              <option value="not_available">Dato non disponibile</option>
            </select>
          </label>
        </div>

        <label class="field field-full">
          <span class="field-label">Note utili</span>
          <textarea
            class="field-input field-textarea"
            name="feedback_notes"
            rows="6"
            placeholder="Scrivi cosa ha funzionato, cosa non ha funzionato, se il count corrisponde, se il modello è corretto, eventuali errori o comportamenti strani."
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
          <button class="button button-primary" id="feedback-submit" type="submit">Invia feedback</button>
          <p class="feedback-status" id="feedback-status">
            Il primo invio potrebbe richiedere la conferma del servizio email se il form non è ancora stato attivato.
          </p>
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
};

let activeToken = 0;
let lastAnalysisSnapshot = {
  runtimeOrigin: "moduli locali vendorizzati",
  file: "Nessun file selezionato",
  model: "—",
  count: "—",
  compatibility: "—",
  status: "Pronto",
  debugExcerpt: "Nessun debug disponibile.",
};

primeRuntime();
bindEvents();

async function primeRuntime() {
  try {
    await exiftoolModulePromise;
    refs.runtimeNote.textContent = "Runtime ExifTool WASM pronto. Moduli e WebAssembly sono serviti localmente.";
  } catch (error) {
    refs.runtimeNote.textContent =
      "Runtime ExifTool WASM non disponibile. Verifica che il server statico esponga correttamente i file locali ESM/WASM.";
    refs.runtimeNote.className = "privacy-note is-danger";
    refs.debugPanel.open = true;
    refs.debugOutput.textContent = `Errore caricamento libreria:\n${stringifyError(error)}`;
  }
}

function bindEvents() {
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

    refs.statusValue.textContent = "File non valido";
    refs.statusValue.className = "status-value is-danger";
    refs.statusNote.textContent = "Trascina un file Canon .CR3 valido.";
  });

  refs.feedbackForm.addEventListener("submit", submitFeedback);
  syncFeedbackContext();
}

function clearResults() {
  activeToken += 1;
  refs.fileInput.value = "";
  refs.statusValue.textContent = "Pronto";
  refs.statusValue.className = "status-value";
  refs.statusNote.textContent =
    "Trascina un file CR3 oppure selezionalo manualmente. ExifTool gira direttamente nel browser.";
  refs.modelValue.textContent = "—";
  refs.countValue.textContent = "—";
  refs.compatibilityValue.textContent = "—";
  refs.fileValue.textContent = "Nessun file selezionato";
  refs.debugOutput.textContent = "Nessun debug disponibile.";
  lastAnalysisSnapshot = {
    ...lastAnalysisSnapshot,
    file: "Nessun file selezionato",
    model: "—",
    count: "—",
    compatibility: "—",
    status: "Pronto",
    debugExcerpt: "Nessun debug disponibile.",
  };
  syncFeedbackContext();
}

async function analyzeFile(file) {
  const token = ++activeToken;

  refs.fileValue.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  refs.modelValue.textContent = "Analisi in corso…";
  refs.countValue.textContent = "Analisi in corso…";
  refs.compatibilityValue.textContent = "Verifica in corso…";
  refs.statusValue.textContent = "Analisi in corso…";
  refs.statusValue.className = "status-value";
  refs.statusNote.textContent =
    "Lettura dei metadati con ExifTool WebAssembly e ricerca robusta di modello e shutter count.";
  refs.debugOutput.textContent = "Analisi in corso…";

  if (!file.name.toLowerCase().endsWith(".cr3")) {
    applyError("Il file selezionato non è un file .CR3.", file, token);
    return;
  }

  try {
    const { parseMetadata } = await exiftoolModulePromise;
    const result = await parseMetadata(file, {
      args: ["-j", "-G", "-n"],
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
  refs.modelValue.textContent = info.model;
  refs.countValue.textContent = info.count;
  refs.compatibilityValue.textContent = info.compatibility;
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

  refs.modelValue.textContent = "dato non disponibile";
  refs.countValue.textContent = "dato non disponibile";
  refs.compatibilityValue.textContent = "verifica non completata";
  refs.statusValue.textContent = "Errore di lettura";
  refs.statusValue.className = "status-value is-danger";
  refs.statusNote.textContent = errorMessage;
  refs.debugPanel.open = true;
  const debugText = formatDebugText(file, null, null, errorMessage);
  refs.debugOutput.textContent = debugText;
  lastAnalysisSnapshot = {
    ...lastAnalysisSnapshot,
    file: file ? `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Nessun file selezionato",
    model: "dato non disponibile",
    count: "dato non disponibile",
    compatibility: "verifica non completata",
    status: "Errore di lettura",
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
    return "Modello non rilevato";
  }

  const clean = String(model).trim().replace(/\s+/g, " ");
  return MODEL_ALIASES.get(clean.toLowerCase()) ?? clean;
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

function extractCameraInfo(record) {
  const simpleRecord = buildSimpleRecord(record);
  const modelSources = collectSources(simpleRecord, MODEL_SIMPLE_KEYS);
  const countSources = collectSources(simpleRecord, COUNT_SIMPLE_KEYS);

  const rawModel = pickFirstValue(modelSources);
  const normalizedModel = normalizeModelName(rawModel == null ? null : String(rawModel));
  const rawCount = pickFirstValue(countSources);
  const count = rawCount == null || rawCount === "" ? "dato non disponibile" : String(rawCount);

  const isRSeries = normalizedModel !== "Modello non rilevato" && isCanonRSeriesModel(normalizedModel);
  const isTested = TESTED_MODELS.has(normalizedModel);

  let compatibility = "modello non rilevato";
  if (isTested) {
    compatibility = "modello testato";
  } else if (isRSeries) {
    compatibility = "modello Canon R non testato";
  } else if (normalizedModel !== "Modello non rilevato") {
    compatibility = "modello fuori serie R";
  }

  let status = "Lettura completata";
  if (normalizedModel === "Modello non rilevato") {
    status = "Lettura completata con modello non rilevato";
  } else if (count === "dato non disponibile") {
    status = "Lettura completata con dati parziali";
  }

  return {
    model: normalizedModel,
    rawModel: rawModel == null ? null : String(rawModel),
    count,
    compatibility,
    status,
    isRSeries,
    isTested,
    modelSources,
    countSources,
    simpleRecord,
  };
}

function buildStatusNote(info) {
  if (!info.rawModel) {
    return "Nessun modello esplicito trovato. Il parser ha comunque controllato chiavi semplificate e gruppi ExifTool.";
  }

  if (info.isTested) {
    return `Modello rilevato: ${info.rawModel}. Questo modello è già stato marcato come testato.`;
  }

  if (info.isRSeries) {
    return `Modello rilevato: ${info.rawModel}. Fa parte della serie Canon EOS R ma non è ancora marcato come testato.`;
  }

  return `Modello rilevato: ${info.rawModel}. Il file non appartiene alla serie Canon EOS R riconosciuta dall'app.`;
}

function statusClassFor(info) {
  if (info.status.includes("parziali")) {
    return "is-warning";
  }
  if (info.status.includes("non rilevato")) {
    return "is-warning";
  }
  return "is-success";
}

function formatDebugText(file, record, info, errorMessage = null) {
  const lines = [
    `File: ${file?.name ?? "n/d"}`,
    `Dimensione: ${file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "n/d"}`,
    "Runtime: ExifTool WebAssembly in browser",
    "Origine runtime: moduli locali vendorizzati",
  ];

  if (errorMessage) {
    lines.push("", "Errore:", errorMessage);
    return lines.join("\n");
  }

  if (!record || !info) {
    lines.push("", "Nessun dato disponibile.");
    return lines.join("\n");
  }

  lines.push(
    "",
    "Valutazione modello:",
    `- modello normalizzato: ${info.model}`,
    `- modello raw: ${info.rawModel ?? "n/d"}`,
    `- serie Canon R: ${info.isRSeries ? "si" : "no"}`,
    `- modello testato: ${info.isTested ? "si" : "no"}`,
    `- compatibilità: ${info.compatibility}`,
    "",
    "Chiavi modello trovate:",
    ...(info.modelSources.length
      ? info.modelSources.map((field) => `- ${field.key}: ${String(field.value)}`)
      : ["- nessuna"]),
    "",
    "Chiavi shutter count trovate:",
    ...(info.countSources.length
      ? info.countSources.map((field) => `- ${field.key}: ${String(field.value)}`)
      : ["- nessuna"]),
    "",
    "Mappa chiavi semplificate:",
  );

  Object.keys(info.simpleRecord)
    .sort()
    .forEach((simpleKey) => {
      const originals = info.simpleRecord[simpleKey].map((field) => field.key).join(", ");
      lines.push(`- ${simpleKey}: ${originals}`);
    });

  lines.push("", "Record ExifTool completo:", JSON.stringify(record, null, 2));
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
  return text.length > 4000 ? `${text.slice(0, 4000)}\n\n[debug troncato]` : text;
}

async function submitFeedback(event) {
  event.preventDefault();

  if (!refs.feedbackForm.reportValidity()) {
    return;
  }

  refs.feedbackSubmit.disabled = true;
  refs.feedbackStatus.textContent = "Invio in corso…";
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
      throw new Error(payload.message || "Invio non riuscito.");
    }

    refs.feedbackStatus.textContent =
      "Feedback inviato. Controlla la mail di attivazione del form se questo è il primo invio.";
    refs.feedbackStatus.className = "feedback-status is-success";
    refs.feedbackForm.reset();
    syncFeedbackContext();
  } catch (error) {
    refs.feedbackStatus.textContent = `Invio non riuscito: ${stringifyError(error)}`;
    refs.feedbackStatus.className = "feedback-status is-danger";
  } finally {
    refs.feedbackSubmit.disabled = false;
  }
}
