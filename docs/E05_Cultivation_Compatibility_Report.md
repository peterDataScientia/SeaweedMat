# E05 — Cultivation compatibility

## Objective
Translate the E04 mechanical assessment into candidate selection for seaweed cultivation, accounting for biological performance. Evidence from different experiments is integrated qualitatively at material level; it is not treated as a matched multi-endpoint dataset.

## Inputs and design
Theobald workbook (DOI 10.25946/28529264; uploaded filename E. Theobald_A. taxiformis substrate selection datasets.xlsx; SHA256 f210aad20e9aa511bba40be50c0f7b3ee68eb8422288425095aa356be9aa120a), sheets Density 5 days, Germling cover and Germling lengths. Sixty unique experimental units, ten treatments, six units per treatment. All identifiers and treatment labels match; each unit has five length records, not five independent experimental units. Ten length records are nonnumeric/missing, all from two control + alginate units; the other 290 are numeric. Use mm columns rather than rounded cm columns. Length endpoints are averaged within unit before treatment summaries. The workbook does not establish longitudinal growth rate from length alone; these are germling development measurements.

Relative cover = 100 × after/before flume cover, calculated per unit, with all denominators positive. Thirteen units have a reported before or after cover above 100%; three ratios exceed 100%. Preserve all values in the primary descriptive analysis; sensitivity excludes those 13 units from the ratio endpoint only. No capping or imputation. Verify the original coverage method before quantitative use of this endpoint in multi-objective selection. Means and SD are at unit level; missing length units excluded only from length endpoints.

Exploratory contrasts compare cotton and sisal separately with polypropylene within each coating stratum, using mean differences and 20,000 percentile bootstrap draws resampling units independently within groups (seed 20261127). The Python analysis calculated bootstrap intervals for group means first and then contrasts, in workbook treatment order and density, relative cover, longest branch, combined branch order. With six units per group and unknown blocking structure, intervals are descriptive, conditional on independent units and not multiplicity-adjusted. No significance claims or equivalence claims are based on them.

## Results
See [treatment summary](../outputs/E05/theobald_summary.csv) and [contrasts](../outputs/E05/theobald_contrasts.csv), rounded to three decimals from the executed Python analysis.

Uncoated cotton had density 31.24 germlings/cm², relative cover 69.96%, combined length 38.46 mm. Uncoated PP had 40.77, 92.37%, 35.24 mm respectively. With alginate, cotton density exceeded PP by 19.41 germlings/cm² (exploratory bootstrap interval 12.17–26.76), while combined length was 11.54 mm lower (interval −16.14 to −7.06). Relative cover difference was −1.43 percentage points (interval −12.41 to 9.92); this does not establish equivalence. Sisal performed less well than cotton and PP for these tested attachment applications. Coating effects are material dependent descriptively; no interaction test has been claimed.

## Coverage sensitivity
Excluding flags leaves only one uncoated PP unit (51.41% relative cover), three uncoated cotton units (57.89%) and four coated PP units (51.22%). Coated cotton remains at 56.25% (six units). The resulting comparisons are highly unbalanced and not a corrected treatment ranking. Density and length evidence provide independent endpoint information, not independent experiments.

## Field evidence
Sobuj et al. (2023), DOI 10.1038/s41598-023-28675-0, Results p2, Fig.1 and Table 2 p3, Methods pp6–7. The 90-day Bangladesh floating-raft study of Gracilariopsis longissima reports plastic rope (polymer unspecified) biomass 13.02 ± 0.08 kg/m² and DGR 4.66 ± 0.01% per day, and nylon 12.60 ± 0.06 kg/m² and 4.62 ± 0.01% per day. Coir and jute are lower, as shown by Fig.1 and described in the text. The paper reports F=35.91, p<0.05 for rope-material biomass comparison and three replicates per experiment. Graph-only natural-fibre means are not treated as exact measurements; prior E02 graph estimates are provisional. Discussion p5 describes maintenance burdens for coir and jute. No cotton comparison in this study. No local Tanzania species validation.

## Translational interpretation
The combined evidence identifies cotton as a priority for local trials: E04 includes two promising cotton constructions, and the independent substrate study supports biological investigation. It does not show that those exact constructions have the measured biological properties. Jute's E04 laboratory strength advantage must be weighed against lower field biomass in Sobuj and lower retained strength in Zhou's field experiment. Sisal's poor attachment results support deprioritisation for this particular substrate function, not rejection of all uses. Retain conventional polymer controls.

[Material evidence matrix](../outputs/E05/material_evidence_matrix.csv) separates the sources and defines candidate-specific next actions. No composite numerical score, species transfer, or environmental superiority claim is made. Next E06: cost and environmental assessment using the LCA/TEA workbook, with explicitly local cost inputs still to be obtained.

## Reproducibility
Python analysis was executed directly on the supplied workbook. Public repository contains rounded summary outputs, contrasts and evidence matrix rather than redistribution of the third-party workbook or unit-level records. Source licence and coverage measurement definition require further verification. 
