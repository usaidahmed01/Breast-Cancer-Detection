# Breast AI — Product and AI Engineering Specification

**Version:** 0.3, editable working specification  
**Date:** 28 September 2026  
**Status:** Build planning; hosting and deployment will be decided in their phase  
**Source specification:** `AI_Breast_Cancer_Detection_Input_Output_Specification.pdf` (13 pages)  
**Product ambition:** Production-quality engineering for a radiologist decision-support product. Clinical use requires separate validation and applicable oversight. The event version uses authorized de-identified studies.

## 1. Project summary

Build an explainable, four-view mammography review application. The system receives left/right CC and MLO images, verifies input and quality, prepares high-resolution breast images, detects supported suspicious findings, localizes lesions, assesses supported outcomes, combines views, displays an accurately labeled explanation, and produces a structured summary for professional review. It can respond **indeterminate** instead of forcing a conclusion. This is the full flow of the source PDF (pp. 1–10).

We will engineer the application as a strong product: reproducible AI, secure image handling, well-defined data contracts, robust error paths, maintainable code, clinician-centered interaction, accessibility, animation, and tests. Production-quality software is not the same as a clinically validated diagnostic device. The final interpretation remains with a qualified professional.

### Project success criteria

1. Correctly handle four-view studies and supported DICOM encodings; clearly reject incomplete or incompatible studies.
2. Run real versioned models; never present illustrative numbers as live predictions.
3. Show each output only when its labels, model, held-out evaluation, and interpretation support it.
4. Preserve original images beside finding boxes, optional masks and precisely labeled heatmaps.
5. Give radiologists a useful interactive workflow, with explicit uncertainty and review state.
6. Produce reproducible evaluation and model documentation, including failure analysis and limitations.
7. Defer hosting, inference location, storage provider, and deployment costs until the deployment phase; design interfaces that leave those choices open.

## 2. Terminology and user journey

- **Mammography:** The X-ray examination. A **mammogram** is an image produced by it.
- **CC/MLO:** Two standard projections of each breast. Together, left and right form the preferred four-view study.
- **Finding:** A visible feature such as a mass or calcification. A suspicious finding is not a confirmed cancer.
- **Localization:** A box identifying a candidate region in a specific image.
- **Segmentation:** A pixel-level outline; requires a separately trained and tested model.
- **Classification score:** The output of a model for a defined label and population. It is not inherently a clinical probability.
- **BI-RADS:** A radiology assessment framework. It is not interchangeable with a pathology label.

**Primary user:** A radiologist or a judge evaluating a research demo. The intended clinical reviewer remains responsible for interpretation.

**Journey:** Open site → read research-demo notice → select four images → check/adjust view assignments → inspect validation status → run analysis → compare original and overlay → inspect per-view and per-breast results → read limitations and model information → clear the study. Authentication and retained-study workflow will be specified before non-demo studies are stored.

**Initial intended imaging context:** Standard two-dimensional, four-view digital screening mammography. Diagnostic additional views, digital breast tomosynthesis (3D), ultrasound, MRI, implants, post-surgical changes and unusual positioning need explicit support/validation before the system analyzes them. Distinguish *a finding in today's examination* from *future cancer risk* and distinguish a radiologist's assessment from pathology. This intended-use statement must accompany the model card and UI.

## 3. Scope and source-to-build mapping

The source PDF is the target flow. Features with distinct data and evaluation requirements remain in scope, with explicit gates for when the UI may show each one.

