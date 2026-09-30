# Step 02 — frontend and API foundation

## What and why

This step connects the application's two parts before image intake or AI training adds complexity. FastAPI will own image validation and inference. Next.js in JavaScript/JSX will own the interactive review experience. A live connection check proves that the browser can reach the frontend, the frontend can reach the API, and the API returns the expected contract. A reachable API does not imply a loaded model: `modelStatus` is explicitly `not_loaded`.

The first UI has four empty view panels, responsive layouts, restrained animation, reduced-motion support, keyboard focus indicators and live status announcements. Image upload and inference become separate next steps.

## 1. Apply this patch

Close any running application terminals. Extract the ZIP to a temporary folder, then copy **the contents of its `breast-ai` folder** into `D:\Breast-Cancer-Project\breast-ai`, merging directories and replacing the files supplied by this patch. You should see `web\package.json` directly inside your existing project, not `breast-ai\breast-ai\web`.

Keep your existing `.venv` and `.git`. Neither is included in the ZIP. There are no file deletions in this patch. If you have customized any listed updated file, review the diff before replacing it.

## 2. Install dependencies

In PowerShell, from the existing project root:

```powershell
cd D:\Breast-Cancer-Project\breast-ai
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pip check
cd web
npm.cmd ci
cd ..
```

Purpose: install the pinned Python packages into your isolated environment and install frontend packages using the included npm lockfile. `requirements.lock.txt` constrains resolved Python dependencies, including the Windows colorama dependency. No PyTorch, model weights, CUDA, paid API or database is needed for this step. No `.env` is required for the default local addresses. If you change the API address later, copy `web/.env.example` to `web/.env.local` and edit `API_BASE_URL`, then restart the frontend.

Step 02A replaces the earlier ESLint 9 configuration with ESLint 10, the compatible React Hooks plugin and the official Next.js plugin. Follow `STEP_02A_UI_REFRESH.md` when applying that update.

## 3. Run the API — terminal 1

From the project root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn api.app.main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal running. Open http://127.0.0.1:8000/docs to inspect the API. Its current endpoint is `GET /api/v1/health`. The API binds to your local computer; deployment is a later phase.

## 4. Run the frontend — terminal 2

Open a second PowerShell terminal:

```powershell
cd D:\Breast-Cancer-Project\breast-ai\web
npm.cmd run dev
```

Open http://127.0.0.1:3000 and click **Check connection**. Expected result: **API connected**, with an explicit message that AI models have not been loaded. The browser calls `/api/health` on Next.js, which makes a server-side request to FastAPI. This keeps the frontend request on the same origin and the backend address in server-side configuration.

## 5. Verify — terminal 3

From the project root:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health | ConvertTo-Json
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
cd web
npm.cmd run lint
npm.cmd test
```

Expected health response:

```json
{
  "schemaVersion": "0.1",
  "service": "breast-ai-api",
  "status": "ok",
  "modelStatus": "not_loaded"
}
```

Two Python tests and five JavaScript tests must pass. Lint should finish without errors. In the browser, stop the API with Ctrl+C and click **Check again**: expect **API unavailable**, without a fabricated result. Restart the API and retry: expect **API connected**. This checks the real outage/recovery path on your machine.

To verify a production build, first stop the frontend dev server with Ctrl+C, then run in `web`:

```powershell
npm.cmd run build
```

Stop the dev server before building so they do not write into the same `.next` directory. After the build, `npm.cmd run start` runs the built frontend locally; keep the API running for its connection check. Build success validates packaging; it does not imply clinical or deployment readiness.

## 6. GitHub checkpoint

After verification, from the project root:

```powershell
git status --short
git add README.md requirements.txt requirements-dev.txt requirements.lock.txt api/app/main.py contracts/health.schema.json tests/test_api_health.py web docs/STEP_02_FOUNDATION.md
git diff --cached --stat
git commit -m "feat: add API and JavaScript review workspace foundation"
git push
git status --short
```

Commit the frontend lockfile. `.venv`, `node_modules`, `.next` and `.env.local` are ignored. If the repository is not initialized or its GitHub remote is missing, use the initialization/remote commands from Step 01, then commit this checkpoint. Keep medical images, credentials and weights outside Git.

## Files changed

| Change | Files |
| --- | --- |
| Updated | `README.md`, `requirements.txt` |
| New API and contract | `api/app/main.py`, `contracts/health.schema.json`, `tests/test_api_health.py` |
| New dependency records | `requirements-dev.txt`, `requirements.lock.txt`, `web/package.json`, `web/package-lock.json` |
| New frontend configuration | `web/.env.example`, `web/next.config.mjs`, `web/eslint.config.mjs` |
| New frontend UI | `web/app/layout.jsx`, `web/app/page.jsx`, `web/app/globals.css`, `web/components/ConnectionPanel.jsx` |
| New API bridge and validation | `web/app/api/health/route.js`, `web/lib/health.js` |
| New frontend tests | `web/tests/health.test.js`, `web/tests/health-route.test.js` |
| New guide | `docs/STEP_02_FOUNDATION.md` |
| Deleted | None |

## Troubleshooting

- Connection unavailable: keep the Python API terminal running; confirm the health URL works and API_BASE_URL points to the same port. API failure and unsupported contract both produce a safe unavailable state.
- Port in use: stop your earlier copy of the corresponding service, then restart it.
- Imports missing: run pip through `.venv\Scripts\python.exe`, not the global Python interpreter.
- npm execution policy error: use `npm.cmd`, as shown above.
- `npm ci` reports a lock mismatch: ensure both package.json and package-lock.json from this same ZIP replaced the old files.

## Exit evidence

Share the live **API connected** screen or its status, command errors if any, and confirmation of your GitHub push. The next implementation step adds the four-view intake contract and validation. Model training follows the dataset and label audit.

## Verification performed before delivery

- Python 3.12.14/Linux: both API tests passed; pip reported no dependency conflicts.
- Node 24.19.0/Linux: fresh `npm ci`, lint, all five JavaScript tests and optimized production build passed.
- Real local HTTP services: workspace rendered; frontend proxy returned 200 for the live API, 503 when API stopped, and 200 after restart.
- Windows x64/CPython 3.14: dependency wheel resolution succeeded, including the Pydantic compiled extension. This checks installation availability; your Windows runtime verification remains the exit gate.
- Production npm dependency audit returned zero reported vulnerabilities at preparation time.
- Browser layout, keyboard and animation inspection were not automated here because the browser executable could not be obtained. Inspect the workspace locally, including a narrow window and your reduced-motion setting, before confirming this checkpoint.

Primary references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [FastAPI first steps](https://fastapi.tiangolo.com/tutorial/first-steps/).
