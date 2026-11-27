# E09 — Independent external evidence assessment

## Scope
This is a frozen, cross-specimen transfer stress test, not matched external validation of a farming rope or a prospectively blinded evaluation. The two datasets had been reviewed during E01 acquisition but were excluded from E03 fitting. No model parameters were changed for E09.

## Inputs
- Frainer & Tiegs (2022), *A stream-to-sea experiment reveals inhibitory effects of freshwater residency on organic-matter decomposition in the sea*, https://doi.org/10.1002/lol2.10261; data https://doi.org/10.5061/dryad.7wm37pvwk. The supplied archive has 48 cotton-strip tensile-strength records, including 10 controls and 16 marine-only records (8 per time). Freshwater and translocation groups are described separately. The temperature column is accumulated exposure, not instantaneous temperature. Retention = 100 × treatment mean / control mean (67.32, source units). No absolute force-unit conversion is needed.
- Pauli et al. (2017), *Macrofouling communities and the degradation of plastic bags in the sea: an in situ experiment*, data https://doi.org/10.5061/dryad.n8274. Use the workbook's all_data_only family level sheet (100 rows; 79 force and 80 area-loss values), without duplicating the taxonomy sheet. TP is in N, disintegration is loss of area in percent. Keep explicit zeros; do not impute missing values. Habitat baselines are normalised separately; identical baseline group means must not be counted as independent evidence.

## Frozen transfer calculation
Use the 35 saved E03 cotton parameter rows (six exact-table twine configurations and one graph-derived Zhou cotton rope, five models per configuration including constant). Evaluate at 15 and 41 days. Take the equal-weight median of six exact-twine predictions by model/time; Zhou is separate. This aggregation is a fixed descriptive choice, not a fitted population model. Compare with the marine-only group means; do not count 70 predictions as 70 independent observations. The effective endpoint count is two correlated group means sharing a baseline. The six curves are not matched configurations; their min/max is not a prediction interval.

| Model | Day 15 (%) | Day 41 (%) | RMSE (pp) |
|---|---:|---:|---:|
| Observed | 97.87 | 54.16 | — |
| Constant | 100.00 | 100.00 | 32.45 |
| Zero-order | 90.51 | 74.06 | 15.00 |
| First-order | 89.70 | 74.29 | 15.36 |
| Weibull | 98.62 | 77.54 | 16.54 |
| Lag-phase | 100.00 | 74.03 | 14.13 |

All four kinetic median predictions overestimate day-41 retention by 19.87–23.38 pp; the observed day-41 mean falls below every exact-twine fitted curve for each kinetic family (the closest lag prediction is 54.35% vs 54.16%, a small gap that should not be overinterpreted). Lag-phase has the lowest descriptive RMSE; this does not establish model superiority with two endpoints. The frozen Zhou cotton curves also overestimate day-41 retention. Distinct specimen geometry, environments and assay methods prevent attribution to a single variable. This is a domain-transfer failure signal, not an estimate of local farm predictive error.

## Applicability boundary
At 12.5 months, recorded MaterBi mean force is zero in both habitats, but mean area loss is only 13.44% benthic and 49.23% pelagic. PE retains 98.46% and 82.04% of initial force in those habitats respectively, with zero reported area loss. Sample counts differ by endpoint. No material mineralisation or complete biodegradation is inferred from these observations. Films are outside the E03 rope domain; do not extrapolate their performance to rope products or equate MaterBi with PBS/PBAT.

## E10 requirements
1. Provide source-specific day-45 estimates and display specimen type, construction, exposure and source.
2. Require matched material, configuration, environment and endpoint for prediction claims; flag mismatches and withhold unvalidated predictions for new local configurations. Allow illustrative screening separately, with explicit lab context.
3. Distinguish breaking force, safe working load, retention, disintegration, biodegradation and local yield.
4. Preserve missing costs, service life, yield and LCA inputs. Scenario calculations are conditional, not observed local outcomes.
5. Prioritise cotton trials, retain conditional jute and conventional reference controls; do not present a validated farm material ranking.
6. Local matched external rope trials remain necessary; no application can claim local predictive validation on E09 alone.

## Reproducibility
The Python script and full notebook were executed locally against the supplied archives. The repository includes a runnable reproduction notebook and source parameter snapshot; the Python RMSE values were independently reproduced in JavaScript from the committed E03 parameters and extracted group means (max difference < 0.000001 pp). Rounded outputs may differ in trailing zeros. The fully executed original notebook with inline figures is delivered in the downloadable E09 package. Raw third-party archives are not redistributed here.

[External cotton summary](../outputs/E09/cotton_external_summary.csv) · [Transfer predictions](../outputs/E09/frozen_transfer_predictions.csv) · [Metrics](../outputs/E09/transfer_metrics.csv) · [Film boundary](../outputs/E09/plastic_film_boundary.csv) · [Applicability register](../outputs/E09/applicability_register.csv) · [Audit](../outputs/E09/audit.json) · [Notebook](../notebooks/E09_External_Transferability.ipynb)