| PDF requirement | Implementation plan | Validation gate / condition | PDF pages |
| --- | --- | --- | --- |
| Four-view mammography | Required input and four-panel viewer | Explicitly marked partial-study mode only after validation | 2, 8-10 |
| DICOM plus research images | Accept supported DICOM and PNG; JPEG accepted with a quality caveat | Add more DICOM transfer syntaxes only after decoder tests | 2-3 |
| Optional clinical details | Display as context only, off by default | Use as model input only with a trained and validated multimodal model | 2 |
| Image validation/quality | File readability, required view count, laterality/view consistency, dimensions, unsupported format | Motion/artifact and positioning claims require labeled quality model | 3-4 |
| Breast region extraction | Reproducible training/inference crop and background handling | Automated anatomical quality grading after evaluation | 3 |
| Normal/abnormal/indeterminate | Use only labels supported by chosen dataset; include indeterminate | Define thresholds on validation set before test evaluation | 4, 6, 9-10 |
| Mass and calcification findings | Prioritized model targets, released only if each class passes its own test gate | Distortion/asymmetry and “other” need suitable labels and performance | 4, 8-10 |
| Lesion localization | Per-image bounding boxes when a detection model passes evaluation | Pixel masks require segmentation labels and separate testing | 4, 8-10 |
| Benign/malignant prediction | Build a dedicated outcome model | Display only with pathology/outcome-linked labels, calibration and independent validation | 5, 9-10 |
| Multi-view analysis | Show both view predictions for each breast and a transparently defined aggregate | Claim matched cross-view lesion agreement only if correspondence is tested | 5, 9-10 |
| Explainable overlay | Bounding boxes as direct detection output; optional tested attribution map | Label a method “Grad-CAM” only if that method is actually implemented | 5, 9-10 |
| Density, morphology, BI-RADS | Separate model heads and UI fields | Dedicated data/model/validation for each output | 4-6, 10 |
| Structured summary | Generated from verified result fields with fixed templates | No invented detail or unreviewed treatment recommendation | 6-7, 9 |
| Radiologist review | Clear review notice and source images always available | Clinical workflow study before patient-care use | 7-10 |

**Critical rule:** Do not fill empty fields with a default “not detected.” Use `not_assessed`, `unsupported`, or `indeterminate` when the feature was not evaluated or the image cannot be read.

## 4. Dataset and label strategy

### 4.1 Primary source

Candidate: **VinDr-Mammo**. It contains 5,000 four-view full-field digital mammography studies (20,000 DICOM images), breast-level BI-RADS and density assessments, and bounding boxes for selected findings. It provides 4,000 training and 1,000 test exams. Access is controlled by a registration and data-use agreement. It is a close fit to the four-view interface and finding-localization tasks, but its BI-RADS labels are **not** biopsy-confirmed malignancy probabilities. Only BI-RADS 3-5 findings are boxed; missing boxes must not automatically be treated as proof that no benign finding exists.

### 4.2 Optional second source

Candidate: **CBIS-DDSM** for a separate pathology-linked mass/calcification experiment. It contains digitized film mammograms with lesion regions and pathology-related information. Its imaging domain differs from contemporary full-field digital mammography. Keep training/evaluation provenance visible and do not casually merge its labels with VinDr-Mammo assessments.

The **RSNA Screening Mammography Breast Cancer Detection** dataset offers four-view images and benign/malignant outcome evidence, but its published competition/open-data terms restrict use to noncommercial purposes. **EMBED Open Data** also states noncommercial research access. These are useful research comparisons, not automatic foundations for a funded clinical product. VinDr-Mammo's restricted license says its use is solely for scientific research. CBIS-DDSM lists CC BY 3.0 on TCIA; confirm the exact collection terms and every upstream annotation/weight license before commercial reuse. Keep a per-dataset and per-weight rights register, with permitted use, redistribution, derivative-model conditions and approval evidence. A future hospital partner may be needed for adequately sized, diverse, pathology-linked, commercially usable data.

### 4.3 Dataset rules

- Obtain access through each publisher's terms. Keep restricted raw images outside the public code repository and any public demonstration assets.
- Create a manifest keyed by study ID, image ID, laterality, view, label source, annotation type, data split, and provenance. Do not include names or identifiers that can identify patients.
- Use study/patient-level separation; never allow a person's other views into a different split. Preserve the official test set as a final untouched evaluation when applicable.
- Document positive/negative definitions and any exclusions. Do not use the test set to pick architecture, thresholds, or overlays.
- Check prevalence, class balance, scanner/device and image-size differences, duplicates, annotations, and demographic coverage before training.
- Public demo images require a separate, documented right to redistribute. Otherwise use a visitor-selected local de-identified file. Illustrative synthetic examples must be labeled as such.

