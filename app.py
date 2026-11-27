"""SeaweedMat — literature-grounded decision support."""
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import streamlit as st
from seaweedmat_engine import load_data, trajectory, estimate, screen, pareto, replacement, predict_model

VERSION = "0.1.0"
st.set_page_config(page_title="SeaweedMat", page_icon="🌊", layout="wide")
plt.rcParams.update({"font.family":"DejaVu Sans","font.weight":"bold","axes.labelweight":"bold","axes.labelsize":14,
    "axes.linewidth":2,"xtick.major.width":2,"ytick.major.width":2,"xtick.major.size":6,"ytick.major.size":6,
    "axes.spines.top":False,"axes.spines.right":False,"legend.fontsize":10,"figure.facecolor":"white"})
st.markdown("""<style>
.block-container{max-width:1440px;padding-top:2rem}
[data-testid="stMetricValue"]{font-weight:700}
[data-testid="stMetricLabel"]{font-weight:600}
h1,h2,h3{letter-spacing:-.025em}
[data-testid="stSidebar"]{border-right:1px solid #DCE8E6}
</style>""", unsafe_allow_html=True)

@st.cache_data
def get_data(): return load_data()

try:
    data=get_data()
except Exception as exc:
    st.error(f"Evidence files could not be loaded: {exc}")
    st.stop()

def download_df(df,name):
    st.download_button("Download CSV",df.to_csv(index=False).encode("utf-8"),file_name=name,mime="text/csv")

def display_name(label,diam):
    return f"{label.rsplit(' ',1)[0]} · {float(diam):g} mm" if str(diam)!="" and label.startswith(("Twisted ","Braided ")) else label

def fig_out(fig,name):
    import io
    st.pyplot(fig,clear_figure=False,use_container_width=True)
    b=io.BytesIO()
    fig.savefig(b,format="svg",bbox_inches="tight",facecolor="white")
    st.download_button("Download figure (SVG)",b.getvalue(),file_name=name,mime="image/svg+xml",key=name)
    plt.close(fig)

st.sidebar.title("SeaweedMat")
st.sidebar.caption(f"Research prototype · v{VERSION}")
page=st.sidebar.radio("Workspace",["Overview","Material explorer","Durability predictor","Mechanical screening","Biological compatibility","Economic & environmental","Pareto & uncertainty","Report & evidence"])
st.sidebar.markdown("[Research repository](https://github.com/peterDataScientia/SeaweedMat)")
st.sidebar.caption("External experiments ≠ local farm validation.")
st.title("SeaweedMat")
st.caption("Intelligent Materials Selection for Sustainable Seaweed Farming")
st.info("Evidence-based research screening only. Published configurations are not certified working-load ratings or validated Zanzibar farm predictions.")

if page=="Overview":
    st.subheader("Evidence at a glance")
    a,b,c,d=st.columns(4)
    a.metric("Material families",len(data["evidence"]))
    b.metric("Mechanical records",len(data["core"]))
    c.metric("Exposure series",len(data["series"]))
    d.metric("Local full-objective validation", "Pending")
    st.markdown("### Trial priorities")
    cols=["material","trial_priority","full_selection_status"]
    st.dataframe(data["evidence"][cols],hide_index=True,use_container_width=True)
    st.markdown("**Cotton** is a priority for matched experiments; **jute** is conditional; **PP and nylon** remain controls. No global material sustainability ranking is justified.")
    st.markdown("### Research workflow")
    st.write("E01–E02 data and harmonisation → E03–E04 kinetics and 45-day retention → E05 biological compatibility → E06 economics and environment → E07–E08 optimisation and sensitivity → E09 external transfer test → E10 prototype.")

