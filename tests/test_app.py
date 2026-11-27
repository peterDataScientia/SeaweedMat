from pathlib import Path
import pytest
from streamlit.testing.v1 import AppTest

ROOT=Path(__file__).resolve().parents[1]
PAGES=["Overview","Material explorer","Durability predictor","Mechanical screening","Biological compatibility","Economic & environmental","Pareto & uncertainty","Report & evidence"]

@pytest.mark.parametrize("page",PAGES)
def test_page(page):
    at=AppTest.from_file(str(ROOT/"app.py"),default_timeout=30).run()
    assert not at.exception
    at.sidebar.radio[0].set_value(page).run()
    assert not at.exception