## 5. AI model development plan

This is a **multi-stage AI system**, not one generic classifier. We will establish baselines, compare stronger candidates, and freeze only models that pass evaluation. GMIC and published high-resolution multi-view CNNs inform the architecture; their results and weights cannot be treated as our performance.

| Model/workstream | Candidate baseline | Required labels | Output and role |
| --- | --- | --- | --- |
| Q0 — quality and compatibility | Deterministic DICOM, metadata, view, visibility and pixel checks; later a quality CNN if labels exist | Pass/fail fixtures; annotated motion/artifact/positioning cases for a learned model | Suitable, inadequate, incomplete or unsupported; never an invented quality grade. |
| D1 — finding detection | Faster R-CNN with feature-pyramid backbone on breast crops or high-resolution overlapping tiles; compare a lighter detector | View-specific finding boxes and classes | Mass boxes first; calcification, distortion and asymmetry added separately if data and class metrics support them. |
| C1 — lesion assessment | ResNet or EfficientNet-family classifier on lesion crop **plus surrounding context** | Pathology/outcome-linked benign and malignant lesions | Lesion-level score. A cancer probability requires appropriate outcome labels and calibration. |
| V1 — four-view fusion | Transparent per-breast aggregation first; compare learned shared-encoder/attention fusion across CC and MLO | Paired four-view exams and breast-level target label | Per-breast assessment with traceable per-view evidence; do not claim the same lesion was matched across views without testing. |
| S1 — segmentation | U-Net-family model or mask detector, compared on held-out masks | Expert pixel-level lesion masks | Contour and extent. A detection box is not a mask. |
| X1 — explanations | Detector box; actual Grad-CAM on a suitable classifier or another accurately named attribution method | Model outputs plus reference regions and sanity checks | Overlay for inspection, not proof of lesion boundary or diagnosis. |
| A1 — advanced heads | Separate density, morphology and ordinal BI-RADS candidates | Dedicated expert labels for each task | Independently evaluated, AI-assisted results with radiologist confirmation. |

### 5.1 Data and label contract

Keep **finding presence**, **lesion box**, **pixel mask**, **breast assessment**, **pathology outcome**, **density**, and **BI-RADS** as separate targets. VinDr-Mammo is useful for four-view finding/assessment work, but BI-RADS does not establish pathology; only BI-RADS 3–5 findings receive its boxes. CBIS-DDSM has pathology-related lesion labels but differs in acquisition domain and case composition. A missing annotation is not automatically a verified negative.

Use a study manifest with source, patient-safe grouping ID, image ID, view/laterality, scanner/acquisition context, dimensions, annotation type, pathology/follow-up source, split and rights. Split by patient; all views and repeat exams for one person stay together. Preserve the official/frozen test set, check duplicate or near-duplicate images, and obtain an independent external site/device cohort before generalization claims. Expert review of sampled false positives, misses and ambiguities is part of the label audit.

### 5.2 Preprocessing

Decode DICOM pixel data, photometric inversion, orientation and spacing correctly. Remove irrelevant background while preserving breast anatomy; normalize intensities using training-defined parameters. Keep reversible mappings for crop/resize/tile coordinates so overlays land on the original pixels. Use high-resolution crops or overlapping tiles for microcalcifications; naive reduction of a full mammogram to a small square can erase tiny signals. Maintain identical training and inference transforms and golden-image parity tests. Augmentation must preserve laterality and anatomy; inspect representative transformed cases.

### 5.3 Training order