elif page=="Material explorer":
    st.subheader("Material evidence explorer")
    material=st.selectbox("Material",data["evidence"].material.tolist())
    row=data["evidence"].set_index("material").loc[material]
    st.markdown(f"**Trial priority:** {row.trial_priority}")
    a,b=st.columns(2)
    with a:
        st.markdown("#### Mechanical evidence")
        st.write(row.E04_mechanical_evidence)
        st.markdown("#### Asparagopsis taxiformis")
        st.write(row.Theobald_A_taxiformis)
    with b:
        st.markdown("#### Gracilariopsis longissima")
        st.write(row.Sobuj_G_longissima)
        st.markdown("#### Missing local evidence")
        st.write("Matched wet/knot strength and load, service life, marketable yield, price, material-specific LCA.")
    sub=data["series"][data["series"].material==material]
    if len(sub):
        st.dataframe(sub[["label","specimen","condition","stratum","interpolation_status"]],hide_index=True,use_container_width=True)
    else: st.warning("No matching mechanical trajectory in the current core.")
    download_df(data["evidence"][data["evidence"].material==material],"material_evidence.csv")

elif page=="Durability predictor":
    st.subheader("Marine ageing and durability")
    ids=data["series"].series_id.tolist()
    labels={s.series_id:display_name(s.label,s.diameter_mm)+" | "+s.condition for s in data["series"].itertuples()}
    sid=st.selectbox("Published exposure series",ids,format_func=lambda x:labels[x])
    s,a=trajectory(data,sid)
    st.caption(f"{s.study} · {s.specimen} · {s.stratum}")
    st.write(f"Exposure: {s.condition}; temperature: "+(f"{s.temperature_C} °C" if str(s.temperature_C)!="" else "see source (twine study 14.5–15.5 °C; other missing temperatures not inferred)"))
    if s.stratum=="sparse_descriptive":
        st.warning("Sparse series: descriptive measured points only. Predictions withheld.")
    elif s.stratum.startswith("graph"):
        st.warning("Provisional digitised data; graph readings and nominal month-to-day conversion carry uncertainty.")
    t=a.exposure_days_nominal.to_numpy(float); y=a.retention_pct.to_numpy(float)
    fig,ax=plt.subplots(figsize=(8,4.2))
    ax.plot(t,y,"o-",color="#006C65",label="Observed summaries / interpolation",lw=2)
    if s.stratum!="sparse_descriptive":
        day=st.slider("Exposure day (within observed range)",0.0,float(t.max()),min(45.,float(t.max())),step=.25)
        result=estimate(data,sid,day)
        c1,c2,c3=st.columns(3)
        c1.metric("Estimated retention",f"{result['retention_pct']:.2f}%")
        c2.metric("Interpolated source value",f"{result['reported_value']:.2f} {result['reported_unit']}")
        c3.metric("Breaking force",f"{result['breaking_force_N']:.2f} N" if result["breaking_force_N"] is not None else "Not available")
        st.caption(f"Bracketing days: {result['left_day']:g}–{result['right_day']:g}. Interpolation, not measured day-specific strength.")
        ax.axvline(day,color="#213A42",ls="--",lw=1)
        ax.scatter([day],[result["retention_pct"]],color="#D97706",s=55,zorder=5)
        if st.checkbox("Show fitted kinetic model sensitivity",value=True):
            p=data["models"][(data["models"].series_id==sid)&(data["models"].model!="constant")]
            x=np.linspace(0,t.max(),200)
            for m in p.itertuples():
                ax.plot(x,predict_model(m.model,x,float(m.rate_scaled),float(m.shape_or_lag_scaled),float(m.time_scale_days)),lw=1.4,label=m.model.replace("_"," "))
    ax.set(xlabel="Nominal exposure [days]",ylabel="Strength retention [%]")
    ax.legend(frameon=False,fontsize=8)
    fig.tight_layout(); fig_out(fig,"durability.svg")
    st.dataframe(a[["record_id","exposure_days_nominal","reported_value","reported_unit","retention_pct","source_locator","extraction"]],hide_index=True,use_container_width=True)
    download_df(a,"source_trajectory.csv")

