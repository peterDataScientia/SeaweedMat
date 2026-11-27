# SeaweedMat

**Intelligent Materials Selection for Sustainable Seaweed Farming**

Research preparation for Challenge G — Sustainable materials for seaweed farming, Africa's Blue Futures Hackathon 2027.

SeaweedMat investigates the balance between mechanical durability, cultivation performance, environmental degradation and affordability, supporting evidence-based selection of candidates for local field trials.

## Scientific question

Which material and rope configurations offer adequate strength over a cultivation cycle while reducing environmental persistence and maintaining practical affordability?

## Current evidence

- [Expanded E01 literature extraction](data/E01/literature_extraction_v0.0.2.csv): 139 source-traceable records from seven studies.
- [E02 harmonisation and audit](data/E02/README.md): 139 harmonised records; 71 mechanical ageing core records.
- [Mechanical ageing core dataset](data/E02/mechanical_ageing_core_v0.0.1.csv)
- [Experimental source register](data/E01/source_register.csv)
- [Exact twine data](data/E01/twine_table_exact.csv)
- [Approximate rope figure readings](data/E01/rope_figure_approximate.csv)

## Research workflow

E01 acquisition and provenance audit → E02 harmonisation → E03 marine ageing models → E04 45-day retention → E05 cultivation compatibility → E06 techno-economic assessment → E07 multi-objective optimisation → E08 uncertainty → E09 independent evaluation → E10 prototype.

A 45-day cycle is a working evaluation horizon, not a universal farming requirement. Retained breaking force alone is not proof of marine biodegradation or adequate working-load safety. Evidence from different species, specimen scales and environments is assessed separately.

## Data stewardship

Original third-party papers and workbooks are retained separately; numerical transcriptions identify source locations. Third-party redistribution terms must be respected. No simulated observations are used to replace missing measurements.

**Stage:** E10 v0.1.0 source implementation committed; independent numerical data-path verification passed. Python runtime tests and deployment verification pending.

## Progress tracker

[Interactive research checklist](https://github.com/peterDataScientia/SeaweedMat/issues/1)

## E03 results

[Scientific report](docs/E03_Kinetic_Validation_Report.md) · [Colab notebook](https://colab.research.google.com/github/peterDataScientia/SeaweedMat/blob/main/notebooks/E03_Marine_Ageing_Kinetics.ipynb) · [Benchmark metrics](outputs/E03/benchmark_metrics.csv)

## E04 results

[Scientific report](docs/E04_45_Day_Strength_Retention_Report.md) · [Colab notebook](https://colab.research.google.com/github/peterDataScientia/SeaweedMat/blob/main/notebooks/E04_45_Day_Strength_Retention.ipynb) · [Day-45 estimates](outputs/E04/day45_estimates.csv)

## E05–E07 results

[E05 cultivation compatibility](docs/E05_Cultivation_Compatibility_Report.md) · [E06 techno-economic assessment](docs/E06_Techno_Economic_Environmental_Assessment.md) · [Executed E06 notebook](notebooks/E06_Techno_Economic_Environmental_Assessment.ipynb) · [E07 selection report](docs/E07_Multi_Objective_Material_Selection_Report.md) · [E07 Colab](https://colab.research.google.com/github/peterDataScientia/SeaweedMat/blob/main/notebooks/E07_Multi_Objective_Material_Selection.ipynb)

## E08 results

[Scientific report](docs/E08_Uncertainty_and_Sensitivity_Report.md) · [Colab notebook](https://colab.research.google.com/github/peterDataScientia/SeaweedMat/blob/main/notebooks/E08_Uncertainty_and_Sensitivity.ipynb) · [Audit](outputs/E08/audit.json)

## E09 results

[Scientific report](docs/E09_External_Transferability_Report.md) · [Colab notebook](https://colab.research.google.com/github/peterDataScientia/SeaweedMat/blob/main/notebooks/E09_External_Transferability.ipynb) · [Outputs](outputs/E09/)

## E10 application

[SeaweedMat app.py](app.py) · [Run and deployment guide](docs/E10_Application_Development.md) · [Build audit](outputs/E10/build_audit.json) · [Automated checks](https://github.com/peterDataScientia/SeaweedMat/actions)

```bash
python -m pip install -r requirements.txt
python -m streamlit run app.py
```
