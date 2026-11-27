import numpy as np
import pytest
from seaweedmat_engine import load_data, trajectory, estimate, screen, pareto, replacement, predict_model

@pytest.fixture(scope="module")
def d(): return load_data()

def test_trajectory_and_day45(d):
    for s in d["series"].itertuples():
        _,a=trajectory(d,s.series_id)
        assert len(a)>=2 and a.iloc[0].retention_pct==100
        if s.stratum=="sparse_descriptive":
            with pytest.raises(ValueError): estimate(d,s.series_id,45)
        else:
            e=estimate(d,s.series_id,45)
            assert abs(e["retention_pct"]-s.interpolated_retention_pct)<1e-5
            with pytest.raises(ValueError): estimate(d,s.series_id,float(a.exposure_days_nominal.max())+1)

def test_constraints(d):
    assert screen(d,80,200,"nominal").passes.sum()==4
    assert screen(d,80,200,"envelope").passes.sum()==2
    assert set(screen(d,80,200,"envelope").query("passes").configuration)=={"Twisted jute 6","Twisted cotton 3"}

def test_pareto(d):
    a=screen(d,80,200,"nominal")
    assert a.loc[pareto(a,["screen_retention_pct","screen_force_N"]),"configuration"].tolist()==["Twisted jute 6"]
    c=a[a.material=="Cotton"]
    assert set(c.loc[pareto(c,["screen_retention_pct","screen_force_N"]),"configuration"])=={"Twisted cotton 3","Braided cotton 5"}

def test_economics():
    assert replacement(1,.5,1)["cost_ratio"]==2
    assert replacement(.5,.5,1,.25)["impact_ratio"]==.5
    with pytest.raises(ValueError): replacement(1,0,1)

def test_model_baselines(d):
    for m in d["models"].itertuples():
        assert np.isclose(predict_model(m.model,0,float(m.rate_scaled),float(m.shape_or_lag_scaled),float(m.time_scale_days)),100)
