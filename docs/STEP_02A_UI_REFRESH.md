# Step 02A — breast-care UI and dependency cleanup

## Purpose

Make the first experience feel warm, focused and connected to breast care. The light interface now uses ivory, blush and rose colors; a custom ribbon illustration; a clearer introduction; and interactions that help explain the four-view workspace. This is a focused revision of Step 02 before image intake is added.

## What changed and why

| Change | Purpose |
| --- | --- |
| Header, hero, ribbon illustration and light palette | Establish a consistent breast-care identity and clear route into the workspace. |
| Projection buttons and grid/focus controls | Let a reviewer explore CC/MLO organization and concentrate on one view. Selected-view details update immediately. |
| Workflow and FAQ disclosures | Explain the planned flow while allowing visitors to choose how much detail to read. |
| Mobile menu, keyboard focus, skip link and live announcements | Make navigation and state changes accessible through more than a mouse. |
| Entrance, floating illustration and interaction motion | Add a calm sense of movement; reduced-motion preferences disable animation and smooth scrolling. Medical image pixels are not animated. |
| ESLint 10 with compatible official JS, Next.js and React Hooks plugins | Remove the deprecated ESLint 9 dependency and the incompatible dependency chain behind the resolver warning. |

The API connection check remains real. The page explicitly describes image intake and model inference as future implementation steps.

## Understanding your install output

- `added ... packages` and `found 0 vulnerabilities`: installation completed, and npm reported no known vulnerabilities in the audited dependency graph at that time.
- The ESLint message referred to deprecated development tooling. This patch upgrades it.
- The `unrs-resolver` warning referred to an unreviewed dependency install script. The refreshed dependency tree no longer contains that package; its lockfile lists no install scripts. No broad script approval is needed for this patch.
- Funding messages are informational; npm is not asking you to pay for installation.
- The npm version notice is optional. Keep your current npm version for this checkpoint.

### npm versus npm.cmd on Windows

Both invoke the same npm CLI. PowerShell can resolve `npm` to its `npm.ps1` launcher, which is subject to PowerShell execution policy. `npm.cmd` explicitly selects the Windows command wrapper and avoids that launcher restriction. If plain `npm` works in your terminal, you can use it. Our Windows instructions use `npm.cmd` so they work without changing a persistent execution policy.

## 1. Apply the patch

Stop the frontend with Ctrl+C. Extract the ZIP elsewhere, then merge the contents of its `breast-ai` folder into `D:\Breast-Cancer-Project\breast-ai`, replacing supplied files. Do not create a second nested `breast-ai` directory. Both `web/package.json` and `web/package-lock.json` must come from this patch. No files need manual deletion; npm ci rebuilds the generated dependency directory from the new lockfile.

## 2. Install and verify the frontend

```powershell
cd D:\Breast-Cancer-Project\breast-ai\web
npm.cmd ci
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Purpose: install the updated dependency tree, check JavaScript/JSX and Hooks rules, verify the health contract/failure behavior, and compile the UI. Five JavaScript tests must pass. There should be no ESLint 9 deprecation or unrs-resolver warning from this dependency tree. If you still see either, confirm both package files were replaced and you are inside this project's `web` directory. No Python dependency reinstall is needed for this patch.

Your Node 24.21.0 meets the refreshed tooling requirements. The package engine field now records ESLint 10's minimum supported versions as well as the frontend runtime requirement.

## 3. Run and inspect

Terminal 1, project root:

```powershell
cd D:\Breast-Cancer-Project\breast-ai
.\.venv\Scripts\python.exe -m uvicorn api.app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2, frontend:

```powershell
cd D:\Breast-Cancer-Project\breast-ai\web
npm.cmd run dev
```

Open http://127.0.0.1:3000 and refresh. Check these behaviors:

1. The hero uses a light ivory/rose theme and a ribbon illustration. Explore the workspace scrolls to the review section.
2. Select R-MLO: its card becomes selected and the details show Right/MLO.
3. Choose Focus view: one selected card is shown. Switch projections, then choose Four views to restore the grid.
4. Expand workflow and FAQ items; keyboard Tab/Enter should operate controls.
5. Click Check connection: expect API connected. Stopping the API and retrying must show API unavailable; restarting restores connection.
6. Narrow the window: open the mobile menu, select a link, and check that the page fits without horizontal scrolling. Escape closes an open menu and returns focus to its toggle.
7. Turn on your operating system's reduced-motion preference: decorative animation and smooth scrolling should stop.

## 4. Commit and push

From the project root:

```powershell
cd D:\Breast-Cancer-Project\breast-ai
git add README.md web docs/STEP_02_FOUNDATION.md docs/STEP_02A_UI_REFRESH.md
git diff --cached --stat
git commit -m "feat: refresh breast-care UI and modernize lint tooling"
git push
```

If the Step 02 checkpoint has not been committed yet, include its API, contract, tests and requirements files as well using that step's Git instructions. Keep the updated package lockfile in Git.

## Patch file list

- Updated: README.md; docs/STEP_02_FOUNDATION.md; web/package.json; web/package-lock.json; web/eslint.config.mjs; web/app/layout.jsx; web/app/page.jsx; web/app/globals.css; web/components/ConnectionPanel.jsx.
- New: docs/STEP_02A_UI_REFRESH.md; web/components/Icon.jsx; web/components/SiteHeader.jsx; web/components/CareIllustration.jsx; web/components/ReviewWorkspace.jsx.
- Deleted: none.

## Next checkpoint

Share the result of the checks and a screenshot of the refreshed UI. After this revision is verified and pushed, Step 03 adds four-view image intake and input validation.

## Verification before delivery

Fresh npm installation, ESLint 10 checks, all five JavaScript tests and the optimized Next.js build passed on Node 24.19.0/Linux. The full npm audit reported zero known vulnerabilities. The new lockfile contains no unrs-resolver package or dependency install scripts. The redesigned page's browser layout and interactions require the local checklist above; a browser executable was unavailable for automated visual inspection here.

Reference: [npm install-script policy](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/).
