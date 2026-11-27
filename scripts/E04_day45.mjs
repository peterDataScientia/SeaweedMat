// SeaweedMat E04; run from repo root: node scripts/E04_day45.mjs
import fs from 'node:fs';
function parseCSV(s){let rows=[],r=[],v="",q=false;for(let i=0;i<s.length;i++){let c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){v+='"';i++}else q=false}else v+=c}else if(c==='"')q=true;else if(c===','){r.push(v);v=""}else if(c==='\n'){r.push(v);rows.push(r);r=[];v=""}else if(c!=='\r')v+=c}if(r.length||v){r.push(v);rows.push(r)}let h=rows.shift();return rows.filter(r=>r.length===h.length).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))}
function csv(a){let keys=Object.keys(a[0]);return [keys,...a.map(r=>keys.map(k=>r[k]))].map(r=>r.map(v=>{let s=String(v??"");return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}).join(",")).join("\n")+"\n"}
function e04(core,params,audit,T=45){
const byId=new Map(core.map(r=>[r.record_id,r]));
const groups=new Map();
for(const r of core){if(+r.exposure_days_nominal===0)continue;const id=[r.baseline_id,r.condition,r.temperature_C].join("|");if(!groups.has(id))groups.set(id,[]);groups.get(id).push(r)}
if(groups.size!==audit.length)throw Error("series count");
const round=x=>Number(x.toFixed(6));
const interp=(a,b,w)=>(1-w)*a+w*b;
const numeric=x=>x!==undefined&&x!==null&&x!==""&&Number.isFinite(Number(x));
const modelRows=[], estimates=[];
for(const a of audit){
 const rr=groups.get(a.series_id);if(!rr)throw Error("missing series");
 const base=byId.get(rr[0].baseline_id);if(!base||+base.retention_pct!==100)throw Error("baseline");
 const pts=[base,...rr].sort((a,b)=>+a.exposure_days_nominal-+b.exposure_days_nominal);
 if(T<0||T>+pts.at(-1).exposure_days_nominal)throw Error("outside observed range");
 const hi=pts.find(r=>+r.exposure_days_nominal>=T),lo=pts.filter(r=>+r.exposure_days_nominal<T).at(-1)||hi;
 const t0=+lo.exposure_days_nominal,t1=+hi.exposure_days_nominal,w=t1===t0?0:(T-t0)/(t1-t0);
 if(w<0||w>1)throw Error("not bracketed");
 const retained=interp(+lo.retention_pct,+hi.retention_pct,w);
 const value=interp(+lo.reported_value,+hi.reported_value,w);
 const sparse=a.stratum==="sparse_descriptive";
 const fitRows=params.filter(p=>p.series_id===a.series_id&&p.model!=="constant");
 const mp=[];
 for(const p of fitRows){
   const x=T/+p.time_scale_days,k=+p.rate_scaled,z=+p.shape_or_lag_scaled;
   const y=p.model==="zero_order"?100*Math.max(0,1-k*x):p.model==="first_order"?100*Math.exp(-k*x):p.model==="weibull"?100*Math.exp(-k*x**z):p.model==="lag_first_order"?100*Math.exp(-k*Math.max(0,x-z)):NaN;
   if(!Number.isFinite(y))throw Error("invalid prediction");
   mp.push(y);modelRows.push({series_id:a.series_id,label:a.label,stratum:a.stratum,target_day:T,model:p.model,predicted_retention_pct:round(y),interpolation_pct:round(retained),difference_pp:round(y-retained),boundary_flag:p.boundary_flag});
 }
 const hasBounds=[lo,hi].every(r=>numeric(r.retention_lower_conditional_pct)&&numeric(r.retention_upper_conditional_pct));
 const force=base.endpoint==="breaking_force"&&["N","kN","kgf"].includes(base.reported_unit)?value*({N:1,kN:1000,kgf:9.80665}[base.reported_unit]):"";
 const specific=base.endpoint==="specific_breaking_force"&&base.reported_unit==="N/ktex"?value:"";
 const status=sparse?"coarse descriptive interpolation only; exclude from candidate comparison":a.stratum==="exact_table_primary"?"primary exact-table interpolation":"supplementary provisional graph interpolation";
 estimates.push({series_id:a.series_id,label:a.label,study:a.study,stratum:a.stratum,material:rr[0].material,specimen:rr[0].specimen,condition:rr[0].condition,temperature_C:rr[0].temperature_C,diameter_mm:rr[0].diameter_mm,target_day:T,left_record_id:lo.record_id,right_record_id:hi.record_id,left_day:t0,right_day:t1,bracket_width_days:round(t1-t0),baseline_bracket:t0===0,interpolated_retention_pct:round(retained),initial_value:+base.reported_value,interpolated_value:round(value),reported_unit:base.reported_unit,breaking_force_N:force===""?"":round(force),specific_force_N_per_ktex:specific===""?"":round(specific),interpolated_lower_conditional_pct:hasBounds?round(interp(+lo.retention_lower_conditional_pct,+hi.retention_lower_conditional_pct,w)):"",interpolated_upper_conditional_pct:hasBounds?round(interp(+lo.retention_upper_conditional_pct,+hi.retention_upper_conditional_pct,w)):"",bound_interpretation:hasBounds?"interpolated source bounds conditional on mean baseline; not confidence interval":"not available",n_kinetic_models:mp.length,model_min_pct:mp.length?round(Math.min(...mp)):"",model_max_pct:mp.length?round(Math.max(...mp)):"",model_spread_pp:mp.length?round(Math.max(...mp)-Math.min(...mp)):"",interpolation_status:status});
}
return {estimates,modelRows}
}
const [core,params,audit]=["data/E02/mechanical_ageing_core_v0.0.1.csv","outputs/E03/model_parameters.csv","outputs/E03/series_audit.csv"].map(path=>parseCSV(fs.readFileSync(path,'utf8')));
const {estimates,modelRows}=e04(core,params,audit);
fs.mkdirSync('outputs/E04_rerun',{recursive:true});
fs.writeFileSync('outputs/E04_rerun/day45_estimates.csv',csv(estimates));
fs.writeFileSync('outputs/E04_rerun/kinetic_sensitivity.csv',csv(modelRows));
for (const name of ['day45_estimates','kinetic_sensitivity']) {const expected=fs.readFileSync('outputs/E04/'+name+'.csv','utf8');const actual=fs.readFileSync('outputs/E04_rerun/'+name+'.csv','utf8');if(expected!==actual)throw Error(name+' differs from committed output');}
console.log('E04 reproduced:',estimates.length,'series;',modelRows.length,'kinetic estimates');
