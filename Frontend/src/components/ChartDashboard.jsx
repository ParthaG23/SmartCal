import { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
  LineController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
} from "chart.js";

ChartJS.register(
  ArcElement, BarElement, LineElement, PointElement, RadialLinearScale,
  CategoryScale, LinearScale, Filler, Tooltip, Legend,
  DoughnutController, BarController, LineController, RadarController,
  PolarAreaController, BubbleController, ScatterController
);

/* ─── Centre-text plugin ─── */
const centreTextPlugin = {
  id: "centreText",
  afterDraw(chart) {
    const ds = chart.data.datasets[0];
    if (!ds?._centre) return;
    const { ctx, chartArea: { width, height, top, left } } = chart;
    const cx = left + width / 2, cy = top + height / 2;
    ctx.save();
    ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = ds._centrecol ?? "#7c3aed";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(ds._centre, cx, ds._centresub ? cy - 12 : cy);
    if (ds._centresub) {
      ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
      // Use a concrete gray so subtitle is visible in both light and dark
      ctx.fillStyle = ds._subcolor ?? "rgba(100,90,130,0.75)";
      ctx.fillText(ds._centresub, cx, cy + 14);
    }
    ctx.restore();
  },
};
if (!ChartJS.registry.plugins.get("centreText")) ChartJS.register(centreTextPlugin);

/* ─── Color scheme hook ─── */
function useColorScheme() {
  return true; // Always return true for permanent dark mode
}

/* ─── Theme tokens ─── */
function getTheme(dark, accent) {
  return {
    dark,
    accent,
    accentLight: accent + "22",
    accentMid:   accent + "55",
    accentBold:  accent,

    // ── Stat cards ──────────────────────────────────────────
    statBg:          dark ? "rgba(255,255,255,0.05)" : "#ffffff",
    statBgHover:     dark ? "rgba(255,255,255,0.09)" : "#fafaff",
    statBorder:      dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.13)",
    statBorderHover: dark ? accent + "77"            : accent,
    // LIGHT FIX: solid opaque colors — opacity-based values become invisible on white
    statLabel:       dark ? "rgba(180,170,220,0.60)" : "#5a5280",
    statValue:       dark ? "rgba(235,228,255,0.95)" : "#0a0520",
    statShadow:      dark ? "none"
                          : "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.09)",
    statShadowHover: dark ? `0 8px 32px ${accent}22`
                          : `0 6px 20px ${accent}28, 0 0 0 1.5px ${accent}`,

    // ── Chart cards ─────────────────────────────────────────
    cardBg:          dark
      ? "linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)"
      : "#ffffff",
    cardBorder:      dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.12)",
    cardBorderHover: dark ? accent + "55"            : accent + "cc",
    cardShadow:      dark ? "0 4px 24px rgba(0,0,0,0.35)"
                          : "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.09)",
    cardShadowHover: dark ? `0 10px 40px ${accent}22`
                          : `0 8px 28px ${accent}30, 0 0 0 1.5px ${accent}cc`,
    cardTitle:       accent,
    shimmer:         dark ? accent + "55" : accent + "99",

    // ── Chart internals ─────────────────────────────────────
    // LIGHT FIX: grid was 0.06 (nearly invisible); bumped to 0.11
    grid:            dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.11)",
    // LIGHT FIX: ticks were 0.50 opacity on near-white — use solid dark value
    ticks:           dark ? "rgba(200,190,240,0.50)" : "#3d3060",
    legendText:      dark ? "rgba(180,170,220,0.60)" : "#4a3f70",
    divider:         dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)",

    // ── Radar-specific overrides ─────────────────────────────
    // RadialLinearScale uses separate grid/angleLines/pointLabels config.
    // These need to be stronger in light mode because the canvas bg is white.
    radarGrid:    dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.14)",
    radarAngle:   dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.20)",
    radarTick:    dark ? "rgba(200,190,240,0.45)" : "#7b6fa0",
    radarLabel:   dark ? "rgba(215,205,245,0.90)" : "#1e1040",

    // ── Tooltip ─────────────────────────────────────────────
    tooltipBg:     dark ? "#12101f" : "#ffffff",
    tooltipBorder: dark ? "rgba(180,160,255,0.22)" : "rgba(0,0,0,0.13)",
    tooltipTitle:  dark ? "rgba(235,225,255,0.92)" : "#0a0520",
    tooltipBody:   dark ? "rgba(180,170,220,0.65)" : "#4a3f70",

    // ── Misc ────────────────────────────────────────────────
    grayBar:      dark ? "rgba(100,116,139,0.55)" : "rgba(140,150,170,0.75)",
    grayBarSolid: dark ? "rgba(100,116,139,0.85)" : "rgba(100,110,130,0.90)",
    accentFill:   dark ? accent + "18" : accent + "22",
    // GAUGE FIX: light mode inactive arc was accent+"22" (cream on white = invisible).
    // Use a visible neutral gray so the contrast against the colored arc is clear.
    accentMuted:  dark ? accent + "30" : "rgba(0,0,0,0.09)",
    glowBg: dark
      ? `radial-gradient(circle at top right,${accent}22 0%,transparent 70%)`
      : `radial-gradient(circle at top right,${accent}10 0%,transparent 70%)`,

    anim: { duration: 900, easing: "easeOutQuart" },
  };
}

/* ─── Inline SVG icons ─── */
const ICONS = {
  pie:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  bar:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  area:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  gauge:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  trend:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  radar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/><line x1="2" y1="15.5" x2="22" y2="15.5"/></svg>,
  polar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  scatter:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="7" cy="12" r="1.5"/><circle cx="14" cy="8" r="1.5"/><circle cx="18" cy="16" r="1.5"/><circle cx="10" cy="17" r="1.5"/><circle cx="16" cy="5" r="1.5"/></svg>,
};

/* ─── Helpers ─── */
const inr    = (v) => `₹${Number(v).toLocaleString("en-IN")}`;
const fmtLbl = (raw) =>
  String(raw).replace(/_/g," ").replace(/([a-z])([A-Z])/g,"$1 $2")
    .replace(/\b\w/g,(c)=>c.toUpperCase()).trim();

