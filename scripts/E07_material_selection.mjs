// Run from repository root: node scripts/E07_material_selection.mjs
import fs from 'node:fs';
function parse(s){let a=[],r=[],v="",q=false;for(let i=0;i<s.length;i++){let c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){v+='"';i++}else q=false}else v+=c}else if(c==='"')q=true;else if(c===','){r.push(v);v=""}else if(c==='\n'){r.push(v);a.push(r);r=[];v=""}else if(c!=='\r')v+=c}if(r.length||v){r.push(v);a.push(r)}const h=a.shift();return a.map(r=>{if(r.length!==h.length)throw Error('CSV width');return Object.fromEntries(h.map((k,i)=>[k,r[i]]))})}
function csv(a){let h=Object.keys(a[0]);return [h,...a.map(r=>h.map(k=>r[k]??""))].map(r=>r.map(v=>{let s=String(v);return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}).join(",")).join("\n")+"\n"}
function e07(mech,evidence,bio,econ){
const num=v=>{if(v===""||v==null||!Number.isFinite(+v))throw Error("missing numeric");return +v}, rd=v=>+v.toFixed(6);
if(mech.length!==9||evidence.length!==8||bio.length!==10||econ.length!==60)throw Error("input count");
const dom=(a,b,keys)=>keys.every(k=>a[k]>=b[k])&&keys.some(k=>a[k]>b[k]);
const front=(a,keys)=>a.filter(x=>!a.some(y=>dom(y,x,keys)));
const m=mech.map(r=>({configuration:r.label,material:r.material,diameter_mm:num(r.diameter_mm),initial_force_N:rd(num(r.initial_value)*9.80665),retention_pct:num(r.interpolated_retention_pct),force_N:num(r.breaking_force_N),model_min_pct:num(r.model_min_pct),model_max_pct:num(r.model_max_pct),source_lower_pct:num(r.interpolated_lower_conditional_pct),source_upper_pct:num(r.interpolated_upper_conditional_pct),model_low_retention_pct:Math.min(num(r.interpolated_retention_pct),num(r.model_min_pct)),model_low_force_N:rd(num(r.initial_value)*9.80665*Math.min(num(r.interpolated_retention_pct),num(r.model_min_pct))/100)}));
const nominal=front(m,["retention_pct","force_N"]), conservative=front(m,["model_low_retention_pct","model_low_force_N"]), cotton=m.filter(x=>x.material==="Cotton"), cottonFront=front(cotton,["retention_pct","force_N"]), cottonLow=front(cotton,["model_low_retention_pct","model_low_force_N"]);
const names=a=>a.map(x=>x.configuration);
const M=m.map(x=>({...x,nominal_front:names(nominal).includes(x.configuration),model_low_front:names(conservative).includes(x.configuration),within_cotton_front:x.material==="Cotton"?names(cottonFront).includes(x.configuration):"",within_cotton_model_low_front:x.material==="Cotton"?names(cottonLow).includes(x.configuration):""}));
const scenarios=[];
for(const r of [60,70,80,90,100])for(const f of [100,200,300,400,600]){
 const a=m.filter(x=>x.retention_pct>=r&&x.force_N>=f), b=m.filter(x=>x.model_low_retention_pct>=r&&x.model_low_force_N>=f);
 scenarios.push({min_retention_pct:r,min_breaking_force_N:f,nominal_count:a.length,model_low_count:b.length,nominal_candidates:names(a).join(";"),model_low_candidates:names(b).join(";"),status:"illustrative thresholds; not certified working load"});
}
const B=[];
for(const coated of [false,true]){
const rows=bio.filter(r=>r.treatment.endsWith(" + alginate")===coated&&!r.treatment.startsWith("Control")).map(r=>({material:r.treatment.replace(" + alginate",""),coating:coated?"alginate":"uncoated",density:num(r.density_cm2_mean),combined_length:num(r.combined_mm_mean),longest_length:num(r.longest_mm_mean),cover_ratio:num(r.relative_cover_pct_mean),cover_flagged:num(r.coverage_flagged),cover_sensitivity_n:num(r.retention_sensitivity_n),cover_sensitivity_mean:num(r.retention_sensitivity_mean)}));
const f=front(rows,["density","combined_length","longest_length"]);const f2=front(rows,["density","combined_length"]);
for(const x of rows)B.push({...x,biological_front_three_endpoints:f.includes(x),biological_front_density_combined:f2.includes(x),cover_used_in_primary:false});
}
const E=econ.map(r=>{const l=num(r.lifetime_ratio),p=num(r.price_per_m_ratio),y=num(r.marketable_yield_ratio),threshold=l*y,ratio=p/threshold;if(Math.abs(ratio-num(r.material_cost_per_output_ratio))>1e-7)throw Error("economic formula");return {lifetime_ratio:l,price_per_m_ratio:p,marketable_yield_ratio:y,cost_ratio:rd(ratio),maximum_price_ratio:rd(threshold),maximum_impact_per_m_ratio:rd(threshold),cost_not_higher:ratio<=1+1e-10,environmental_status:"conditional threshold only; actual per-metre impact missing",status:"illustrative scenario; not probability"}});
const P=evidence.map(r=>{const configs=M.filter(x=>x.material===r.material);let action=({Cotton:"priority matched local trial",Jute:"conditional trial; conflicting context",Sisal:"lower attachment priority",Coir:"secondary exploratory trial",Rayon:"exploratory; biological data needed","PBS/PBAT":"exploratory; short-term data needed",Polypropylene:"reference control",Nylon:"reference control"})[r.material];return {...r,exact_mechanical_configurations:configs.length,mechanical_evidence_available:configs.length?"exact table; external conditions":r.E04_mechanical_evidence,local_matched_wet_knot_load:"missing",local_service_life:"missing",local_yield:"missing",local_price:"missing",material_specific_lca:"missing",full_selection_status:"not evaluable",trial_priority:action}});
return {mechanical:M,thresholds:scenarios,biological:B,economic:E,evidence:P,summary:{mechanical_nominal_front:names(nominal),mechanical_model_low_front:names(conservative),cotton_nominal_front:names(cottonFront),cotton_model_low_front:names(cottonLow),threshold_scenarios:scenarios.length,nominal_nonempty:scenarios.filter(r=>r.nominal_count>0).length,model_low_nonempty:scenarios.filter(r=>r.model_low_count>0).length,biological_front:B.filter(r=>r.biological_front_three_endpoints).map(r=>r.coating+": "+r.material),economic_scenarios:E.length,economic_not_higher:E.filter(r=>r.cost_not_higher).length,fully_evaluable_materials:P.filter(r=>r.full_selection_status!=="not evaluable").length}}
}
const paths=["outputs/E04/primary_mechanical_comparison.csv","outputs/E05/material_evidence_matrix.csv","outputs/E05/theobald_summary.csv","outputs/E06/replacement_scenarios.csv"];
const names={"mechanical":"mechanical_pareto","thresholds":"constraint_scenarios","biological":"biological_pareto","economic":"replacement_constraints","evidence":"integrated_decision_matrix"};
const out=e07(...paths.map(p=>parse(fs.readFileSync(p,'utf8'))));
for(const [k,n] of Object.entries(names)){if(csv(out[k])!==fs.readFileSync('outputs/E07/'+n+'.csv','utf8'))throw Error(n+' mismatch');}
console.log(JSON.stringify(out.summary,null,2));
