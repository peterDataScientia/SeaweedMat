# E07 — Evidence-aware multi-objective material selection

## Design
Executed against E04 exact-table mechanical comparison, E05 material evidence and treatment summaries, and E06 replacement scenarios. Maximise retention and absolute force within the nine Araya-Schmidt & Queirolo configurations; maximise density, combined branch length and longest branch length separately within the two Theobald coating strata (exclude control). Pareto dominance is point-estimate based, not a significance test. Repeat biological analysis without longest branch length to test sensitivity to overlapping growth endpoints. Cover is retained descriptively but omitted from primary optimisation because of the E05 flags.

For mechanical sensitivity use min(interpolation, lowest fitted kinetic prediction) and multiply by initial force for the corresponding absolute force. This deterministic envelope is not a confidence bound and does not propagate sampling uncertainty. Test illustrative minimum retention thresholds 60,70,80,90,100% and breaking forces 100,200,300,400,600 N. These are not allowable working loads or locally validated requirements.

## Results
- Twisted jute 6 mm is mechanically non-dominated on both nominal and model-low comparisons. Within cotton, twisted 3.3 mm and braided 5.2 mm remain non-dominated in both analyses.
- Of 25 illustrative mechanical scenarios, 25 have at least one nominal candidate and 20 have at least one model-low candidate. At 80% and 200 N both approaches retain four configurations: twisted jute 6 and 3 mm, twisted cotton 3.3 mm, and braided cotton 5.2 mm. Counts are not probabilities.
- Cotton and PP are on the biological point-estimate front under both coating conditions, including when longest branch length is omitted. Nylon and sisal are dominated within this specific four-substrate test, not across all cultivation systems.
- In the 60 illustrative E06 price/life/yield combinations, 26 have purchase cost per output no greater than reference. The break-even maximum price per metre and replacement-related environmental impact per metre ratios are both l*y, where l and y are service-life and marketable-yield ratios. No actual candidate environmental impacts or local prices are inferred.

## Trial prioritisation (not global optimisation)
Cotton is a priority for matched local experiments; the mechanical configurations and Theobald biological substrates are not matched specimens. Jute is conditional because its laboratory mechanical advantage contrasts with field durability and biomass findings. Sisal has lower priority for attachment; coir is secondary; rayon and PBS/PBAT are exploratory. PP and nylon are reference controls. These categories are evidence-informed research decisions rather than computed utility scores.

All eight materials lack the matched local load, service life, yield, price and material-specific LCA inputs needed for final multi-objective selection. No missing objective was replaced by zero. Mechanical strength retention does not establish lifetime or safety, and germling development does not establish marketable yield. Denmark system-level LCA/TEA is not candidate material-level Tanzania LCA/TEA.

## Files
- [Mechanical Pareto](../outputs/E07/mechanical_pareto.csv)
- [Constraints](../outputs/E07/constraint_scenarios.csv)
- [Biological Pareto](../outputs/E07/biological_pareto.csv)
- [Replacement constraints](../outputs/E07/replacement_constraints.csv)
- [Decision matrix](../outputs/E07/integrated_decision_matrix.csv)
- [Audit](../outputs/E07/audit.json)
- [Exact JavaScript reproducer](../scripts/E07_material_selection.mjs)
- [Python notebook](../notebooks/E07_Multi_Objective_Material_Selection.ipynb)

The calculations were executed in JavaScript against repository input CSVs. Python notebook saved for independent rerun; not yet executed in Python. Next E08: sensitivity to mechanical and biological uncertainty, economic assumptions and missing local inputs.
