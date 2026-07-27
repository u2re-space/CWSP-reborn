/*
 * Filename: control-pair-modal.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/control-pair-modal.ts
 * Change date and time: 20.10.00_20.07.2026
 * Reason for changes: Modal for Control pairing — publicToken + live 20s deviceCode.
 */

export type PairModalResult = {
    publicToken: string;
    deviceCode: string;
} | null;

const STYLE_ID = "cwsp-control-pair-modal-style";

const ensureStyle = (): void => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
.cwsp-pair-modal-backdrop {
  position: fixed; inset: 0; z-index: 100000;
  background: rgba(8, 12, 18, 0.72);
  display: flex; align-items: center; justify-content: center;
  padding: 1.25rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.cwsp-pair-modal {
  width: min(420px, 100%);
  background: #121820;
  color: #e8eef5;
  border: 1px solid #2a3644;
  border-radius: 12px;
  padding: 1.25rem 1.35rem 1.1rem;
  box-shadow: 0 18px 48px rgba(0,0,0,.45);
}
.cwsp-pair-modal h2 {
  margin: 0 0 .35rem; font-size: 1.15rem; font-weight: 650;
}
.cwsp-pair-modal p {
  margin: 0 0 .9rem; font-size: .88rem; line-height: 1.45; color: #a8b4c2;
}
.cwsp-pair-modal label {
  display: block; margin: 0 0 .75rem; font-size: .8rem; color: #c5d0dc;
}
.cwsp-pair-modal input {
  display: block; width: 100%; margin-top: .3rem;
  box-sizing: border-box;
  border: 1px solid #334155; border-radius: 8px;
  background: #0b1016; color: #f1f5f9;
  padding: .55rem .7rem; font-size: 1rem; letter-spacing: .04em;
}
.cwsp-pair-modal .row {
  display: flex; gap: .6rem; justify-content: flex-end; margin-top: 1rem;
}
.cwsp-pair-modal button {
  border: 0; border-radius: 8px; padding: .55rem .95rem;
  font-size: .9rem; cursor: pointer;
}
.cwsp-pair-modal .cancel { background: #243041; color: #dbe4ee; }
.cwsp-pair-modal .ok { background: #2f6fed; color: #fff; font-weight: 600; }
.cwsp-pair-modal .err { color: #fca5a5; font-size: .8rem; min-height: 1.1em; margin: .25rem 0 0; }
`;
    document.head.appendChild(style);
};

/**
 * Ask operator for Control public token + live device code from phone/desk Settings.
 */
export const showControlPairModal = (opts?: {
    title?: string;
    hint?: string;
    initialPublicToken?: string;
    /** Shown when previous attempt failed validation. */
    error?: string;
}): Promise<PairModalResult> => {
    ensureStyle();
    return new Promise((resolve) => {
        const backdrop = document.createElement("div");
        backdrop.className = "cwsp-pair-modal-backdrop";
        backdrop.setAttribute("role", "dialog");
        backdrop.setAttribute("aria-modal", "true");

        const modal = document.createElement("div");
        modal.className = "cwsp-pair-modal";
        modal.innerHTML = `
          <h2>${opts?.title || "Pair CWSP Control"}</h2>
          <p>${
              opts?.hint ||
              "Enter the <strong>public token</strong> and the live <strong>20s device code</strong> from the device Settings → CWSP (or the bridge notification / desk .data file)."
          }</p>
          <label>Public token
            <input name="publicToken" autocomplete="off" spellcheck="false" placeholder="cwsp-pub-…" />
          </label>
          <label>Device code (20s; previous still OK ~10s)
            <input name="deviceCode" autocomplete="off" spellcheck="false" placeholder="ABC123" maxlength="12" />
          </label>
          <p class="err" data-err></p>
          <div class="row">
            <button type="button" class="cancel" data-cancel>Cancel</button>
            <button type="button" class="ok" data-ok>Pair &amp; verify</button>
          </div>
        `;
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        const pubInput = modal.querySelector('input[name="publicToken"]') as HTMLInputElement;
        const codeInput = modal.querySelector('input[name="deviceCode"]') as HTMLInputElement;
        const errEl = modal.querySelector("[data-err]") as HTMLElement;
        if (opts?.initialPublicToken) pubInput.value = opts.initialPublicToken;
        if (opts?.error) errEl.textContent = opts.error;

        const close = (value: PairModalResult) => {
            backdrop.remove();
            resolve(value);
        };

        modal.querySelector("[data-cancel]")?.addEventListener("click", () => close(null));
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) close(null);
        });
        modal.querySelector("[data-ok]")?.addEventListener("click", () => {
            const publicToken = String(pubInput.value || "").trim();
            const deviceCode = String(codeInput.value || "")
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "");
            if (!publicToken || publicToken.length < 8) {
                errEl.textContent = "Public token is required (from device Settings).";
                pubInput.focus();
                return;
            }
            if (deviceCode.length < 4) {
                errEl.textContent = "Enter the live device code shown on the device.";
                codeInput.focus();
                return;
            }
            close({ publicToken, deviceCode });
        });

        // Prefer focusing the missing field.
        if (pubInput.value) codeInput.focus();
        else pubInput.focus();
    });
};
