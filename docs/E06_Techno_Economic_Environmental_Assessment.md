# E06 — Techno-economic and environmental assessment

Executed in Python and independently rerun in a Python notebook against the uploaded LCA and TEA dataset.xlsx (15 sheets; SHA256 9b421e1d239baeebf860a1284eee381cdb2bd2d111b14af463b711beb29d2a3c; source https://zenodo.org/records/18642765).

## Results
Danish Saccharina latissima cultivation, four 18.75 ha system configurations. Longline had lower impact per kg fresh biomass than each net configuration across all 18 reported impact categories. GWP was 0.96151115, 1.19042057, 1.14456824 and 0.14441212 kg CO2 eq/kg fresh biomass in concrete, heavy chain, light chain and longline respectively. Source locators: Biomass composition B11:E12; LCIA comparison C3:F20, C47:F64, C69:F86; Groupped contribution G/N/P rows 2,20,38,56. No biomass uptake credit deducted.

All twelve summary NPVs recomputed from original annual CAPEX, OPEX and revenue, including year-zero costs and 7% discount rate, agree within EUR 0.00001. Seven cumulative balances differ by more than EUR 1. Case 1 (EUR 31/kg DW) yields NPV EUR 507597.78, 546634.69, 328547.96 and 1354621.80 respectively. Conditional break-even selling prices are EUR 21.675, 21.414, 24.279 and 12.992/kg DW. Source five-year net/line lifetime scenarios reduce reported GWP by 8.25–10.69%; this is not a measured candidate lifetime. Inventory has selected cost allocations over five years despite a listed lifetime of 1. Preserve source accounting; do not interpret as local replacement frequency.

## Translational model
For matched installed length and steady-state recurring replacement-only costs, define p=candidate/reference price per metre, l=candidate/reference service life and y=candidate/reference marketable yield per equivalent period. Relative material purchase cost per output = p/(l*y); break-even price ratio = l*y. The 60 scenario rows are illustrative, dimensionless sensitivity calculations, not observations or Tanzania price forecasts. An analogous threshold holds for per-metre replacement-related life-cycle impact. Labour, transport, discounting, downtime, salvage and other farm costs are excluded. E04 retained strength does not establish service life; E05 germling endpoints do not establish marketable biomass yield. No material-specific cost or environmental ranking is claimed.

## Next
E07 constraint-first selection integrating E04–E06. Cotton remains a trial priority, jute conditional, conventional polymer references retained. Local matched wet/knot strength, working load, service life, cost, labour, yield and life-cycle inventories are required for definitive selection. Do not fill missing objectives with zero.

[System summary](../outputs/E06/systems_summary.csv) · [NPV audit](../outputs/E06/npv_audit.csv) · [Replacement scenarios](../outputs/E06/replacement_scenarios.csv)

The full executed notebook, Python script, detailed CSVs and PNG/SVG/PDF figures are in the separately delivered downloadable E06 package; only key results and this report are deposited here. Original third-party workbook is not redistributed.