1. Audit rights, image formats, labels, quality, prevalence, scanner sources and patient grouping; create contact sheets for expert checks.
2. Train a per-view assessment baseline and D1 mass detector, with experiment config, seeds, curves and error gallery.
3. Train and evaluate calcification detection separately at sufficient resolution. Extend to distortion/asymmetry only with suitable labels and per-class results.
4. Train C1 on verified pathology/outcome data, testing image shortcuts such as markers, burned-in text, site/device and patient repeats.
5. Establish simple CC/MLO aggregation, then compare V1 against it and single-view baselines; document whether view agreement is heuristic or learned.
6. Develop S1 and A1 only on their own masks/labels. Evaluate each independent head before enabling its UI output.
7. Select thresholds and uncertainty bands on validation data. Calibrate probability outputs on appropriate outcomes; freeze thresholds before final test evaluation.
8. Freeze artifacts, model/preprocessing versions, checksums, label mapping and model card. Verify inference results and box coordinates against the training reference on golden studies.

### 5.4 Abstention and explainability

The analysis must abstain for unreadable or unsupported pixel encoding, missing views, inadequate quality when established, model failure, or predefined uncertainty. Do not call a method “out-of-distribution detection” unless separately implemented and validated. Detector boxes and heatmaps are distinct overlays. An actual Grad-CAM requires the appropriate gradients/feature layer; a colored blur over the detection box is not Grad-CAM. Test explanations against reference regions and sanity checks; always show the original image.

### 5.5 Deep model comparison: free access versus product suitability

The model below is a **shortlist for reproducible experiments**, not a ranking by incompatible published scores. “Best” will mean strongest performance on the same held-out patient-level and external tests at a practical latency, with defensible labels and usable rights. Free-to-download weights are not necessarily free to use in a commercial product.

| Candidate | What is actually available | Strength for this project | Constraint and decision |
| --- | --- | --- | --- |
| **Our high-resolution detector + four-view fusion** | Train our own weights with PyTorch/Torchvision/MONAI and permitted initialization | Controls labels, pipeline, architecture, explainability, runtime and ownership; compare mass/calcification detectors and simple versus learned fusion | First product-track candidate. Results depend on lawful data and compute; no performance can be promised in advance. |
| **Kheiron mammo-net** | MIT-licensed training code, ResNet-18 baseline; no claim here that it supplies a clinical pretrained model | Reproducible image-level baseline and preprocessing reference | Its example uses VinDr BI-RADS labels, not confirmed pathology; repository says high-end GPU was used. Code license does not change data rights. |
| **NYU GMIC** | Five pretrained GMIC-ResNet-18 models with high-resolution saliency; AGPL-3.0 repository | Serious high-resolution interpretable benchmark | Preprocessing/input assumptions and AGPL obligations require review; saliency is not a ground-truth mask. Research benchmark, not an automatic product dependency. |
| **NYU GLAM** | Pretrained weakly supervised high-resolution saliency models; AGPL-3.0 repository | Compare interpretability/localization behavior | Its fine-grained saliency is not equivalent to expert-drawn segmentation. Review license and generalization. |
| **NYU four-view BI-RADS CNN** | Pretrained four-view code/model, BSD-2-Clause repository | Multi-view architecture baseline | Predicts BI-RADS categories, not pathology; old framework/input assumptions and weight terms require checking. |
| **Mammo-CLIP** | Research code/checkpoints, image-text pretraining | Explore whether mammography-specific representation helps low-label tasks | Explicit CC BY-NC-SA 4.0 repository terms prohibit commercial deployment. Research comparison only absent separate permission. |
| **Mammo-FM** | Apache-2.0 code; model weights under a custom academic license | Modern representation-learning experiment | Code and weights have different permissions; do not place academic weights into a commercial product without separate rights. |
| **MIT-licensed two-view research code** | Public dual-view implementations, including a VinDr baseline | Test whether paired-view fusion beats a single image on the same splits | Verify any checkpoint separately; published BI-RADS results are not cancer-detection results. |

