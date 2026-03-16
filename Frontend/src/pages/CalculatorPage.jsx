import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculate, getCalculators } from "../services/api";
import { FaCalculator } from "react-icons/fa";
import { MdOutlineCalculate } from "react-icons/md";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ================================================================
   CATEGORY STYLES
================================================================ */
const CAT = {
  Finance:  { ring:"#6366f1", lb:"bg-indigo-50 text-indigo-600 border-indigo-200",  db:"dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25" },
  Math:     { ring:"#3b82f6", lb:"bg-blue-50 text-blue-600 border-blue-200",        db:"dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25" },
  Health:   { ring:"#ec4899", lb:"bg-pink-50 text-pink-600 border-pink-200",        db:"dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/25" },
  Science:  { ring:"#a855f7", lb:"bg-purple-50 text-purple-600 border-purple-200",  db:"dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/25" },
  Shopping: { ring:"#f97316", lb:"bg-orange-50 text-orange-600 border-orange-200",  db:"dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25" },
  Travel:   { ring:"#06b6d4", lb:"bg-cyan-50 text-cyan-600 border-cyan-200",        db:"dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/25" },
  Personal: { ring:"#f59e0b", lb:"bg-amber-50 text-amber-600 border-amber-200",     db:"dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25" },
  Default:  { ring:"#6366f1", lb:"bg-indigo-50 text-indigo-600 border-indigo-200",  db:"dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25" },
};

/* ================================================================
   LABEL FORMATTER
   "health_risk" → "Health Risk"
   "bmi"         → "BMI"
   "body_fat_est"→ "Body Fat Est"
================================================================ */
function formatLabel(raw) {
  return String(raw)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/* ================================================================
   RESULT NORMALISER — scalar | object | array
================================================================ */
function parseResult(raw) {
  if (raw === null || raw === undefined) return [];

  // Skip known chart-data arrays (yearly_breakdown, schedule, etc.)
  const CHART_KEYS = new Set([
    "yearly_breakdown","period_breakdown","schedule","yearly_summary",
    "discount_steps","bulk_steps","slab_comparison","tip_options",
    "price_sensitivity","mileage_sensitivity","milestones","conversion_table",
    "distribution","growth_series","digit_series",
  ]);

  if (typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw)
      .filter(([k]) => !CHART_KEYS.has(k))
      .map(([label, value], i) => ({
        label: formatLabel(label),
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
        primary: i === 0,
      }));
  }
  if (Array.isArray(raw))
    return raw.map((item, i) =>
      typeof item === "object"
        ? { label: formatLabel(item.label ?? `Result ${i+1}`), value: String(item.value), primary: i === 0 }
        : { label: `Result ${i+1}`, value: String(item), primary: i === 0 }
    );
  return [{ label: "Result", value: String(raw), primary: true }];
}