elif page=="Mechanical screening":
    st.subheader("Day-45 constraint screening")
    st.caption("Nine exact-table twine configurations. Illustrative thresholds, not safe working loads.")
    r=st.slider("Minimum retention [%]",0,150,80)
    f=st.number_input("Minimum breaking force [N]",min_value=0.,max_value=10000.,value=200.,step=25.)
    mode=st.selectbox("Evidence stress case",["envelope","nominal","model","source"])
    out=screen(data,r,f,mode)
    st.metric("Configurations meeting both constraints",f"{out.passes.sum()} / {len(out)}")
    st.dataframe(out[["configuration","diameter_mm","screen_retention_pct","screen_force_N","passes"]],hide_index=True,use_container_width=True,
        column_config={"passes":st.column_config.CheckboxColumn("Meets thresholds"),"screen_retention_pct":st.column_config.NumberColumn("Retention [%]",format="%.2f"),"screen_force_N":st.column_config.NumberColumn("Breaking force [N]",format="%.2f")})
    st.caption("The envelope combines separate deterministic stress ranges by their outer bounds; not joint uncertainty propagation.")
    download_df(out,"mechanical_screen.csv")

elif page=="Biological compatibility":
    st.subheader("Cultivation compatibility")
    coat=st.radio("Substrate coating",["Uncoated","Alginate"],horizontal=True)
    b=data["bio"]
    b=b[b.treatment.str.endswith(" + alginate").eq(coat=="Alginate")].copy()
    b["material"]=b.treatment.str.replace(" + alginate","",regex=False)
    endpoints={"density_cm2_mean":("Germlings / cm²","density_cm2_sd"),"combined_mm_mean":("Combined branch length [mm]","combined_mm_sd"),"longest_mm_mean":("Longest branch length [mm]","longest_mm_sd"),"relative_cover_pct_mean":("Relative cover [%]","relative_cover_pct_sd")}
    ep=st.selectbox("Measured endpoint",list(endpoints),format_func=lambda x:endpoints[x][0])
    title,sd=endpoints[ep]
    if ep=="relative_cover_pct_mean":
        st.warning("Coverage flags can reverse the cotton–PP comparison; excluded from primary optimisation.")
    fig,ax=plt.subplots(figsize=(7,4))
    ax.bar(b.material,b[ep].astype(float),yerr=b[sd].astype(float),capsize=4,color="#006C65")
    ax.set_ylabel(title); ax.tick_params(axis="x",rotation=20); fig.tight_layout(); fig_out(fig,"biological.svg")
    st.caption("Mean ± unit-level SD; six units per treatment except missing length units. Theobald A. taxiformis; not matched to E04 configurations.")
    st.dataframe(b[["treatment","n","coverage_flagged",ep,sd,"retention_sensitivity_n","retention_sensitivity_mean"]],hide_index=True,use_container_width=True)
    download_df(b,"biological_treatments.csv")

elif page=="Economic & environmental":
    st.subheader("Material replacement simulator")
    st.caption("Illustrative ratios relative to a conventional reference. No local prices or lifetimes inferred.")
    c1,c2,c3=st.columns(3)
    price=c1.number_input("Price per metre ratio",.01,100.,1.,.05)
    life=c2.number_input("Service life ratio",.01,100.,.5,.05)
    yield_r=c3.number_input("Marketable yield ratio",.01,100.,1.,.05)
    impact=st.number_input("Replacement impact per metre ratio",.01,100.,1.,.05) if st.checkbox("Include hypothetical impact ratio") else None
    out=replacement(price,life,yield_r,impact)
    a,b,c=st.columns(3)
    a.metric("Purchase cost per output",f"{out['cost_ratio']:.3f}×")
    b.metric("Break-even price / impact ratio",f"{out['break_even_ratio']:.3f}×")
    c.metric("Replacement impact per output",f"{out['impact_ratio']:.3f}×" if impact is not None else "Not evaluated")
    st.latex(r"C/C_{ref}=p/(\ell y)")
    st.caption("Steady-state replacement purchase costs only; excludes labour, transport, downtime and other farm costs.")
    st.markdown("### Published Danish cultivation-system LCA")
    st.caption("System-level Saccharina latissima results, not candidate material footprints in Tanzania.")
    l=data["lca"]
    fig,ax=plt.subplots(figsize=(7,3.8))
    ax.barh(l.system,l.gwp_per_kg_FW,color="#006C65")
    ax.set_xlabel("GWP [kg CO₂-eq / kg fresh biomass]"); fig.tight_layout(); fig_out(fig,"system_lca.svg")
    download_df(l,"danish_system_lca.csv")