**Selection protocol:** Establish an identical data split, label definition, preprocessing record, threshold-selection method and test unit for every comparable candidate. Compare a simple image baseline, high-resolution detector, four-view model and any permitted pretrained candidate. Track lesion sensitivity at false positives per image, breast-level sensitivity/specificity and PR-AUC, calibration, subgroup results, external-site drop, inference time and memory. Perform ablations for image resolution, calcification tiling, two-view fusion, prior-image input and clinical context. Do not compare one paper's AUC on a selected case set with another paper's AUC on screening prevalence.

**Compute plan:** Reuse lawful public initialization and freeze/finetune encoders where useful; train on crops/tiles, gradient accumulation and mixed precision when available, and checkpoint every run. Free research GPU capacity can be explored but is not guaranteed or sufficient for every high-resolution experiment. The product architecture must follow evidence; do not compress a model until it loses small lesions just to meet a free host's limit.

### 5.6 Product differentiators to develop and prove

1. **Two scales of evidence:** High-resolution lesion detection plus whole-breast context and CC/MLO fusion. A low-resolution classification score alone is insufficient for tiny findings.
2. **Current versus prior mammogram review:** Add an optional prior four-view study and a current/prior comparison workspace. A separately trained temporal model may flag *new or changing* findings when longitudinal outcome data exists. Show `prior unavailable` otherwise. Future cancer-risk prediction is a different task with a different outcome horizon; it must not be mixed into current-lesion detection.
3. **Contralateral and view comparison:** Compare left/right and CC/MLO evidence with explicit alignment limits. Learn lesion correspondence only if experts provide or validate matching labels.
4. **Calibrated, density-aware uncertainty:** Evaluate dense versus non-dense breasts and scanner/site subgroups; abstain or flag review when evidence is weak. Density-aware claims need measured subgroup improvement.
5. **Human disagreement workflow:** Let a radiologist inspect, correct and annotate AI findings; store feedback separately from ground truth. Retraining requires adjudication, versioning and a fresh independent test.
6. **Transparent evidence trail:** Show original image, specific boxes, per-view support, score definition, model version and limitations. Report detection/assessment rather than a dramatic unexplained percentage.
7. **Prospective utility:** After retrospective and external validation, study radiologist+AI reading, false positives, misses, reading time and reader bias. A UI demo cannot establish these benefits.

These are differentiation hypotheses until our data show improvement. Prior examinations are clinically relevant and longitudinal models have shown value for future-risk tasks, but they require appropriately paired data and must be evaluated for our intended detection task.

## 6. Evaluation and release gates

| Area | Required evaluation | Release rule |
| --- | --- | --- |
| Input/quality | Valid/invalid DICOM, PNG/JPEG, four-view mapping, orientation, missing views, unsupported compression | Fail safely with a useful message; no prediction for unsupported input |
| Detection | Sensitivity/recall, specificity or false positives per exam, per-class precision/recall, PR-AUC as appropriate | Publish exact held-out results and threshold; omit a class if poor |
| Localization | Lesion-level sensitivity at stated false positives per image; IoU/mAP where annotation quality permits | Display boxes only for evaluated model outputs |
| Breast/study assessment | ROC-AUC and PR-AUC with confidence intervals; sensitivity and specificity at chosen threshold; confusion matrix | State dataset and target label; do not call it pathology accuracy if labels are BI-RADS |
| Probability | Reliability plot, calibration error/Brier score on suitable outcomes; subgroup review | Show percentage as calibrated probability only after this gate |
| Robustness | Image size, scanner/source, breast density, age where available, atypical views, corrupted files | Report limitations and abstain where unsupported |
| Inference parity | Compare deployed-runtime outputs and mapped boxes with the Python training reference on fixed cases | Resolve discrepancies before releasing a model |
| UX/performance | Upload and load times, memory, four-view inference latency, desktop/mobile behavior | Document supported devices and meet measured performance targets |

Before publicizing an accuracy figure, record test-set size, confidence interval, label source, inclusion criteria, threshold, model version, and whether the result is per image, breast, study, or lesion. Do not borrow results from published clinical studies as this model's results.

## 7. Application architecture and data contract