/* ════════ STAT CARD ════════ */
function StatCard({ label, value, accent, th, index }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:18, scale:0.96 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay:index*0.07, duration:0.45, ease:[0.22,1,0.36,1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", borderRadius:"14px", padding:"16px 18px",
        background: hov ? th.statBgHover : th.statBg,
        border: `1.5px solid ${hov ? th.statBorderHover : th.statBorder}`,
        boxShadow: hov ? th.statShadowHover : th.statShadow,
        backdropFilter: th.dark ? "blur(14px)" : "none",
        WebkitBackdropFilter: th.dark ? "blur(14px)" : "none",
        cursor:"default", transition:"all 0.28s ease", overflow:"hidden",
      }}
    >
      <div style={{ position:"absolute",top:0,right:0,width:"70px",height:"70px",
        background:th.glowBg, pointerEvents:"none" }}/>
      {/* accent top-line accent strip on hover */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"2px",
        background:`linear-gradient(90deg,transparent,${accent},transparent)`,
        opacity: hov ? 1 : 0, transition:"opacity 0.28s ease",
      }}/>
      <p style={{
        margin:0, fontSize:"10px", fontWeight:700, letterSpacing:"0.11em",
        textTransform:"uppercase", color: th.statLabel,
        fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:"8px",
      }}>{label}</p>
      <p style={{
        margin:0, fontSize:"19px", fontWeight:800,
        color: hov ? accent : th.statValue,
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        letterSpacing:"-0.025em", lineHeight:1.15,
        transition:"color 0.25s ease",
      }}>{value}</p>
    </motion.div>
  );
}

/* ════════ DASH CARD ════════ */
function DashCard({ title, icon="bar", th, delay=0, span="1", children }) {
  const [hov, setHov] = useState(false);
  const IconEl = ICONS[icon] ?? ICONS.bar;
  return (
    <motion.div
      initial={{ opacity:0, y:22 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: span==="2" ? "span 2" : "span 1",
        borderRadius:"18px",
        border:`1.5px solid ${hov ? th.cardBorderHover : th.cardBorder}`,
        background: th.cardBg,
        backdropFilter: th.dark ? "blur(16px)" : "none",
        WebkitBackdropFilter: th.dark ? "blur(16px)" : "none",
        overflow:"hidden", display:"flex", flexDirection:"column",
        transition:"border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hov ? th.cardShadowHover : th.cardShadow,
        position:"relative",
      }}
    >
      {/* shimmer top border */}
      <div style={{
        position:"absolute",top:0,left:"8%",right:"8%",height:"1px",
        background:`linear-gradient(90deg,transparent,${th.shimmer},transparent)`,
        opacity: hov ? 1 : 0.45, transition:"opacity 0.3s ease",
      }}/>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"9px",
        padding:"13px 16px", borderBottom:`1px solid ${th.cardBorder}` }}>
        <div style={{
          width:"26px", height:"26px", borderRadius:"8px",
          background:`linear-gradient(135deg,${th.accent}28,${th.accent}12)`,
          border:`1px solid ${th.accent}30`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:th.accent, flexShrink:0,
        }}>{IconEl}</div>
        <span style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.13em",
          textTransform:"uppercase", color:th.cardTitle,
          fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          {title}
        </span>
      </div>
      <div style={{ flex:1, padding:"14px 16px 16px" }}>{children}</div>
    </motion.div>
  );
}

/* ════════ CANVAS CHART ════════ */
function ChartCanvas({ id, height=220, config }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !config) return;
    const existing = ChartJS.getChart(ref.current);
    if (existing) existing.destroy();
    const inst = new ChartJS(ref.current, config);
    return () => inst.destroy();
  }, [config]);
  return (
    <div style={{ position:"relative", width:"100%", height }}>
      <canvas ref={ref} id={id}/>
    </div>
  );
}

/* ─── Legend pills ─── */
function ChartLegend({ items, th }) {
  return (
    <div style={{ marginTop:"12px", display:"flex", flexWrap:"wrap",
      justifyContent:"center", gap:"5px 16px" }}>
      {items.map(({ label, color }) => (
        <span key={label} style={{ display:"flex", alignItems:"center", gap:"6px",
          fontSize:"10px", color:th.legendText,
          fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"0.04em" }}>
          <span style={{ width:"8px",height:"8px",borderRadius:"3px",
            background:color,flexShrink:0 }}/>
          {label}
        </span>
      ))}
    </div>
  );
}

/* ─── Section divider ─── */
function SectionDivider({ th }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:"10px",margin:"6px 0" }}>
      <div style={{ flex:1,height:"1px",background:th.divider }}/>
      <div style={{ width:"6px",height:"6px",borderRadius:"50%",
        background:th.accent,boxShadow:`0 0 8px ${th.accent}99`,flexShrink:0 }}/>
      <div style={{ flex:1,height:"1px",background:th.divider }}/>
    </div>
  );
}