elif page=="Pareto & uncertainty":
    st.subheader("Mechanical Pareto and uncertainty")
    st.caption("Point-estimate optimisation within exact-table configurations only. No combined cross-study utility score.")
    mode=st.selectbox("Stress case",["nominal","model","source","envelope"])
    m=screen(data,0,0,mode)
    scope=st.radio("Comparison scope",["All exact-table configurations","Cotton only"],horizontal=True)
    if scope=="Cotton only": m=m[m.material=="Cotton"].copy()
    m["non_dominated"]=pareto(m,["screen_retention_pct","screen_force_N"])
    fig,ax=plt.subplots(figsize=(7,4.5))
    for mat,color in [("Cotton","#006C65"),("Jute","#2459AD")]:
        p=m[m.material==mat]
        if len(p): ax.scatter(p.screen_retention_pct,p.screen_force_N,color=color,label=mat,s=65)
    p=m[m.non_dominated]
    ax.scatter(p.screen_retention_pct,p.screen_force_N,facecolors="none",edgecolors="#D97706",s=160,lw=2,label="Non-dominated")
    ax.set(xlabel="Strength retention [%]",ylabel="Breaking force [N]"); ax.legend(frameon=False); fig.tight_layout(); fig_out(fig,"mechanical_pareto.svg")
    st.dataframe(m[["configuration","diameter_mm","screen_retention_pct","screen_force_N","non_dominated"]],hide_index=True,use_container_width=True)
    st.markdown("### Day-45 deterministic stress envelopes")
    st.dataframe(m[["configuration","envelope_low_pct","envelope_high_pct","envelope_low_N","envelope_high_N"]],hide_index=True,use_container_width=True)
    download_df(m,"pareto_and_uncertainty.csv")

else:
    st.subheader("Applicability and report export")
    st.markdown("#### Independent external evidence")
    st.dataframe(data["external"],hide_index=True,use_container_width=True)
    st.caption("Cotton-strip transfer test: two external group means; not matched farm validation.")
    st.dataframe(data["domain"],hide_index=True,use_container_width=True)
    st.markdown("#### Export a decision-screening report")
    a,b=st.columns(2)
    r=a.number_input("Minimum retention [%]",0.,150.,80.)
    f=b.number_input("Minimum breaking force [N]",0.,10000.,200.)
    mode=st.selectbox("Stress case",["envelope","nominal","model","source"])
    out=screen(data,r,f,mode)
    selected=out[out.passes]
    report=f"# SeaweedMat v{VERSION} — Research screening report\n\nDay 45 | retention ≥ {r:g}% | breaking force ≥ {f:g} N | mode: {mode}\n\n"
    report+=f"{len(selected)} of {len(out)} published configurations meet the illustrative constraints.\n\n"
    for z in selected.itertuples(): report+=f"- {z.configuration} ({z.diameter_mm:g} mm): {z.screen_retention_pct:.2f}% / {z.screen_force_N:.2f} N\n"
    report+="\n## Evidence boundaries\nThese are external lab twines dried before tensile testing. No working-load certification, local service life, matched yield, price or material-specific LCA. Stress bounds are deterministic; no probability claim.\n\n## Sources\nE02, E04, E05, E06, E07, E08, E09: https://github.com/peterDataScientia/SeaweedMat\n"
    st.code(report,language="markdown")
    st.download_button("Download research report",report,file_name="SeaweedMat_screening_report.md",mime="text/markdown")
    download_df(out,"report_screening_results.csv")