### 7.1 Architecture without a hosting decision

**Web:** Next.js + React in **JavaScript/JSX**, not TypeScript/TSX. Use JSDoc for important objects, JSON Schema/runtime validation for API payloads, ESLint/Prettier and contract tests. Separate viewer, results, animation, upload and API client modules. A DICOM viewer such as Cornerstone is a candidate, subject to actual mammogram tests.

**AI/API:** Python + FastAPI is the initial implementation choice for DICOM processing and PyTorch/MONAI inference. The JavaScript preference applies to the web application; Python remains appropriate for AI training/inference. Start as a modular service with versioned API and model registry; introduce asynchronous workers/queue if load and run time require them. Avoid tying the model to a hosting platform. Evaluate server or on-device inference during the deployment phase using model size, performance, privacy and cost.

**Security/operations:** Validate file content and size; reject unsupported transfer syntax; de-identify study records and logs. No public repository with raw medical images. No retained patient study without a defined consent/legal basis, access controls, encryption, retention/deletion and audit design. Capture model version, latency and errors without recording pixels or identifying metadata. Authentication and role-based permissions are required before a real multiuser reviewer workflow.

### 7.2 Suggested repository

```text
breast-ai/
  web/                 # Next.js JavaScript/JSX
    app/               # Routes
    components/        # Viewer, upload, results, animations
    lib/               # API client and runtime schema validation
  api/                 # FastAPI, DICOM and inference services
    app/routes/
    app/services/
    app/schemas/
  ml/                  # Python preprocessing, training, evaluation
    data/
    models/
    train/
    evaluation/
  contracts/           # JSON Schema and safe example payloads
  docs/                # Model cards, provenance, evaluation, operations
  tests/               # Input, model, API, UI and end-to-end
```

**Illustrative API:** `POST /api/v1/studies` creates a short-lived study; `POST /api/v1/studies/{id}/images` validates views; `POST /api/v1/studies/{id}/analyze` starts versioned inference; `GET /api/v1/studies/{id}/results` returns structured findings; `DELETE /api/v1/studies/{id}` removes temporary material. Add a review endpoint only with an authenticated reviewer workflow. Exact routes can evolve, but idempotence, schema validation, safe errors and model-version traceability are required.

### 7.3 Result object (illustrative contract)

```json
{
  "schemaVersion": "0.2",
  "modelVersion": "to-be-assigned",
  "studyStatus": "complete | incomplete | unsupported | indeterminate",
  "views": [
    {
      "key": "R-CC",
      "inputStatus": "valid",
      "findingStatus": "detected | not_detected | not_assessed | indeterminate",
      "findings": [
        {
          "type": "mass",
          "scoreType": "model_suspicion_score",
          "score": 0.0,
          "boxOriginalPixels": [0, 0, 0, 0]
        }
      ]
    }
  ],
  "breasts": {
    "left": {"status": "review | no_supported_finding | indeterminate"},
    "right": {"status": "review | no_supported_finding | indeterminate"}
  },
  "limitations": ["Research prototype; professional review required"]
}
```

The numeric values above are placeholders defining a schema, **not a sample diagnosis**. A result can only contain a label if the released model actually predicts it. The summary is a deterministic rendering of this object, not a free-form language-model interpretation.

## 8. Interactive UI and animation specification

### Screens and interactions

1. **Landing:** Clear purpose, flow, evidence level and start action.
2. **Study intake:** Four animated drag/drop slots, thumbnails, editable view assignments, parsed metadata, actionable errors and optional clinical context clearly separated from model inputs.
3. **Live progress:** Validation, preprocessing, detection, assessment, fusion, explanation. The progress state must reflect real work, not a fabricated percentage.
4. **Review dashboard:** Four synchronized image panels; left/right assessment cards; finding list; zoom, pan, window/level; original/box/mask/heatmap toggles; hover/click a finding to focus its source region; transparent CC/MLO evidence; confidence and limitation details.
5. **Evidence and report:** Model version, supported findings, test metrics and limitations; printable structured summary and explicit radiologist review state.