/* ================================================================
   CHART HELPERS
================================================================ */
const TT    = { backgroundColor:"#0f0f14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:12, color:"#e2e8f0" };
const GRID  = <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />;
const XTICK = { fontSize:10, fill:"#9ca3af" };
const YTICK = { fontSize:10, fill:"#9ca3af" };

/* ================================================================
   PER-CALCULATOR CHART DEFINITIONS
================================================================ */
function getDashboardCharts(slug, inputs, result, accent) {

  if (slug === "age") {
    const age  = parseFloat(typeof result === "object" ? result.years : result);
    if (!age) return [];
    const born    = new Date().getFullYear() - age;
    const decades = Array.from({ length:9 }, (_, i) => ({
      decade:`${i*10}s`, lived: age>=(i+1)*10 ? 10 : Math.max(0,age-i*10),
    }));
    const gauge = [
      { name:"Lived",     value:age,               fill:accent },
      { name:"Remaining", value:Math.max(0,80-age), fill:accent+"22" },
    ];
    const milestones = [5,10,18,21,25,30,40,50,60,70,80].map(m=>({ age:m, reached:age>=m?1:0 }));
    return [
      { title:"Age Gauge", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" startAngle={220} endAngle={-40} data={gauge}>
            <PolarAngleAxis type="number" domain={[0,80]} tick={false}/>
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill:"rgba(128,128,128,0.08)" }}>
              {gauge.map((d,i)=><Cell key={i} fill={d.fill}/>)}
            </RadialBar>
            <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:36, fontWeight:700, fill:accent }}>{age}</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:12, fill:"#9ca3af" }}>years old</text>
          </RadialBarChart>
        </ResponsiveContainer>
      )},
      { title:`Life by Decade (born ${born})`, span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={decades} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="decade" tick={XTICK}/><YAxis tick={YTICK} domain={[0,10]}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="lived" radius={[4,4,0,0]} name="Years">
              {decades.map((d,i)=><Cell key={i} fill={d.lived>=10?accent:accent+"55"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"Life Milestones", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={milestones} margin={{ top:4,right:8,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="age" tick={XTICK} tickFormatter={v=>`${v}yr`}/><YAxis hide/>
            <Tooltip contentStyle={TT} formatter={(_,__,p)=>[p.payload.age<=age?"Reached":"Not yet","Milestone"]}/>
            <Bar dataKey="reached" radius={[4,4,0,0]}>
              {milestones.map((d,i)=><Cell key={i} fill={d.age<=age?accent:"#374151"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "bmi") {
    const bmi   = parseFloat(typeof result==="object" ? result.bmi ?? Object.values(result)[0] : result);
    const h     = parseFloat(inputs.height ?? inputs.h);
    const w     = parseFloat(inputs.weight ?? inputs.w);
    if (!bmi) return [];
    const zones = [
      { name:"Underweight", min:10,  max:18.5, color:"#60a5fa" },
      { name:"Normal",      min:18.5,max:25,   color:"#4ade80" },
      { name:"Overweight",  min:25,  max:30,   color:"#fb923c" },
      { name:"Obese",       min:30,  max:40,   color:"#f87171" },
    ];
    const active  = zones.find(z=>bmi>=z.min&&bmi<z.max) ?? zones[3];
    const clamp   = Math.min(Math.max(bmi,10),40);
    const pct     = ((clamp-10)/30)*100;
    const barData = zones.map(z=>({ name:z.name, width:z.max-z.min, color:z.color }));
    const wtRange = h ? Array.from({length:6},(_,i)=>{ const b=16+i*5; return { bmi:b, weight:parseFloat((b*(h/100)**2).toFixed(1)) }; }) : [];
    return [
      { title:"BMI Meter", span:"full", Chart:()=>(
        <div className="flex flex-col gap-3 px-2 pt-2 pb-4">
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/5">
            {zones.map((z,i)=>(
              <div key={i} className="absolute top-0 h-full" style={{ left:`${((z.min-10)/30)*100}%`, width:`${((z.max-z.min)/30)*100}%`, background:z.color, opacity:0.75 }}/>
            ))}
            <div className="absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full bg-white shadow-lg ring-2 ring-white/40" style={{ left:`${pct}%`, transition:"left 0.7s cubic-bezier(.34,1.56,.64,1)" }}/>
          </div>
          <div className="flex justify-between text-[11px] font-semibold">
            {zones.map(z=>(
              <span key={z.name} style={{ color:z.name===active.name?z.color:"#9ca3af" }}>{z.name}</span>
            ))}
          </div>
          <p className="text-center mt-2">
            <span className="text-5xl font-bold tracking-tight" style={{ color:active.color }}>{parseFloat(bmi).toFixed(1)}</span>
            <span className="ml-2 text-base text-gray-400 dark:text-white/40 font-medium">BMI — {active.name}</span>
          </p>
        </div>
      )},
      { title:"BMI Zones Range", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="name" tick={{ ...XTICK, fontSize:9 }}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="width" radius={[6,6,0,0]} name="BMI Range">
              {barData.map((d,i)=><Cell key={i} fill={d.color} opacity={zones[i].name===active.name?1:0.35}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
      h ? { title:"Weight vs BMI at Your Height", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={wtRange} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accent} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {GRID}<XAxis dataKey="bmi" tick={XTICK} tickFormatter={v=>`BMI ${v}`}/><YAxis tick={YTICK} tickFormatter={v=>`${v}kg`}/>
            <Tooltip contentStyle={TT} formatter={v=>[`${v} kg`,"Weight"]}/>
            <Area type="monotone" dataKey="weight" stroke={accent} fill="url(#wGrad)" strokeWidth={2} dot={{ r:3,fill:accent }} name="Weight"/>
            {w && <Line type="monotone" dataKey={()=>w} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5} dot={false} name="Your weight"/>}
          </AreaChart>
        </ResponsiveContainer>
      )} : null,
    ].filter(Boolean);
  }

  if (slug === "compoundInterest") {
    const p = parseFloat(inputs.principal??inputs.p), r=parseFloat(inputs.rate??inputs.r), t=parseFloat(inputs.time??inputs.t), n=parseFloat(inputs.n)||12;
    if (!p||!r||!t) return [];
    const years = Array.from({length:Math.min(Math.ceil(t),30)+1},(_,yr)=>{ const amt=p*Math.pow(1+r/100/n,n*yr); return { year:`Y${yr}`,Amount:Math.round(amt),Principal:Math.round(p) }; });
    const comparison=[1,2,4,12].map(freq=>{ const labels={1:"Annual",2:"Semi",4:"Quarterly",12:"Monthly"}; const amt=p*Math.pow(1+r/100/freq,freq*t); return { freq:labels[freq],amount:Math.round(amt) }; });
    const finalAmt=p*Math.pow(1+r/100/n,n*t);
    const pie=[{name:"Principal",value:Math.round(p),color:"#6b7280"},{name:"Interest",value:Math.round(finalAmt-p),color:accent}];
    return [
      { title:"Growth Over Time", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={years} margin={{ top:8,right:8,left:0,bottom:0 }}>
            <defs><linearGradient id="ciA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.4}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="year" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Area type="monotone" dataKey="Amount" stroke={accent} fill="url(#ciA)" strokeWidth={2.5} dot={false} name="Total Amount"/>
            <Area type="monotone" dataKey="Principal" stroke="#6b7280" fill="none" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Principal"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </AreaChart>
        </ResponsiveContainer>
      )},
      { title:"Principal vs Interest", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={4} dataKey="value">
              {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"Compounding Frequency Impact", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparison} margin={{ top:4,right:4,left:-10,bottom:0 }}>
            {GRID}<XAxis dataKey="freq" tick={XTICK}/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="amount" radius={[6,6,0,0]} name="Final Amount">
              {comparison.map((_,i)=><Cell key={i} fill={accent} opacity={0.5+i*0.15}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "simpleInterest") {
    const p=parseFloat(inputs.principal??inputs.p),r=parseFloat(inputs.rate??inputs.r),t=parseFloat(inputs.time??inputs.t);
    if (!p||!r||!t) return [];
    const years=Array.from({length:Math.min(Math.ceil(t),20)},(_,i)=>({ year:`Y${i+1}`,Principal:Math.round(p),Interest:Math.round((p*r*(i+1))/100) }));
    const pie=[{name:"Principal",value:Math.round(p),color:"#6b7280"},{name:"Interest",value:Math.round(p*r*t/100),color:accent}];
    return [
      { title:"Growth Year by Year", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={years} margin={{ top:8,right:8,left:0,bottom:0 }}>
            {GRID}<XAxis dataKey="year" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="Principal" stackId="a" fill="#6b7280" radius={[0,0,6,6]} name="Principal"/>
            <Bar dataKey="Interest"  stackId="a" fill={accent}  radius={[6,6,0,0]} name="Interest"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"Principal vs Interest", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={4} dataKey="value">
              {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"Interest Accumulation", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={years} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            <defs><linearGradient id="siGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.4}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="year" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Area type="monotone" dataKey="Interest" stroke={accent} fill="url(#siGrad)" strokeWidth={2} dot={false} name="Interest"/>
          </AreaChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "emi") {
    const loan=parseFloat(inputs.loan??inputs.principal??inputs.amount),rate=parseFloat(inputs.rate??inputs.interest),tenure=parseFloat(inputs.tenure??inputs.months);
    if (!loan||!rate||!tenure) return [];
    const r=rate/(12*100),emi=loan*r*Math.pow(1+r,tenure)/(Math.pow(1+r,tenure)-1),totalInt=emi*tenure-loan;
    const pie=[{name:"Principal",value:Math.round(loan),color:"#6b7280"},{name:"Interest",value:Math.round(totalInt),color:accent}];
    const step=Math.max(1,Math.floor(tenure/30));const area=[];let bal=loan;
    for(let m=0;m<=tenure;m+=step){area.push({month:`M${m}`,Balance:Math.round(Math.max(0,bal))});for(let s=0;s<step&&m+s<tenure;s++){const int=bal*r;bal-=(emi-int);}}
    const yearly=Array.from({length:Math.min(Math.ceil(tenure/12),30)},(_,yr)=>{ const paid=emi*Math.min(12,tenure-yr*12),intPd=paid*(totalInt/(emi*tenure)); return {year:`Y${yr+1}`,Principal:Math.round(paid-intPd),Interest:Math.round(intPd)}; });
    return [
      { title:"Principal vs Interest", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pie} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={4} dataKey="value">
              {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
            <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:11,fill:"#9ca3af" }}>Monthly EMI</text>
            <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:18,fontWeight:700,fill:accent }}>₹{Math.round(emi).toLocaleString()}</text>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"Balance Decline", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={area} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            <defs><linearGradient id="emiB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.35}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="month" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Area type="monotone" dataKey="Balance" stroke={accent} fill="url(#emiB)" strokeWidth={2} dot={false} name="Balance"/>
          </AreaChart>
        </ResponsiveContainer>
      )},
      { title:"Yearly Payments", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yearly} margin={{ top:4,right:8,left:0,bottom:0 }}>
            {GRID}<XAxis dataKey="year" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="Principal" stackId="a" fill="#6b7280" radius={[0,0,4,4]} name="Principal"/>
            <Bar dataKey="Interest"  stackId="a" fill={accent}  radius={[4,4,0,0]} name="Interest"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "discount") {
    const original=parseFloat(inputs.originalPrice??inputs.original??inputs.price??inputs.amount),pct=parseFloat(inputs.discount??inputs.percentage??inputs.percent);
    if (!original||!pct) return [];
    const saved=(original*pct)/100,final=original-saved;
    const bps=[5,10,15,20,25,30,40,50].map(d=>({ discount:`${d}%`,paid:Math.round(original*(1-d/100)),saved:Math.round(original*d/100) }));
    return [
      { title:"You Pay vs You Save", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={[{name:"You Pay",value:Math.round(final)},{name:"You Save",value:Math.round(saved)}]} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={4} dataKey="value">
              {[accent,"#4ade80"].map((c,i)=><Cell key={i} fill={c}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:12,fill:"#9ca3af" }}>Saving</text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:22,fontWeight:700,fill:"#4ade80" }}>{pct}% off</text>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"Savings at Different Discounts", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bps} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="discount" tick={XTICK}/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="saved" radius={[4,4,0,0]} name="Savings">
              {bps.map((_,i)=><Cell key={i} fill={accent} opacity={0.4+i*0.08}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "gst") {
    const amount=parseFloat(inputs.amount??inputs.price),rate=parseFloat(inputs.gstRate??inputs.rate??inputs.gst);
    if (!amount||!rate) return [];
    const gst=(amount*rate)/100,total=amount+gst;
    const slabs=[5,12,18,28].map(r=>({ rate:`${r}%`,base:Math.round(amount),gst:Math.round(amount*r/100),total:Math.round(amount+amount*r/100) }));
    return [
      { title:"Tax Breakdown", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={[{name:"Base Amount",value:Math.round(amount)},{name:"GST",value:Math.round(gst)}]} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={4} dataKey="value">
              {["#6b7280",accent].map((c,i)=><Cell key={i} fill={c}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:11,fill:"#9ca3af" }}>Total</text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:18,fontWeight:700,fill:accent }}>₹{Math.round(total).toLocaleString()}</text>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"GST Across All Slabs", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={slabs} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="rate" tick={XTICK}/><YAxis tick={YTICK} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="base" stackId="a" fill="#6b7280" radius={[0,0,4,4]} name="Base"/>
            <Bar dataKey="gst"  stackId="a" fill={accent}  radius={[4,4,0,0]} name="GST"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "temperature") {
    const c=typeof result==="object" ? parseFloat(result.celsius??Object.values(result)[0]) : parseFloat(result);
    if (!c&&c!==0) return [];
    const f=c*9/5+32,k=c+273.15;
    const scales=[{name:"°C",value:parseFloat(c.toFixed(2)),fill:"#3b82f6"},{name:"°F",value:parseFloat(f.toFixed(2)),fill:accent},{name:"K",value:parseFloat(k.toFixed(2)),fill:"#a855f7"}];
    const range=Array.from({length:11},(_,i)=>{ const cv=c-50+i*10; return { temp:`${cv.toFixed(0)}°C`,C:cv,F:parseFloat((cv*9/5+32).toFixed(1)) }; });
    return [
      { title:"All Scales Compared", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scales} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="name" tick={XTICK}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="value" radius={[6,6,0,0]} name="Value">
              {scales.map((d,i)=><Cell key={i} fill={d.fill}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"°C vs °F Conversion Curve", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={range} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="temp" tick={XTICK} interval="preserveStartEnd"/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Line type="monotone" dataKey="C" stroke="#3b82f6" strokeWidth={2} dot={false} name="Celsius"/>
            <Line type="monotone" dataKey="F" stroke={accent}  strokeWidth={2} dot={false} name="Fahrenheit"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </LineChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "percentage") {
    const value=parseFloat(inputs.value??inputs.part??inputs.x),total=parseFloat(inputs.total??inputs.whole??inputs.y);
    if (!value||!total) return [];
    const pct=(value/total)*100;
    const gaugeData=[{name:"Part",value:Math.round(pct),fill:accent},{name:"Rest",value:Math.round(100-pct),fill:accent+"22"}];
    const bar=[10,20,30,40,50,60,70,80,90,100].map(p=>({ pct:`${p}%`,value:Math.round(total*p/100) }));
    return [
      { title:"Percentage Gauge", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" startAngle={220} endAngle={-40} data={gaugeData}>
            <PolarAngleAxis type="number" domain={[0,100]} tick={false}/>
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill:"rgba(128,128,128,0.08)" }}>
              {gaugeData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
            </RadialBar>
            <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:34,fontWeight:700,fill:accent }}>{pct.toFixed(1)}%</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:11,fill:"#9ca3af" }}>of total</text>
          </RadialBarChart>
        </ResponsiveContainer>
      )},
      { title:"Value at Each Percentage", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bar} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="pct" tick={XTICK}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="value" radius={[4,4,0,0]} name="Value">
              {bar.map((_,i)=><Cell key={i} fill={accent} opacity={0.3+i*0.07}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "average") {
    const raw=inputs.numbers??inputs.values??inputs.nums??"";
    const arr=String(raw).split(/[\s,]+/).map(Number).filter(n=>!isNaN(n)&&String(n)!=="");
    if (arr.length<2) return [];
    const avg=arr.reduce((a,b)=>a+b,0)/arr.length;
    const sorted=[...arr].sort((a,b)=>a-b);
    const data=arr.map((v,i)=>({ n:`#${i+1}`,value:v }));
    const dist=sorted.map((v,i)=>({ i:i+1,value:v,deviation:parseFloat((v-avg).toFixed(2)) }));
    return [
      { title:"Values with Average Line", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top:8,right:8,left:0,bottom:0 }}>
            {GRID}<XAxis dataKey="n" tick={XTICK}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="value" radius={[4,4,0,0]} name="Value">
              {data.map((d,i)=><Cell key={i} fill={Math.abs(d.value-avg)<0.0001?"#4ade80":accent} opacity={0.8}/>)}
            </Bar>
            <Line type="monotone" dataKey={()=>parseFloat(avg.toFixed(2))} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={false} name={`Avg: ${avg.toFixed(2)}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"Deviation from Mean", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dist} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="i" tick={XTICK} tickFormatter={v=>`#${v}`}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT} formatter={v=>[`${v>0?"+":""}${v}`,"Deviation"]}/>
            <Bar dataKey="deviation" radius={[4,4,0,0]} name="Deviation">
              {dist.map((d,i)=><Cell key={i} fill={d.deviation>=0?accent:"#f87171"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"Sorted Distribution", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dist} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            <defs><linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.4}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="i" tick={XTICK} tickFormatter={v=>`#${v}`}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Area type="monotone" dataKey="value" stroke={accent} fill="url(#avgGrad)" strokeWidth={2} dot={{ r:3,fill:accent }} name="Value"/>
          </AreaChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "fuelCost") {
    const dist=parseFloat(inputs.distance??inputs.km),mileage=parseFloat(inputs.mileage??inputs.efficiency),price=parseFloat(inputs.fuelPrice??inputs.price);
    if (!dist||!mileage||!price) return [];
    const data=Array.from({length:6},(_,i)=>{ const d=Math.round((dist/6)*(i+1)),l=d/mileage; return { km:`${d}km`,Cost:Math.round(l*price),Litres:parseFloat(l.toFixed(1)) }; });
    const fuelPrices=[80,90,100,110,120,130].map(p=>({ price:`₹${p}`,cost:Math.round((dist/mileage)*p) }));
    const mileages=[8,10,12,15,18,20,25].map(m=>({ mileage:`${m}km/L`,cost:Math.round((dist/m)*price) }));
    return [
      { title:"Cost & Fuel vs Distance", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top:8,right:8,left:0,bottom:0 }}>
            {GRID}<XAxis dataKey="km" tick={XTICK}/>
            <YAxis yAxisId="cost"  tick={YTICK} tickFormatter={v=>`₹${v}`}  orientation="left"/>
            <YAxis yAxisId="litre" tick={YTICK} tickFormatter={v=>`${v}L`}  orientation="right"/>
            <Tooltip contentStyle={TT}/>
            <Bar yAxisId="cost"  dataKey="Cost"   fill={accent}  radius={[4,4,0,0]} name="Cost (₹)"/>
            <Bar yAxisId="litre" dataKey="Litres" fill="#6b7280" radius={[4,4,0,0]} name="Fuel (L)"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
      { title:"Price Sensitivity", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={fuelPrices} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            <defs><linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.4}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="price" tick={XTICK}/><YAxis tick={YTICK} tickFormatter={v=>`₹${v}`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Area type="monotone" dataKey="cost" stroke={accent} fill="url(#fuelGrad)" strokeWidth={2} dot={{ r:3,fill:accent }} name="Trip Cost"/>
          </AreaChart>
        </ResponsiveContainer>
      )},
      { title:"Mileage Sensitivity", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mileages} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="mileage" tick={{ ...XTICK,fontSize:9 }}/><YAxis tick={YTICK} tickFormatter={v=>`₹${v}`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="cost" radius={[4,4,0,0]} name="Trip Cost">
              {mileages.map((_,i)=><Cell key={i} fill={accent} opacity={1-i*0.1}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "tip") {
    const bill=parseFloat(inputs.bill??inputs.amount??inputs.total),tipPct=parseFloat(inputs.tipPercent??inputs.tip??inputs.percent);
    const people=parseFloat(inputs.people??inputs.persons??inputs.split)||1;
    if (!bill||!tipPct) return [];
    const tipAmt=(bill*tipPct)/100;
    const bars=[5,10,15,18,20,25].map(t=>({ pct:`${t}%`,bill:Math.round(bill),tip:Math.round(bill*t/100) }));
    return [
      { title:"Bill Breakdown", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={[{name:"Bill",value:Math.round(bill)},{name:"Tip",value:Math.round(tipAmt)}]} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={4} dataKey="value">
              {["#6b7280",accent].map((c,i)=><Cell key={i} fill={c}/>)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:11,fill:"#9ca3af" }}>Per Person</text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize:18,fontWeight:700,fill:accent }}>₹{Math.round((bill+tipAmt)/people).toLocaleString()}</text>
          </PieChart>
        </ResponsiveContainer>
      )},
      { title:"Tip Options Comparison", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bars} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="pct" tick={XTICK}/><YAxis tick={YTICK} tickFormatter={v=>`₹${v}`}/>
            <Tooltip contentStyle={TT} formatter={v=>`₹${Number(v).toLocaleString()}`}/>
            <Bar dataKey="bill" stackId="a" fill="#6b7280" radius={[0,0,4,4]} name="Bill"/>
            <Bar dataKey="tip"  stackId="a" fill={accent}  radius={[4,4,0,0]} name="Tip"/>
            <Legend wrapperStyle={{ fontSize:11 }}/>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  if (slug === "factorial") {
    const n=parseFloat(inputs.n??inputs.number??inputs.num);
    if (!n||n<2) return [];
    const cap=Math.min(n,15);
    const data=Array.from({length:cap},(_,i)=>{ let f=1;for(let j=2;j<=i+1;j++)f*=j; return { n:`${i+1}!`,value:f,digits:String(f).length }; });
    return [
      { title:"Factorial Growth Curve", span:"full", Chart:()=>(
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top:8,right:8,left:0,bottom:0 }}>
            <defs><linearGradient id="facGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.4}/><stop offset="95%" stopColor={accent} stopOpacity={0}/></linearGradient></defs>
            {GRID}<XAxis dataKey="n" tick={XTICK}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Area type="monotone" dataKey="value" stroke={accent} fill="url(#facGrad)" strokeWidth={2.5} dot={{ r:4,fill:accent }} name="n!"/>
          </AreaChart>
        </ResponsiveContainer>
      )},
      { title:"Digits in Result", span:"half", Chart:()=>(
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top:4,right:4,left:-20,bottom:0 }}>
            {GRID}<XAxis dataKey="n" tick={XTICK}/><YAxis tick={YTICK}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="digits" radius={[4,4,0,0]} name="Digits">
              {data.map((_,i)=><Cell key={i} fill={accent} opacity={0.4+i*0.05}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )},
    ];
  }

  return [];
}

/* ================================================================
   CARD WRAPPER
================================================================ */
function DashCard({ title, accent, children, className = "" }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#111116] ${className}`}>
      {title && (
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-white/6" style={{ color:accent }}>
          <HiSparkles className="text-sm shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
      )}
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}

/* ================================================================
   STAT CARD — clean label formatting, no underscores
================================================================ */
function StatCard({ label, value, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.25 }}
      className="flex flex-col gap-1.5 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-white/8 dark:bg-[#111116]"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35">
        {formatLabel(label)}
      </span>
      <span className="text-xl font-bold leading-tight" style={{ color:accent }}>
        {value}
      </span>
    </motion.div>
  );
}

/* ================================================================
   FIELD with inline UNIT SWITCHER
   Shows pill buttons (kg / lb / oz) next to the label when
   the field definition includes a units[] array.
================================================================ */
function Field({ field, value, unit, onInput, onUnit, accent }) {
  const isSelect = field.type === "select";

  return (
    <div className="flex flex-col gap-1.5">

      {/* label row + unit pills */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
          {field.label}
        </label>

        {/* unit switcher pills — only when field has units[] */}
        {field.units && field.units.length > 1 && (
          <div className="flex items-center gap-1">
            {field.units.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => onUnit(field.name, u)}
                className={`
                  rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide
                  transition-all duration-150 border
                  ${unit === u
                    ? "text-white border-transparent shadow-sm"
                    : "bg-transparent text-gray-400 border-gray-200 hover:border-gray-300 dark:text-white/35 dark:border-white/10 dark:hover:border-white/25"
                  }
                `}
                style={unit === u ? { background:accent, borderColor:accent } : {}}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* select field */}
      {isSelect ? (
        <select
          name={field.name}
          value={value ?? field.options?.[0]?.value ?? ""}
          onChange={onInput}
          className="
            w-full rounded-xl border px-4 py-3 text-sm outline-none cursor-pointer
            transition-all duration-200
            border-gray-200 bg-gray-50 text-gray-700
            hover:border-gray-300 focus:bg-white
            dark:border-white/10 dark:bg-white/5 dark:text-white/80
            dark:hover:border-white/20 dark:focus:bg-white/8
          "
          onFocus={e => { e.target.style.borderColor = accent; }}
          onBlur={e  => { e.target.style.borderColor = ""; }}
        >
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type ?? "number"}
          name={field.name}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={onInput}
          className="
            w-full rounded-xl border px-4 py-3 text-sm font-mono outline-none
            transition-all duration-200
            border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300
            hover:border-gray-300 focus:bg-white focus:ring-2
            dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:placeholder-white/20
            dark:hover:border-white/20 dark:focus:bg-white/8
          "
          style={{ "--tw-ring-color": `${accent}30` }}
          onFocus={e => { e.target.style.borderColor = accent; }}
          onBlur={e  => { e.target.style.borderColor = ""; }}
        />
      )}

      {field.hint && (
        <p className="text-[11px] text-gray-400 dark:text-white/25 leading-snug">{field.hint}</p>
      )}
    </div>
  );
}

/* ================================================================
   SKELETON
================================================================ */
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-white/8" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-gray-200 dark:bg-white/8" />
          <div className="h-4 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 dark:border-white/8 dark:bg-white/3">
          {[1,2,3].map(n=>(
            <div key={n} className="space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/8" />
              <div className="h-11 rounded-xl bg-gray-100 dark:bg-white/5" />
            </div>
          ))}
          <div className="h-12 rounded-xl bg-gray-200 dark:bg-white/8" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/8 dark:bg-white/3 lg:col-span-2 h-64" />
      </div>
    </div>
  );
}

/* ================================================================
   PAGE
================================================================ */
export default function CalculatorPage() {
  const { type }  = useParams();
  const navigate  = useNavigate();

  const [calculator,  setCalculator]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [inputs,      setInputs]      = useState({});
  const [units,       setUnits]       = useState({});   // { fieldName: selectedUnit }
  const [result,      setResult]      = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error,       setError]       = useState(null);

  /* load calculator definition */
  useEffect(() => {
    setResult(null); setError(null); setInputs({}); setUnits({}); setLoading(true);
    (async () => {
      try {
        const res  = await getCalculators();
        const calc = res.data.data.find(c => c.slug === type || c.name?.toLowerCase().replace(/\s+/g,"") === type);
        setCalculator(calc ?? null);

        // seed default units from first option of each field
        if (calc?.fields) {
          const defaults = {};
          calc.fields.forEach(f => { if (f.units?.length) defaults[f.name] = f.units[0]; });
          setUnits(defaults);
        }
      } catch { setError("Failed to load calculator."); }
      finally  { setLoading(false); }
    })();
  }, [type]);

  /* field value change */
  const handleInput = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setResult(null);
  };

  /* unit pill change — sends  fieldName_unit  key to API */
  const handleUnit = (fieldName, unit) => {
    setUnits(prev => ({ ...prev, [fieldName]: unit }));
    setResult(null);
  };

  /* submit */
  const handleCalculate = async () => {
    setError(null); setCalculating(true);
    try {
      // merge unit selections as  fieldName_unit  keys
      const payload = { ...inputs };
      Object.entries(units).forEach(([field, unit]) => {
        payload[`${field}_unit`] = unit;
      });

      const res = await calculate(type, payload);
      setResult(res.data.result);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Calculation failed.");
    } finally { setCalculating(false); }
  };

  const style    = CAT[calculator?.category] ?? CAT.Default;
  const accent   = style.ring;
  const rows     = parseResult(result);
  const charts   = result !== null ? getDashboardCharts(type, inputs, result, accent) : [];
  const hasCharts = charts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[#0a0a0e]">

      {/* dark glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{ background:`radial-gradient(ellipse 70% 80% at 50% -10%, ${accent}15, transparent 70%)` }} />

      <div className="relative px-4 py-10 lg:px-8">

        {/* back */}
        <button onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 dark:text-white/35 dark:hover:text-white/70 transition-colors">
          <HiArrowLeft /> All Calculators
        </button>

        {loading && <Skeleton />}

        {!loading && error && !calculator && (
          <div className="rounded-2xl border px-6 py-5 text-sm border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/8 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !calculator && !error && (
          <div className="py-24 text-center text-sm text-gray-400 dark:text-white/35">
            Calculator <span className="font-mono text-gray-600 dark:text-white/55">"{type}"</span> not found.
          </div>
        )}

        {!loading && calculator && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>

            {/* page header */}
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background:`${accent}1a` }}>
                  <FaCalculator className="text-xl" style={{ color:accent }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white/95">
                    {calculator.name}
                  </h1>
                  {calculator.category && (
                    <span className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style.lb} ${style.db}`}>
                      {calculator.category}
                    </span>
                  )}
                </div>
              </div>
              {calculator.description && (
                <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-white/40 mt-1">
                  {calculator.description}
                </p>
              )}
            </div>

            {/* stat tiles */}
            <AnimatePresence>
              {rows.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {rows.map(({ label, value }, i) => (
                    <StatCard key={label} label={label} value={value} accent={accent} delay={i * 0.05} />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* dashboard grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">

              {/* LEFT — sticky form */}
              <div className="lg:sticky lg:top-6">
                <DashCard title={`${calculator.name} Inputs`} accent={accent}>
                  <div className="flex flex-col gap-5">

                    {calculator.fields.map((field, i) => (
                      <motion.div key={field.name}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:i*0.07, duration:0.22 }}>
                        <Field
                          field={field}
                          value={inputs[field.name]}
                          unit={units[field.name] ?? field.units?.[0]}
                          onInput={handleInput}
                          onUnit={handleUnit}
                          accent={accent}
                        />
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                          exit={{ opacity:0, height:0 }} className="text-xs text-red-500 dark:text-red-400">
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={handleCalculate} disabled={calculating} whileTap={{ scale:0.97 }}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:opacity-55 disabled:cursor-not-allowed"
                      style={{ background:`linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow:`0 4px 24px ${accent}35` }}>
                      {calculating ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                          </svg>
                          Calculating…
                        </>
                      ) : (
                        <><MdOutlineCalculate className="text-xl"/> Calculate</>
                      )}
                    </motion.button>
                  </div>
                </DashCard>

                {calculator.formula && (
                  <p className="mt-3 text-center font-mono text-xs text-gray-400 dark:text-white/20">
                    {calculator.formula}
                  </p>
                )}
              </div>

              {/* RIGHT — charts */}
              <div className="lg:col-span-2">
                {!hasCharts ? (
                  <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="flex flex-col items-center gap-3 text-center px-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background:`${accent}15` }}>
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-white/40">
                          Enter values and hit <span style={{ color:accent }}>Calculate</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-300 dark:text-white/20">
                          Charts and insights will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {charts.map(({ title, span, Chart }, i) => (
                      <motion.div key={title}
                        className={span === "full" ? "sm:col-span-2" : "col-span-1"}
                        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay:0.08+i*0.07, duration:0.28 }}>
                        <DashCard title={title} accent={accent}>
                          <Chart />
                        </DashCard>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
