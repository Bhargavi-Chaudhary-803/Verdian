import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf, Trash2, MapPin, BarChart3, LogOut,
  User, Bell, Upload, CheckCircle, AlertTriangle,
  Recycle, TrendingUp, TrendingDown, Clock, Shield, Users,
  Map, ScanLine, Plus, X, Star, Activity, Download,
  Home, Radio, Settings, Loader, Award, Zap, RefreshCw
} from "lucide-react";

// ─── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
  "https://fhitqdahjiupsehqevta.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaXRxZGFoaml1cHNlaHFldnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU5NjgsImV4cCI6MjA4OTY4MTk2OH0.JrqjT_AGvcwDp5l3oAPsMujUrim8zWoLxHtwONXH5h8"
);

// ─── Color Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f0d", surface: "#111a15", card: "#162019", border: "#1e3028",
  accent: "#22c55e", accentDim: "#16a34a", accentGlow: "rgba(34,197,94,0.15)",
  warn: "#f59e0b", danger: "#ef4444", blue: "#3b82f6",
  text: "#e8f5ee", muted: "#6b8c78", dim: "#2d4a38",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes spinSlow { to{transform:rotate(360deg)} }
  @keyframes dash { to{stroke-dashoffset:0} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes glowPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orbitRotate { from{transform:rotate(0deg) translateX(60px) rotate(0deg)} to{transform:rotate(360deg) translateX(60px) rotate(-360deg)} }
  .float-anim { animation: floatY 4s ease-in-out infinite; }
  .float-anim-2 { animation: floatY 5s ease-in-out infinite 1s; }
  .float-anim-3 { animation: floatY 6s ease-in-out infinite 2s; }
  .shimmer-line { background: linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.4) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 2s linear infinite; }
  .kpi-card { position:relative; overflow:hidden; transition:transform .2s,box-shadow .2s; }
  .kpi-card:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(34,197,94,0.15); }
  .kpi-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(34,197,94,0.04) 0%,transparent 60%); pointer-events:none; }
  .stat-ring { filter:drop-shadow(0 0 6px rgba(34,197,94,0.4)); }
  .hex-bg { background-image: url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.3v17.4L30 52 0 34.7V17.3z' fill='none' stroke='rgba(34,197,94,0.06)' stroke-width='1'/%3E%3C/svg%3E"); background-size:60px 52px; }
  .glow-border { box-shadow: 0 0 0 1px rgba(34,197,94,0.2), 0 4px 20px rgba(34,197,94,0.08); }
  .leaflet-container { border-radius: 12px; }
  .leaflet-popup-content-wrapper { background: #ffffff; border: 1px solid #e2e8f0; color: #1a202c; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
  .leaflet-popup-tip { background: #ffffff; }
  .leaflet-popup-content { margin: 14px 18px; font-family: 'Inter', sans-serif; }
  .leaflet-popup-close-button { color: #888 !important; }
  .leaflet-control-zoom a { background: #ffffff !important; color: #16a34a !important; border-color: #d1fae5 !important; font-weight: 700 !important; }
  .leaflet-control-zoom a:hover { background: #f0fdf4 !important; }
  .leaflet-control-attribution { background: rgba(255,255,255,0.85) !important; color: #888 !important; font-size: 12px; }
  .leaflet-control-attribution a { color: #16a34a !important; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 2px; }
  .syne { font-family: 'Orbitron', sans-serif; font-weight: 700; letter-spacing: 0.06em; }
  .glow { box-shadow: 0 0 24px ${C.accentGlow}, inset 0 1px 0 rgba(34,197,94,0.1); }
  .glow-sm { box-shadow: 0 0 12px rgba(34,197,94,0.2); }
  .pulse-dot { width:8px;height:8px;background:${C.accent};border-radius:50%;animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
  .scan-line { position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${C.accent},transparent);animation:scan 2s linear infinite; }
  @keyframes scan { 0%{top:0%} 100%{top:100%} }
  .fade-in { animation:fadeIn .4s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .tab-active { background:${C.accentGlow};border-color:${C.accent}!important;color:${C.accent}!important; }
  .btn-primary { background:${C.accent};color:#0a0f0d;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s; }
  .btn-primary:hover { background:#4ade80;transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  .btn-ghost { background:transparent;border:1px solid ${C.border};color:${C.muted};cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s; }
  .btn-ghost:hover { border-color:${C.accent};color:${C.accent}; }
  input,textarea,select { background:${C.surface};border:1px solid ${C.border};color:${C.text};font-family:'DM Sans',sans-serif;outline:none;transition:border .2s; }
  input:focus,textarea:focus,select:focus { border-color:${C.accent}; }
  .sidebar-link { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;color:${C.muted};transition:all .2s;border:1px solid transparent; }
  .sidebar-link:hover,.sidebar-link.active { background:${C.accentGlow};border-color:${C.dim};color:${C.accent}; }
  .card { background:${C.card};border:1px solid ${C.border};border-radius:16px; }
  .chart-bar { border-radius:4px 4px 0 0;transition:all .3s; }
  .notif-dot { position:absolute;top:2px;right:2px;width:6px;height:6px;background:${C.danger};border-radius:50%; }
  .map-cell { transition:all .2s; cursor:pointer; }
  .map-cell:hover { transform:scale(1.1); z-index:10; }
  .error-box { background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:10px 14px;color:${C.danger};font-size:13px; }
  .success-box { background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:10px 14px;color:${C.accent};font-size:13px; }
`;
// ─── Static data ──────────────────────────────────────────────────────────────
const wasteCategories = [
  { id: "recyclable", label: "Recyclable", icon: Recycle, color: C.blue, examples: ["Paper","Plastic PET","Glass","Metal cans"] },
  { id: "organic",    label: "Organic",    icon: Leaf,    color: C.accent, examples: ["Food scraps","Garden waste","Coffee grounds"] },
  { id: "hazardous",  label: "Hazardous",  icon: AlertTriangle, color: C.danger, examples: ["Batteries","Paint","Chemicals","E-waste"] },
  { id: "general",    label: "General",    icon: Trash2,  color: C.muted, examples: ["Mixed plastic","Styrofoam","Contaminated items"] },
];

const aiWasteItems = [
  { name:"Plastic Bottle",  category:"recyclable", confidence:94, guidance:"Rinse and place in blue bin. Remove cap separately.", points:10 },
  { name:"Apple Core",      category:"organic",    confidence:99, guidance:"Place in green bin. Compostable.", points:5 },
  { name:"Old Battery",     category:"hazardous",  confidence:97, guidance:"Take to nearest e-waste collection point. Do not mix with regular waste.", points:20 },
  { name:"Newspaper",       category:"recyclable", confidence:91, guidance:"Keep dry and bundle with other paper. Place in blue bin.", points:8 },
  { name:"Leftover Food",   category:"organic",    confidence:96, guidance:"Seal in a bag and place in green compost bin.", points:5 },
  { name:"Paint Can",       category:"hazardous",  confidence:88, guidance:"Contact municipal hazardous waste disposal. Never pour in drain.", points:25 },
];

const scheduleItems = [
  { zone:"Karol Bagh",   time:"07:00 AM", type:"Mixed",      status:"completed",   truck:"DL-01-CX" },
  { zone:"Lajpat Nagar", time:"09:30 AM", type:"Organic",    status:"in-progress", truck:"DL-03-GR" },
  { zone:"Rohini",       time:"11:00 AM", type:"Recyclable", status:"pending",     truck:"DL-07-BC" },
  { zone:"Saket",        time:"02:00 PM", type:"Hazardous",  status:"pending",     truck:"DL-05-HZ" },
  { zone:"Mayur Vihar",  time:"04:30 PM", type:"General",    status:"pending",     truck:"DL-09-MW" },
];

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ size = 18 }) {
  return (
    <div style={{ display:"inline-flex", animation:"spin 1s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader size={size} color={C.accent} />
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenu, setMobileMenu] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const stats = [
    { val:"2.1B",    label:"Tonnes landfilled yearly",  icon:"🌍" },
    { val:"67%",     label:"Recyclables misclassified",  icon:"♻️" },
    { val:"₹48K Cr", label:"Recycling value lost",       icon:"💸" },
    { val:"94%",     label:"Our AI accuracy",             icon:"🤖" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#050a07", overflowX:"hidden", position:"relative" }}>
      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.97)} }
        @keyframes gridFade { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowLine { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes rotateHex { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes counterUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes particleDrift { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0.6} 100%{transform:translateY(-120px) translateX(20px) scale(0);opacity:0} }
        .hero-headline { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-sub { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-cta { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .stat-item { animation: counterUp 0.6s ease both; }
        .stat-item:nth-child(1){animation-delay:0.1s} .stat-item:nth-child(2){animation-delay:0.2s}
        .stat-item:nth-child(3){animation-delay:0.3s} .stat-item:nth-child(4){animation-delay:0.4s}
        .feature-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(34,197,94,0.4) !important; }
        .feature-card:hover .feat-icon { transform: scale(1.15) rotate(-5deg); }
        .feat-icon { transition: transform 0.3s ease; }
        .nav-link { position:relative; color:#6b8c78; font-size:14px; cursor:pointer; text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:#e8f5ee; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#22c55e; transition:width 0.3s; }
        .nav-link:hover::after { width:100%; }
        .particle { position:absolute; width:4px; height:4px; border-radius:50%; background:#22c55e; animation: particleDrift 3s ease-out infinite; pointer-events:none; }
        .glow-btn { position:relative; overflow:hidden; }
        .glow-btn::before { content:''; position:absolute; inset:-1px; background:linear-gradient(90deg,#22c55e,#4ade80,#22c55e); background-size:200%; animation:shimmer 2s linear infinite; border-radius:inherit; z-index:-1; opacity:0; transition:opacity 0.3s; }
        .glow-btn:hover::before { opacity:1; }
        @keyframes shimmer { 0%{background-position:0%} 100%{background-position:200%} }
      `}</style>

      {/* Mouse-following glow */}
      <div style={{
        position:"fixed", pointerEvents:"none", zIndex:0,
        width:700, height:700, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)",
        transform:`translate(${mousePos.x - 350}px, ${mousePos.y - 350}px)`,
        transition:"transform 0.4s ease",
      }} />

      {/* Animated SVG gradient canvas — behind all hero content */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="g1" cx="20%" cy="30%"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.12"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></radialGradient>
            <radialGradient id="g2" cx="80%" cy="60%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.07"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
            <radialGradient id="g3" cx="50%" cy="90%"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.08"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></radialGradient>
            <filter id="blur1"><feGaussianBlur stdDeviation="40"/></filter>
          </defs>
          {/* Soft gradient blobs */}
          <ellipse cx="200" cy="280" rx="400" ry="300" fill="url(#g1)" filter="url(#blur1)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 40,-30; -20,20; 0,0" dur="18s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="1200" cy="500" rx="380" ry="280" fill="url(#g2)" filter="url(#blur1)">
            <animateTransform attributeName="transform" type="translate" values="0,0; -50,30; 20,-20; 0,0" dur="22s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="720" cy="820" rx="350" ry="200" fill="url(#g3)" filter="url(#blur1)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 30,-40; -30,20; 0,0" dur="15s" repeatCount="indefinite"/>
          </ellipse>
          {/* Dot grid */}
          {Array.from({length:20}).map((_,row) => Array.from({length:30}).map((_,col) => (
            <circle key={`${row}-${col}`} cx={col*52+26} cy={row*48+24} r="1" fill="rgba(34,197,94,0.08)"/>
          )))}
          {/* Flowing diagonal lines */}
          {[0,1,2,3].map(i => (
            <line key={i} x1={-200+i*400} y1="0" x2={600+i*400} y2="900" stroke="rgba(34,197,94,0.04)" strokeWidth="1">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${8+i*2}s`} repeatCount="indefinite"/>
            </line>
          ))}
          {/* Top-right accent arc */}
          <circle cx="1380" cy="60" r="200" fill="none" stroke="rgba(34,197,94,0.06)" strokeWidth="1" strokeDasharray="8 16"/>
          <circle cx="1380" cy="60" r="140" fill="none" stroke="rgba(34,197,94,0.04)" strokeWidth="1" strokeDasharray="4 12">
            <animateTransform attributeName="transform" type="rotate" from="0 1380 60" to="360 1380 60" dur="30s" repeatCount="indefinite"/>
          </circle>
          {/* Bottom-left accent */}
          <circle cx="80" cy="840" r="120" fill="none" stroke="rgba(59,130,246,0.05)" strokeWidth="1" strokeDasharray="6 10">
            <animateTransform attributeName="transform" type="rotate" from="360 80 840" to="0 80 840" dur="25s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      {/* NAV — responsive */}
      <style>{`
        .nav-links { display:flex; align-items:center; gap:32px; }
        .nav-actions { display:flex; gap:10px; }
        .nav-hamburger { display:none; background:none; border:none; cursor:pointer; color:#6b8c78; padding:4px; }
        .nav-mobile-menu { display:none; position:fixed; top:64px; left:0; right:0; zIndex:99; background:rgba(5,10,7,0.97); border-bottom:1px solid rgba(34,197,94,0.12); backdrop-filter:blur(20px); padding:20px 24px; flex-direction:column; gap:16px; }
        .nav-mobile-menu.open { display:flex; }
        @media (max-width: 768px) {
          .nav-links { display:none !important; }
          .nav-actions { display:none !important; }
          .nav-hamburger { display:block !important; }
        }
      `}</style>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"0 clamp(20px, 4vw, 48px)", height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(5,10,7,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.1)" : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none", transition:"all .4s",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="28" height="28" viewBox="0 0 32 32">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
            <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="0.8"/>
            <circle cx="16" cy="16" r="4" fill="#22c55e" opacity="0.9"/>
          </svg>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:16, color:"#e8f5ee", letterSpacing:"0.2em" }}>VERDIAN</span>
        </div>
        <div className="nav-links">
          {["Features","About","Cities"].map(l => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div>
        <div className="nav-actions">
          <button style={{ padding:"8px 20px", borderRadius:8, background:"transparent", border:"1px solid rgba(34,197,94,0.25)", color:"#6b8c78", cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", transition:"all .2s" }}
            onMouseEnter={e=>{e.target.style.borderColor="#22c55e";e.target.style.color="#e8f5ee"}}
            onMouseLeave={e=>{e.target.style.borderColor="rgba(34,197,94,0.25)";e.target.style.color="#6b8c78"}}
            onClick={() => onNavigate("auth")}>Sign in</button>
          <button className="glow-btn" style={{ padding:"8px 20px", borderRadius:8, background:"#22c55e", border:"none", color:"#050a07", cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:700 }}
            onClick={() => onNavigate("auth")}>Get started →</button>
        </div>
        <button className="nav-hamburger" onClick={() => setMobileMenu(m => !m)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>
      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${mobileMenu ? "open" : ""}`} style={{ zIndex:99 }}>
        {["Features","About","Cities"].map(l => (
          <span key={l} style={{ fontSize:15, color:"#a0b8a8", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{l}</span>
        ))}
        <div style={{ borderTop:"1px solid rgba(34,197,94,0.1)", paddingTop:12, display:"flex", flexDirection:"column", gap:10 }}>
          <button style={{ padding:"10px 0", borderRadius:8, background:"transparent", border:"1px solid rgba(34,197,94,0.25)", color:"#6b8c78", cursor:"pointer", fontSize:14, fontFamily:"'Inter',sans-serif" }}
            onClick={() => onNavigate("auth")}>Sign in</button>
          <button style={{ padding:"10px 0", borderRadius:8, background:"#22c55e", border:"none", color:"#050a07", cursor:"pointer", fontSize:14, fontFamily:"'Inter',sans-serif", fontWeight:700 }}
            onClick={() => onNavigate("auth")}>Get started →</button>
        </div>
      </div>

      {/* HERO */}
      <div ref={heroRef} style={{ position:"relative", zIndex:1, paddingTop:160, paddingBottom:100, textAlign:"center", maxWidth:900, margin:"0 auto", padding:"160px 32px 100px" }}>

        {/* Pill badge */}
        <div className="hero-headline" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", marginBottom:32 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:12, color:"#22c55e", fontWeight:600, letterSpacing:"0.05em" }}>AI-POWERED WASTE INTELLIGENCE</span>
        </div>

        {/* Main headline */}
        <h1 className="hero-headline" style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:"clamp(36px,5vw,66px)", lineHeight:1.12, letterSpacing:"0.02em", color:"#e8f5ee", marginBottom:24 }}>
          Cities waste less<br />
          <span style={{ background:"linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>when they see clearly.</span>
        </h1>

        <p className="hero-sub" style={{ fontSize:17, color:"#6b8c78", maxWidth:520, margin:"0 auto 48px", lineHeight:1.75 }}>
          Verdian classifies waste in seconds using AI, maps hotspots in real-time, and guides every citizen toward a circular economy.
        </p>

        <div className="hero-cta" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="glow-btn" style={{ padding:"14px 36px", borderRadius:12, background:"#22c55e", border:"none", color:"#050a07", fontSize:15, fontFamily:"'Orbitron',sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:"-0.01em" }}
            onClick={() => onNavigate("auth")}>
            Start for free →
          </button>
          <button style={{ padding:"14px 36px", borderRadius:12, background:"transparent", border:"1px solid rgba(255,255,255,0.08)", color:"#a0b8a8", fontSize:15, fontFamily:"'Inter',sans-serif", cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(34,197,94,0.3)";e.currentTarget.style.color="#e8f5ee"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="#a0b8a8"}}
            onClick={() => onNavigate("auth")}>
            View admin demo
          </button>
        </div>

        {/* Decorative UI preview card */}
        <div style={{ marginTop:72, position:"relative" }}>
          {/* Glow behind card */}
          <div style={{ position:"absolute", bottom:-40, left:"50%", transform:"translateX(-50%)", width:"70%", height:60, background:"radial-gradient(ellipse, rgba(34,197,94,0.2) 0%, transparent 70%)", filter:"blur(20px)" }} />
          <div style={{ borderRadius:20, border:"1px solid rgba(34,197,94,0.12)", background:"rgba(10,20,14,0.8)", backdropFilter:"blur(20px)", padding:24, textAlign:"left", maxWidth:700, margin:"0 auto", boxShadow:"0 40px 80px rgba(0,0,0,0.5)" }}>
            {/* Window chrome */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>(
                <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c, opacity:0.7 }} />
              ))}
              <div style={{ flex:1, height:20, borderRadius:6, background:"rgba(255,255,255,0.04)", marginLeft:8, display:"flex", alignItems:"center", paddingLeft:10 }}>
                <span style={{ fontSize:12, color:"#2d4a38" }}>verdian.ai/dashboard</span>
              </div>
            </div>
            {/* Mini dashboard preview */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
              {[["♻️ Recyclable","38%","#3b82f6"],["🌿 Organic","42%","#22c55e"],["⚠️ Hazardous","8%","#ef4444"]].map(([l,v,c],i)=>(
                <div key={i} style={{ padding:"12px 14px", borderRadius:10, background:`${c}08`, border:`1px solid ${c}20` }}>
                  <div style={{ fontSize:12, color:"#6b8c78", marginBottom:6 }}>{l}</div>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:22, color:c, letterSpacing:"-0.03em" }}>{v}</div>
                  <div style={{ marginTop:6, height:3, borderRadius:2, background:`${c}20` }}>
                    <div style={{ height:"100%", width:v, background:c, borderRadius:2 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.1)", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"rgba(34,197,94,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <div style={{ fontSize:16 }}>🤖</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:"#6b8c78" }}>AI Classification</div>
                <div style={{ fontSize:13, color:"#e8f5ee", fontWeight:600 }}>Plastic PET Bottle → Recyclable ✓</div>
              </div>
              <div style={{ padding:"3px 10px", borderRadius:100, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", fontSize:12, color:"#22c55e", fontWeight:700, flexShrink:0 }}>94% conf.</div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(34,197,94,0.06)", borderBottom:"1px solid rgba(34,197,94,0.06)", padding:"48px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
          {stats.map((s,i) => (
            <div key={i} className="stat-item" style={{ textAlign:"center", padding:"0 24px", borderRight: i < 3 ? "1px solid rgba(34,197,94,0.08)" : "none" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:34, color:"#22c55e", letterSpacing:"-0.04em", lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:12, color:"#6b8c78", marginTop:6, lineHeight:1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ position:"relative", zIndex:1, padding:"96px 48px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          {/* Section label */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ height:1, flex:1, background:"linear-gradient(90deg, transparent, rgba(34,197,94,0.3))" }} />
            <span style={{ fontSize:12, color:"#22c55e", fontWeight:700, letterSpacing:"0.12em" }}>CAPABILITIES</span>
            <div style={{ height:1, flex:1, background:"linear-gradient(90deg, rgba(34,197,94,0.3), transparent)" }} />
          </div>
          <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:"clamp(28px,3.5vw,44px)", letterSpacing:"-0.03em", color:"#e8f5ee", textAlign:"center", marginBottom:12 }}>
            One platform.<br/>Every waste workflow.
          </h2>
          <p style={{ color:"#6b8c78", textAlign:"center", fontSize:15, marginBottom:64, lineHeight:1.7 }}>
            Built for citizens who care, and municipalities who need to act fast.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
            {[
              { icon:"AI", title:"AI Waste Classifier", desc:"Upload a photo or type a description. Our model returns category, confidence score, bin color, and disposal instructions in under 2 seconds.", tag:"94% accuracy", color:"#22c55e" },
              { icon:"MAP", title:"Live Hotspot Map", desc:"Interactive Leaflet map overlays municipal hotspots and citizen-logged waste pins. Filter by priority. Dispatch trucks from the admin panel.", tag:"Real-time", color:"#3b82f6" },
              { icon:"CHART", title:"Smart Analytics", desc:"Track recycling rates, CO₂ savings, weekly collection volume and category breakdowns. Full leaderboard for citizen gamification.", tag:"Live data", color:"#f59e0b" },
              { icon:"PIN", title:"Geo-tagged Logging", desc:"Log waste items with GPS coordinates. Every logged item appears as a pin on the city map — giving municipalities precise data on waste origins.", tag:"GPS-enabled", color:"#8b5cf6" },
            ].map((f,i) => (
              <div key={i} className="feature-card" style={{ padding:32, borderRadius:20, background:"rgba(10,18,12,0.6)", border:"1px solid rgba(34,197,94,0.08)", backdropFilter:"blur(10px)", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:20 }}>
                  <div className="feat-icon" style={{ width:52, height:52, borderRadius:14, background:`${f.color}10`, border:`1px solid ${f.color}20`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {f.icon === "AI" && <ScanLine size={22} color={f.color}/>}
                    {f.icon === "MAP" && <MapPin size={22} color={f.color}/>}
                    {f.icon === "CHART" && <BarChart3 size={22} color={f.color}/>}
                    {f.icon === "PIN" && <Map size={22} color={f.color}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                      <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:16, color:"#e8f5ee" }}>{f.title}</span>
                      <span style={{ fontSize:12, padding:"2px 8px", borderRadius:100, background:`${f.color}12`, border:`1px solid ${f.color}25`, color:f.color, fontWeight:700, letterSpacing:"0.05em" }}>{f.tag}</span>
                    </div>
                    <p style={{ fontSize:13, color:"#6b8c78", lineHeight:1.7, margin:0 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CITIES */}
      <div style={{ position:"relative", zIndex:1, padding:"0 48px 80px" }}>
        <div style={{ maxWidth:960, margin:"0 auto", textAlign:"center" }}>
          <div style={{ padding:"32px", borderRadius:20, background:"rgba(34,197,94,0.03)", border:"1px solid rgba(34,197,94,0.08)" }}>
            <p style={{ fontSize:12, color:"#2d4a38", fontWeight:700, letterSpacing:"0.1em", marginBottom:16 }}>ACTIVE IN</p>
            <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
              {["Delhi","Mumbai","Bengaluru","Hyderabad","Chennai"].map((c,i) => (
                <span key={i} style={{ fontSize:14, color:"#6b8c78", fontWeight:500 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{ position:"relative", zIndex:1, padding:"80px 48px 100px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ position:"relative", padding:"60px 40px", borderRadius:24, overflow:"hidden", background:"linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(10,20,14,0.9) 100%)", border:"1px solid rgba(34,197,94,0.15)" }}>
            {/* Corner decoration */}
            <svg style={{ position:"absolute", top:0, right:0, opacity:0.15 }} width="200" height="200" viewBox="0 0 200 200">
              <circle cx="180" cy="20" r="80" fill="none" stroke="#22c55e" strokeWidth="0.5"/>
              <circle cx="180" cy="20" r="50" fill="none" stroke="#22c55e" strokeWidth="0.5"/>
              <circle cx="180" cy="20" r="25" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1"/>
            </svg>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:"#e8f5ee", letterSpacing:"-0.03em", marginBottom:12, lineHeight:1.15 }}>
              Ready to make your<br />city cleaner?
            </div>
            <p style={{ color:"#6b8c78", marginBottom:32, fontSize:15, lineHeight:1.6 }}>
              Join thousands of citizens turning waste knowledge into environmental action.
            </p>
            <button className="glow-btn" style={{ padding:"16px 44px", borderRadius:14, background:"#22c55e", border:"none", color:"#050a07", fontSize:16, fontFamily:"'Orbitron',sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:"-0.01em" }}
              onClick={() => onNavigate("auth")}>
              Get started free →
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(34,197,94,0.06)", padding:"24px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="20" height="20" viewBox="0 0 32 32">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5"/>
            <circle cx="16" cy="16" r="3" fill="#22c55e" opacity="0.7"/>
          </svg>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:13, color:"#2d4a38", letterSpacing:"0.2em", fontFamily:"'Orbitron',sans-serif" }}>VERDIAN</span>
        </div>
        <span style={{ fontSize:12, color:"#2d4a38" }}>© 2026 Verdian. Smart Waste Intelligence.</span>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email:"", password:"", name:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (err) throw err;
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onLogin({ id: data.user.id, name: profile?.name || form.email.split("@")[0], email: form.email, role: profile?.role || "user", ...profile });
      } else {
        if (!form.name) { setError("Name is required."); setLoading(false); return; }
        const { data, error: err } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { name: form.name, role } }
        });
        if (err) throw err;
        if (data.user && !data.session) {
          setSuccess("Account created! Check your email to confirm, then sign in.");
        } else if (data.session) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
          onLogin({ id: data.user.id, name: form.name, email: form.email, role, ...profile });
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />
      <div className="fade-in" style={{ width:"100%", maxWidth:440 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40, justifyContent:"center" }}>
          <div style={{ width:40, height:40, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Recycle size={20} color={C.accent} />
          </div>
          <span className="syne" style={{ fontWeight:700, fontSize:22, color:C.text, letterSpacing:"0.2em", fontFamily:"'Orbitron',sans-serif" }}>VERDIAN</span>
        </div>

        <div className="card" style={{ padding:36 }}>
          <h2 className="syne" style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:4 }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:28 }}>
            {isLogin ? "Sign in to your Verdian account" : "Join the green revolution"}
          </p>

          {!isLogin && (
            <div style={{ display:"flex", background:C.surface, borderRadius:10, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
              {["user","admin"].map(r => (
                <button key={r} onClick={() => setRole(r)}
                  style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
                    background: role === r ? C.accent : "transparent", color: role === r ? "#0a0f0d" : C.muted }}>
                  {r === "user" ? "🌿 Citizen" : "🏛️ Admin"}
                </button>
              ))}
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Full Name</label>
              <input style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Email</label>
            <input style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
              placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Password</label>
            <input type="password" style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
              placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password:e.target.value})}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          {error   && <div className="error-box"   style={{ marginBottom:16 }}>⚠ {error}</div>}
          {success && <div className="success-box" style={{ marginBottom:16 }}>✓ {success}</div>}

          <button className="btn-primary glow" style={{ width:"100%", padding:"13px 0", borderRadius:10, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            onClick={handleSubmit} disabled={loading}>
            {loading && <Spinner size={16} />}
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ marginTop:20, textAlign:"center", fontSize:13, color:C.muted }}>
            {isLogin ? "No account?" : "Have an account?"}{" "}
            <span style={{ color:C.accent, cursor:"pointer" }} onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}>
              {isLogin ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeSection, setActiveSection, onLogout }) {
  const userLinks  = [
    { id:"dashboard",   icon:Home,     label:"Dashboard",   color:"#22c55e" },
    { id:"scanner",     icon:ScanLine, label:"AI Scanner",  color:"#3b82f6" },
    { id:"map",         icon:Map,      label:"Waste Map",   color:"#22c55e" },
    { id:"hotspots",    icon:Radio,    label:"Hotspots",    color:"#ef4444" },
    { id:"add-waste",   icon:Plus,     label:"Add Waste",   color:"#f59e0b" },
    { id:"analytics",   icon:BarChart3,label:"Analytics",   color:"#22c55e" },
  ];
  const adminLinks = [
    { id:"admin-dashboard", icon:Shield,    label:"Admin Overview", color:"#ef4444" },
    { id:"map",             icon:Map,       label:"City Map",       color:"#22c55e" },
    { id:"hotspots",        icon:Radio,     label:"Hotspots",       color:"#ef4444" },
    { id:"schedule",        icon:Clock,     label:"Schedule",       color:"#f59e0b" },
    { id:"analytics",       icon:BarChart3, label:"Analytics",      color:"#22c55e" },
    { id:"users",           icon:Users,     label:"Users",          color:"#3b82f6" },
  ];
  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <div style={{ width:230, minHeight:"100vh", background:"#0a0f0d", borderRight:"1px solid #1e3028", display:"flex", flexDirection:"column", padding:"0 0 20px", flexShrink:0, position:"relative", overflow:"hidden" }}>
      {/* Sidebar background graphic */}
      <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:80, right:-40, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Logo area */}
      <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #1e3028" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ position:"relative", width:34, height:34, flexShrink:0 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="16" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
              <circle cx="17" cy="17" r="16" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="25 76" strokeLinecap="round"
                style={{animation:"spinSlow 8s linear infinite", transformOrigin:"17px 17px"}} />
              <text x="17" y="21" textAnchor="middle" fontSize="12" fill="#22c55e">♻</text>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:15, color:"#e8f5ee", letterSpacing:"0.2em", fontFamily:"'Orbitron',sans-serif" }}>VERDIAN</div>
            <div style={{ fontSize:12, color:"#2d4a38", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Waste Intelligence</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ margin:"12px 12px 8px", padding:"12px 14px", borderRadius:12,
        background: user.role==="admin" ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)",
        border:`1px solid ${user.role==="admin" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)"}`,
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-10, top:-10, width:50, height:50, borderRadius:"50%", background: user.role==="admin" ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)" }} />
        <div style={{ fontSize:12, color: user.role==="admin" ? "#ef4444" : "#22c55e", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>
          {user.role==="admin" ? "🏛️ Admin" : "🌿 Citizen"}
        </div>
        <div style={{ fontSize:13, color:"#e8f5ee", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
        <div style={{ fontSize:12, color:"#6b8c78", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
      </div>

      {/* Nav section label */}
      <div style={{ padding:"8px 18px 4px" }}>
        <div style={{ fontSize:12, color:"#2d4a38", fontWeight:700, textTransform:"uppercase", letterSpacing:1.5 }}>Navigation</div>
      </div>

      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2, padding:"0 10px" }}>
        {links.map(l => {
          const isActive = activeSection === l.id;
          return (
            <div key={l.id}
              onClick={() => setActiveSection(l.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10,
                cursor:"pointer", fontSize:13, fontWeight: isActive ? 600 : 400,
                color: isActive ? l.color : "#6b8c78",
                background: isActive ? `${l.color}12` : "transparent",
                border: isActive ? `1px solid ${l.color}25` : "1px solid transparent",
                transition:"all .15s", position:"relative", overflow:"hidden" }}>
              {isActive && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:l.color }} />}
              <l.icon size={15} color={isActive ? l.color : "#6b8c78"} />
              <span>{l.label}</span>
              {isActive && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:l.color, boxShadow:`0 0 6px ${l.color}` }} />}
            </div>
          );
        })}
      </nav>

      {/* Bottom mini graphic — recycling rings */}
      <div style={{ margin:"8px 12px 12px", padding:14, borderRadius:12, background:"rgba(34,197,94,0.04)", border:"1px solid rgba(34,197,94,0.08)", textAlign:"center" }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin:"0 auto 8px", display:"block" }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="3" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="3"
            strokeDasharray={`${((user.green_points||0)/500)*125} 125`}
            strokeLinecap="round" strokeDashoffset="-31"
            style={{transform:"rotate(-90deg)", transformOrigin:"24px 24px", transition:"stroke-dasharray 1s ease"}} />
          <text x="24" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="#22c55e" fontFamily="'Quicksand',sans-serif">
            {user.green_points||0}
          </text>
          <text x="24" y="36" textAnchor="middle" fontSize="6" fill="#6b8c78">pts</text>
        </svg>
        <div style={{ fontSize:12, color:"#6b8c78" }}>Green Points</div>
      </div>

      <div style={{ padding:"0 10px", display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, cursor:"pointer", fontSize:13, color:"#6b8c78", border:"1px solid transparent", transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#e8f5ee";e.currentTarget.style.borderColor="#1e3028"}}
          onMouseLeave={e=>{e.currentTarget.style.color="#6b8c78";e.currentTarget.style.borderColor="transparent"}}
          onClick={() => setActiveSection("settings")}>
          <Settings size={15} /><span>Settings</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, cursor:"pointer", fontSize:13, color:"#ef4444", border:"1px solid transparent", transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";e.currentTarget.style.borderColor="rgba(239,68,68,0.2)"}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent"}}
          onClick={onLogout}>
          <LogOut size={15} /><span>Sign Out</span>
        </div>
      </div>
    </div>
  );
}
// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ title, user }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const timeStr = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });

  return (
    <div style={{ height:64, background:"rgba(10,15,13,0.95)", borderBottom:"1px solid #1e3028", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0, backdropFilter:"blur(12px)", position:"relative", overflow:"hidden" }}>
      {/* Subtle shimmer line at bottom */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1 }} className="shimmer-line" />

      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:17, color:"#e8f5ee", letterSpacing:"-0.02em" }}>{title}</div>
          <div style={{ fontSize:12, color:"#2d4a38" }}>
            {now.toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        {/* Live clock */}
        <div style={{ padding:"5px 12px", borderRadius:8, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.12)", display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
          <span style={{ fontSize:12, color:"#22c55e", fontWeight:600, fontFamily:"monospace" }}>{timeStr}</span>
        </div>

        {/* Notification bell */}
        <div style={{ position:"relative", cursor:"pointer", width:36, height:36, borderRadius:10, border:"1px solid #1e3028", background:"rgba(34,197,94,0.04)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(34,197,94,0.3)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e3028"}}>
          <Bell size={15} color="#6b8c78" />
          <div style={{ position:"absolute", top:7, right:7, width:6, height:6, background:"#ef4444", borderRadius:"50%", border:"1px solid #0a0f0d", boxShadow:"0 0 4px #ef4444" }} />
        </div>

        {/* Avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 12px 6px 6px", borderRadius:10, border:"1px solid #1e3028", background:"rgba(34,197,94,0.04)", cursor:"pointer", transition:"all .2s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(34,197,94,0.2)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e3028"}}>
          <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,rgba(34,197,94,0.3),rgba(34,197,94,0.1))", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <User size={14} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize:12, color:"#e8f5ee", fontWeight:600, lineHeight:1.2 }}>{user.name?.split(" ")[0]}</div>
            <div style={{ fontSize:12, color:"#6b8c78", textTransform:"capitalize" }}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
function UserDashboard({ user }) {
  const [logs,    setLogs]    = useState([]);
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [rank,    setRank]    = useState(null);
  const [tick,    setTick]    = useState(0);

  const loadData = async () => {
    const { data: logsData } = await supabase.from("waste_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
    setLogs(logsData || []);
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof) setProfile(p => ({ ...p, ...prof }));
    const { count } = await supabase.from("profiles").select("*", { count:"exact", head:true }).gt("green_points", prof?.green_points || 0);
    setRank((count || 0) + 1);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadData();

    // Realtime: re-fetch when waste_logs changes for this user
    const logsSub = supabase.channel("dashboard-logs-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "waste_logs", filter: `user_id=eq.${user.id}` },
        () => loadData())
      .subscribe();

    // Realtime: re-fetch when profile changes
    const profSub = supabase.channel("dashboard-profile-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(logsSub); supabase.removeChannel(profSub); };
  }, [user.id]);

  // Animate tick for SVG rings
  useEffect(() => { const t = setTimeout(() => setTick(1), 200); return () => clearTimeout(t); }, [loading]);

  const catColor = { recyclable:"#3b82f6", organic:"#22c55e", hazardous:"#ef4444", general:"#6b8c78" };
  // catIcon rendered inline via wasteCategories lookup

  // compute weekly bar data from logs
  const weekBars = (() => {
    const d = new Array(7).fill(0);
    const now = new Date();
    logs.forEach(l => {
      const diff = Math.floor((now - new Date(l.created_at)) / 86400000);
      if (diff < 7) d[6 - diff]++;
    });
    return d;
  })();
  const maxBar = Math.max(...weekBars, 1);

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:22 }}>

      {/* ── Hero Banner with SVG decoration ── */}
      <div style={{ position:"relative", borderRadius:20, overflow:"hidden", padding:"28px 32px", background:"linear-gradient(135deg, #091409 0%, #0a1a0e 60%, #061009 100%)", border:"1px solid rgba(34,197,94,0.12)" }}>
        {/* Animated SVG background */}
        <svg style={{ position:"absolute", right:0, top:0, height:"100%", width:"45%", opacity:1 }} viewBox="0 0 380 160" preserveAspectRatio="xMaxYMid slice">
          <defs>
            <radialGradient id="bannerGrad" cx="60%" cy="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="280" cy="80" rx="160" ry="100" fill="url(#bannerGrad)"/>
          <circle cx="300" cy="80" r="70" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 6"/>
          <circle cx="300" cy="80" r="45" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" strokeDasharray="3 8"/>
          <circle cx="300" cy="80" r="22" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="1" opacity="0.6"/>
          {[0,45,90,135,180,225,270,315].map((deg,i) => {
            const rad = deg * Math.PI / 180;
            const x = 300 + 70 * Math.cos(rad); const y = 80 + 70 * Math.sin(rad);
            return <circle key={i} cx={x} cy={y} r="2.5" fill="#22c55e" opacity={i%2===0?0.5:0.25}/>;
          })}
          <line x1="180" y1="0" x2="380" y2="160" stroke="#22c55e" strokeWidth="0.3" opacity="0.1"/>
          <line x1="200" y1="0" x2="380" y2="130" stroke="#22c55e" strokeWidth="0.3" opacity="0.07"/>
        </svg>

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
            <span style={{ fontSize:12, color:"#22c55e", fontWeight:700, letterSpacing:"0.1em" }}>CITIZEN DASHBOARD</span>
          </div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:26, color:"#e8f5ee", letterSpacing:"-0.03em", marginBottom:6 }}>
            Hi, {profile.name?.split(" ")[0]}!
          </div>
          <div style={{ fontSize:13, color:"#6b8c78", marginBottom:20 }}>
            You've saved{" "}
            <span style={{ color:"#22c55e", fontWeight:700 }}>{profile.co2_saved || 0} kg</span>{" "}
            of CO₂ · Rank{" "}
            <span style={{ color:"#3b82f6", fontWeight:700 }}>#{rank || "—"}</span>{" "}
            in Delhi
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", fontSize:12, color:"#22c55e", fontWeight:600 }}>
              <Award size={12} /> Eco Hero
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", fontSize:12, color:"#f59e0b", fontWeight:600 }}>
              <Activity size={12} /> {profile.streak||0} day streak
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", fontSize:12, color:"#3b82f6", fontWeight:600 }}>
              <Star size={12} /> {profile.green_points||0} pts
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards with animated SVG progress rings ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Items Logged",  value: loading ? 0 : logs.length,              suffix:"",    icon:ScanLine,  color:"#3b82f6",  max:50 },
          { label:"Green Points",  value: loading ? 0 : profile.green_points||0,  suffix:"",    icon:Star,      color:"#22c55e",  max:500 },
          { label:"CO₂ Saved",     value: loading ? 0 : profile.co2_saved||0,     suffix:" kg", icon:Leaf,      color:"#4ade80",  max:50 },
          { label:"Day Streak",    value: loading ? 0 : profile.streak||0,        suffix:"d",   icon:Activity,  color:"#f59e0b",  max:30 },
        ].map((s, i) => {
          const pct = Math.min((s.value / s.max) * 100, 100);
          const r = 24; const circ = 2 * Math.PI * r;
          const filled = tick ? (pct / 100) * circ : 0;
          return (
            <div key={i} style={{ position:"relative", padding:"18px 20px", borderRadius:16, background:"#162019", border:"1px solid #1e3028", overflow:"hidden", transition:"transform .2s,box-shadow .2s", cursor:"default" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 28px ${s.color}18`}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              {/* Background shape */}
              <div style={{ position:"absolute", right:-16, top:-16, width:80, height:80, borderRadius:"50%", background:`${s.color}08` }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${s.color}05 0%, transparent 60%)` }} />

              <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12, color:"#6b8c78", fontWeight:500, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, fontWeight:800, color:"#e8f5ee", letterSpacing:"-0.04em", lineHeight:1 }}>
                    {loading ? "—" : s.value}{s.suffix}
                  </div>
                </div>
                {/* SVG ring */}
                <svg width="56" height="56" viewBox="0 0 56 56" style={{ filter:`drop-shadow(0 0 6px ${s.color}44)` }}>
                  <circle cx="28" cy="28" r={r} fill="none" stroke={`${s.color}18`} strokeWidth="3.5"/>
                  <circle cx="28" cy="28" r={r} fill="none" stroke={s.color} strokeWidth="3.5"
                    strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                    style={{ transform:"rotate(-90deg)", transformOrigin:"28px 28px", transition:"stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}/>
                  <foreignObject x="20" y="20" width="16" height="16">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" }}>
                      <s.icon size={14} color={s.color}/>
                    </div>
                  </foreignObject>
                </svg>
              </div>
              {/* Bottom bar */}
              <div style={{ height:3, borderRadius:2, background:`${s.color}15`, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${tick ? pct : 0}%`, background:`linear-gradient(90deg, ${s.color}80, ${s.color})`, borderRadius:2, transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
              </div>
              <div style={{ marginTop:6, fontSize:12, color:"#6b8c78" }}>{Math.round(pct)}% of {s.suffix ? s.max + s.suffix : `${s.max} target`}</div>
            </div>
          );
        })}
      </div>

      {/* ── Mini bar chart + Activity ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>

        {/* Activity feed */}
        <div style={{ padding:22, borderRadius:16, background:"#162019", border:"1px solid #1e3028" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color:"#e8f5ee" }}>Recent Activity</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#22c55e", fontWeight:700 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }} />
              LIVE
            </div>
          </div>
          {loading ? <div style={{ textAlign:"center", padding:"20px 0" }}><Spinner /></div> :
            logs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"28px 0" }}>
                <div style={{ width:48, height:48, borderRadius:12, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <ScanLine size={22} color="#2d4a38"/>
                </div>
                <div style={{ color:"#6b8c78", fontSize:13 }}>No waste logged yet.<br/>Start with the AI Scanner!</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {logs.map((log,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", transition:"all .2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(34,197,94,0.04)";e.currentTarget.style.borderColor="rgba(34,197,94,0.12)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.04)"}}>
                    <div style={{ width:30, height:30, borderRadius:8, background:`${catColor[log.category]}12`, border:`1px solid ${catColor[log.category]}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {(() => { const wc = wasteCategories.find(w=>w.id===log.category); return wc ? <wc.icon size={13} color={catColor[log.category]}/> : null; })()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, color:"#e8f5ee", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{log.item_name}</div>
                      <div style={{ fontSize:12, color:"#6b8c78" }}>{log.category} · {new Date(log.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                    </div>
                    <div style={{ padding:"2px 8px", borderRadius:100, background:"rgba(34,197,94,0.1)", fontSize:12, color:"#22c55e", fontWeight:700, flexShrink:0 }}>+{log.points_earned}pts</div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Weekly mini chart */}
        <div style={{ padding:22, borderRadius:16, background:"#162019", border:"1px solid #1e3028" }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color:"#e8f5ee", marginBottom:4 }}>This Week</div>
          <div style={{ fontSize:12, color:"#6b8c78", marginBottom:20 }}>Items logged per day</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
            {weekBars.map((v,i) => {
              const days = ["M","T","W","T","F","S","S"];
              const isMax = v === maxBar && v > 0;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                  <div style={{ width:"100%", borderRadius:"4px 4px 0 0", height:`${(v/maxBar)*80}px`, minHeight: v > 0 ? 4 : 2,
                    background: isMax ? "linear-gradient(180deg,#4ade80,#22c55e)" : v > 0 ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.08)",
                    transition:"height 1s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: isMax ? "0 0 10px rgba(34,197,94,0.4)" : "none" }} />
                  <div style={{ fontSize:12, color: isMax ? "#22c55e" : "#6b8c78", fontWeight: isMax ? 700 : 400 }}>{days[i]}</div>
                </div>
              );
            })}
          </div>

          {/* Segregation guide mini */}
          <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(34,197,94,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#6b8c78", marginBottom:10, fontWeight:600 }}><Leaf size={11} color="#6b8c78"/> Quick Guide</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {wasteCategories.map((wc,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:8, background:`${wc.color}08`, border:`1px solid ${wc.color}15` }}>
                  <wc.icon size={11} color={wc.color}/>
                  <span style={{ fontSize:12, color:wc.color, fontWeight:600 }}>{wc.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI SCANNER ───────────────────────────────────────────────────────────────
function AIScanner({ user }) {
  const [phase,       setPhase]       = useState("idle");
  const [selectedItem,setSelectedItem]= useState(null);
  const [manualInput, setManualInput] = useState("");
  const [activeTab,   setActiveTab]   = useState("upload");
  const [history,     setHistory]     = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [saveMsg,     setSaveMsg]     = useState("");
  const [uploadFile,  setUploadFile]  = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.from("waste_logs").select("*").eq("user_id", user.id)
      .order("created_at", { ascending:false }).limit(5)
      .then(({ data }) => setHistory(data || []));
  }, [user.id]);

  const catMeta = {
    recyclable: { color:C.blue,   label:"♻️ Recyclable", bin:"Blue Bin" },
    organic:    { color:C.accent, label:"🌿 Organic",    bin:"Green Bin" },
    hazardous:  { color:C.danger, label:"⚠️ Hazardous",  bin:"Red Collection" },
    general:    { color:C.muted,  label:"🗑️ General",    bin:"Black Bin" },
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    // Simulate AI scan on upload
    setPhase("scanning"); setSaveMsg("");
    setSelectedItem(aiWasteItems[Math.floor(Math.random() * aiWasteItems.length)]);
    setTimeout(() => setPhase("result"), 2400);
  };

  const handleManual = () => {
    if (!manualInput.trim()) return;
    const found = aiWasteItems.find(i => i.name.toLowerCase().includes(manualInput.toLowerCase()))
      || { name:manualInput, category:"general", confidence:78, guidance:"Place in general waste bin. Ensure it is dry and non-hazardous.", points:5 };
    setSelectedItem(found); setPhase("result");
  };

  const saveToDatabase = async () => {
    if (!selectedItem) return;
    setSaving(true);
    const co2Map = { recyclable:0.3, organic:0.1, hazardous:0.5, general:0.05 };

    const { error } = await supabase.from("waste_logs").insert({
      user_id:      user.id,
      item_name:    selectedItem.name,
      category:     selectedItem.category,
      quantity:     1,
      unit:         "items",
      confidence:   selectedItem.confidence,
      points_earned:selectedItem.points,
    });

    if (!error) {
      // Update profile points & co2
      await supabase.rpc("increment_user_stats", {
        uid:    user.id,
        points: selectedItem.points,
        co2:    co2Map[selectedItem.category] || 0.1,
      }).catch(() => {
        // fallback if RPC not set up
        supabase.from("profiles").select("green_points,co2_saved").eq("id", user.id).single()
          .then(({ data }) => {
            supabase.from("profiles").update({
              green_points: (data?.green_points || 0) + selectedItem.points,
              co2_saved:    Math.round(((data?.co2_saved || 0) + (co2Map[selectedItem.category] || 0.1)) * 100) / 100,
            }).eq("id", user.id);
          });
      });
      setSaveMsg("✓ Saved to your waste log!");
      // Refresh history
      const { data } = await supabase.from("waste_logs").select("*").eq("user_id", user.id).order("created_at", { ascending:false }).limit(5);
      setHistory(data || []);
    } else {
      setSaveMsg("⚠ Could not save. Try again.");
    }
    setSaving(false);
  };

  const reset = () => { setPhase("idle"); setSelectedItem(null); setManualInput(""); setSaveMsg(""); setUploadFile(null); setUploadPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:24 }}>
        <div className="card" style={{ padding:28 }}>
          <div className="syne" style={{ fontWeight:800, fontSize:20, color:C.text, marginBottom:6 }}>AI Waste Classifier</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Classify waste and save it directly to your Supabase log.</p>

          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {["upload","manual"].map(t => (
              <button key={t} onClick={() => { setActiveTab(t); reset(); }}
                className={`btn-ghost ${activeTab === t ? "tab-active" : ""}`}
                style={{ padding:"7px 16px", borderRadius:8, fontSize:13 }}>
                {t === "upload" ? "📁 Upload Image" : "✏️ Manual Input"}
              </button>
            ))}
          </div>

          {phase === "idle" && (
            activeTab === "upload" ? (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange} />
                <div style={{ border:`2px dashed ${C.dim}`, borderRadius:16, padding:48, textAlign:"center", cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}
                  onClick={() => fileInputRef.current?.click()}>
                  <div style={{ width:64, height:64, borderRadius:16, background:C.accentGlow, border:`1px solid ${C.dim}`, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Upload size={28} color={C.accent} />
                  </div>
                  <div style={{ fontWeight:600, color:C.text, marginBottom:6 }}>Upload Waste Image</div>
                  <div style={{ fontSize:13, color:C.muted }}>Click to browse · JPG, PNG, WEBP supported</div>
                  <div style={{ marginTop:12, fontSize:12, color:C.muted, padding:"6px 14px", background:C.accentGlow, borderRadius:100, display:"inline-block" }}>
                    AI will classify automatically on upload
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:8, display:"block" }}>Describe your waste item</label>
                <input style={{ width:"100%", padding:"12px 16px", borderRadius:10, fontSize:14, marginBottom:12 }}
                  placeholder="e.g. Plastic bottle, old battery..." value={manualInput}
                  onChange={e => setManualInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleManual()} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {aiWasteItems.slice(0,5).map((item,i) => (
                    <button key={i} className="btn-ghost" style={{ padding:"6px 14px", borderRadius:100, fontSize:12 }}
                      onClick={() => { setManualInput(item.name); setSelectedItem(item); setPhase("result"); }}>
                      {item.name}
                    </button>
                  ))}
                </div>
                <button className="btn-primary" style={{ padding:"12px 24px", borderRadius:10, fontSize:14 }} onClick={handleManual}>Classify →</button>
              </div>
            )
          )}

          {phase === "scanning" && (
            <div style={{ padding:"60px 0", textAlign:"center", position:"relative" }}>
              <div style={{ width:120, height:120, border:`2px solid ${C.accent}`, borderRadius:16, margin:"0 auto 24px", position:"relative", overflow:"hidden" }}>
                <ScanLine size={48} color={C.accent} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", opacity:0.3 }} />
                <div className="scan-line" />
              </div>
              <div className="syne" style={{ fontWeight:700, fontSize:18, color:C.text }}>Analysing...</div>
              <div style={{ color:C.muted, marginTop:8, fontSize:13 }}>AI model processing</div>
            </div>
          )}

          {phase === "result" && selectedItem && (() => {
            const meta = catMeta[selectedItem.category];
            return (
              <div className="fade-in">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <CheckCircle size={20} color={C.accent} />
                    <span style={{ fontWeight:600, color:C.text }}>Classification complete</span>
                  </div>
                  <button className="btn-ghost" style={{ padding:"6px 14px", borderRadius:8, fontSize:12 }} onClick={reset}>Scan another</button>
                </div>

                <div style={{ padding:24, borderRadius:16, background:`${meta.color}12`, border:`1px solid ${meta.color}30`, marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:22, fontWeight:700, color:C.text }}>{selectedItem.name}</div>
                      <div style={{ fontSize:18, color:meta.color, fontWeight:600 }}>{meta.label}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:28, fontWeight:800, color:meta.color, fontFamily:"Syne" }}>{selectedItem.confidence}%</div>
                      <div style={{ fontSize:12, color:C.muted }}>confidence</div>
                    </div>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:C.dim, overflow:"hidden", marginBottom:16 }}>
                    <div style={{ height:"100%", width:`${selectedItem.confidence}%`, background:meta.color, borderRadius:3 }} />
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ padding:"8px 16px", borderRadius:10, background:`${meta.color}20`, border:`1px solid ${meta.color}40`, fontSize:13, color:meta.color, fontWeight:600 }}>
                      🗑️ {meta.bin}
                    </div>
                    <div style={{ padding:"8px 16px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, fontSize:13, color:C.accent, fontWeight:600 }}>
                      +{selectedItem.points} pts
                    </div>
                    <button className="btn-primary" style={{ padding:"8px 20px", borderRadius:10, fontSize:13, marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}
                      onClick={saveToDatabase} disabled={saving || !!saveMsg}>
                      {saving ? <Spinner size={14} /> : null}
                      {saveMsg ? saveMsg : "Save to Log"}
                    </button>
                  </div>
                </div>

                <div style={{ padding:20, borderRadius:12, background:C.surface, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:600, color:C.text, marginBottom:8, fontSize:14 }}>📋 Disposal Guidance</div>
                  <p style={{ color:C.muted, fontSize:13, lineHeight:1.7 }}>{selectedItem.guidance}</p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Scan History from Supabase */}
        <div className="card" style={{ padding:20 }}>
          <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:14 }}>Scan History</div>
          {history.length === 0 ? (
            <div style={{ color:C.muted, fontSize:13 }}>No scans yet.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {history.map((log,i) => {
                const meta = catMeta[log.category];
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:meta.color, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{log.item_name}</div>
                      <div style={{ fontSize:12, color:C.muted }}>{log.category}</div>
                    </div>
                    <div style={{ fontSize:12, color:C.accent }}>+{log.points_earned}pts</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LEAFLET MAP VIEW ────────────────────────────────────────────────────────
function MapView() {
  const [hotspots,        setHotspots]        = useState([]);
  const [wasteLogs,       setWasteLogs]       = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedLog,     setSelectedLog]     = useState(null);
  const [filter,          setFilter]          = useState("all");
  const [showLogs,        setShowLogs]        = useState(true);
  const [loading,         setLoading]         = useState(true);
  const mapRef          = useRef(null);
  const mapObjRef       = useRef(null);
  const hotspotMarkersRef = useRef([]);
  const logMarkersRef     = useRef([]);

  useEffect(() => {
    const load = async () => {
      const [{ data: hs }, { data: logs }] = await Promise.all([
        supabase.from("hotspots").select("*"),
        supabase.from("waste_logs").select("id,item_name,category,lat,lng,address,created_at,points_earned").not("lat", "is", null).not("lng", "is", null),
      ]);
      setHotspots(hs || []);
      setWasteLogs(logs || []);
      setLoading(false);
    };
    load();
  }, []);

  // Dynamically load Leaflet and init map
  useEffect(() => {
    if (loading || !mapRef.current || mapObjRef.current) return;
    if (window.L) { initMap(); return; }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);
    return () => {
      if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null; }
    };
  }, [loading]);

  const levelColor = { high:"#ef4444", med:"#f59e0b", low:"#22c55e" };
  const levelLabel = { high:"HIGH", med:"MED", low:"LOW" };
  const catColor   = { recyclable:"#3b82f6", organic:"#22c55e", hazardous:"#ef4444", general:"#6b8c78" };
  const catEmoji   = { recyclable:"♻️", organic:"🌿", hazardous:"⚠️", general:"🗑️" };

  const initMap = () => {
    if (!window.L || !mapRef.current || mapObjRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center:[28.63,77.22], zoom:11, zoomControl:true });

    // ── Light tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapObjRef.current = map;
    renderHotspotMarkers(map, hotspots, "all");
    renderLogMarkers(map, wasteLogs);
  };

  const renderHotspotMarkers = (map, spots, fil) => {
    const L = window.L;
    if (!L || !map) return;
    hotspotMarkersRef.current.forEach(m => map.removeLayer(m));
    hotspotMarkersRef.current = [];
    spots.filter(h => fil === "all" || h.level === fil).forEach(h => {
      const col = levelColor[h.level] || "#22c55e";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;border-radius:50%;background:${col}22;border:2.5px solid ${col};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${col}44;">
          <div style="width:12px;height:12px;border-radius:50%;background:${col};box-shadow:0 0 6px ${col};"></div>
        </div>`,
        iconSize:[34,34], iconAnchor:[17,17], popupAnchor:[0,-20],
      });
      const marker = L.marker([h.lat, h.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:190px;font-family:'DM Sans',sans-serif;">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#1a1a1a;">${h.name}</div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
            <span style="padding:2px 9px;border-radius:100px;background:${col}18;border:1px solid ${col}40;color:${col};font-size:10px;font-weight:700;">${levelLabel[h.level]}</span>
            <span style="font-size:11px;color:#888;">${h.trend === "up" ? "↑ Increasing" : "↓ Decreasing"}</span>
          </div>
          <div style="font-size:12px;color:#555;margin-bottom:3px;">Volume: <b style="color:#222;">${h.volume} kg</b></div>
          <div style="font-size:12px;color:#555;">Trucks needed: <b style="color:#222;">${h.collections_needed}</b></div>
        </div>
      `);
      marker.on("click", () => setSelectedHotspot(h));
      hotspotMarkersRef.current.push(marker);
    });
  };

  const renderLogMarkers = (map, logs) => {
    const L = window.L;
    if (!L || !map) return;
    logMarkersRef.current.forEach(m => map.removeLayer(m));
    logMarkersRef.current = [];
    logs.forEach(log => {
      if (!log.lat || !log.lng) return;
      const col = catColor[log.category] || "#6b8c78";
      const emoji = catEmoji[log.category] || "🗑️";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:30px;height:30px;border-radius:8px;background:white;border:2px solid ${col};display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.15);cursor:pointer;">${emoji}</div>`,
        iconSize:[30,30], iconAnchor:[15,15], popupAnchor:[0,-18],
      });
      const marker = L.marker([log.lat, log.lng], { icon }).addTo(map);
      const date = new Date(log.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
      marker.bindPopup(`
        <div style="min-width:160px;font-family:'DM Sans',sans-serif;">
          <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#1a1a1a;">${log.item_name}</div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
            <span style="padding:2px 8px;border-radius:100px;background:${col}15;border:1px solid ${col}40;color:${col};font-size:10px;font-weight:600;text-transform:capitalize;">${log.category}</span>
          </div>
          <div style="font-size:11px;color:#777;">${log.address || ""}</div>
          <div style="font-size:11px;color:#999;margin-top:3px;">${date} · +${log.points_earned} pts</div>
        </div>
      `);
      marker.on("click", () => setSelectedLog(log));
      logMarkersRef.current.push(marker);
    });
  };

  // Re-render hotspot markers on filter change
  useEffect(() => {
    if (mapObjRef.current && hotspots.length > 0) renderHotspotMarkers(mapObjRef.current, hotspots, filter);
  }, [filter, hotspots]);

  // Toggle log pins visibility
  useEffect(() => {
    if (!mapObjRef.current) return;
    logMarkersRef.current.forEach(m => {
      if (showLogs) mapObjRef.current.addLayer(m);
      else mapObjRef.current.removeLayer(m);
    });
  }, [showLogs]);

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div className="syne" style={{ fontWeight:700, fontSize:17, color:C.text }}>Delhi Waste Map</div>
              <div style={{ fontSize:12, color:C.muted }}>Hotspots + logged waste pins · Live from Supabase</div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["all","high","med","low"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn-ghost ${filter === f ? "tab-active" : ""}`}
                  style={{ padding:"5px 10px", borderRadius:8, fontSize:12 }}>
                  {f === "all" ? "All Zones" : f === "high" ? "🔴" : f === "med" ? "🟡" : "🟢"}
                </button>
              ))}
              <button onClick={() => setShowLogs(!showLogs)}
                className={`btn-ghost ${showLogs ? "tab-active" : ""}`}
                style={{ padding:"5px 10px", borderRadius:8, fontSize:12 }}>
                📍 Waste Logs
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ height:480, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner size={32} /></div>
          ) : (
            <div ref={mapRef} style={{ height:480, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}` }} />
          )}

          {/* Legend */}
          <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Legend:</div>
            {[["#ef4444","High Hotspot"],["#f59e0b","Med Hotspot"],["#22c55e","Low Hotspot"]].map(([c,l],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.muted }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
            {[["♻️","Recyclable"],["🌿","Organic"],["⚠️","Hazardous"],["🗑️","General"]].map(([e,l],i)=>(
              <div key={i} style={{ fontSize:12, color:C.muted }}>{e} {l}</div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {(selectedHotspot || selectedLog) ? (
            <div className="card fade-in" style={{ padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text }}>
                  {selectedHotspot ? "Zone Detail" : "Waste Log Detail"}
                </div>
                <button onClick={() => { setSelectedHotspot(null); setSelectedLog(null); }}
                  style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><X size={16} /></button>
              </div>
              {selectedHotspot && (
                <>
                  <div style={{ padding:16, borderRadius:12, background:`${levelColor[selectedHotspot.level]}15`, border:`1px solid ${levelColor[selectedHotspot.level]}30`, marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:16, color:C.text }}>{selectedHotspot.name}</div>
                    <div style={{ display:"inline-flex", marginTop:6, padding:"3px 10px", borderRadius:100, background:`${levelColor[selectedHotspot.level]}20`, fontSize:12, color:levelColor[selectedHotspot.level], fontWeight:600 }}>
                      {selectedHotspot.level?.toUpperCase()} PRIORITY
                    </div>
                  </div>
                  {[["Volume", `${selectedHotspot.volume} kg`], ["Trucks needed", selectedHotspot.collections_needed], ["Trend", selectedHotspot.trend === "up" ? "↑ Increasing" : "↓ Decreasing"]].map(([k,v],i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize:13, color:C.muted }}>{k}</span>
                      <span style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </>
              )}
              {selectedLog && (
                <>
                  <div style={{ padding:16, borderRadius:12, background:`${catColor[selectedLog.category]}12`, border:`1px solid ${catColor[selectedLog.category]}30`, marginBottom:14 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{selectedLog.item_name}</div>
                    <div style={{ fontSize:12, color:catColor[selectedLog.category], fontWeight:600, marginTop:4, textTransform:"capitalize" }}>{catEmoji[selectedLog.category]} {selectedLog.category}</div>
                  </div>
                  {[
                    ["Location", selectedLog.address || `${selectedLog.lat?.toFixed(4)}, ${selectedLog.lng?.toFixed(4)}`],
                    ["Date", new Date(selectedLog.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })],
                    ["Points", `+${selectedLog.points_earned} pts`],
                  ].map(([k,v],i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize:13, color:C.muted }}>{k}</span>
                      <span style={{ fontSize:13, color:C.text, fontWeight:600, textAlign:"right", maxWidth:160 }}>{v}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding:18 }}>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Click any marker for details</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(239,68,68,.1)", fontSize:12, color:C.danger }}>● Hotspot zones</div>
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(34,197,94,.1)", fontSize:12, color:C.accent }}>📍 Waste logs</div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding:18 }}>
            <div className="syne" style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>Active Hotspots</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>{hotspots.length} zones · {wasteLogs.length} pinned logs</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {hotspots.filter(h => filter === "all" || h.level === filter).map((h,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}`, cursor:"pointer" }}
                  onClick={() => { setSelectedHotspot(h); setSelectedLog(null); if (mapObjRef.current) mapObjRef.current.setView([h.lat, h.lng], 13); }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:levelColor[h.level], flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{h.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{h.volume} kg · {h.collections_needed} truck{h.collections_needed>1?"s":""}</div>
                  </div>
                  {h.trend === "up" ? <TrendingUp size={12} color={C.danger} /> : <TrendingDown size={12} color={C.accent} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD WASTE ────────────────────────────────────────────────────────────────
function AddWaste({ user }) {
  const [form,      setForm]      = useState({ name:"", category:"", quantity:"1", unit:"items", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [location,  setLocation]  = useState(null); // { lat, lng, address }
  const [gpsLoading,setGpsLoading]= useState(false);
  const [gpsError,  setGpsError]  = useState("");

  const handleGetGPS = () => {
    if (!navigator.geolocation) { setGpsError("Geolocation not supported by your browser."); return; }
    setGpsLoading(true); setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Reverse geocode using OpenStreetMap Nominatim (free, no key needed)
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          address = data.display_name?.split(",").slice(0,3).join(", ") || address;
        } catch (_) {}
        setLocation({ lat, lng, address });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.code === 1 ? "Location permission denied. Please allow access in browser settings." : "Could not get location. Try again.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category) { setError("Item name and category are required."); return; }
    setLoading(true); setError("");
    const pts = { recyclable:10, organic:5, hazardous:20, general:3 }[form.category];
    const co2Map = { recyclable:0.3, organic:0.1, hazardous:0.5, general:0.05 };

    const insertData = {
      user_id:       user.id,
      item_name:     form.name,
      category:      form.category,
      quantity:      parseFloat(form.quantity) || 1,
      unit:          form.unit,
      notes:         form.notes,
      points_earned: pts,
    };
    if (location) {
      insertData.lat = location.lat;
      insertData.lng = location.lng;
      insertData.address = location.address;
    }

    const { error: insertError } = await supabase.from("waste_logs").insert(insertData);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Update profile
    const { data: prof } = await supabase.from("profiles").select("green_points,co2_saved").eq("id", user.id).single();
    await supabase.from("profiles").update({
      green_points: (prof?.green_points || 0) + pts,
      co2_saved:    Math.round(((prof?.co2_saved || 0) + (co2Map[form.category] || 0.1)) * 100) / 100,
    }).eq("id", user.id);

    setResult({ ...form, pts, cat: wasteCategories.find(c => c.id === form.category), location });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted && result) return (
    <div className="fade-in" style={{ padding:28 }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <div className="card glow" style={{ padding:36, textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:C.accentGlow, border:`1px solid ${C.accent}`, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CheckCircle size={32} color={C.accent} />
          </div>
          <div className="syne" style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:8 }}>Saved to Supabase!</div>
          <div style={{ color:C.muted, marginBottom:8 }}>{result.name} · {result.quantity} {result.unit}</div>
          {result.location && (
            <div style={{ fontSize:12, color:C.accent, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <MapPin size={12} /> {result.location.address}
            </div>
          )}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:24 }}>
            <div style={{ padding:"10px 20px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}` }}>
              <div className="syne" style={{ fontSize:22, fontWeight:800, color:C.accent }}>+{result.pts}</div>
              <div style={{ fontSize:12, color:C.muted }}>Points</div>
            </div>
            <div style={{ padding:"10px 20px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
              <div className="syne" style={{ fontSize:16, fontWeight:800, color:C.text }}>{result.cat?.label}</div>
              <div style={{ fontSize:12, color:C.muted }}>Category</div>
            </div>
          </div>
          <button className="btn-primary" style={{ padding:"12px 32px", borderRadius:10, fontSize:14 }}
            onClick={() => { setSubmitted(false); setForm({ name:"", category:"", quantity:"1", unit:"items", notes:"" }); setLocation(null); }}>
            Log Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ padding:28 }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <div className="card" style={{ padding:32 }}>
          <div className="syne" style={{ fontWeight:800, fontSize:20, color:C.text, marginBottom:6 }}>Add Waste Item</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:28 }}>Log a waste item — saved directly to Supabase</p>

          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Item Name *</label>
              <input style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                placeholder="e.g. Plastic bottle, food scraps..." value={form.name}
                onChange={e => setForm({...form, name:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:10, display:"block" }}>Waste Category *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {wasteCategories.map(wc => (
                  <div key={wc.id} onClick={() => setForm({...form, category:wc.id})}
                    style={{ padding:14, borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .2s",
                      background: form.category === wc.id ? `${wc.color}18` : C.surface,
                      border:`1px solid ${form.category === wc.id ? wc.color : C.border}` }}>
                    <wc.icon size={16} color={wc.color} />
                    <span style={{ fontSize:14, color: form.category === wc.id ? wc.color : C.text, fontWeight: form.category === wc.id ? 600 : 400 }}>{wc.label}</span>
                    {form.category === wc.id && <CheckCircle size={14} color={wc.color} style={{ marginLeft:"auto" }} />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Quantity</label>
                <input type="number" style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                  value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Unit</label>
                <select style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                  value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}>
                  {["items","kg","litres","bags"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* ── Location Section ── */}
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:8, display:"block" }}>
                📍 Location <span style={{ color:C.dim }}>(optional — shown as pin on map)</span>
              </label>
              {location ? (
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:"rgba(34,197,94,.08)", border:`1px solid ${C.dim}` }}>
                  <MapPin size={15} color={C.accent} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{location.address}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</div>
                  </div>
                  <button onClick={() => setLocation(null)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleGetGPS}
                    disabled={gpsLoading}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10, border:`1px dashed ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", transition:"all .2s", width:"100%" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.dim; e.currentTarget.style.color = C.muted; }}>
                    {gpsLoading ? <Spinner size={15} /> : <MapPin size={15} />}
                    {gpsLoading ? "Getting your location..." : "Use my current GPS location"}
                  </button>
                  {gpsError && <div style={{ fontSize:12, color:C.danger, marginTop:6 }}>⚠ {gpsError}</div>}
                  <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>Click the button above — your browser will ask for permission</div>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Notes (optional)</label>
              <textarea style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14, resize:"vertical", minHeight:80, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}
                placeholder="Any details..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} />
            </div>

            {error && <div className="error-box">⚠ {error}</div>}

            <button className="btn-primary glow" style={{ padding:"14px 0", borderRadius:12, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onClick={handleSubmit} disabled={loading}>
              {loading && <Spinner size={16} />}
              Save to Database →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function Analytics({ isAdmin, user }) {
  const [logs,      setLogs]      = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      if (isAdmin) {
        const { data } = await supabase.from("waste_logs").select("*").order("created_at", { ascending:false }).limit(200);
        setLogs(data || []);
        const { data: lb } = await supabase.from("profiles").select("name,green_points,co2_saved").order("green_points", { ascending:false }).limit(10);
        setLeaderboard(lb || []);
      } else {
        const { data } = await supabase.from("waste_logs").select("*").eq("user_id", user.id).order("created_at", { ascending:false }).limit(100);
        setLogs(data || []);
      }
      setLoading(false);
    };
    load();
  }, [isAdmin, user?.id]);

  // Compute weekly counts from real logs
  const weeklyData = (() => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const counts = new Array(7).fill(0);
    const now = new Date();
    logs.forEach(log => {
      const d = new Date(log.created_at);
      const diff = Math.floor((now - d) / 86400000);
      if (diff < 7) {
        const idx = (d.getDay() + 6) % 7;
        counts[idx]++;
      }
    });
    return { labels:days, values:counts };
  })();

  const catBreakdown = (() => {
    const total = logs.length || 1;
    return wasteCategories.map(wc => ({
      cat: wc.label,
      color: wc.color,
      pct: Math.round((logs.filter(l => l.category === wc.id).length / total) * 100),
    }));
  })();

  const totalPts  = logs.reduce((s,l) => s + (l.points_earned||0), 0);
  const maxBar    = Math.max(...weeklyData.values, 1);

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      {loading ? <div style={{ textAlign:"center", padding:60 }}><Spinner size={32} /></div> : (
        <>
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { label:"Total Items",      value:logs.length,    icon:Trash2,    color:C.muted },
              { label:"Points Earned",    value:totalPts,       icon:Star,      color:C.accent },
              { label:"Recyclable",       value:logs.filter(l=>l.category==="recyclable").length, icon:Recycle, color:C.blue },
              { label:"Hazardous Logged", value:logs.filter(l=>l.category==="hazardous").length,  icon:AlertTriangle, color:C.danger },
            ].map((k,i) => (
              <div key={i} className="card" style={{ padding:22 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{k.label}</span>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${k.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <k.icon size={14} color={k.color} />
                  </div>
                </div>
                <div className="syne" style={{ fontSize:26, fontWeight:800, color:C.text }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
            {/* Bar Chart */}
            <div className="card" style={{ padding:28 }}>
              <div className="syne" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:24 }}>
                {isAdmin ? "All Users — Items This Week" : "Your Items This Week"}
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:160 }}>
                {weeklyData.values.map((v,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ fontSize:12, color:C.muted }}>{v}</div>
                    <div className="chart-bar" style={{ width:"100%", height:`${(v/maxBar)*120}px`, background:v===Math.max(...weeklyData.values)?C.accent:`${C.accent}50`, minHeight:4 }} />
                    <div style={{ fontSize:12, color:C.muted }}>{weeklyData.labels[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="card" style={{ padding:28 }}>
              <div className="syne" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:20 }}>Category Breakdown</div>
              {catBreakdown.map((c,i) => (
                <div key={i} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:C.text }}>{c.cat}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{c.pct}%</span>
                  </div>
                  <div style={{ height:7, borderRadius:4, background:C.dim, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${c.pct}%`, background:c.color, borderRadius:4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard (admin) or Schedule */}
          {isAdmin && leaderboard.length > 0 && (
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div className="syne" style={{ fontWeight:700, fontSize:16, color:C.text }}>🏆 Citizen Leaderboard</div>
                <button className="btn-ghost" style={{ padding:"6px 14px", borderRadius:8, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                  <Download size={13} /> Export
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 120px 100px", gap:0 }}>
                <div style={{ padding:"8px 12px", fontSize:12, color:C.muted, gridColumn:"1/-1", display:"grid", gridTemplateColumns:"40px 1fr 120px 100px", background:C.surface, borderRadius:8, marginBottom:6 }}>
                  <span>#</span><span>Name</span><span>Green Points</span><span>CO₂ Saved</span>
                </div>
                {leaderboard.map((row,i) => (
                  <div key={i} style={{ padding:"10px 12px", gridColumn:"1/-1", display:"grid", gridTemplateColumns:"40px 1fr 120px 100px", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
                    <span style={{ fontSize:14, color:C.muted, fontWeight:700 }}>#{i+1}</span>
                    <span style={{ fontSize:14, color:C.text, fontWeight:500 }}>{row.name}</span>
                    <span style={{ fontSize:13, color:C.accent, fontWeight:600 }}>{row.green_points}</span>
                    <span style={{ fontSize:13, color:C.blue }}>{row.co2_saved} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="card" style={{ padding:24 }}>
              <div className="syne" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:20 }}>Today's Collection Schedule</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {scheduleItems.map((s,i) => {
                  const sc = s.status==="completed"?C.accent:s.status==="in-progress"?C.warn:C.muted;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 18px", borderRadius:12, background:C.surface, border:`1px solid ${C.border}` }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:sc, flexShrink:0 }} />
                      <div style={{ minWidth:140, fontWeight:600, fontSize:14, color:C.text }}>{s.zone}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, color:C.muted, fontSize:13, minWidth:100 }}><Clock size={12} />{s.time}</div>
                      <div style={{ flex:1, fontSize:13, color:C.muted }}>{s.type} waste</div>
                      <div style={{ fontSize:12, color:C.muted }}>{s.truck}</div>
                      <div style={{ padding:"4px 12px", borderRadius:100, background:`${sc}18`, border:`1px solid ${sc}30`, fontSize:12, color:sc, fontWeight:600, textTransform:"capitalize" }}>{s.status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const [hotspots,  setHotspots]  = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [logCount,  setLogCount]  = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: hs }, { count: uc }, { count: lc }] = await Promise.all([
        supabase.from("hotspots").select("*"),
        supabase.from("profiles").select("*", { count:"exact", head:true }),
        supabase.from("waste_logs").select("*", { count:"exact", head:true }),
      ]);
      setHotspots(hs || []);
      setUserCount(uc || 0);
      setLogCount(lc || 0);
      setLoading(false);
    };
    load();
  }, []);

  const levelColor = { high:C.danger, med:C.warn, low:C.accent };

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      <div className="card" style={{ padding:24, background:"linear-gradient(135deg, #1a0f0f 0%, #200f0f 100%)", borderColor:"rgba(239,68,68,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <Shield size={16} color={C.danger} />
              <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>ADMIN CONTROL CENTRE</span>
            </div>
            <div className="syne" style={{ fontSize:24, fontWeight:800, color:C.text }}>Municipal Dashboard</div>
            <div style={{ color:C.muted, marginTop:4, fontSize:14 }}>Delhi Waste Management Authority · Live Supabase Data</div>
          </div>
          {!loading && (
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", textAlign:"center" }}>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.danger }}>{hotspots.filter(h=>h.level==="high").length}</div>
                <div style={{ fontSize:12, color:C.muted }}>Critical Zones</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, textAlign:"center" }}>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.accent }}>{userCount}</div>
                <div style={{ fontSize:12, color:C.muted }}>Registered Users</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.3)", textAlign:"center" }}>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.blue }}>{logCount}</div>
                <div style={{ fontSize:12, color:C.muted }}>Total Logs</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? <div style={{ textAlign:"center", padding:60 }}><Spinner size={32} /></div> : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div className="card" style={{ padding:24 }}>
              <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>🔴 Critical Zones</div>
              {hotspots.filter(h=>h.level==="high").length === 0 ? (
                <div style={{ color:C.muted, fontSize:13 }}>No critical zones right now.</div>
              ) : hotspots.filter(h=>h.level==="high").map((h,i,arr) => (
                <div key={i} style={{ padding:"14px 0", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontWeight:600, color:C.text }}>{h.name}</span>
                    <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>{h.volume} kg</span>
                  </div>
                  <div style={{ height:5, borderRadius:3, background:C.dim, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ height:"100%", width:`${Math.min((h.volume/3000)*100,100)}%`, background:C.danger, borderRadius:3 }} />
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn-primary" style={{ padding:"5px 14px", borderRadius:8, fontSize:12 }}>Dispatch</button>
                    <button className="btn-ghost"   style={{ padding:"5px 14px", borderRadius:8, fontSize:12 }}>Details</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding:24 }}>
              <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>All Hotspots</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {hotspots.map((h,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:levelColor[h.level], flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{h.name}</div>
                      <div style={{ fontSize:12, color:C.muted }}>{h.volume} kg · {h.collections_needed} truck{h.collections_needed>1?"s":""}</div>
                    </div>
                    <div style={{ padding:"2px 8px", borderRadius:100, background:`${levelColor[h.level]}18`, fontSize:12, color:levelColor[h.level], fontWeight:600, textTransform:"uppercase" }}>{h.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>📅 Today's Schedule</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {scheduleItems.map((s,i) => {
                const sc = s.status==="completed"?C.accent:s.status==="in-progress"?C.warn:C.muted;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sc, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.zone}</div>
                      <div style={{ fontSize:12, color:C.muted }}>{s.time} · {s.type} · {s.truck}</div>
                    </div>
                    <div style={{ padding:"3px 10px", borderRadius:100, background:`${sc}18`, fontSize:12, color:sc, fontWeight:600, textTransform:"capitalize" }}>{s.status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── HOTSPOTS PAGE ────────────────────────────────────────────────────────────
function HotspotsPage() {
  const [hotspots, setHotspots] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const levelColor = { high:C.danger, med:C.warn, low:C.accent };

  useEffect(() => {
    supabase.from("hotspots").select("*").order("volume", { ascending:false })
      .then(({ data }) => { setHotspots(data||[]); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding:28, textAlign:"center" }}><Spinner size={32} /></div>;

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[["High", "high", C.danger], ["Medium", "med", C.warn], ["Low", "low", C.accent]].map(([l,k,c],i) => (
          <div key={i} className="card" style={{ padding:20, borderColor:`${c}30` }}>
            <div style={{ fontSize:12, color:C.muted }}>{l} Priority Zones</div>
            <div className="syne" style={{ fontSize:32, fontWeight:800, color:c, marginTop:4 }}>{hotspots.filter(h=>h.level===k).length}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {hotspots.map((h,i) => {
          const col = levelColor[h.level];
          return (
            <div key={i} className="card" style={{ padding:22, borderColor:`${col}25` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${col}18`, border:`1px solid ${col}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Radio size={20} color={col} />
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16, color:C.text }}>{h.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>Lat: {h.lat} · Lng: {h.lng}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ textAlign:"right" }}>
                    <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.text }}>{h.volume} kg</div>
                    <div style={{ fontSize:12, color:C.muted }}>volume</div>
                  </div>
                  <div style={{ padding:"6px 14px", borderRadius:100, background:`${col}18`, border:`1px solid ${col}30`, fontSize:12, color:col, fontWeight:700, textTransform:"uppercase" }}>{h.level}</div>
                </div>
              </div>
              <div style={{ marginTop:16, display:"flex", gap:20 }}>
                <div style={{ fontSize:13, color:C.muted }}>🚛 {h.collections_needed} collection{h.collections_needed>1?"s":""} needed</div>
                <div style={{ fontSize:13, color: h.trend==="up" ? C.danger : C.accent }}>
                  {h.trend==="up" ? "↑ Increasing" : "↓ Decreasing"}
                </div>
              </div>
              <div style={{ marginTop:14, height:5, borderRadius:3, background:C.dim }}>
                <div style={{ height:"100%", width:`${Math.min(Math.round(h.volume/30),100)}%`, background:col, borderRadius:3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const sectionTitles = {
  dashboard:"My Dashboard", "admin-dashboard":"Admin Dashboard",
  scanner:"AI Scanner & Decoder", map:"Waste Map", hotspots:"Waste Hotspots",
  "add-waste":"Add Waste", analytics:"Analytics", schedule:"Collection Schedule",
  users:"User Management", settings:"Settings",
};

function AppShell({ user, onLogout }) {
  const [section, setSection] = useState(user.role === "admin" ? "admin-dashboard" : "dashboard");

  const renderSection = () => {
    switch (section) {
      case "dashboard":       return <UserDashboard user={user} />;
      case "admin-dashboard": return <AdminDashboard />;
      case "scanner":         return <AIScanner user={user} />;
      case "map":             return <MapView />;
      case "hotspots":        return <HotspotsPage />;
      case "add-waste":       return <AddWaste user={user} />;
      case "analytics":       return <Analytics isAdmin={user.role==="admin"} user={user} />;
      case "schedule":        return <Analytics isAdmin={true} user={user} />;
      case "users":           return (
        <div className="fade-in" style={{ padding:28 }}>
          <div className="card" style={{ padding:24 }}>
            <div className="syne" style={{ fontWeight:700, fontSize:17, color:C.text, marginBottom:8 }}>Registered Citizens</div>
            <div style={{ color:C.muted, fontSize:14 }}>User management — data lives in your Supabase profiles table.</div>
          </div>
        </div>
      );
      default: return <div style={{ padding:28, color:C.muted }}>Coming soon</div>;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar user={user} activeSection={section} setActiveSection={setSection} onLogout={onLogout} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TopBar title={sectionTitles[section]||"Verdian"} user={user} />
        <div style={{ flex:1, overflowY:"auto" }}>{renderSection()}</div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,    setPage]    = useState("landing");
  const [user,    setUser]    = useState(null);
  const [booting, setBooting] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({ id:session.user.id, email:session.user.email, name:profile?.name||session.user.email.split("@")[0], role:profile?.role||"user", ...profile });
        setPage("app");
      }
      setBooting(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") { setUser(null); setPage("landing"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setPage("landing");
  };

  if (booting) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <div style={{ width:48, height:48, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Recycle size={24} color={C.accent} />
      </div>
      <Spinner size={24} />
      <div style={{ fontSize:13, color:C.muted }}>Connecting to Supabase...</div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {page === "landing" && <LandingPage onNavigate={setPage} />}
      {page === "auth"    && <AuthPage onLogin={(u) => { setUser(u); setPage("app"); }} />}
      {page === "app" && user && <AppShell user={user} onLogout={handleLogout} />}
    </>
  );
}