### Motion system

Use restrained entrance and panel transitions, analysis-step cues, overlay fading, box highlighting, comparison sliders and responsive drawers. A selected finding may smoothly center and zoom the matching image. Respect `prefers-reduced-motion`; provide keyboard operation, focus indicators, readable contrast and text labels independent of color. Never animate diagnostic pixels, conceal uncertainty or make an illustrative screen look like a live prediction. The original mammogram must stay one action away.

## 9. Build phases and exit gates

| Phase | Build work | Exit evidence |
| --- | --- | --- |
| 0 — Rights and feasibility | Obtain data, inspect labels/DICOM, define supported tasks and classes | Data dictionary, rights record, image audit |
| 1 — Foundation | JavaScript Next app, Python API, input contract, DICOM viewer and safe upload | Correct four-view rendering; invalid studies fail clearly |
| 2 — AI baselines | Preprocessing, patient-level split, assessment/detection baselines | Reproducible validation and error gallery |
| 3 — Core AI | High-resolution supported findings, boxes, breast aggregation, abstention | Locked test metrics, thresholds and model card |
| 4 — Review experience | Interactive dashboard, overlays, animations, accessibility and report | End-to-end flows and clinician usability review |
| 5 — Advanced AI | Segmentation, pathology model, density, descriptors and BI-RADS as data permit | Separate evidence gate and model card per feature |
| 5A — Longitudinal comparison | Optional prior-study viewer; temporal model only with linked current/prior data and a defined outcome | Current-only versus current-plus-prior ablation and separate model card |
| 6 — Hardening | Security, tests, audit, performance, external dataset and human workflow evaluation | Readiness review for intended context |
| 7 — Deployment | Choose architecture/provider from actual requirements and current options | Deployed system passes same safety, performance and end-to-end gates |

UI and AI work can overlap. No product claim can skip its model evidence gate.

## 10. Engineering quality

Use JavaScript/JSX linting, formatting, JSDoc, runtime schemas and API contract tests; pin Python environments and training configs. Test DICOM decoding/inversion, orientation, coordinate maps, duplicate/missing views, split leakage, model export/inference parity, API failures, UI interactions and accessibility. Include normal, suspicious, unsupported, failed and indeterminate end-to-end cases. CI should run relevant tests and build checks without raw images or secrets. Document rollback for model or app regressions. Track input format coverage, inference latency, failures, abstention and model drift without collecting identifying metadata.

## 11. Privacy, safety, and honest claims

- Use de-identified, authorized images. DICOM can contain patient data in metadata **and burned into pixels**; de-identification needs to check both. Minimize transfer and retention regardless of the eventual inference architecture.
- Do not log filenames, medical metadata, pixels, or scores to analytics. Avoid third-party scripts on the analysis page.
- The app makes no diagnosis; a positive flag is a request for professional review, and a negative result cannot rule out cancer.
- Do not claim reduced mortality, fewer biopsies, improved radiologist performance, or clinical readiness based solely on a retrospective dataset benchmark.
- The paper/article evidence in the pitch describes other systems. Present this project's own dataset, test design, and metrics separately.
- Before any use with patients, plan clinician-led external validation, human factors, privacy/security review, and applicable medical-device regulatory assessment in target markets.

## 12. Main risks and mitigations

| Risk | Practical response |
| --- | --- |
| Microcalcifications vanish on downsampling | High-resolution crops/tiles; independent calcification evaluation |
| DICOM decoder misses a transfer syntax or inverts pixels | Supported-syntax matrix and golden DICOM cases; fail safely |
| BI-RADS treated as pathology | Separate label dictionary, models, score names and model cards |
| A negative annotation is unverified | Audit annotation policy; expert-adjudicated samples |
| Model appears good because of leakage or dataset shortcuts | Patient-level split, artifact/site audits and external dataset |
| Boxes/heatmaps mislead the reader | Keep originals, explain each overlay method, assess localization |
| Multi-view fusion gives false certainty | Compare to simple aggregation and define agreement clearly |
| Processing or load is too slow | Profile real image sizes; choose inference infrastructure at deployment phase |
| Identifiable data enters logs or repository | Data-governance review, safe logging, access controls and repository checks |

