# Breast AI

A four-view mammography decision-support project. Web code uses JavaScript/JSX. The API and AI pipeline use Python. Deployment choices will be made in their own phase.

## Current checkpoint

Step 01: repository layout and a local Python virtual environment. No model weights, image processing or application server are installed at this checkpoint.

Read [Step 01 setup](docs/STEP_01_SETUP.md) for commands, verification and the GitHub commit. The [working specification](docs/PRODUCT_SPECIFICATION.md) defines the future product; features described there are not yet implemented.

## Directories

| Directory | Purpose |
| --- | --- |
| `web/` | Future Next.js frontend in JavaScript/JSX |
| `api/app/` | Future Python API |
| `ml/` | Data preparation, training and evaluation |
| `contracts/` | Shared JSON payload definitions |
| `tests/` | Verification cases |
| `scripts/` | Local setup and verification commands |
| `docs/` | Setup history and engineering specification |

## Patch workflow

Every future step ZIP has a `breast-ai/` root and includes complete versions of the new and modified files. Extract it over the existing project, merging directories. Read its step document for any explicitly listed deletions. The ZIP never includes `.venv`, `node_modules`, secrets, medical images, weights or Git history. Your GitHub repository records the code after each verified step.
