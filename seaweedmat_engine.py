"""SeaweedMat numerical core. Literature conditions only; no safety certification."""
from pathlib import Path
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent
PATHS = {
    "series": "outputs/E04/day45_estimates.csv",
    "core": "data/E02/mechanical_ageing_core_v0.0.1.csv",
    "models": "outputs/E03/model_parameters.csv",
    "stress": "outputs/E08/mechanical_stress_envelopes.csv",
    "bio": "outputs/E05/theobald_summary.csv",
    "evidence": "outputs/E07/integrated_decision_matrix.csv",
    "lca": "outputs/E06/systems_summary.csv",
    "external": "outputs/E09/transfer_metrics.csv",
    "domain": "outputs/E09/applicability_register.csv",
}

def load_data(root=ROOT):
    data = {k: pd.read_csv(Path(root)/v, keep_default_na=False) for k,v in PATHS.items()}
    for k, n in {"series":16,"core":71,"models":59,"stress":9,"bio":10,"evidence":8,"lca":4,"external":5}.items():
        if len(data[k]) != n:
            raise ValueError(f"{k}: expected {n} records, found {len(data[k])}")
    if data["core"].record_id.duplicated().any() or data["series"].series_id.duplicated().any():
        raise ValueError("Duplicate evidence identifiers")
    return data

def trajectory(data, series_id):
    s = data["series"].set_index("series_id").loc[series_id]
    c = data["core"]
    b = c[c.record_id == series_id.split("|")[0]]
    p = c[(c.baseline_id == series_id.split("|")[0]) &
          (c.condition == s.condition) &
          (c.temperature_C.astype(str) == str(s.temperature_C)) &
          (pd.to_numeric(c.exposure_days_nominal)>0)]
    # A shared baseline may belong to a different condition; attach it exactly once.
    a = pd.concat([b,p],ignore_index=True).sort_values("exposure_days_nominal")
    if len(b)!=1 or len(a)<2 or a.exposure_days_nominal.duplicated().any():
        raise ValueError("Invalid source series")
    return s,a

def predict_model(model,t,k,p,scale):
    x=np.asarray(t,dtype=float)/float(scale)
    if model=="constant": return np.ones_like(x)*100
    if model=="zero_order": return 100*np.maximum(0,1-k*x)
    if model=="first_order": return 100*np.exp(-k*x)
    if model=="weibull": return 100*np.exp(-k*x**p)
    if model=="lag_first_order": return 100*np.exp(-k*np.maximum(0,x-p))
    raise ValueError("Unknown kinetic model")

def estimate(data,series_id,day):
    s,a=trajectory(data,series_id)
    t=a.exposure_days_nominal.to_numpy(float)
    if not np.isfinite(day) or day<t.min() or day>t.max():
        raise ValueError("Outside observed exposure range")
    if s.stratum=="sparse_descriptive":
        raise ValueError("Sparse descriptive series: no predictive estimate")
    y=float(np.interp(day,t,a.retention_pct.to_numpy(float)))
    v=float(np.interp(day,t,a.reported_value.to_numpy(float)))
    units=s.reported_unit
    force=v*{"kgf":9.80665,"kN":1000,"N":1}[units] if units in ["kgf","kN","N"] else None
    i=np.searchsorted(t,day)
    lo=hi=i if t[i]==day else i
    if t[i]!=day: lo=i-1
    return {"retention_pct":y,"reported_value":v,"reported_unit":units,"breaking_force_N":force,
            "left_day":float(t[lo]),"right_day":float(t[hi])}

def screen(data,retention,force,mode="envelope"):
    if mode not in {"nominal","model","source","envelope"}: raise ValueError("Unknown mode")
    if not np.isfinite(retention) or not np.isfinite(force) or retention<0 or force<0: raise ValueError("Invalid thresholds")
    r,f={"nominal":("nominal_retention_pct","nominal_force_N"),
         "model":("model_low_pct","model_low_N"),
         "source":("source_stress_low_pct","source_stress_low_N"),
         "envelope":("envelope_low_pct","envelope_low_N")}[mode]
    d=data["stress"].copy()
    d["screen_retention_pct"]=pd.to_numeric(d[r])
    d["screen_force_N"]=pd.to_numeric(d[f])
    d["passes"]=(d.screen_retention_pct>=retention)&(d.screen_force_N>=force)
    return d

def pareto(df,columns):
    z=df[columns].to_numpy(float)
    if not np.isfinite(z).all(): raise ValueError("Missing Pareto objectives")
    return np.array([not np.any(np.all(z>=x,axis=1)&np.any(z>x,axis=1)) for x in z],dtype=bool)

def replacement(price,life,yield_ratio,impact=None):
    vals=[price,life,yield_ratio]+([] if impact is None else [impact])
    if not all(np.isfinite(vals)) or min(vals)<=0: raise ValueError("Ratios must be positive and finite")
    limit=life*yield_ratio
    return {"cost_ratio":price/limit,"break_even_ratio":limit,
            "impact_ratio":None if impact is None else impact/limit}
