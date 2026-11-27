# E02 — Data harmonisation (initial literature tranche)

## Inputs and outputs
- [Expanded E01 extraction](../E01/literature_extraction_v0.0.2.csv): 139 records, seven literature sources; supersedes the earlier 68-record extraction for analysis, while preserving the earlier files.
- [Harmonised literature](harmonised_literature_v0.0.1.csv): all 139 records with derived columns and model eligibility.
- [Mechanical ageing core](mechanical_ageing_core_v0.0.1.csv): 71 records with within-series normalised strength (45 twine, 26 whole-rope records).
- [Audit counts](audit_v0.0.1.json).

## Harmonisation rules
Original values, units, time units, specimen scale, conditions, source locators and digitisation method are retained. Convert kgf to N by multiplying by 9.80665 and kN to N by multiplying by 1000. Convert N/tex to N/ktex by multiplying by 1000. Do not convert Moreno's ambiguous “Kg” label into N. For month-based reports, nominal days use 365.25/12; this is a convention, not recorded elapsed days. Strength retention is 100 × reported value / the matched baseline, or the original relative break load when supplied. Retention above 100% is retained. Shared baselines are recorded once. Conditional uncertainty bounds divide the reported bounds by the mean baseline; they are not confidence intervals and do not propagate baseline uncertainty. CV-derived SD, graph whiskers, min–max and unresolved error bars are explicitly distinguished.

## Evidence structure
| Group | Rows |
|---|---:|
| Twine ageing | 45 |
| Whole-rope ageing | 26 |
| String/strand ageing without time-zero baseline | 48 |
| Initial monofilament properties | 2 |
| Monofilament ageing narrative endpoint | 1 |
| Water saturation (not service ageing) | 8 |
| Biological performance | 8 |
| Mineralisation | 1 |
| Total | 139 |

A row represents a published summary, a graphical reading, or a narrative endpoint, not an independent specimen. Graph readings are provisional estimates. Where uncertainty bounds cannot be distinguished, fields remain blank. No missing values were replaced with simulated values.

## Source decisions
- Moreno Fig. 5 and 6: do not assign whole-rope initial load to strings/strands; preserve the reported unit. Plot-floor values and month-four strand measurements inconsistent with the methods are quarantined. Type 3 cannot be tested after six months; no subsequent zeros are inserted.
- Zhou Fig. 2: digitised mean and distinguishable whiskers. The source describes standard deviation of the mean; do not silently reinterpret as SE. Overlapping whiskers are unresolved.
- Chamley Fig. 8: shared normalised baseline and readable rope markers; a resolvable SD band was transcribed for abiotic month six. Narrow bands remain blank.
- Le Gué (2023): Table 2 experimental loads are preferred to the model predictions and ambiguous narrative. At nine months and 40°C the table gives 17.0 kN; the text gives 17.1 kN and calls it 60% loss. Relative to 28.6 kN, Table 2 gives 59.44% retention. Fig. 5/12 axis labels are not readable in the supplied manuscript, so a complete monofilament/rope curve cannot be extracted from them. Do not impute unreported intermediate points.
- Le Gué (2024): Fig. 11 dry/wet comparison is not a time-dependent durability experiment.
- Sobuj (2023): biomass and DGR are biological outcomes, not mechanical observations.
- Chamley mineralisation: separate fibre respirometry endpoint, not inferred from strength loss.

## QA
Re-read the committed CSVs: 139 unique IDs in input and output, 71 rows in the core, all referenced baselines resolve, all recorded bounds bracket their values, and 65 absolute-to-relative calculations agree with their matched baselines at the stored precision.

## Next steps
E02 is an initial harmonisation of literature data only. Integrate the four earlier workbook/archive datasets as separate evidence blocks after audit; verify approximate graphical points and uncertainties against source data, and obtain a legible version or author-supplied values for unresolved Le Gué curves. Assess study overlap before E03. Do not pool specimen scales, exposure conditions or materials into one degradation model without explicit justification. E03 should begin with within-series models; 45-day estimates require observed bracketing data or a separately labelled extrapolation. No farm-specific strength threshold or safe working load has been validated.
