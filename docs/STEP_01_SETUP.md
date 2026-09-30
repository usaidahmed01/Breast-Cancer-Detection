# Step 01 — local project setup

## Purpose

Create a consistent project layout, isolate Python dependencies in `.venv`, and establish a clean GitHub checkpoint. This foundation lets future ZIP patches be applied without mixing application code, trained models and local environments. Python handles the API/AI work; JavaScript/JSX handles the frontend.

## 1. Extract the ZIP

Extract `Breast_AI_Setup_Step_01.zip` into your chosen development directory. It contains one `breast-ai` folder. Open that folder in VS Code, then open a PowerShell terminal there. If you previously extracted the experimental DICOM-audit ZIP, keep that folder separately and begin this guided setup in a fresh folder.

## 2. Create your local virtual environment

Run in PowerShell:

```powershell
python .\scripts\setup.py
```

This checks Python, Node, npm and Git; creates `.venv`; confirms pip is available; and verifies the project layout. It uses your installed Python. Python 3.11+ is sufficient for this setup checkpoint; compatibility with the exact AI dependencies will be checked before installing them. No network download is needed for this step. Application dependencies are added and pinned when used.

Alternative wrapper:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

This bypass applies to that PowerShell process. It does not change your machine's persistent execution policy.

## 3. Verify

```powershell
.\.venv\Scripts\python.exe .\scripts\check_setup.py
```

Expected final check message:

```text
SETUP CHECK PASSED: project folders and local virtual environment are ready.
```

In VS Code, choose **Python: Select Interpreter** from the Command Palette, then select `.venv\Scripts\python.exe`.

Optional terminal activation:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use `.\.venv\Scripts\python.exe` directly for Python commands. Activation only changes terminal command lookup; the environment already exists.

For macOS/Linux, run `python3 scripts/setup.py`, then `.venv/bin/python scripts/check_setup.py`. Optional activation: `source .venv/bin/activate`.

## 4. Commit and push

Create an empty GitHub repository named `breast-ai`. For this new project, leave GitHub's README, license and .gitignore initialization unchecked because these setup files supply the repository contents. A private repository is a reasonable starting choice while the product name and code license are undecided.

Run in the project root:

```powershell
git init
git branch -M main
git add .
git status --short
```

Check that `.venv` and local data are absent from the staged list. Then:

```powershell
git commit -m "chore: initialize project structure and local setup"
git remote add origin https://github.com/YOUR_USERNAME/breast-ai.git
git push -u origin main
git status --short
```

Replace `YOUR_USERNAME` and the repository name with your actual GitHub URL. If GitHub asks you to sign in, use its normal Git credential flow. The final `git status --short` should have no output. If you already created a nonempty repository, share its current file list before merging this scaffold. Do not force-push.

## Files in this checkpoint

- New: README, requirements placeholder, .gitignore, .gitattributes, .editorconfig.
- New: setup and verification scripts; package markers and tracked folder placeholders.
- New: this step guide and an unchanged copy of the working product specification.
- Updated/deleted: none; this is the initial guided checkpoint.

## Exit gate and next step

Share the `SETUP CHECK PASSED` output and your GitHub repository URL or confirmation of the successful push. The next ZIP will implement the first application slice. It will list every new/updated/deleted file and provide commands, purpose, verification and a commit message.
