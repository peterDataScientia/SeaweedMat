# SeaweedMat v0.1.0 — application

Streamlit research prototype. Eight workspaces: Overview, Material explorer, Durability predictor, Mechanical screening, Biological compatibility, Economic & environmental, Pareto & uncertainty, Report & evidence.

## Run locally

Requires Python 3.11 (CI target).
```bash
git clone https://github.com/peterDataScientia/SeaweedMat.git
cd SeaweedMat
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

## Deploy to Streamlit Community Cloud
Open https://share.streamlit.io/ and sign in, select the repository peterDataScientia/SeaweedMat, branch main, entry point app.py, Python 3.11. Deploy. No API keys required. A live deployment has not been verified. 

## Tests
```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
```
GitHub Actions workflow runs compilation, numerical regression tests and eight page smoke tests. Independent JavaScript evidence-path checks were completed: all 16 trajectories matched; all 13 eligible day-45 interpolations reproduced; 3 sparse trajectories withhold prediction; default nominal screening retains 4, deterministic envelope retains 2. Python execution/CI results and live UI have not been confirmed in the current environment (Streamlit absent and container cannot resolve GitHub).

## Scientific boundaries
Source-derived E02–E09 data are read from committed CSVs. Durability estimates are bounded by observed exposure range; sparse series show measured points only. Provisional graph data are labelled. The economic simulator operates on user-specified dimensionless scenarios, not price forecasts. Pareto analysis is within exact-table mechanical configurations. Exports are CSV, SVG and Markdown screening reports. Plot styling uses Matplotlib with Figentra-inspired settings, not the Figentra library. No local working-load, service-life, crop-yield or material-level LCA claims are validated. No overall material sustainability score is manufactured.

[Build audit](../outputs/E10/build_audit.json) · [Application](../app.py) · [Engine](../seaweedmat_engine.py) · [Tests](../tests/)