## 13. Enhancements and open decisions

### Enhancements added beyond the PDF

- A separate data-label contract for finding, pathology, BI-RADS, density, masks and quality.
- A precise intended-use boundary for 2D screening, with unsupported modalities and diagnostic contexts handled explicitly.
- A high-resolution model path for small findings rather than indiscriminate resizing.
- Named detection, lesion, fusion, segmentation, explanation and advanced model workstreams.
- A researched comparison of publicly available weights, code licenses, training-data rights and compute requirements.
- Optional prior-study comparison, with a separate temporal model and evaluation rather than conflating detection with future-risk prediction.
- Patient-level data separation, locked test results, calibration, external validation, model cards and uncertainty gates.
- Interactive four-view review, meaningful animation, accessible controls and original/overlay comparison.
- Versioned API, safe study lifecycle, security, observability and release/rollback expectations.

### Choices that remain editable

Project brand/design language; event date and available hardware; acquired datasets and licenses; first released detection classes after evaluation; exact model architectures following baseline comparisons; whether clinical context becomes a trained input; storage and authentication rollout; and **all hosting/deployment choices in Phase 7**.

## 14. Sources

- User-supplied `AI_Breast_Cancer_Detection_Input_Output_Specification.pdf`, pp. 1–13.
- Breastcancer.org, AI and mammography: https://www.breastcancer.org/screening-testing/artificial-intelligence
- MASAI randomized trial: https://portal.research.lu.se/en/publications/interval-cancer-sensitivity-and-specificity-comparing-ai-supporte/
- VinDr-Mammo: https://physionet.org/content/vindr-mammo/1.0.0/
- CBIS-DDSM: https://www.cancerimagingarchive.net/collection/cbis-ddsm/
- VinDr-Mammo restricted license: https://physionet.org/content/vindr-mammo/view-license/1.0.0/
- RSNA mammography dataset terms: https://www.kaggle.com/competitions/rsna-breast-cancer-detection/rules
- EMBED open-data use FAQ: https://docs.hitilab.com/docs/datasets/embed/open-data-faq
- High-resolution multi-view CNN research: https://arxiv.org/abs/1703.07047
- NYU GMIC reference implementation (license/weights require review): https://github.com/nyukat/gmic
- NYU GLAM repository: https://github.com/nyukat/GLAM
- NYU four-view BI-RADS classifier: https://github.com/nyukat/BIRADS_classifier
- Kheiron mammo-net research baseline: https://github.com/Kheiron-Medical/mammo-net
- Mammo-CLIP repository and terms: https://github.com/batmanlab/Mammo-CLIP
- Mammo-FM repository and weight terms: https://github.com/batmanlab/Mammo-FM
- Dual-view VinDr research baseline: https://github.com/iCARE-Lab/vindr-mammo-dual-view-classification
- Prior-study research example: https://www.nature.com/articles/s41523-025-00831-x
- MONAI: https://github.com/Project-MONAI/MONAI
- Torchvision detection references: https://docs.pytorch.org/vision/stable/models/faster_rcnn
- Cornerstone image loader: https://www.cornerstonejs.org/docs/concepts/cornerstone-core/imageloader/
- FDA background on medical-image analysis and CDS: https://www.fda.gov/medical-devices/digital-health-center-excellence/step-6-software-function-intended-provide-clinical-decision-support
- FDA/IMDRF Good Machine Learning Practice principles: https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/good-machine-learning-practice-medical-device-development-guiding-principles

Research references inform the engineering plan; their performance does not transfer to our model. Review licenses, dataset agreements and applicable jurisdictions before commercial or clinical use.

**Research pages checked:** 28 September 2026. Recheck terms and dataset agreements before use.
