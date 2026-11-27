# E08 — Uncertainty and sensitivity analysis

## Scope
Executed against the committed E02, E04, E05 and E07 CSVs. The analysis addresses sensitivity, not predictive probability or farm safety certification.

## Mechanical stress
The exact-table day-45 interpolation uses w=3/14. Interpolate the day-42/day-56 lower and upper mean ± SD bounds, derived from rounded CV values. For retention, divide the lower aged value by upper baseline and vice versa; for absolute force convert the interpolated aged bounds directly from kgf to N. Include the nominal and four kinetic model estimates in a separate model sensitivity range. The final envelope takes the minimum lower and maximum upper endpoints across the two analyses; it is a union, not simultaneous propagation of model and measurement uncertainty. Rectangular dominance stress ignores correlations; it is a conservative possibility screen, not a joint confidence interval. Raw replicate values are unavailable and no probabilistic sampling model is assumed.

All four kinetic models reproduce the point-estimate Pareto structure (jute 6 mm globally; twisted cotton 3.3 mm and braided cotton 5.2 mm within cotton). The envelope analysis identifies jute 6 mm as the only configuration with no possible dominator in the specified rectangular stress bounds. It definitely dominates four of eight competitors, not all eight. This applies only to the original lab configurations, not field suitability.

At the illustrative 80% retention/200 N breaking-force screen, nominal and kinetic-model-low analyses retain four configurations. Source stress and union-envelope screening retain only twisted jute 6 mm (95.44%, 649.55 N) and twisted cotton 3.3 mm (80.12%, 218.63 N). Cotton's margin above the retention threshold is just 0.12 percentage points and is sensitive to rounded source CVs and threshold choice. Braided cotton 5.2 mm (74.37%, 337.07 N) remains a relevant force-oriented trial candidate, not a failed material. Of the 25 illustrative threshold pairs, 25 have nominal candidates; 20 have candidates under each alternative stress case. These counts are not success probabilities.

## Biological robustness
Audit the existing 16 E05 marginal bootstrap contrasts, without treating them as simultaneous intervals. Cotton's uncoated density and combined-length intervals cross zero, while coated density is higher and combined length lower relative to PP. Sisal has negative contrast intervals across the four endpoints under both coatings. Excluding flagged cover values reverses the cotton-minus-PP point difference in both coating strata (uncoated −22.407 to +6.480 pp, coated −1.429 to +5.029 pp); the uncoated comparison leaves only three cotton units and one PP unit. This is not a corrected treatment effect and supports excluding cover from primary optimisation. No equivalence, causal or across-species claim.

## Economic robustness
For each service-life ratio 0.25, 0.5, 1, 1.5 and 2, respectively 0, 2, 5, 8 and 11 of 12 illustrative scenarios have recurring material purchase cost per output at or below reference (26/60 total). At unchanged marketable yield, the maximum break-even purchase price ratio equals the service-life ratio. Analogous replacement-impact thresholds are conditional on the same installed length and steady-state assumptions, and do not constitute material LCA estimates. Elasticities of the replacement cost ratio to price, life and yield are +1, −1 and −1. Grid counts are not probability estimates.

## Decision and E09
Prioritise matched cotton trials (twisted 3.3 mm and braided 5.2 mm), retain jute conditionally, and compare with PP/nylon controls. Jute field evidence conflicts with its lab performance; no cross-context pooled effect. Local matched wet/knot load, service life, marketable yield, price and material-specific LCA remain missing for all eight materials. E09 should seek independent source-level datasets or explicitly external evaluations, not relabel E03 held-out time points as independent validation. The previously acquired auxiliary evidence may be suitable only after checking specimen and endpoint compatibility.

## Reproducibility
The deterministic JavaScript computation was executed against repository inputs; eight CSV outputs, audit and exact reproducer are saved. The Python notebook is a separately authored rerun with numerical checks, not independently executed in Python.

[Outputs](../outputs/E08/) · [Audit](../outputs/E08/audit.json) · [Executable](../scripts/E08_uncertainty.mjs) · [Notebook](../notebooks/E08_Uncertainty_and_Sensitivity.ipynb)