/* ════════ CHART CONFIG BUILDERS ════════ */
function buildCharts(slug, inputs, result, th) {
  const { accent, accentFill, accentMuted, grid, ticks, anim,
          tooltipBg, tooltipBorder, tooltipTitle, tooltipBody,
          grayBar, grayBarSolid, dark } = th;

  const tooltip = {
    backgroundColor:tooltipBg, borderColor:tooltipBorder, borderWidth:1,
    titleColor:tooltipTitle, bodyColor:tooltipBody,
    padding:12, cornerRadius:12, boxPadding:6,
    titleFont:{ family:"'Plus Jakarta Sans',sans-serif",weight:"700",size:12 },
    bodyFont: { family:"'Plus Jakarta Sans',sans-serif",size:11 },
  };

  const xScale = (extra={}) => ({
    grid:{ color:grid,drawTicks:false },
    ticks:{ color:ticks,font:{ size:10.5,family:"'Plus Jakarta Sans',sans-serif" },padding:6,...extra },
    border:{ display:false },
  });
  const yScale = (cb,extra={}) => ({
    grid:{ color:grid,drawTicks:false },
    ticks:{ color:ticks,font:{ size:10.5,family:"'Plus Jakarta Sans',sans-serif" },padding:8,callback:cb,...extra },
    border:{ display:false },
  });

  // ── palette helpers ──
  const PALETTE = [accent,"#f59e0b","#22c55e","#ec4899","#06b6d4","#a855f7","#f97316","#14b8a6"];
  const hexAlpha = (hex, a) => hex + Math.round(a*255).toString(16).padStart(2,"0");

  // ── Config factories ──
  const donutCfg = ({ labels, data, colors, centre, centresub }) => ({
    type:"doughnut",
    data:{ labels, datasets:[{ data, backgroundColor:colors, borderWidth:0,
      hoverOffset:10, _centre:centre, _centresub:centresub, _centrecol:colors[0] }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:"70%",
      animation:{ ...anim, animateRotate:true },
      plugins:{ legend:{ display:false },
        tooltip:{ ...tooltip, callbacks:{ label:(d)=>inr(d.raw) } } } },
    plugins:[centreTextPlugin],
  });

  const areaCfg = ({ labels, datasets, yFmt }) => ({
    type:"line",
    data:{ labels, datasets:datasets.map(ds=>({
      tension:0.42, borderWidth:2.5, pointRadius:0,
      pointHoverRadius:6, pointHoverBorderWidth:2,
      pointHoverBorderColor: dark ? "#1a1530" : "#ffffff",
      fill:true, ...ds })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      interaction:{ mode:"index",intersect:false },
      plugins:{ legend:{ display:false }, tooltip },
      scales:{ x:xScale({ autoSkip:true,maxTicksLimit:8 }), y:yScale(yFmt??((v)=>v)) } },
  });

  const stackedCfg = ({ labels, datasets, yFmt }) => ({
    type:"bar",
    data:{ labels, datasets:datasets.map((ds,i)=>({
      borderRadius: i===0
        ? { topLeft:0,topRight:0,bottomLeft:6,bottomRight:6 }
        : { topLeft:6,topRight:6,bottomLeft:0,bottomRight:0 },
      borderSkipped:false, stack:"a", ...ds })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      interaction:{ mode:"index",intersect:false },
      plugins:{ legend:{ display:false }, tooltip },
      scales:{ x:{ ...xScale(),stacked:true }, y:{ ...yScale(yFmt??((v)=>v)),stacked:true } } },
  });

  const barCfg = ({ labels, data, colors, yFmt }) => ({
    type:"bar",
    data:{ labels, datasets:[{ data, backgroundColor:colors??accent,
      borderRadius:7, borderSkipped:false }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      plugins:{ legend:{ display:false }, tooltip },
      scales:{ x:xScale(), y:yScale(yFmt??((v)=>v)) } },
  });

  const radialCfg = ({ pct, label, sub }) => ({
    type:"doughnut",
    data:{ datasets:[{ data:[Math.min(pct,100),Math.max(0,100-pct)],
      // GAUGE FIX: accentMuted is now a neutral gray in light mode so the inactive
      // arc is clearly visible against the white card background
      backgroundColor:[accent, accentMuted], borderWidth:0,
      _centre:label, _centresub:sub, _centrecol:accent }] },
    options:{ responsive:true, maintainAspectRatio:false,
      circumference:240, rotation:-120, cutout:"74%",
      animation:{ ...anim, animateRotate:true },
      plugins:{ legend:{ display:false }, tooltip:{ enabled:false } } },
    plugins:[centreTextPlugin],
  });

  // ── Radar chart — uses dedicated radarGrid/radarAngle/radarLabel tokens ──
  const radarCfg = ({ labels, datasets }) => ({
    type:"radar",
    data:{ labels, datasets:datasets.map((ds,i)=>({
      borderWidth:2.5, pointRadius:5, pointHoverRadius:7,
      borderColor:PALETTE[i],
      backgroundColor:hexAlpha(PALETTE[i], dark ? 0.14 : 0.10),
      pointBackgroundColor:PALETTE[i],
      // RADAR FIX: point border must contrast against both dark and light card bg
      pointBorderColor: dark ? "#1a1530" : "#ffffff",
      pointBorderWidth:2, ...ds })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      plugins:{ legend:{ display:false }, tooltip },
      scales:{ r:{
        // RADAR FIX: use stronger grid/angleLines colors in light mode
        grid:       { color: th.radarGrid },
        angleLines: { color: th.radarAngle },
        ticks:{
          color: th.radarTick,
          font:{ size:9.5, family:"'Plus Jakarta Sans',sans-serif" },
          backdropColor:"transparent",
          stepSize:20,
        },
        // RADAR FIX: pointLabels (the outer axis names) were nearly invisible
        // in light mode — now use solid dark color
        pointLabels:{
          color: th.radarLabel,
          font:{ size:11, family:"'Plus Jakarta Sans',sans-serif", weight:"600" },
        },
      } } },
  });

  // ── Polar area chart ──
  const polarCfg = ({ labels, data, colors }) => ({
    type:"polarArea",
    data:{ labels, datasets:[{
      data,
      backgroundColor:colors.map(c=>hexAlpha(c, dark ? 0.72 : 0.65)),
      borderColor:colors,
      borderWidth: dark ? 1.5 : 2,
      hoverBackgroundColor:colors.map(c=>hexAlpha(c,0.88)) }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      plugins:{ legend:{ display:false }, tooltip },
      scales:{ r:{
        grid:{ color: th.radarGrid },
        ticks:{ display:false },
        startAngle:-60,
      } } },
  });

  // ── NEW: Scatter chart ──
  const scatterCfg = ({ datasets, xLabel, yLabel }) => ({
    type:"scatter",
    data:{ datasets:datasets.map((ds,i)=>({
      backgroundColor:hexAlpha(PALETTE[i],0.75),
      borderColor:PALETTE[i], borderWidth:1.5,
      pointRadius:6, pointHoverRadius:8, ...ds })) },
    options:{ responsive:true, maintainAspectRatio:false, animation:anim,
      plugins:{ legend:{ display:false }, tooltip },
      scales:{
        x:{ ...xScale(), title:{ display:!!xLabel,text:xLabel,color:ticks,font:{ size:10.5,family:"'Plus Jakarta Sans',sans-serif" } } },
        y:{ ...yScale(v=>v), title:{ display:!!yLabel,text:yLabel,color:ticks,font:{ size:10.5,family:"'Plus Jakarta Sans',sans-serif" } } },
      } },
  });

  const C = (title,id,icon,span,height,config,legendItems) =>
    ({ title,id,icon,span,height,config,legendItems });

  /* ═══ EMI ═══ */
  if (slug==="emi") {
    const loan   = parseFloat(inputs.loan??inputs.principal??inputs.amount);
    const rate   = parseFloat(inputs.rate??inputs.interest);
    const tenure = parseFloat(inputs.tenure??inputs.months);
    if (!loan||!rate||!tenure) return { stats:[],charts:[] };
    const r=rate/(12*100);
    const emi=(loan*r*Math.pow(1+r,tenure))/(Math.pow(1+r,tenure)-1);
    const totalInt=emi*tenure-loan;

    const yearly=Array.from({length:Math.min(Math.ceil(tenure/12),20)},(_,yr)=>{
      const paid=emi*Math.min(12,tenure-yr*12);
      const intPd=paid*(totalInt/(emi*tenure));
      return { yr:`Y${yr+1}`,p:Math.round(paid-intPd),i:Math.round(intPd) };
    });

    const balances=[];let bal=loan;
    const step=Math.max(1,Math.floor(tenure/24));
    for(let m=0;m<=tenure;m+=step){
      balances.push({ m:m===0?"Start":`M${m}`,v:Math.round(Math.max(0,bal)) });
      for(let s=0;s<step&&m+s<tenure;s++) bal-=emi-bal*r;
    }

    // Scatter: month vs outstanding balance (sample points)
    const scatterPts=[]; let b2=loan;
    for(let m=0;m<=tenure;m+=Math.max(1,Math.floor(tenure/30))){
      scatterPts.push({ x:m, y:Math.round(Math.max(0,b2)) });
      for(let s=0;s<Math.max(1,Math.floor(tenure/30))&&m+s<tenure;s++) b2-=emi-b2*r;
    }

    return {
      stats:[
        { label:"Monthly EMI",    value:inr(Math.round(emi)) },
        { label:"Total Payment",  value:inr(Math.round(emi*tenure)) },
        { label:"Total Interest", value:inr(Math.round(totalInt)) },
        { label:"Interest Ratio", value:`${((totalInt/(loan+totalInt))*100).toFixed(1)}%` },
      ],
      charts:[
        C("Principal vs Interest","emi-donut","pie","1",230,
          donutCfg({ labels:["Principal","Interest"],data:[Math.round(loan),Math.round(totalInt)],
            colors:[accent,"#f59e0b"],centre:inr(Math.round(emi)),centresub:"/ month" }),
          [{ label:"Principal",color:accent },{ label:"Interest",color:"#f59e0b" }]),
        C("Balance Decline","emi-bal","area","1",220,
          areaCfg({ labels:balances.map(b=>b.m),datasets:[{ label:"Balance",data:balances.map(b=>b.v),
            borderColor:"#22c55e",backgroundColor:"rgba(34,197,94,0.10)",pointHoverBackgroundColor:"#22c55e" }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` })),
        C("Yearly Breakdown","emi-stack","layers","2",210,
          stackedCfg({ labels:yearly.map(y=>y.yr),datasets:[
            { label:"Principal",data:yearly.map(y=>y.p),backgroundColor:grayBar },
            { label:"Interest", data:yearly.map(y=>y.i),backgroundColor:accent }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` }),
          [{ label:"Principal",color:grayBarSolid },{ label:"Interest",color:accent }]),
        C("Balance Scatter","emi-scatter","scatter","2",210,
          scatterCfg({ datasets:[{ label:"Outstanding", data:scatterPts }],xLabel:"Month",yLabel:"Balance (₹)" })),
      ],
    };
  }

  /* ═══ Compound Interest ═══ */
  if (slug==="compoundInterest") {
    const p=parseFloat(inputs.principal??inputs.p);
    const r=parseFloat(inputs.rate??inputs.r);
    const time=parseFloat(inputs.time??inputs.t);
    const n=parseFloat(inputs.n)||12;
    if (!p||!r||!time) return { stats:[],charts:[] };
    const final=p*Math.pow(1+r/100/n,n*time);
    const interest=final-p;
    const years=Array.from({length:Math.min(Math.ceil(time),30)+1},(_,yr)=>({
      yr:`Y${yr}`,total:Math.round(p*Math.pow(1+r/100/n,n*yr)),principal:Math.round(p) }));
    const freqComp=[1,2,4,12].map(f=>({
      label:{1:"Annual",2:"Semi",4:"Quarterly",12:"Monthly"}[f],
      amt:Math.round(p*Math.pow(1+r/100/f,f*time)) }));

    // Radar: compare growth at different rate scenarios
    const rateScenarios=[r*0.5,r*0.75,r,r*1.25,r*1.5].map(rv=>{
      const fv=p*Math.pow(1+rv/100/n,n*time);
      return { rate:rv.toFixed(1), final:Math.round(fv), interest:Math.round(fv-p) };
    });

    return {
      stats:[
        { label:"Final Amount",   value:inr(Math.round(final)) },
        { label:"Total Interest", value:inr(Math.round(interest)) },
        { label:"Principal",      value:inr(Math.round(p)) },
        { label:"Growth",         value:`${((interest/p)*100).toFixed(1)}%` },
      ],
      charts:[
        C("Growth Over Time","ci-area","area","2",220,
          areaCfg({ labels:years.map(y=>y.yr),datasets:[
            { label:"Total",data:years.map(y=>y.total),borderColor:accent,backgroundColor:accentFill,pointHoverBackgroundColor:accent },
            { label:"Principal",data:years.map(y=>y.principal),borderColor:grayBarSolid,backgroundColor:"transparent",borderDash:[5,4] }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` }),
          [{ label:"Total",color:accent },{ label:"Principal",color:grayBarSolid }]),
        C("Principal vs Interest","ci-donut","pie","1",220,
          donutCfg({ labels:["Principal","Interest"],data:[Math.round(p),Math.round(interest)],
            colors:[grayBar,accent],centre:`${((interest/p)*100).toFixed(0)}%`,centresub:"growth" }),
          [{ label:"Principal",color:grayBarSolid },{ label:"Interest",color:accent }]),
        C("Compounding Frequency","ci-freq","polar","1",210,
          polarCfg({ labels:freqComp.map(f=>f.label),data:freqComp.map(f=>f.amt),
            colors:[accent,"#22c55e","#f59e0b","#ec4899"] }),
          freqComp.map((f,i)=>({ label:f.label,color:[accent,"#22c55e","#f59e0b","#ec4899"][i] }))),
        C("Rate Sensitivity Scatter","ci-scatter","scatter","2",210,
          scatterCfg({ datasets:[
            { label:"Final Value",data:rateScenarios.map(s=>({x:parseFloat(s.rate),y:s.final})),backgroundColor:hexAlpha(accent,0.75),borderColor:accent },
            { label:"Interest Earned",data:rateScenarios.map(s=>({x:parseFloat(s.rate),y:s.interest})),backgroundColor:hexAlpha("#22c55e",0.75),borderColor:"#22c55e" },
          ],xLabel:"Rate (%)",yLabel:"Amount (₹)" }),
          [{ label:"Final Value",color:accent },{ label:"Interest Earned",color:"#22c55e" }]),
      ],
    };
  }

  /* ═══ Simple Interest ═══ */
  if (slug==="simpleInterest") {
    const p=parseFloat(inputs.principal??inputs.p);
    const r=parseFloat(inputs.rate??inputs.r);
    const time=parseFloat(inputs.time??inputs.t);
    if (!p||!r||!time) return { stats:[],charts:[] };
    const totalInt=(p*r*time)/100;
    const years=Array.from({length:Math.min(Math.ceil(time),25)},(_,i)=>({
      yr:`Y${i+1}`,p:Math.round(p),i:Math.round((p*r*(i+1))/100) }));

    const radarData = {
      labels:["Principal","Interest","Total","Growth %","Years"],
      datasets:[{
        label:"Overview",
        data:[
          (p/(p+totalInt))*100,
          (totalInt/(p+totalInt))*100,
          Math.min(((p+totalInt)/p)*10,100),
          Math.min(((totalInt/p)*100)/2,100),
          Math.min((time/20)*100,100),
        ],
      }]
    };

    return {
      stats:[
        { label:"Total Interest",value:inr(Math.round(totalInt)) },
        { label:"Final Amount",  value:inr(Math.round(p+totalInt)) },
        { label:"Principal",     value:inr(Math.round(p)) },
        { label:"Rate",          value:`${r}%` },
      ],
      charts:[
        C("Year by Year Growth","si-stack","layers","2",210,
          stackedCfg({ labels:years.map(y=>y.yr),datasets:[
            { label:"Principal",data:years.map(y=>y.p),backgroundColor:grayBar },
            { label:"Interest", data:years.map(y=>y.i),backgroundColor:accent }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` }),
          [{ label:"Principal",color:grayBarSolid },{ label:"Interest",color:accent }]),
        C("Metric Radar","si-radar","radar","1",220,radarCfg(radarData)),
        C("Interest Accumulation","si-area","area","1",210,
          areaCfg({ labels:years.map(y=>y.yr),datasets:[{ label:"Interest",data:years.map(y=>y.i),
            borderColor:accent,backgroundColor:accentFill,pointHoverBackgroundColor:accent }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` })),
      ],
    };
  }

  /* ═══ BMI ═══ */
  if (slug==="bmi") {
    const bmi=parseFloat(typeof result==="object"?result.bmi??Object.values(result)[0]:result);
    const h=parseFloat(inputs.height??inputs.h);
    if (!bmi) return { stats:[],charts:[] };
    const zones=[
      { name:"Under",  range:"< 18.5",color:"#60a5fa",min:10,  max:18.5 },
      { name:"Normal", range:"18.5–25",color:"#4ade80",min:18.5,max:25  },
      { name:"Over",   range:"25–30",  color:"#fb923c",min:25,  max:30  },
      { name:"Obese",  range:"> 30",   color:"#f87171",min:30,  max:40  },
    ];
    const active=zones.find(z=>bmi>=z.min&&bmi<z.max)??zones[3];
    const pct=Math.min(Math.max(((bmi-10)/30)*100,0),100);
    const wtRange=h?Array.from({length:7},(_,i)=>{const b=15+i*4;return{bmi:b,w:+(b*(h/100)**2).toFixed(1)};}):[];

    // Radar: health metrics (normalized 0-100)
    const radarData = {
      labels:["BMI Score","Healthy Zone","Zone Distance","Height Factor"],
      datasets:[{
        label:"Health Profile",
        data:[
          Math.min((bmi/40)*100,100),
          active.name==="Normal"?100:50,
          Math.min(Math.abs(bmi-21.75)*10,100),
          h?Math.min((h/200)*100,100):50,
        ]
      }]
    };

    return {
      stats:[
        { label:"Your BMI", value:bmi.toFixed(1) },
        { label:"Category", value:active.name },
        { label:"Height",   value:h?`${h} cm`:"—" },
        { label:"Range",    value:active.range },
      ],
      charts:[
        C("BMI Gauge","bmi-gauge","gauge","1",220,radialCfg({ pct,label:bmi.toFixed(1),sub:"BMI" })),
        C("Zone Overview","bmi-polar","polar","1",210,
          polarCfg({ labels:zones.map(z=>z.name),data:zones.map(z=>z.max-z.min),colors:zones.map(z=>z.color) }),
          zones.map(z=>({ label:z.name,color:z.color }))),
        C("Health Radar","bmi-radar","radar","1",220,radarCfg(radarData)),
        ...(wtRange.length?[
          C("Weight vs BMI at Your Height","bmi-wt","scatter","1",210,
            scatterCfg({ datasets:[{ label:"Weight",data:wtRange.map(r=>({x:r.bmi,y:r.w})),backgroundColor:hexAlpha(accent,0.75),borderColor:accent }],xLabel:"BMI",yLabel:"Weight (kg)" }))
        ]:[]),
      ],
    };
  }

  /* ═══ Age ═══ */
  if (slug==="age") {
    const age=parseFloat(typeof result==="object"?result.years:result);
    if (!age) return { stats:[],charts:[] };
    const decades=Array.from({length:9},(_,i)=>({ d:`${i*10}s`,v:age>=(i+1)*10?10:Math.max(0,age-i*10) }));
    const milestones=[5,10,18,21,25,30,40,50,60,70,80].map(m=>({ m,r:age>=m?1:0 }));

    const radarData={
      labels:["Childhood","Teen","Young Adult","Adult","Middle Age"],
      datasets:[{
        label:"Life Stage",
        data:[
          Math.min((Math.min(age,12)/12)*100,100),
          age>=13?Math.min(((Math.min(age,19)-13)/6)*100,100):0,
          age>=20?Math.min(((Math.min(age,35)-20)/15)*100,100):0,
          age>=36?Math.min(((Math.min(age,55)-36)/19)*100,100):0,
          age>=56?Math.min(((age-56)/24)*100,100):0,
        ]
      }]
    };

    return {
      stats:[
        { label:"Age",         value:`${Math.floor(age)} yrs` },
        { label:"Months",      value:`${Math.floor(age*12)}` },
        { label:"Days",        value:Math.floor(age*365).toLocaleString() },
        { label:"Next Decade", value:`${(Math.ceil(age/10)*10-age).toFixed(1)} yrs` },
      ],
      charts:[
        C("Age Gauge","age-gauge","gauge","1",220,
          radialCfg({ pct:Math.min((age/80)*100,100),label:Math.floor(age).toString(),sub:"years old" })),
        C("Life Stage Radar","age-radar","radar","1",210,radarCfg(radarData)),
        C("Life by Decade","age-dec","bar","2",200,
          barCfg({ labels:decades.map(d=>d.d),data:decades.map(d=>d.v),
            colors:decades.map(d=>d.v>=10?accent:accentMuted),yFmt:(v)=>`${v}y` })),
        C("Milestones","age-mil","polar","2",130,
          polarCfg({ labels:milestones.map(m=>`${m.m}yr`),data:milestones.map(m=>m.r+0.5),
            colors:milestones.map(m=>m.m<=age?"#4ade80":grayBar) })),
      ],
    };
  }

  /* ═══ Discount ═══ */
  if (slug==="discount") {
    const original=parseFloat(inputs.originalPrice??inputs.original??inputs.price??inputs.amount);
    const pct=parseFloat(inputs.discount??inputs.percentage??inputs.percent);
    if (!original||!pct) return { stats:[],charts:[] };
    const saved=(original*pct)/100;
    const steps=[5,10,15,20,25,30,40,50].map(d=>({ d:`${d}%`,s:Math.round(original*d/100) }));
    const scatterPts=steps.map(s=>({ x:parseInt(s.d),y:s.s }));
    return {
      stats:[
        { label:"Final Price",value:inr(Math.round(original-saved)) },
        { label:"You Save",   value:inr(Math.round(saved)) },
        { label:"Discount",   value:`${pct}%` },
        { label:"Original",   value:inr(Math.round(original)) },
      ],
      charts:[
        C("Savings Breakdown","disc-donut","pie","1",220,
          donutCfg({ labels:["You Pay","You Save"],data:[Math.round(original-saved),Math.round(saved)],
            colors:[accent,"#4ade80"],centre:`${pct}%`,centresub:"off" }),
          [{ label:"You pay",color:accent },{ label:"You save",color:"#4ade80" }]),
        C("Polar — Savings at Each Discount","disc-polar","polar","1",210,
          polarCfg({ labels:steps.map(s=>s.d),data:steps.map(s=>s.s),colors:PALETTE }),
          steps.map((s,i)=>({ label:s.d,color:PALETTE[i%PALETTE.length] }))),
        C("Savings Curve","disc-scatter","scatter","2",210,
          scatterCfg({ datasets:[{ label:"Savings",data:scatterPts,backgroundColor:hexAlpha(accent,0.75),borderColor:accent }],xLabel:"Discount %",yLabel:"Savings (₹)" })),
      ],
    };
  }

  /* ═══ GST ═══ */
  if (slug==="gst") {
    const amount=parseFloat(inputs.amount??inputs.price);
    const rate=parseFloat(inputs.gstRate??inputs.rate??inputs.gst);
    if (!amount||!rate) return { stats:[],charts:[] };
    const gst=(amount*rate)/100;
    const slabs=[5,12,18,28].map(r=>({ r:`${r}%`,gst:Math.round(amount*r/100),base:Math.round(amount) }));
    return {
      stats:[
        { label:"Base Amount",value:inr(Math.round(amount)) },
        { label:"GST",        value:inr(Math.round(gst)) },
        { label:"Total",      value:inr(Math.round(amount+gst)) },
        { label:"Rate",       value:`${rate}%` },
      ],
      charts:[
        C("Tax Breakdown","gst-donut","pie","1",220,
          donutCfg({ labels:["Base","GST"],data:[Math.round(amount),Math.round(gst)],
            colors:[grayBar,accent],centre:inr(Math.round(amount+gst)),centresub:"total" }),
          [{ label:"Base",color:grayBarSolid },{ label:"GST",color:accent }]),
        C("GST Polar — All Slabs","gst-polar","polar","1",210,
          polarCfg({ labels:slabs.map(s=>s.r),data:slabs.map(s=>s.gst),
            colors:[accent,"#f59e0b","#22c55e","#ec4899"] }),
          slabs.map((s,i)=>({ label:s.r,color:[accent,"#f59e0b","#22c55e","#ec4899"][i] }))),
        C("Slab Comparison","gst-slabs","layers","2",210,
          stackedCfg({ labels:slabs.map(s=>s.r),datasets:[
            { label:"Base",data:slabs.map(s=>s.base),backgroundColor:grayBar },
            { label:"GST", data:slabs.map(s=>s.gst), backgroundColor:accent }],
            yFmt:(v)=>`₹${(v/1000).toFixed(0)}k` }),
          [{ label:"Base",color:grayBarSolid },{ label:"GST",color:accent }]),
      ],
    };
  }

  /* ═══ Percentage ═══ */
  if (slug==="percentage") {
    const value=parseFloat(inputs.value??inputs.part??inputs.x);
    const total=parseFloat(inputs.total??inputs.whole??inputs.y);
    if (!value||!total) return { stats:[],charts:[] };
    const pct=(value/total)*100;
    const bar10=[10,20,30,40,50,60,70,80,90,100].map(p=>({ p:`${p}%`,v:Math.round(total*p/100) }));
    return {
      stats:[
        { label:"Percentage",value:`${pct.toFixed(2)}%` },
        { label:"Part",      value:value.toLocaleString() },
        { label:"Total",     value:total.toLocaleString() },
        { label:"Remainder", value:Math.round(total-value).toLocaleString() },
      ],
      charts:[
        C("Percentage Gauge","pct-gauge","gauge","1",220,
          radialCfg({ pct:Math.min(pct,100),label:`${pct.toFixed(1)}%`,sub:"of total" })),
        C("Part vs Whole","pct-donut","pie","1",220,
          donutCfg({ labels:["Part","Remainder"],data:[Math.round(value),Math.round(total-value)],
            colors:[accent,grayBar],centre:`${pct.toFixed(1)}%`,centresub:"of total" }),
          [{ label:"Part",color:accent },{ label:"Remainder",color:grayBarSolid }]),
        C("Value at Each Percentage","pct-bar","bar","2",210,
          barCfg({ labels:bar10.map(b=>b.p),data:bar10.map(b=>b.v),
            colors:bar10.map((_,i)=>hexAlpha(accent,0.35+i*0.07)) })),
      ],
    };
  }

  /* ═══ Temperature ═══ */
  if (slug==="temperature") {
    const c=typeof result==="object"
      ?parseFloat(result.celsius??Object.values(result)[0]):parseFloat(result);
    if (c===undefined||isNaN(c)) return { stats:[],charts:[] };
    const f=c*9/5+32; const k=c+273.15;
    const range=Array.from({length:11},(_,i)=>{const cv=c-50+i*10;return{t:`${cv.toFixed(0)}°C`,C:cv,F:+(cv*9/5+32).toFixed(1)};});
    return {
      stats:[
        { label:"Celsius",    value:`${c.toFixed(1)}°C` },
        { label:"Fahrenheit", value:`${f.toFixed(1)}°F` },
        { label:"Kelvin",     value:`${k.toFixed(2)} K` },
        { label:"Status",     value:c<0?"Freezing":c<20?"Cool":c<37?"Warm":"Hot" },
      ],
      charts:[
        C("All Scales","temp-polar","polar","1",210,
          polarCfg({ labels:["°C","°F","K (÷10)"],
            data:[Math.abs(c)||1,Math.abs(f)||1,Math.abs(k/10)||1],
            colors:["#60a5fa",accent,"#a855f7"] }),
          [{ label:"°C",color:"#60a5fa" },{ label:"°F",color:accent },{ label:"K",color:"#a855f7" }]),
        C("°C vs °F Curve","temp-curve","area","1",210,
          areaCfg({ labels:range.map(r=>r.t),datasets:[
            { label:"°C",data:range.map(r=>r.C),borderColor:"#60a5fa",backgroundColor:"rgba(96,165,250,0.08)",pointHoverBackgroundColor:"#60a5fa" },
            { label:"°F",data:range.map(r=>r.F),borderColor:accent,backgroundColor:accentFill,pointHoverBackgroundColor:accent }] }),
          [{ label:"°C",color:"#60a5fa" },{ label:"°F",color:accent }]),
        C("Scatter — °C vs °F","temp-scatter","scatter","2",210,
          scatterCfg({ datasets:[{ label:"Temp Points",data:range.map(r=>({x:r.C,y:r.F})),backgroundColor:hexAlpha(accent,0.75),borderColor:accent }],xLabel:"°C",yLabel:"°F" })),
      ],
    };
  }

  /* ═══ Fuel Cost ═══ */
  if (slug==="fuelCost") {
    const dist=parseFloat(inputs.distance??inputs.km);
    const mile=parseFloat(inputs.mileage??inputs.efficiency);
    const price=parseFloat(inputs.fuelPrice??inputs.price);
    if (!dist||!mile||!price) return { stats:[],charts:[] };
    const totalCost=(dist/mile)*price;
    const litres=dist/mile;
    const steps=Array.from({length:6},(_,i)=>{const d=Math.round((dist/6)*(i+1));return{km:`${d}km`,cost:Math.round((d/mile)*price)};});
    const priceRange=[80,90,100,110,120,130].map(p=>({ p:`₹${p}`,c:Math.round((dist/mile)*p) }));
    const mileageRange=[8,10,12,15,18,20,25].map(m=>({ m:`${m}`,c:Math.round((dist/m)*price) }));

    // Radar: efficiency profile
    const radarData={
      labels:["Distance","Mileage","Fuel Cost","Efficiency","Economy"],
      datasets:[{
        label:"Trip Profile",
        data:[
          Math.min((dist/500)*100,100),
          Math.min((mile/30)*100,100),
          Math.max(0,100-((price-80)/50)*100),
          Math.min((mile/20)*100,100),
          Math.max(0,100-((totalCost/5000)*100)),
        ]
      }]
    };

    return {
      stats:[
        { label:"Trip Cost",value:inr(Math.round(totalCost)) },
        { label:"Fuel Used",value:`${litres.toFixed(1)} L` },
        { label:"Distance", value:`${dist} km` },
        { label:"Mileage",  value:`${mile} km/L` },
      ],
      charts:[
        C("Cost vs Distance","fuel-area","area","2",220,
          areaCfg({ labels:steps.map(s=>s.km),datasets:[{ label:"Cost",data:steps.map(s=>s.cost),
            borderColor:accent,backgroundColor:accentFill,pointHoverBackgroundColor:accent }],yFmt:(v)=>inr(v) })),
        C("Trip Efficiency Radar","fuel-radar","radar","1",220,radarCfg(radarData)),
        C("Mileage Sensitivity","fuel-scatter","scatter","1",210,
          scatterCfg({ datasets:[{ label:"Cost vs Mileage",data:mileageRange.map(m=>({x:parseFloat(m.m),y:m.c})),backgroundColor:hexAlpha(accent,0.75),borderColor:accent }],xLabel:"km/L",yLabel:"Trip Cost (₹)" })),
        C("Price Sensitivity","fuel-polar","polar","2",190,
          polarCfg({ labels:priceRange.map(p=>p.p),data:priceRange.map(p=>p.c),colors:PALETTE }),
          priceRange.map((p,i)=>({ label:p.p,color:PALETTE[i%PALETTE.length] }))),
      ],
    };
  }

  /* ═══ Average ═══ */
  if (slug==="average") {
    const raw=inputs.numbers??inputs.values??inputs.nums??"";
    const arr=String(raw).split(/[\s,]+/).map(Number).filter(n=>!isNaN(n));
    if (arr.length<2) return { stats:[],charts:[] };
    const avg=arr.reduce((a,b)=>a+b,0)/arr.length;
    const sorted=[...arr].sort((a,b)=>a-b);
    const deviations=sorted.map((v,i)=>({ i:i+1,v,dev:+(v-avg).toFixed(2) }));
    const scatterPts=arr.map((v,i)=>({ x:i+1,y:v }));
    return {
      stats:[
        { label:"Average",value:avg.toFixed(2) },
        { label:"Min",    value:sorted[0] },
        { label:"Max",    value:sorted[sorted.length-1] },
        { label:"Count",  value:arr.length },
      ],
      charts:[
        C("Values with Average","avg-main","bar","2",210,
          barCfg({ labels:arr.map((_,i)=>`#${i+1}`),data:arr,
            colors:arr.map(v=>Math.abs(v-avg)<0.001?"#4ade80":accent) })),
        C("Distribution Scatter","avg-scatter","scatter","1",200,
          scatterCfg({ datasets:[
            { label:"Values",data:scatterPts,backgroundColor:hexAlpha(accent,0.75),borderColor:accent },
            { label:"Avg",data:[{x:1,y:avg},{x:arr.length,y:avg}],backgroundColor:"#4ade80",borderColor:"#4ade80",showLine:true,borderDash:[5,4],pointRadius:0 },
          ],xLabel:"Index",yLabel:"Value" }),
          [{ label:"Values",color:accent },{ label:"Average",color:"#4ade80" }]),
        C("Deviation from Mean","avg-dev","bar","1",200,
          barCfg({ labels:deviations.map(d=>`#${d.i}`),data:deviations.map(d=>d.dev),
            colors:deviations.map(d=>d.dev>=0?accent:"#f87171") })),
      ],
    };
  }

  /* ═══ Tip ═══ */
  if (slug==="tip") {
    const bill=parseFloat(inputs.bill??inputs.amount??inputs.total);
    const tipPct=parseFloat(inputs.tipPercent??inputs.tip??inputs.percent);
    const people=parseFloat(inputs.people??inputs.persons??inputs.split)||1;
    if (!bill||!tipPct) return { stats:[],charts:[] };
    const tipAmt=(bill*tipPct)/100;
    const bars=[5,10,15,18,20,25].map(t=>({ t:`${t}%`,bill:Math.round(bill),tip:Math.round(bill*t/100) }));
    return {
      stats:[
        { label:"Tip Amount",value:inr(Math.round(tipAmt)) },
        { label:"Total Bill",value:inr(Math.round(bill+tipAmt)) },
        { label:"Per Person",value:inr(Math.round((bill+tipAmt)/people)) },
        { label:"People",    value:people },
      ],
      charts:[
        C("Bill Breakdown","tip-donut","pie","1",220,
          donutCfg({ labels:["Bill","Tip"],data:[Math.round(bill),Math.round(tipAmt)],
            colors:[grayBar,accent],centre:inr(Math.round((bill+tipAmt)/people)),centresub:"per person" }),
          [{ label:"Bill",color:grayBarSolid },{ label:"Tip",color:accent }]),
        C("Tip Options Comparison","tip-bar","layers","1",210,
          stackedCfg({ labels:bars.map(b=>b.t),datasets:[
            { label:"Bill",data:bars.map(b=>b.bill),backgroundColor:grayBar },
            { label:"Tip", data:bars.map(b=>b.tip), backgroundColor:accent }],yFmt:(v)=>inr(v) }),
          [{ label:"Bill",color:grayBarSolid },{ label:"Tip",color:accent }]),
        C("Tip Amount Polar","tip-polar","polar","2",190,
          polarCfg({ labels:bars.map(b=>b.t),data:bars.map(b=>b.tip),colors:PALETTE }),
          bars.map((b,i)=>({ label:b.t,color:PALETTE[i%PALETTE.length] }))),
      ],
    };
  }

  /* ═══ Factorial ═══ */
  if (slug==="factorial") {
    const n=parseFloat(inputs.n??inputs.number??inputs.num);
    if (!n||n<2) return { stats:[],charts:[] };
    const cap=Math.min(n,15);
    const data=Array.from({length:cap},(_,i)=>{let f=1;for(let j=2;j<=i+1;j++)f*=j;return{n:`${i+1}!`,v:f,d:String(f).length};});
    const scatterPts=data.map(d=>({ x:parseInt(d.n),y:d.v }));
    return {
      stats:[
        { label:"n",          value:n },
        { label:"Digits",     value:typeof result==="object"?(result.digits??"—"):String(result).length },
        { label:"Shown Up To",value:`${cap}!` },
      ],
      charts:[
        C("Factorial Growth Curve","fac-growth","area","2",220,
          areaCfg({ labels:data.map(d=>d.n),datasets:[{ label:"n!",data:data.map(d=>d.v),
            borderColor:accent,backgroundColor:accentFill,pointHoverBackgroundColor:accent }] })),
        C("Growth Scatter","fac-scatter","scatter","1",200,
          scatterCfg({ datasets:[{ label:"n!",data:scatterPts,backgroundColor:hexAlpha(accent,0.75),borderColor:accent }],xLabel:"n",yLabel:"n!" })),
        C("Digits in Result","fac-digits","bar","1",200,
          barCfg({ labels:data.map(d=>d.n),data:data.map(d=>d.d),
            colors:data.map((_,i)=>hexAlpha(accent,0.35+i*0.045)) })),
      ],
    };
  }

  /* ═══ Generic Fallback ═══ */
  const skipKeys=["message","status","note","tip","type","sign","category","direction","equation","expression","stage","rating"];
  const numericPairs=[];
  if (typeof result==="object"&&result!==null) {
    Object.entries(result).forEach(([k,v])=>{
      if (typeof v==="object") return;
      const num=parseFloat(String(v).replace(/[₹$€£¥,\s]/g,"").replace(/^[^0-9.-]+/,""));
      if (!isNaN(num)&&isFinite(num)&&!skipKeys.some(sk=>k.toLowerCase().includes(sk)))
        numericPairs.push({ name:fmtLbl(k),value:num });
    });
  } else if (!isNaN(parseFloat(result))) {
    numericPairs.push({ name:"Result",value:parseFloat(result) });
  }
  if (numericPairs.length===0) return { stats:[],charts:[] };
  const positiveNums=numericPairs.filter(p=>p.value>0);
  if (numericPairs.length===1) {
    return {
      stats:[{ label:numericPairs[0].name,value:numericPairs[0].value.toLocaleString() }],
      charts:[C("Result","gen-gauge","gauge","2",220,
        radialCfg({ pct:50,label:numericPairs[0].value.toLocaleString(),sub:numericPairs[0].name }))],
    };
  }
  return {
    stats:numericPairs.slice(0,4).map(p=>({ label:p.name,value:p.value.toLocaleString() })),
    charts:[
      C("Values Overview","gen-bar","bar","1",210,
        barCfg({ labels:numericPairs.map(p=>p.name),data:numericPairs.map(p=>p.value),
          colors:numericPairs.map((_,i)=>hexAlpha(PALETTE[i%PALETTE.length],0.75)) })),
      ...(positiveNums.length>=3?[
        C("Polar Distribution","gen-polar","polar","1",220,
          polarCfg({ labels:positiveNums.map(p=>p.name),data:positiveNums.map(p=>p.value),
            colors:positiveNums.map((_,i)=>PALETTE[i%PALETTE.length]) }),
          positiveNums.map((p,i)=>({ label:p.name,color:PALETTE[i%PALETTE.length] })))
      ]:[]),
      ...(positiveNums.length>=2?[
        C("Metric Radar","gen-radar","radar","2",220,
          radarCfg({ labels:numericPairs.map(p=>p.name),
            datasets:[{ label:"Values",data:numericPairs.map(p=>{
              const max=Math.max(...numericPairs.map(x=>Math.abs(x.value)));
              return max>0?(Math.abs(p.value)/max)*100:0;
            }) }] }))
      ]:[]),
    ],
  };
}

/* ════════════════════════
   MAIN EXPORT
════════════════════════ */
export default function ChartDashboard({ slug, inputs, result, accent = "#7c3aed" }) {
  const dark = useColorScheme();
  const th   = useMemo(() => getTheme(dark, accent), [dark, accent]);

  const resData = useMemo(() => {
    try {
      const parsed = buildCharts(slug, inputs, result, th);
      let newStats = [...parsed.stats];
      if (typeof result === "object" && result !== null) {
        const existingLabels = new Set(newStats.map(s => s.label.toLowerCase()));
        const skipKeys = ["message","status","note","tip","type","category","direction","equation",
          "expression","stage","rating","yearly_breakdown","monthly_breakdown","series","points",
          "zodiac_key","zodiac_dates"];
        Object.entries(result).forEach(([k, v]) => {
          if (typeof v === "object") return;
          if (skipKeys.some(sk => k.toLowerCase() === sk || (k.toLowerCase().includes(sk) && sk !== "zodiac_key" && sk !== "zodiac_dates"))) return;
          if (k.toLowerCase() === "zodiac_key" || k.toLowerCase() === "zodiac_dates") return;
          if (String(v) === "N/A" || v === null || v === undefined) return;
          const label = fmtLbl(k);
          if (!existingLabels.has(label.toLowerCase())) newStats.push({ label, value: String(v) });
        });
      }
      return { stats: newStats, charts: parsed.charts };
    } catch (e) {
      console.error("ChartDashboard error:", e);
      return { stats:[], charts:[] };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, JSON.stringify(inputs), JSON.stringify(result), accent, dark]);

  const { stats, charts } = resData;
  if (!result) return null;
  if (stats.length === 0 && charts.length === 0) return null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.35 }}
        style={{ fontFamily:"'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Stat Cards ── */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} label={s.label} value={s.value}
                accent={accent} th={th} index={i} />
            ))}
          </div>
        )}

        {stats.length > 0 && charts.length > 0 && <SectionDivider th={th} />}

        {/* ── Charts ── */}
        {charts.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:"12px", marginTop:"14px" }}>
            {charts.map(({ id, title, icon, span, height, config, legendItems }, i) => (
              <DashCard key={id} title={title} icon={icon} th={th} delay={i*0.07} span={span}>
                <ChartCanvas id={id} height={height} config={config}/>
                {legendItems && <ChartLegend items={legendItems} th={th}/>}
              </DashCard>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}