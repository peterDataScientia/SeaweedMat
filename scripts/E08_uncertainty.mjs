// Run from repo root: node scripts/E08_uncertainty.mjs
import fs from 'node:fs';
function parse(s){let a=[],r=[],v="",q=false;for(let i=0;i<s.length;i++){let c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){v+='"';i++}else q=false}else v+=c}else if(c==='"')q=true;else if(c===','){r.push(v);v=""}else if(c==='\n'){r.push(v);a.push(r);r=[];v=""}else if(c!=='\r')v+=c}if(r.length||v){r.push(v);a.push(r)}const h=a.shift();return a.map(r=>{if(r.length!==h.length)throw Error('CSV width');return Object.fromEntries(h.map((k,i)=>[k,r[i]]))})}
function csv(a){let h=Object.keys(a[0]);return [h,...a.map(r=>h.map(k=>r[k]??""))].map(r=>r.map(v=>{let s=String(v);return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}).join(",")).join("\n")+"\n"}
function e08(core,mech,kin,bio,contrast,econ,evidence){
const n=v=>{if(v===""||v==null||!Number.isFinite(+v))throw Error("numeric missing");return +v}, rd=v=>+v.toFixed(6), w=3/14, I=(a,b)=>(1-w)*a+w*b;
if(core.length!==71||mech.length!==9||kin.length!==46||bio.length!==10||contrast.length!==16||econ.length!==60||evidence.length!==8)throw Error('input count');
const mechanical=mech.map(m=>{
 const id="AQ19_"+m.configuration.replaceAll(" ","_");
 const a=[0,42,56].map(d=>core.find(r=>r.record_id===id+"_d"+d));
 if(a.some(r=>!r||r.reported_unit!=="kgf"||r.uncertainty_type!=="SD derived from rounded CV"))throw Error("source");
 const [b,l,h]=a;
 const flo=I(n(l.lower),n(h.lower))*9.80665,fhi=I(n(l.upper),n(h.upper))*9.80665;
 const rlo=100*I(n(l.lower),n(h.lower))/n(b.upper),rhi=100*I(n(l.upper),n(h.upper))/n(b.lower);
 const krlo=Math.min(n(m.retention_pct),n(m.model_min_pct)),krhi=Math.max(n(m.retention_pct),n(m.model_max_pct));
 const fmodelLo=Math.min(n(m.force_N),krlo/100*n(m.initial_force_N)),fmodelHi=Math.max(n(m.force_N),krhi/100*n(m.initial_force_N));
 return {configuration:m.configuration,material:m.material,diameter_mm:n(m.diameter_mm),nominal_retention_pct:n(m.retention_pct),nominal_force_N:n(m.force_N),source_stress_low_pct:rd(rlo),source_stress_high_pct:rd(rhi),source_stress_low_N:rd(flo),source_stress_high_N:rd(fhi),model_low_pct:rd(krlo),model_high_pct:rd(krhi),model_low_N:rd(fmodelLo),model_high_N:rd(fmodelHi),envelope_low_pct:rd(Math.min(rlo,krlo)),envelope_high_pct:rd(Math.max(rhi,krhi)),envelope_low_N:rd(Math.min(flo,fmodelLo)),envelope_high_N:rd(Math.max(fhi,fmodelHi)),status:"deterministic envelope; not a probability or interval estimate"};
});
const tiers=["nominal","model_low","source_stress_low","envelope_low"];
const grid=[];
for(const r of [60,70,80,90,100])for(const f of [100,200,300,400,600])for(const tier of tiers){
 const rk=tier==="nominal"?"nominal_retention_pct":tier+"_pct",fk=tier==="nominal"?"nominal_force_N":tier+"_N";
 const pass=mechanical.filter(x=>x[rk]>=r&&x[fk]>=f);
 grid.push({min_retention_pct:r,min_breaking_force_N:f,stress_case:tier,n_candidates:pass.length,candidates:pass.map(x=>x.configuration).join(";"),status:"illustrative; not working-load certification"});
}
const robustness=mechanical.map(m=>{
 const others=mechanical.filter(x=>x!==m);
 const dominates=others.filter(x=>m.envelope_low_pct>=x.envelope_high_pct&&m.envelope_low_N>=x.envelope_high_N&&(m.envelope_low_pct>x.envelope_high_pct||m.envelope_low_N>x.envelope_high_N)).map(x=>x.configuration);
 const possible=others.filter(x=>x.envelope_high_pct>=m.envelope_low_pct&&x.envelope_high_N>=m.envelope_low_N&&(x.envelope_high_pct>m.envelope_low_pct||x.envelope_high_N>m.envelope_low_N)).map(x=>x.configuration);
 return {configuration:m.configuration,definitely_dominates_count:dominates.length,definitely_dominates:dominates.join(";"),possible_dominators_count:possible.length,possible_dominators:possible.join(";"),envelope_certified_nondominated:possible.length===0,status:"rectangular envelope stress; correlation not modelled"};
});
const modelCases=[];
for(const model of ["zero_order","first_order","weibull","lag_first_order"]){
 const a=kin.filter(r=>r.stratum==="exact_table_primary"&&r.model===model);if(a.length!==9)throw Error("kinetic model count");
 const z=a.map(r=>{let m=mechanical.find(x=>x.configuration===r.label);if(!m)throw Error("label");return {name:m.configuration,material:m.material,r:n(r.predicted_retention_pct),f:n(r.predicted_retention_pct)/100*n(mech.find(x=>x.configuration===m.configuration).initial_force_N)}});
 const dom=(a,b)=>a.r>=b.r&&a.f>=b.f&&(a.r>b.r||a.f>b.f);
 const front=z.filter(x=>!z.some(y=>dom(y,x)));
 const c=z.filter(x=>x.material==="Cotton"),cf=c.filter(x=>!c.some(y=>dom(y,x)));
 modelCases.push({model,global_front:front.map(x=>x.name).join(";"),cotton_front:cf.map(x=>x.name).join(";"),passes_80pct_200N:z.filter(x=>x.r>=80&&x.f>=200).map(x=>x.name).join(";")});
}
const B=contrast.map(r=>({...r,interval_direction:n(r.boot_lo)>0?"positive":n(r.boot_hi)<0?"negative":"crosses zero",status:"E05 exploratory marginal bootstrap interval; not adjusted; no equivalence inference"}));
const coverage=[];
for(const coat of [""," + alginate"]){const c=bio.find(r=>r.treatment==="Cotton"+coat),p=bio.find(r=>r.treatment==="Polypropylene"+coat);let a=n(c.relative_cover_pct_mean)-n(p.relative_cover_pct_mean),b=n(c.retention_sensitivity_mean)-n(p.retention_sensitivity_mean);coverage.push({coating:coat?"alginate":"uncoated",all_units_cotton_minus_PP_pp:rd(a),flag_excluded_cotton_minus_PP_pp:rd(b),direction_reversed:a*b<0,cotton_remaining_n:n(c.retention_sensitivity_n),PP_remaining_n:n(p.retention_sensitivity_n),status:"exclusion sensitivity; not corrected estimate"});}
const economics=[];
for(const l of [...new Set(econ.map(x=>n(x.lifetime_ratio)))]){const a=econ.filter(x=>n(x.lifetime_ratio)===l);economics.push({lifetime_ratio:l,scenarios:a.length,at_or_below_reference:a.filter(x=>x.cost_not_higher==="true").length,min_cost_ratio:Math.min(...a.map(x=>n(x.cost_ratio))),max_cost_ratio:Math.max(...a.map(x=>n(x.cost_ratio))),break_even_price_ratio_at_yield_0_8:rd(l*.8),break_even_price_ratio_at_yield_1:rd(l),break_even_price_ratio_at_yield_1_2:rd(l*1.2),status:"grid count not probability"});}
const missing=evidence.map(r=>({material:r.material,trial_priority:r.trial_priority,local_load:r.local_matched_wet_knot_load,local_life:r.local_service_life,local_yield:r.local_yield,local_price:r.local_price,local_lca:r.material_specific_lca,decision:"trial prioritisation only; full selection withheld"}));
return {mechanical,grid,robustness,modelCases,biological:B,coverage,economics,missing,summary:{grid_nonempty:Object.fromEntries(tiers.map(t=>[t,grid.filter(x=>x.stress_case===t&&x.n_candidates>0).length])),default_case:grid.filter(x=>x.min_retention_pct===80&&x.min_breaking_force_N===200),certified_nondominated:robustness.filter(x=>x.envelope_certified_nondominated).map(x=>x.configuration),coverage,modelCases,economics,fully_evaluable:0}};
}
const paths=["data/E02/mechanical_ageing_core_v0.0.1.csv","outputs/E07/mechanical_pareto.csv","outputs/E04/kinetic_sensitivity.csv","outputs/E05/theobald_summary.csv","outputs/E05/theobald_contrasts.csv","outputs/E07/replacement_constraints.csv","outputs/E07/integrated_decision_matrix.csv"];const names={"mechanical":"mechanical_stress_envelopes","grid":"constraint_stress_grid","robustness":"dominance_stress","modelCases":"kinetic_model_sensitivity","biological":"biological_interval_audit","coverage":"cover_exclusion_sensitivity","economics":"economic_lifetime_sensitivity","missing":"missing_evidence_register"};
const o=e08(...paths.map(p=>parse(fs.readFileSync(p,'utf8'))));
for(const [k,v] of Object.entries(names))if(csv(o[k])!==fs.readFileSync('outputs/E08/'+v+'.csv','utf8'))throw Error(v+' mismatch');
console.log(JSON.stringify(o.summary,null,2));
