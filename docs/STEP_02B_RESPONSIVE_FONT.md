# Step 02B — responsive layout and typography

## Purpose

Make the existing breast-care interface comfortable to read and operate on small phones, tablets and desktops before adding image intake. This is a focused presentation checkpoint: it does not add medical inference or deployment.

## What changed and why

| File | Change and purpose |
| --- | --- |
| `web/app/layout.jsx` | Load self-hosted Manrope variable (interface) and Lora variable regular/italic (headlines). Fonts are bundled with the app, with system fallbacks. |
| `web/app/globals.css` | Apply those font families, make type and controls more readable, allow projection choices to wrap, move the mobile navigation and stacked layout to 960px, and make the four view cards single-column at 420px and below. Keep reduced-motion support. |
| `web/components/SiteHeader.jsx` | Close the mobile menu when the viewport becomes desktop-sized so its state matches the layout. |
| `web/package.json`, `web/package-lock.json` | Pin the two font packages for reproducible installation. |
| `README.md` | Point to the current checkpoint and distinguish the responsive UI from future medical features. |
| `docs/STEP_02B_RESPONSIVE_FONT.md` | Record the application, verification, and GitHub instructions for this patch. |

## 1. Apply the patch

Stop the frontend with Ctrl+C. Extract the ZIP somewhere else, then merge its `breast-ai` folder into `D:\Breast-Cancer-Project\breast-ai`, replacing the supplied files. Do not create a second nested `breast-ai` directory. No files need deletion. Keep both updated package files together.

## 2. Install and verify

```powershell
cd D:\Breast-Cancer-Project\breast-ai\web
npm.cmd ci
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Open http://127.0.0.1:3000. Use browser responsive mode at widths such as 320, 390, 768, 1024 and 1440px. Check for horizontal scrolling, readable headings, wrapping projection controls, selection and focus mode, and a menu that works on a phone and closes after resizing to desktop. Try keyboard navigation and a reduced-motion setting. If plain `npm` works in PowerShell, it invokes the same CLI; `npm.cmd` avoids the PowerShell script-policy issue.

The Python API and virtual environment do not change in this patch. To test the live connection button, also start the existing API in another terminal:

```powershell
cd D:\Breast-Cancer-Project\breast-ai
.\.venv\Scripts\python.exe -m uvicorn api.app.main:app --reload --host 127.0.0.1 --port 8000
```

## 3. Commit and push

After the checks and visual review pass:

```powershell
cd D:\Breast-Cancer-Project\breast-ai
git add README.md docs/STEP_02B_RESPONSIVE_FONT.md web/app/layout.jsx web/app/globals.css web/components/SiteHeader.jsx web/package.json web/package-lock.json
git diff --cached --stat
git commit -m "style: refine responsive layout and typography"
git push
```

The ZIP contains only complete new or changed files in a `breast-ai/` root. It excludes generated dependencies, secrets and medical data. The next development checkpoint is four-view image intake and validation after this one is committed.

## Verification before delivery

Frontend lint, five Node tests and the production build passed locally. Browser visual review across viewport sizes remains a user-side check in the Windows environment.
