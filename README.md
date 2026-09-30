# Breast AI

A four-view mammography decision-support project. Web code uses JavaScript/JSX. The API and AI pipeline use Python. Deployment choices will be made in their own phase.

## Current checkpoint

Step 02B: a responsive breast-care interface with self-hosted Manrope body text and Lora display text, readable workspace controls and layouts from small phones through desktops. Projection selection, grid/focus layouts, expandable workflow details, mobile navigation and the live API connection check remain available. Image intake and model inference begin in later steps.

Read [Step 02B responsive font](docs/STEP_02B_RESPONSIVE_FONT.md) for the current patch, commands and GitHub checkpoint. [Step 02A UI refresh](docs/STEP_02A_UI_REFRESH.md), [Step 02 foundation](docs/STEP_02_FOUNDATION.md) and [Step 01 setup](docs/STEP_01_SETUP.md) record earlier steps. The [working specification](docs/PRODUCT_SPECIFICATION.md) defines the future product; features described there are not all implemented.

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
