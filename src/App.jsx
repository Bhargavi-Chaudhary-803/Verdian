import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf, Trash2, MapPin, BarChart3, LogOut,
  User, Bell, Upload, CheckCircle, AlertTriangle,
  Recycle, TrendingUp, TrendingDown, Clock, Shield, Users,
  Map, ScanLine, Plus, X, Star, Activity, Download,
  Home, Radio, Settings, Loader, Award, Calendar
} from "lucide-react";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://fhitqdahjiupsehqevta.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaXRxZGFoaml1cHNlaHFldnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU5NjgsImV4cCI6MjA4OTY4MTk2OH0.JrqjT_AGvcwDp5l3oAPsMujUrim8zWoLxHtwONXH5h8"
);

// ─── Preload Leaflet script at module level (avoids timing issues) ──────────────
if (typeof window !== "undefined" && !window.__leafletLoading) {
  window.__leafletLoading = true;
  const s = document.createElement("script");
  s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  s.onload = () => { window.__leafletReady = true; };
  document.head.appendChild(s);
}

// ─── Color Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:"#f0fdf4",        // very light green-white page background
  surface:"#ffffff",   // white surfaces / sidebar
  card:"#ffffff",      // white cards
  border:"#d1fae5",    // soft green border
  accent:"#16a34a",    // darker green for contrast on light bg
  accentDim:"#15803d",
  accentGlow:"rgba(22,163,74,0.10)",
  warn:"#d97706", danger:"#dc2626", blue:"#2563eb",
  text:"#14532d",      // deep green for primary text — great contrast
  muted:"#4b7c5a",     // medium green-grey for secondary text
  dim:"#bbf7d0",       // light green for dividers / subtle fills
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:${C.bg}; color:${C.text}; font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#f0fdf4; }
  ::-webkit-scrollbar-thumb { background:#bbf7d0; border-radius:2px; }
  .syne { font-family:'Syne',sans-serif; }
  .heading { font-family:'DM Sans',sans-serif; font-weight:700; letter-spacing:-0.02em; }
  .glow { box-shadow:0 0 24px rgba(22,163,74,0.15),0 2px 8px rgba(22,163,74,0.08),inset 0 1px 0 rgba(22,163,74,0.1); }
  .glow-sm { box-shadow:0 2px 12px rgba(22,163,74,0.2),0 0 0 1px rgba(22,163,74,0.1); }
  .pulse-dot { width:8px;height:8px;background:${C.accent};border-radius:50%;animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
  .scan-line { position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${C.accent},transparent);animation:scan 2s linear infinite; }
  @keyframes scan { 0%{top:0%} 100%{top:100%} }
  .fade-in { animation:fadeIn .4s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .tab-active { background:rgba(22,163,74,0.1);border-color:${C.accent}!important;color:${C.accent}!important; }
  .btn-primary { background:${C.accent};color:#ffffff;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s; }
  .btn-primary:hover { background:#15803d;transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  .btn-ghost { background:transparent;border:1px solid ${C.border};color:${C.muted};cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s; }
  .btn-ghost:hover { border-color:${C.accent};color:${C.accent}; }
  input,textarea,select { background:#f8fffe;border:1px solid ${C.border};color:${C.text};font-family:'DM Sans',sans-serif;outline:none;transition:border .2s; }
  input:focus,textarea:focus,select:focus { border-color:${C.accent};background:#ffffff; }
  .sidebar-link { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;color:${C.muted};transition:all .2s;border:1px solid transparent; }
  .sidebar-link:hover,.sidebar-link.active { background:rgba(22,163,74,0.08);border-color:${C.dim};color:${C.accent}; }
  .card { background:${C.card};border:1px solid ${C.border};border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.04); }
  .chart-bar { border-radius:4px 4px 0 0;transition:all .3s; }
  .notif-dot { position:absolute;top:2px;right:2px;width:6px;height:6px;background:${C.danger};border-radius:50%; }
  .error-box { background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:10px 14px;color:${C.danger};font-size:13px; }
  .success-box { background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:10px 14px;color:${C.accent};font-size:13px; }
  .leaflet-container { border-radius:12px; }
  .leaflet-popup-content-wrapper { background:#ffffff;border:1px solid #e2e8f0;color:#1a202c;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.12); }
  .leaflet-popup-tip { background:#ffffff; }
  .leaflet-popup-content { margin:14px 18px;font-family:'DM Sans',sans-serif; }
  .leaflet-popup-close-button { color:#888 !important; }
  .leaflet-control-zoom a { background:#ffffff !important;color:#16a34a !important;border-color:#d1fae5 !important;font-weight:700 !important; }
  .leaflet-control-zoom a:hover { background:#f0fdf4 !important; }
  .leaflet-control-attribution { background:rgba(255,255,255,0.85) !important;color:#888 !important;font-size:12px; }
  .leaflet-control-attribution a { color:#16a34a !important; }
`;

// ─── Static data ──────────────────────────────────────────────────────────────
const wasteCategories = [
  { id:"recyclable", label:"Recyclable", icon:Recycle,       color:C.blue,   examples:["Paper","Plastic PET","Glass","Metal cans"] },
  { id:"organic",    label:"Organic",    icon:Leaf,          color:C.accent, examples:["Food scraps","Garden waste","Coffee grounds"] },
  { id:"hazardous",  label:"Hazardous",  icon:AlertTriangle, color:C.danger, examples:["Batteries","Paint","Chemicals","E-waste"] },
  { id:"general",    label:"General",    icon:Trash2,        color:C.muted,  examples:["Mixed plastic","Styrofoam","Contaminated items"] },
];

const aiWasteItems = [
  { name:"Plastic Bottle", category:"recyclable", confidence:94, guidance:"Rinse and place in blue bin. Remove cap separately.", points:10 },
  { name:"Apple Core",     category:"organic",    confidence:99, guidance:"Place in green bin. Compostable.", points:5 },
  { name:"Old Battery",    category:"hazardous",  confidence:97, guidance:"Take to nearest e-waste collection point.", points:20 },
  { name:"Newspaper",      category:"recyclable", confidence:91, guidance:"Keep dry and bundle with other paper.", points:8 },
  { name:"Leftover Food",  category:"organic",    confidence:96, guidance:"Seal in a bag and place in green compost bin.", points:5 },
  { name:"Paint Can",      category:"hazardous",  confidence:88, guidance:"Contact municipal hazardous waste disposal.", points:25 },
];

const scheduleItems = [
  { zone:"Karol Bagh",   time:"07:00 AM", type:"Mixed",      status:"completed",   truck:"DL-01-CX" },
  { zone:"Lajpat Nagar", time:"09:30 AM", type:"Organic",    status:"in-progress", truck:"DL-03-GR" },
  { zone:"Rohini",       time:"11:00 AM", type:"Recyclable", status:"pending",     truck:"DL-07-BC" },
  { zone:"Saket",        time:"02:00 PM", type:"Hazardous",  status:"pending",     truck:"DL-05-HZ" },
  { zone:"Mayur Vihar",  time:"04:30 PM", type:"General",    status:"pending",     truck:"DL-09-MW" },
];


// ─── SEED SAMPLE DATA ────────────────────────────────────────────────────────
// Runs once when app mounts. Inserts demo data if tables are empty.
const SEED_USER_ID = "demo-seed-user-00000000-0000-0000-0000-000000000001";

async function seedSampleData() {
  // --- Hotspots ---
  const { count: hsCount } = await supabase.from("hotspots").select("*", { count:"exact", head:true });
  if (!hsCount || hsCount === 0) {
    await supabase.from("hotspots").insert([
      { name:"Karol Bagh Market",    lat:28.6519, lng:77.1909, level:"high", volume:2840, trend:"up",   collections_needed:3 },
      { name:"Lajpat Nagar",         lat:28.5677, lng:77.2437, level:"high", volume:2100, trend:"up",   collections_needed:2 },
      { name:"Rohini Sector 14",     lat:28.7041, lng:77.1025, level:"med",  volume:1450, trend:"down", collections_needed:2 },
      { name:"Saket District Centre",lat:28.5245, lng:77.2066, level:"med",  volume:1120, trend:"up",   collections_needed:1 },
      { name:"Mayur Vihar Phase 1",  lat:28.6082, lng:77.2941, level:"low",  volume:620,  trend:"down", collections_needed:1 },
      { name:"Dwarka Sector 10",     lat:28.5826, lng:77.0595, level:"low",  volume:480,  trend:"down", collections_needed:1 },
      { name:"Connaught Place",      lat:28.6315, lng:77.2167, level:"high", volume:3200, trend:"up",   collections_needed:4 },
      { name:"Nehru Place",          lat:28.5491, lng:77.2518, level:"med",  volume:970,  trend:"up",   collections_needed:1 },
    ]);
  }

  // --- Waste Logs (with geo pins across Delhi) ---
  const { count: wlCount } = await supabase.from("waste_logs").select("*", { count:"exact", head:true });
  if (!wlCount || wlCount === 0) {
    const now = new Date();
    const daysAgo = (d) => new Date(now - d * 86400000).toISOString();
    await supabase.from("waste_logs").insert([
      { user_id:SEED_USER_ID, item_name:"Plastic Bottles",  category:"recyclable", quantity:5, unit:"items", points_earned:10, lat:28.6519, lng:77.1909, address:"Karol Bagh, New Delhi", created_at:daysAgo(0) },
      { user_id:SEED_USER_ID, item_name:"Food Waste",       category:"organic",    quantity:2, unit:"kg",    points_earned:5,  lat:28.5677, lng:77.2437, address:"Lajpat Nagar, New Delhi", created_at:daysAgo(0) },
      { user_id:SEED_USER_ID, item_name:"Old Battery",      category:"hazardous",  quantity:3, unit:"items", points_earned:20, lat:28.6315, lng:77.2167, address:"Connaught Place, New Delhi", created_at:daysAgo(1) },
      { user_id:SEED_USER_ID, item_name:"Cardboard Boxes",  category:"recyclable", quantity:8, unit:"items", points_earned:8,  lat:28.5491, lng:77.2518, address:"Nehru Place, New Delhi", created_at:daysAgo(1) },
      { user_id:SEED_USER_ID, item_name:"Garden Waste",     category:"organic",    quantity:5, unit:"kg",    points_earned:5,  lat:28.7041, lng:77.1025, address:"Rohini Sector 14, New Delhi", created_at:daysAgo(2) },
      { user_id:SEED_USER_ID, item_name:"Paint Can",        category:"hazardous",  quantity:1, unit:"items", points_earned:25, lat:28.5826, lng:77.0595, address:"Dwarka Sector 10, New Delhi", created_at:daysAgo(2) },
      { user_id:SEED_USER_ID, item_name:"Glass Bottles",    category:"recyclable", quantity:6, unit:"items", points_earned:10, lat:28.5245, lng:77.2066, address:"Saket District Centre, New Delhi", created_at:daysAgo(3) },
      { user_id:SEED_USER_ID, item_name:"Leftover Food",    category:"organic",    quantity:3, unit:"kg",    points_earned:5,  lat:28.6082, lng:77.2941, address:"Mayur Vihar Phase 1, New Delhi", created_at:daysAgo(3) },
      { user_id:SEED_USER_ID, item_name:"E-Waste Monitor",  category:"hazardous",  quantity:1, unit:"items", points_earned:20, lat:28.6389, lng:77.2090, address:"India Gate, New Delhi", created_at:daysAgo(4) },
      { user_id:SEED_USER_ID, item_name:"Newspaper Bundle", category:"recyclable", quantity:4, unit:"kg",    points_earned:8,  lat:28.6129, lng:77.2295, address:"Khan Market, New Delhi", created_at:daysAgo(4) },
      { user_id:SEED_USER_ID, item_name:"Plastic Bags",     category:"general",    quantity:10,unit:"items", points_earned:3,  lat:28.6562, lng:77.2410, address:"Civil Lines, New Delhi", created_at:daysAgo(5) },
      { user_id:SEED_USER_ID, item_name:"Coffee Grounds",   category:"organic",    quantity:1, unit:"kg",    points_earned:5,  lat:28.5355, lng:77.3910, address:"Noida Sector 18, UP", created_at:daysAgo(5) },
      { user_id:SEED_USER_ID, item_name:"Metal Cans",       category:"recyclable", quantity:12,unit:"items", points_earned:10, lat:28.4595, lng:77.0266, address:"Gurugram Sector 29, Haryana", created_at:daysAgo(6) },
      { user_id:SEED_USER_ID, item_name:"Chemical Waste",   category:"hazardous",  quantity:2, unit:"litres",points_earned:25, lat:28.7196, lng:77.1025, address:"Pitampura, New Delhi", created_at:daysAgo(6) },
      { user_id:SEED_USER_ID, item_name:"Styrofoam",        category:"general",    quantity:3, unit:"items", points_earned:3,  lat:28.6448, lng:77.0572, address:"Janakpuri, New Delhi", created_at:daysAgo(6) },
      { user_id:SEED_USER_ID, item_name:"Fruit Peels",      category:"organic",    quantity:2, unit:"kg",    points_earned:5,  lat:28.5921, lng:77.0460, address:"Uttam Nagar, New Delhi", created_at:daysAgo(7) },
    ]);
  }

  // --- Profiles (leaderboard data) ---
  const { count: prCount } = await supabase.from("profiles").select("*", { count:"exact", head:true });
  if (!prCount || prCount === 0) {
    await supabase.from("profiles").insert([
      { id:"11111111-1111-1111-1111-111111111111", name:"Priya Sharma",  role:"user",  green_points:4200, co2_saved:38, streak:21 },
      { id:"22222222-2222-2222-2222-222222222222", name:"Rahul Mehta",   role:"user",  green_points:3750, co2_saved:32, streak:14 },
      { id:"33333333-3333-3333-3333-333333333333", name:"Aarav Singh",   role:"user",  green_points:1840, co2_saved:18, streak:7  },
      { id:"44444444-4444-4444-4444-444444444444", name:"Kavya Nair",    role:"user",  green_points:1600, co2_saved:15, streak:5  },
      { id:"55555555-5555-5555-5555-555555555555", name:"Arjun Verma",   role:"user",  green_points:980,  co2_saved:9,  streak:3  },
      { id:"66666666-6666-6666-6666-666666666666", name:"Sneha Iyer",    role:"user",  green_points:760,  co2_saved:7,  streak:2  },
    ]);
  }
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ size=18 }) {
  return (
    <div style={{ display:"inline-flex", animation:"spin 1s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader size={size} color={C.accent} />
    </div>
  );
}

// ─── LANDING PAGE (original App.jsx design) ───────────────────────────────────
function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const stats = [
    { val:"2.1B",    label:"Tonnes landfilled yearly" },
    { val:"67%",     label:"Recyclables misclassified" },
    { val:"₹48K Cr", label:"Recycling value lost" },
    { val:"94%",     label:"Our AI accuracy" },
  ];
  const features = [
    { icon:ScanLine,  title:"AI Scanner",       desc:"Upload an image or describe the item. Our model classifies waste in seconds with 94% accuracy." },
    { icon:Map,       title:"Live Hotspot Map",  desc:"Real-time waste accumulation maps help municipalities dispatch trucks efficiently." },
    { icon:BarChart3, title:"Smart Analytics",   desc:"Track recycling rates, CO₂ savings, and collection schedules on one dashboard." },
    { icon:Leaf,      title:"Eco Rewards",       desc:"Earn green points for every item correctly classified. Redeem at partner stores." },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f0fdf4", overflowX:"hidden", position:"relative" }}>

      {/* ── Background Video ── */}
      <video autoPlay muted loop playsInline style={{
        position:"fixed", top:0, left:0,
        width:"100%", height:"100%",
        objectFit:"cover",
        transform:"scale(1.35)",
        opacity:0.18,
        zIndex:0,
        pointerEvents:"none",
      }}>
        <source src="/landing1.mp4" type="video/mp4" />
      </video>

      {/* All content sits above the video */}
      <div style={{ position:"relative", zIndex:1 }}>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(240,253,244,0.97)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none", transition:"all .3s"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Recycle size={18} color={C.accent} />
          </div>
          <span className="syne" style={{ fontWeight:800, fontSize:20, color:C.text }}>VERDIAN</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-ghost" style={{ padding:"8px 20px", borderRadius:8, fontSize:14 }} onClick={() => onNavigate("auth")}>Sign In</button>
          <button className="btn-primary" style={{ padding:"8px 20px", borderRadius:8, fontSize:14 }} onClick={() => onNavigate("auth")}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop:120, paddingBottom:80, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:200, left:"10%", width:300, height:300, background:"radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div className="fade-in" style={{ maxWidth:800, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100, background:C.accentGlow, border:`1px solid ${C.dim}`, marginBottom:24 }}>
            <div className="pulse-dot" />
            <span style={{ fontSize:12, color:C.accent, fontWeight:500 }}>AI-Powered Waste Intelligence Platform</span>
          </div>
          <h1 className="syne" style={{ fontSize:"clamp(40px,7vw,80px)", fontWeight:800, lineHeight:1.05, marginBottom:24, color:C.text }}>
            Smarter Waste.<br /><span style={{ color:C.accent }}>Greener Cities.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:560, margin:"0 auto 40px", lineHeight:1.7 }}>
            Verdian uses computer vision and real-time analytics to classify waste, guide citizens, and optimize municipal collection routes — reducing landfill burden by up to 40%.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary glow-sm" style={{ padding:"14px 32px", borderRadius:12, fontSize:16 }} onClick={() => onNavigate("auth")}>Start Scanning Free</button>
            <button className="btn-ghost" style={{ padding:"14px 32px", borderRadius:12, fontSize:16 }} onClick={() => onNavigate("auth")}>Admin Demo →</button>
          </div>
        </div>

        {/* Hero preview card */}
        <div className="fade-in" style={{ maxWidth:900, margin:"60px auto 0", padding:"0 24px" }}>
          <div className="card glow" style={{ padding:24, position:"relative", overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {[["Recyclable","38%",C.blue,38],["Organic","42%",C.accent,42],["Hazardous","8%",C.danger,8]].map(([label,val,col,pct],i) => (
                <div key={i} style={{ padding:16, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{label}</div>
                  <div style={{ height:6, borderRadius:3, background:C.dim, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:3 }} />
                  </div>
                  <div className="syne" style={{ fontSize:20, fontWeight:700, marginTop:8, color:C.text }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, padding:16, background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <ScanLine size={22} color={C.accent} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:C.muted }}>AI Classification Result</div>
                <div style={{ fontWeight:600, color:"#14532d" }}>Plastic PET Bottle → Recyclable</div>
              </div>
              <div style={{ padding:"4px 12px", borderRadius:100, background:"rgba(34,197,94,.15)", border:`1px solid ${C.dim}`, fontSize:12, color:C.accent }}>94% confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:"40px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {stats.map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div className="syne" style={{ fontSize:36, fontWeight:800, color:C.accent }}>{s.val}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:"80px 40px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 className="syne" style={{ fontSize:36, fontWeight:800, color:C.text }}>Everything in one platform</h2>
            <p style={{ color:C.muted, marginTop:12 }}>Built for citizens and city managers alike</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
            {features.map((f,i) => (
              <div key={i} className="card" style={{ padding:28, display:"flex", gap:18, alignItems:"flex-start", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width:44, height:44, borderRadius:12, background:C.accentGlow, border:`1px solid ${C.dim}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <f.icon size={20} color={C.accent} />
                </div>
                <div>
                  <div className="syne" style={{ fontWeight:700, fontSize:17, color:C.text, marginBottom:6 }}>{f.title}</div>
                  <div style={{ color:C.muted, fontSize:14, lineHeight:1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"60px 40px", textAlign:"center", borderTop:`1px solid ${C.border}` }}>
        <h2 className="syne" style={{ fontSize:32, fontWeight:800, color:C.text, marginBottom:16 }}>Join 12,000+ eco-conscious users</h2>
        <p style={{ color:C.muted, marginBottom:32 }}>Delhi · Mumbai · Bengaluru · Hyderabad · Chennai</p>
        <button className="btn-primary glow" style={{ padding:"16px 40px", borderRadius:12, fontSize:16 }} onClick={() => onNavigate("auth")}>
          Get Started — It's Free
        </button>
      </div>
      <div style={{ padding:"20px 40px", textAlign:"center", borderTop:`1px solid ${C.border}`, color:C.muted, fontSize:12 }}>
        © 2026 Verdian. Smart Waste Intelligence.
      </div>

      </div> {/* end z-index wrapper */}
    </div>
  );
}

// ─── AUTH PAGE (Supabase real auth) ───────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email:"", password:"", name:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Demo bypass: fetch real data from Supabase using the demo admin profile ──
  const handleDemoAdmin = async () => {
    // Use a fixed demo admin UUID — ensure this exists in your profiles table with role='admin'
    const DEMO_ADMIN_ID = "00000000-0000-0000-0000-000000000001";
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", DEMO_ADMIN_ID).single();
    if (profile) {
      onLogin({ id: DEMO_ADMIN_ID, name: profile.name || "Demo Admin", email: "admin@verdian.ai", role: "admin", ...profile });
    } else {
      // Profile doesn't exist yet — create it and log in
      await supabase.from("profiles").upsert({
        id: DEMO_ADMIN_ID, name: "Demo Admin", role: "admin", green_points: 0, co2_saved: 0, streak: 0
      });
      onLogin({ id: DEMO_ADMIN_ID, name: "Demo Admin", email: "admin@verdian.ai", role: "admin", green_points: 0, co2_saved: 0, streak: 0 });
    }
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error:err } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (err) throw err;
        const { data:profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        const actualRole = profile?.role || "user";
        if (role === "admin" && actualRole !== "admin") {
          await supabase.auth.signOut();
          setError("Access denied. This account does not have admin privileges. Please sign in as Citizen.");
          setLoading(false); return;
        }
        if (role === "user" && actualRole === "admin") {
          await supabase.auth.signOut();
          setError("This is an admin account. Please select Admin to sign in.");
          setLoading(false); return;
        }
        onLogin({ id:data.user.id, name:profile?.name||form.email.split("@")[0], email:form.email, role:actualRole, ...profile });
      } else {
        if (!form.name) { setError("Name is required."); setLoading(false); return; }
        const { data, error:err } = await supabase.auth.signUp({
          email:form.email, password:form.password,
          options:{ data:{ name:form.name, role } }
        });
        if (err) throw err;
        if (data.user && !data.session) {
          setSuccess("Account created! Check your email to confirm, then sign in.");
        } else if (data.session) {
          const { data:profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
          onLogin({ id:data.user.id, name:form.name, email:form.email, role, ...profile });
        }
      }
    } catch(err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 50%, rgba(22,163,74,0.08) 0%, transparent 60%)", pointerEvents:"none" }} />
      <div className="fade-in" style={{ width:"100%", maxWidth:440 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40, justifyContent:"center" }}>
          <div style={{ width:40, height:40, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Recycle size={20} color={C.accent} />
          </div>
          <span className="syne" style={{ fontWeight:800, fontSize:24, color:C.text }}>VERDIAN</span>
        </div>
        <div className="card" style={{ padding:36 }}>
          <h2 className="syne" style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:4 }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:20 }}>
            {isLogin ? "Sign in to your Verdian account" : "Join the green revolution"}
          </p>



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
              onKeyDown={e => e.key==="Enter" && handleSubmit()} />
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

        {/* Demo quick-access */}
        <div style={{ marginTop:16, padding:"16px 20px", borderRadius:14, background:"#ffffff", border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12, fontWeight:600 }}>Quick Demo Access</div>
          <button onClick={handleDemoAdmin}
            style={{ width:"100%", padding:"9px 0", borderRadius:9, border:"1px solid rgba(220,38,38,0.2)", background:"rgba(220,38,38,0.06)", color:"#dc2626", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#dc2626";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(220,38,38,0.06)";e.currentTarget.style.color="#dc2626";}}>
            <Shield size={13}/> Admin Demo
          </button>
          <div style={{ marginTop:10, fontSize:12, color:C.muted, textAlign:"center" }}>No credentials needed for demo</div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeSection, setActiveSection, onLogout }) {
  const userLinks = [
    { id:"dashboard",   icon:Home,     label:"Dashboard" },
    { id:"scanner",     icon:ScanLine, label:"AI Scanner" },
    { id:"map",         icon:Map,      label:"Waste Map" },
    { id:"add-waste",   icon:Plus,     label:"Add Waste" },
  ];
  const adminLinks = [
    { id:"admin-dashboard", icon:Shield,   label:"Admin Overview" },
    { id:"map",             icon:Map,      label:"City Map" },
    { id:"hotspots",        icon:Radio,    label:"Hotspots" },
  ];
  const links = user.role === "admin" ? adminLinks : userLinks;
  return (
    <div style={{ width:220, minHeight:"100vh", background:"#ffffff", borderRight:"1px solid #d1fae5", boxShadow:"2px 0 8px rgba(0,0,0,0.04)", display:"flex", flexDirection:"column", padding:"20px 12px", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 6px", marginBottom:32 }}>
        <div style={{ width:32, height:32, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Recycle size={15} color={C.accent} />
        </div>
        <span className="syne" style={{ fontWeight:800, fontSize:17, color:C.text }}>VERDIAN</span>
      </div>
      <div style={{ padding:"6px 12px", borderRadius:8, background:user.role==="admin"?"rgba(239,68,68,.1)":C.accentGlow, border:`1px solid ${user.role==="admin"?"rgba(239,68,68,.3)":C.dim}`, marginBottom:20 }}>
        <div style={{ fontSize:12, color:user.role==="admin"?C.danger:C.accent, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>
          {user.role === "admin" ? "Admin" : "Citizen"}
        </div>
        <div style={{ fontSize:12, color:C.text, marginTop:2, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
      </div>
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        {links.map(l => (
          <div key={l.id} className={`sidebar-link ${activeSection===l.id?"active":""}`} onClick={() => setActiveSection(l.id)}>
            <l.icon size={16} /><span>{l.label}</span>
          </div>
        ))}
      </nav>
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:12, display:"flex", flexDirection:"column", gap:2 }}>
        <div className="sidebar-link" onClick={() => setActiveSection("settings")}><Settings size={16} /><span>Settings</span></div>
        <div className="sidebar-link" style={{ color:C.danger }} onClick={onLogout}><LogOut size={16} /><span>Sign Out</span></div>
      </div>
    </div>
  );
}

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ title, user }) {
  return (
    <div style={{ height:60, background:"#ffffff", borderBottom:"1px solid #d1fae5", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0 }}>
      <div>
        <div className="heading" style={{ fontWeight:700, fontSize:17, color:C.text }}>{title}</div>
        <div style={{ fontSize:12, color:C.muted }}>
          {new Date().toLocaleDateString("en-IN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", cursor:"pointer" }}><Bell size={18} color={C.muted} /></div>
        <div style={{ width:36, height:36, borderRadius:"50%", background:C.accentGlow, border:`1px solid ${C.dim}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <User size={16} color={C.accent} />
        </div>
      </div>
    </div>
  );
}


// ─── USER DASHBOARD (realtime Supabase) ──────────────────────────────────────
function UserDashboard({ user }) {
  const [logs, setLogs]       = useState([]);
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [rank, setRank]       = useState(null);

  const loadData = async () => {
    const { data:logsData } = await supabase.from("waste_logs").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(10);
    setLogs(logsData||[]);
    const { data:prof } = await supabase.from("profiles").select("*").eq("id",user.id).single();
    if (prof) setProfile(p=>({...p,...prof}));
    const { count } = await supabase.from("profiles").select("*",{count:"exact",head:true}).gt("green_points",prof?.green_points||0);
    setRank((count||0)+1);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadData();
    const logsSub = supabase.channel("dash-logs-"+user.id)
      .on("postgres_changes",{event:"*",schema:"public",table:"waste_logs",filter:`user_id=eq.${user.id}`},()=>loadData())
      .subscribe();
    const profSub = supabase.channel("dash-prof-"+user.id)
      .on("postgres_changes",{event:"*",schema:"public",table:"profiles",filter:`id=eq.${user.id}`},()=>loadData())
      .subscribe();
    return () => { supabase.removeChannel(logsSub); supabase.removeChannel(profSub); };
  }, [user.id]);

  const catColor = { recyclable:C.blue, organic:C.accent, hazardous:C.danger, general:C.muted };

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:22 }}>

      {/* Large greeting hero */}
      <div style={{ borderRadius:20, padding:"36px 40px", background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)", border:"1px solid #bbf7d0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.accent, boxShadow:"0 0 6px rgba(22,163,74,0.5)" }}/>
          <span style={{ fontSize:12, color:C.accent, fontWeight:700, letterSpacing:"0.08em" }}>CITIZEN DASHBOARD</span>
        </div>
        <div className="syne" style={{ fontWeight:800, fontSize:48, color:"#14532d", lineHeight:1.1, marginBottom:12 }}>
          Hi, {profile.name?.split(" ")[0] || "there"}!
        </div>
        <div style={{ fontSize:16, color:C.muted, marginBottom:20 }}>
          You've saved <span style={{ color:C.accent, fontWeight:700 }}>{profile.co2_saved || 0} kg</span> of CO₂
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:100, background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.25)", fontSize:14, color:C.accent, fontWeight:600 }}>
            <Star size={14}/> {profile.green_points || 0} pts
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:100, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", fontSize:14, color:C.warn, fontWeight:600 }}>
            <Activity size={14}/> {profile.streak || 0} day streak
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:100, background:"rgba(22,163,74,0.08)", border:`1px solid ${C.dim}`, fontSize:14, color:C.accent, fontWeight:600 }}>
            <Leaf size={14}/> {loading ? "—" : logs.length} items logged
          </div>
        </div>
      </div>

      {/* Recent Activity — full width, clean */}
      <div className="card" style={{ padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div className="heading" style={{ fontWeight:700, fontSize:18, color:C.text }}>Recent Activity</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.accent, fontWeight:700 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, animation:"pulse 2s infinite" }}/> LIVE
          </div>
        </div>
        {loading ? <div style={{ textAlign:"center", padding:"28px 0" }}><Spinner size={28}/></div> :
          logs.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🌱</div>
              <div style={{ fontWeight:600, fontSize:16, color:C.text, marginBottom:6 }}>Nothing logged yet</div>
              <div style={{ color:C.muted, fontSize:14 }}>Head to Add Waste or the AI Scanner to get started!</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12, background:"rgba(22,163,74,0.03)", border:"1px solid #d1fae5", transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(22,163,74,0.07)";e.currentTarget.style.borderColor="#86efac"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(22,163,74,0.03)";e.currentTarget.style.borderColor="#d1fae5"}}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${catColor[log.category]}12`, border:`1px solid ${catColor[log.category]}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {(()=>{ const wc=wasteCategories.find(w=>w.id===log.category); return wc?<wc.icon size={16} color={catColor[log.category]}/>:null; })()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, color:C.text, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{log.item_name}</div>
                    <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{log.category} · {new Date(log.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                  <div style={{ padding:"4px 12px", borderRadius:100, background:"rgba(34,197,94,0.1)", fontSize:13, color:C.accent, fontWeight:700, flexShrink:0 }}>+{log.points_earned} pts</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─── AI SCANNER (upload + manual only, no camera) ────────────────────────────
function AIScanner({ user }) {
  const [phase, setPhase]             = useState("idle");
  const [selectedItem, setSelectedItem] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const [activeTab, setActiveTab]     = useState("upload");
  const [history, setHistory]         = useState([]);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState("");
  const [scannerLocation, setScannerLocation] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-capture GPS silently so scanned items get pinned automatically
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude:lat, longitude:lng } = pos.coords;
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await res.json();
          address = d.display_name?.split(",").slice(0,3).join(", ") || address;
        } catch(_) {}
        setScannerLocation({ lat, lng, address, auto: true });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const refreshHistory = () => supabase.from("waste_logs").select("*").eq("user_id",user.id)
    .order("created_at",{ascending:false}).limit(5).then(({data})=>setHistory(data||[]));

  useEffect(() => { refreshHistory(); }, [user.id]);

  const catMeta = {
    recyclable:{ color:C.blue,   label:"Recyclable", bin:"Blue Bin" },
    organic:   { color:C.accent, label:"Organic",    bin:"Green Bin" },
    hazardous: { color:C.danger, label:"Hazardous",  bin:"Red Collection" },
    general:   { color:C.muted,  label:"General",    bin:"Black Bin" },
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    setPhase("scanning"); setSaveMsg("");
    setSelectedItem(aiWasteItems[Math.floor(Math.random()*aiWasteItems.length)]);
    setTimeout(()=>setPhase("result"),2400);
  };

  const handleManual = () => {
    if (!manualInput.trim()) return;
    const found = aiWasteItems.find(i=>i.name.toLowerCase().includes(manualInput.toLowerCase()))
      || { name:manualInput, category:"general", confidence:78, guidance:"Place in general waste bin. Ensure it is dry and non-hazardous.", points:5 };
    setSelectedItem(found); setPhase("result");
  };

  const saveToDatabase = async () => {
    if (!selectedItem) return;
    setSaving(true);
    const co2Map = { recyclable:0.3, organic:0.1, hazardous:0.5, general:0.05 };
    const insertPayload = {
      user_id:user.id, item_name:selectedItem.name, category:selectedItem.category,
      quantity:1, unit:"items", confidence:selectedItem.confidence, points_earned:selectedItem.points,
    };
    if (scannerLocation) {
      insertPayload.lat = scannerLocation.lat;
      insertPayload.lng = scannerLocation.lng;
      insertPayload.address = scannerLocation.address;
    }
    const { error } = await supabase.from("waste_logs").insert(insertPayload);
    if (!error) {
      const { data:prof } = await supabase.from("profiles").select("green_points,co2_saved").eq("id",user.id).single();
      await supabase.from("profiles").update({
        green_points:(prof?.green_points||0)+selectedItem.points,
        co2_saved:Math.round(((prof?.co2_saved||0)+(co2Map[selectedItem.category]||0.1))*100)/100,
      }).eq("id",user.id);
      setSaveMsg("Saved to your waste log!");
      refreshHistory();
    } else { setSaveMsg("Could not save. Try again."); }
    setSaving(false);
  };

  const reset = () => { setPhase("idle"); setSelectedItem(null); setManualInput(""); setSaveMsg(""); setScannerLocation(null); if(fileInputRef.current) fileInputRef.current.value=""; };

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:24 }}>
        <div className="card" style={{ padding:28 }}>
          <div className="heading" style={{ fontWeight:800, fontSize:20, color:C.text, marginBottom:6 }}>AI Waste Classifier</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Classify waste and save it directly to your log.</p>
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {["upload","manual"].map(t=>(
              <button key={t} onClick={()=>{setActiveTab(t);reset();}}
                className={`btn-ghost ${activeTab===t?"tab-active":""}`} style={{ padding:"7px 16px", borderRadius:8, fontSize:13 }}>
                {t==="upload"?"Upload Image":"Manual Input"}
              </button>
            ))}
          </div>

          {phase==="idle" && (
            activeTab==="upload" ? (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange}/>
                <div style={{ border:`2px dashed ${C.dim}`, borderRadius:16, padding:48, textAlign:"center", cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.dim}
                  onClick={()=>fileInputRef.current?.click()}>
                  <div style={{ width:64, height:64, borderRadius:16, background:C.accentGlow, border:`1px solid ${C.dim}`, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Upload size={28} color={C.accent}/>
                  </div>
                  <div style={{ fontWeight:600, color:C.text, marginBottom:6 }}>Upload Waste Image</div>
                  <div style={{ fontSize:13, color:C.muted }}>Click to browse — JPG, PNG, WEBP supported</div>
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
                  onChange={e=>setManualInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleManual()}/>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {aiWasteItems.slice(0,5).map((item,i)=>(
                    <button key={i} className="btn-ghost" style={{ padding:"6px 14px", borderRadius:100, fontSize:12 }}
                      onClick={()=>{ setManualInput(item.name); setSelectedItem(item); setPhase("result"); }}>
                      {item.name}
                    </button>
                  ))}
                </div>
                <button className="btn-primary" style={{ padding:"12px 24px", borderRadius:10, fontSize:14 }} onClick={handleManual}>Classify →</button>
              </div>
            )
          )}

          {phase==="scanning" && (
            <div style={{ padding:"60px 0", textAlign:"center" }}>
              <div style={{ width:120, height:120, border:`2px solid ${C.accent}`, borderRadius:16, margin:"0 auto 24px", position:"relative", overflow:"hidden" }}>
                <ScanLine size={48} color={C.accent} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", opacity:0.3 }}/>
                <div className="scan-line"/>
              </div>
              <div className="heading" style={{ fontWeight:700, fontSize:18, color:C.text }}>Analysing...</div>
              <div style={{ color:C.muted, marginTop:8, fontSize:13 }}>AI model processing</div>
            </div>
          )}

          {phase==="result" && selectedItem && (()=>{
            const meta = catMeta[selectedItem.category];
            return (
              <div className="fade-in">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <CheckCircle size={20} color={C.accent}/><span style={{ fontWeight:600, color:C.text }}>Classification complete</span>
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
                      <div className="heading" style={{ fontSize:28, fontWeight:800, color:meta.color }}>{selectedItem.confidence}%</div>
                      <div style={{ fontSize:12, color:C.muted }}>confidence</div>
                    </div>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:C.dim, overflow:"hidden", marginBottom:16 }}>
                    <div style={{ height:"100%", width:`${selectedItem.confidence}%`, background:meta.color, borderRadius:3 }}/>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ padding:"8px 16px", borderRadius:10, background:`${meta.color}20`, border:`1px solid ${meta.color}40`, fontSize:13, color:meta.color, fontWeight:600 }}>
                      {meta.bin}
                    </div>
                    <div style={{ padding:"8px 16px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, fontSize:13, color:C.accent, fontWeight:600 }}>
                      +{selectedItem.points} pts
                    </div>
                    <button className="btn-primary" style={{ padding:"8px 20px", borderRadius:10, fontSize:13, marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}
                      onClick={saveToDatabase} disabled={saving||!!saveMsg}>
                      {saving?<Spinner size={14}/>:null} {saveMsg||"Save to Log"}
                    </button>
                  </div>
                  {/* Location for map pin */}
                  {!saveMsg && (
                    <ScannerLocation scannerLocation={scannerLocation} setScannerLocation={setScannerLocation}/>
                  )}
                </div>
                <div style={{ padding:20, borderRadius:12, background:"#f8fafc", border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:600, color:C.text, marginBottom:8, fontSize:14 }}>Disposal Guidance</div>
                  <p style={{ color:C.muted, fontSize:13, lineHeight:1.7 }}>{selectedItem.guidance}</p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Scan History */}
        <div className="card" style={{ padding:20 }}>
          <div className="heading" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:14 }}>Scan History</div>
          {history.length===0 ? <div style={{ color:C.muted, fontSize:13 }}>No scans yet.</div> : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {history.map((log,i)=>{
                const meta=catMeta[log.category];
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:meta.color, flexShrink:0 }}/>
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


// ─── LEAFLET MAP VIEW (light tiles, hotspot + waste log pins, GPS) ────────────
function MapView() {
  const [hotspots, setHotspots]               = useState([]);
  const [wasteLogs, setWasteLogs]             = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedLog, setSelectedLog]         = useState(null);
  const [filter, setFilter]                   = useState("all");
  const [showLogs, setShowLogs]               = useState(true);
  const [loading, setLoading]                 = useState(true);
  const mapRef            = useRef(null);
  const mapObjRef         = useRef(null);
  const hotspotMarkersRef = useRef([]);
  const logMarkersRef     = useRef([]);
  // Use refs so render functions always have fresh data, no stale closures
  const hotspotsRef       = useRef([]);
  const wasteLogsRef      = useRef([]);
  const filterRef         = useRef("all");
  const showLogsRef       = useRef(true);

  const levelColor = { high:"#ef4444", med:"#f59e0b", low:"#22c55e" };
  const levelLabel = { high:"HIGH", med:"MED", low:"LOW" };
  const catColor   = { recyclable:"#2563eb", organic:"#16a34a", hazardous:"#dc2626", general:"#64748b" };

  // ── render functions — pure, always read from refs ──────────────────────────
  const renderHotspotMarkers = (map, spots, fil) => {
    const L = window.L; if (!L || !map) return;
    hotspotMarkersRef.current.forEach(m => map.removeLayer(m));
    hotspotMarkersRef.current = [];
    (spots || hotspotsRef.current).filter(h => fil === "all" || h.level === fil).forEach(h => {
      const col = levelColor[h.level] || "#22c55e";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;border-radius:50%;background:${col}22;border:2.5px solid ${col};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${col}44;">
          <div style="width:12px;height:12px;border-radius:50%;background:${col};box-shadow:0 0 6px ${col};"></div>
        </div>`,
        iconSize:[34,34], iconAnchor:[17,17], popupAnchor:[0,-20],
      });
      const marker = L.marker([h.lat, h.lng], { icon }).addTo(map);
      marker.bindPopup(`<div style="min-width:190px;font-family:'DM Sans',sans-serif;">
        <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#1a1a1a;">${h.name}</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <span style="padding:2px 9px;border-radius:100px;background:${col}18;border:1px solid ${col}40;color:${col};font-size:12px;font-weight:700;">${levelLabel[h.level]}</span>
          <span style="font-size:12px;color:#888;">${h.trend === "up" ? "↑ Increasing" : "↓ Decreasing"}</span>
        </div>
        <div style="font-size:12px;color:#555;margin-bottom:3px;">Volume: <b style="color:#222;">${h.volume} kg</b></div>
        <div style="font-size:12px;color:#555;">Trucks needed: <b style="color:#222;">${h.collections_needed}</b></div>
      </div>`);
      marker.on("click", () => setSelectedHotspot(h));
      hotspotMarkersRef.current.push(marker);
    });
  };

  const renderLogMarkers = (map, logs) => {
    const L = window.L; if (!L || !map) return;
    logMarkersRef.current.forEach(m => map.removeLayer(m));
    logMarkersRef.current = [];
    const items = logs || wasteLogsRef.current;
    items.forEach(log => {
      if (!log.lat || !log.lng) return;
      const col = catColor[log.category] || "#6b8c78";
      const svgPath =
        log.category === "recyclable"
          ? '<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>'
          : log.category === "organic"
          ? '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'
          : log.category === "hazardous"
          ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
          : '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>';
      const iconHtml = `<div style="width:30px;height:30px;border-radius:8px;background:white;border:2px solid ${col};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2);cursor:pointer;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>
      </div>`;
      const icon = L.divIcon({ className:"", html:iconHtml, iconSize:[30,30], iconAnchor:[15,30], popupAnchor:[0,-32] });
      const marker = L.marker([log.lat, log.lng], { icon }).addTo(map);
      const date = new Date(log.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
      marker.bindPopup(`<div style="min-width:160px;font-family:'DM Sans',sans-serif;">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#1a1a1a;">${log.item_name}</div>
        <span style="padding:2px 8px;border-radius:100px;background:${col}15;border:1px solid ${col}40;color:${col};font-size:12px;font-weight:600;text-transform:capitalize;">${log.category}</span>
        <div style="font-size:12px;color:#777;margin-top:6px;">${log.address || ""}</div>
        <div style="font-size:12px;color:#999;margin-top:3px;">${date} · +${log.points_earned} pts</div>
      </div>`);
      marker.on("click", () => setSelectedLog(log));
      logMarkersRef.current.push(marker);
    });
    // Honour showLogs toggle
    if (!showLogsRef.current) logMarkersRef.current.forEach(m => map.removeLayer(m));
  };

  // ── Ensure Leaflet script is loaded, then initialise map ─────────────────────
  const ensureLeaflet = (cb) => {
    if (window.L) { cb(); return; }
    if (document.querySelector('script[src*="leaflet"]')) {
      // Script already injected but not yet loaded — wait
      const check = setInterval(() => { if (window.L) { clearInterval(check); cb(); } }, 50);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = cb;
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!window.L || !mapRef.current || mapObjRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center:[28.63,77.22], zoom:11 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:19,
    }).addTo(map);
    mapObjRef.current = map;
    // Render with data already in refs (avoids stale closure)
    renderHotspotMarkers(map, hotspotsRef.current, filterRef.current);
    renderLogMarkers(map, wasteLogsRef.current);
  };

  // ── Load data ─────────────────────────────────────────────────────────────────
  const loadMapData = async () => {
    const [{ data:hs }, { data:logs }] = await Promise.all([
      supabase.from("hotspots").select("*"),
      supabase.from("waste_logs")
        .select("id,item_name,category,lat,lng,address,created_at,points_earned")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    const hsData   = hs   || [];
    const logsData = logs || [];
    // Update refs FIRST so render functions see fresh data
    hotspotsRef.current  = hsData;
    wasteLogsRef.current = logsData;
    setHotspots(hsData);
    setWasteLogs(logsData);
    setLoading(false);
    // If map already exists (realtime update case), re-render markers immediately
    if (mapObjRef.current) {
      renderHotspotMarkers(mapObjRef.current, hsData, filterRef.current);
      renderLogMarkers(mapObjRef.current, logsData);
    }
  };

  // Keep a stable ref to loadMapData so realtime callbacks always call fresh version
  const loadMapDataRef = useRef(loadMapData);
  useEffect(() => { loadMapDataRef.current = loadMapData; });

  // ── Initial load + realtime subscription ─────────────────────────────────────
  useEffect(() => {
    loadMapDataRef.current();
    const sub = supabase.channel("map-logs-v3")
      .on("postgres_changes", { event:"*", schema:"public", table:"waste_logs" }, () => loadMapDataRef.current())
      .on("postgres_changes", { event:"*", schema:"public", table:"hotspots" },   () => loadMapDataRef.current())
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
      if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null; }
    };
  }, []);

  // ── Init map: wait for data loaded AND Leaflet script ready ─────────────────
  useEffect(() => {
    if (loading || !mapRef.current || mapObjRef.current) return;
    if (window.L) { initMap(); return; }
    // Leaflet is being loaded in background — poll until ready
    const t = setInterval(() => {
      if (window.L) { clearInterval(t); initMap(); }
    }, 30);
    return () => clearInterval(t);
  }, [loading]);

  // ── Sync refs when state updates (rendering handled directly in loadMapData) ──
  useEffect(() => { hotspotsRef.current = hotspots; }, [hotspots]);
  useEffect(() => { wasteLogsRef.current = wasteLogs; }, [wasteLogs]);

  // ── Filter change ─────────────────────────────────────────────────────────────
  useEffect(() => {
    filterRef.current = filter;
    if (mapObjRef.current) renderHotspotMarkers(mapObjRef.current, hotspotsRef.current, filter);
  }, [filter]);

  // ── Toggle log pins ───────────────────────────────────────────────────────────
  useEffect(() => {
    showLogsRef.current = showLogs;
    if (!mapObjRef.current) return;
    logMarkersRef.current.forEach(m => {
      if (showLogs) mapObjRef.current.addLayer(m);
      else          mapObjRef.current.removeLayer(m);
    });
  }, [showLogs]);

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div className="heading" style={{ fontWeight:700, fontSize:17, color:C.text }}>Delhi Waste Map</div>
              <div style={{ fontSize:12, color:C.muted }}>Hotspots + waste log pins · Live from Supabase</div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["all","high","med","low"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`btn-ghost ${filter===f?"tab-active":""}`} style={{ padding:"5px 10px", borderRadius:8, fontSize:12 }}>
                  {f==="all"?"All":f==="high"?"High":f==="med"?"Med":"Low"}
                </button>
              ))}
              <button onClick={()=>setShowLogs(!showLogs)} className={`btn-ghost ${showLogs?"tab-active":""}`} style={{ padding:"5px 10px", borderRadius:8, fontSize:12 }}>
                <MapPin size={12}/> Logs
              </button>
            </div>
          </div>
          {loading ? (
            <div style={{ height:480, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner size={32}/></div>
          ) : (
            <div ref={mapRef} style={{ height:480, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}` }}/>
          )}
          <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Legend:</span>
            {[["#ef4444","High"],["#f59e0b","Med"],["#22c55e","Low"]].map(([c,l],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.muted }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c }}/>{l} Hotspot
              </div>
            ))}
            <div style={{ fontSize:12, color:C.muted }}>Square icons = waste logs</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {(selectedHotspot||selectedLog) ? (
            <div className="card fade-in" style={{ padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <div className="heading" style={{ fontWeight:700, fontSize:15, color:C.text }}>
                  {selectedHotspot?"Zone Detail":"Waste Log"}
                </div>
                <button onClick={()=>{setSelectedHotspot(null);setSelectedLog(null);}} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><X size={16}/></button>
              </div>
              {selectedHotspot && (
                <>
                  <div style={{ padding:16, borderRadius:12, background:`${levelColor[selectedHotspot.level]}15`, border:`1px solid ${levelColor[selectedHotspot.level]}30`, marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:16, color:C.text }}>{selectedHotspot.name}</div>
                    <div style={{ display:"inline-flex", marginTop:6, padding:"3px 10px", borderRadius:100, background:`${levelColor[selectedHotspot.level]}20`, fontSize:12, color:levelColor[selectedHotspot.level], fontWeight:600 }}>
                      {selectedHotspot.level?.toUpperCase()} PRIORITY
                    </div>
                  </div>
                  {[["Volume",`${selectedHotspot.volume} kg`],["Trucks needed",selectedHotspot.collections_needed],["Trend",selectedHotspot.trend==="up"?"↑ Increasing":"↓ Decreasing"]].map(([k,v],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
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
                    <div style={{ fontSize:12, color:catColor[selectedLog.category], fontWeight:600, marginTop:4, textTransform:"capitalize" }}>{selectedLog.category}</div>
                  </div>
                  {[
                    ["Location",selectedLog.address||`${selectedLog.lat?.toFixed(4)}, ${selectedLog.lng?.toFixed(4)}`],
                    ["Date",new Date(selectedLog.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})],
                    ["Points",`+${selectedLog.points_earned} pts`],
                  ].map(([k,v],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
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
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(239,68,68,.1)", fontSize:12, color:C.danger }}>● Hotspot zones</div>
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(34,197,94,.1)", fontSize:12, color:C.accent }}>■ Waste log pins</div>
              </div>
              <div style={{ marginTop:10, fontSize:12, color:C.muted, lineHeight:1.5 }}>
                Waste pins appear for logs saved with a location. Allow browser location access when adding waste to auto-pin.
              </div>
            </div>
          )}
          <div className="card" style={{ padding:18 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>Active Hotspots</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>
              {hotspots.length} zones · {wasteLogs.filter(l=>l.lat&&l.lng).length} pinned logs
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {hotspots.filter(h=>filter==="all"||h.level===filter).map((h,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}`, cursor:"pointer" }}
                  onClick={()=>{ setSelectedHotspot(h); setSelectedLog(null); if(mapObjRef.current) mapObjRef.current.setView([h.lat,h.lng],13); }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:levelColor[h.level], flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{h.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{h.volume} kg · {(h.collections_needed||0)>0?"Truck needed":"No truck"}</div>
                  </div>
                  {h.trend==="up"?<TrendingUp size={12} color={C.danger}/>:<TrendingDown size={12} color={C.accent}/>}
                </div>
              ))}
            </div>
            {wasteLogs.filter(l=>l.lat&&l.lng).length > 0 && (
              <>
                <div style={{ margin:"14px 0 10px", fontSize:12, fontWeight:700, color:C.muted, letterSpacing:"0.05em" }}>RECENT LOG PINS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto" }}>
                  {wasteLogs.filter(l=>l.lat&&l.lng).slice(0,15).map((l,i)=>{
                    const catColor = { recyclable:C.blue, organic:C.accent, hazardous:C.danger, general:C.muted };
                    const col = catColor[l.category]||C.muted;
                    return (
                      <div key={l.id||i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, cursor:"pointer" }}
                        onClick={()=>{ setSelectedLog(l); setSelectedHotspot(null); if(mapObjRef.current) mapObjRef.current.setView([l.lat,l.lng],14); }}>
                        <div style={{ width:7, height:7, borderRadius:2, background:col, flexShrink:0 }}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.item_name}</div>
                          <div style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{l.category}</div>
                        </div>
                        <div style={{ fontSize:11, color:col, fontWeight:600 }}>+{l.points_earned}pts</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── SHARED: LocationPicker (GPS + manual) ───────────────────────────────────
function LocationPicker({ location, setLocation }) {
  const [tab, setTab]             = useState("gps"); // "gps" | "manual"
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError]   = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualAddr, setManualAddr] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");

  const handleGetGPS = () => {
    if (!navigator.geolocation) { setGpsError("Geolocation not supported."); return; }
    setGpsLoading(true); setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude:lat, longitude:lng } = pos.coords;
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          address = data.display_name?.split(",").slice(0,3).join(", ")||address;
        } catch(_){}
        setLocation({ lat, lng, address }); setGpsLoading(false);
      },
      (err) => { setGpsError(err.code===1?"Location permission denied. Please enable in browser settings.":"Could not get location."); setGpsLoading(false); },
      { enableHighAccuracy:true, timeout:10000 }
    );
  };

  const handleManualSet = () => {
    const lat = parseFloat(manualLat), lng = parseFloat(manualLng);
    if (isNaN(lat)||isNaN(lng)) { setSearchErr("Enter valid lat/lng numbers."); return; }
    if (lat<-90||lat>90||lng<-180||lng>180) { setSearchErr("Coordinates out of range."); return; }
    setSearchErr("");
    setLocation({ lat, lng, address: manualAddr||`${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  };

  const handleAddressSearch = async () => {
    if (!manualAddr.trim()) return;
    setSearching(true); setSearchErr("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualAddr)}&format=json&limit=1`);
      const data = await res.json();
      if (!data.length) { setSearchErr("Address not found. Try a different search."); setSearching(false); return; }
      const { lat, lon, display_name } = data[0];
      setManualLat(parseFloat(lat).toFixed(5));
      setManualLng(parseFloat(lon).toFixed(5));
      setLocation({ lat:parseFloat(lat), lng:parseFloat(lon), address:display_name.split(",").slice(0,3).join(", ") });
    } catch(_) { setSearchErr("Search failed. Try entering coordinates manually."); }
    setSearching(false);
  };

  if (location) return (
    <div>
      <label style={{ fontSize:12, color:C.muted, marginBottom:8, display:"block" }}>
        Location <span style={{ color:C.dim }}>(will appear as pin on map)</span>
      </label>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:"rgba(34,197,94,.08)", border:`1px solid ${C.dim}` }}>
        <MapPin size={15} color={C.accent}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>
            {location.address}
            {location.auto && <span style={{ marginLeft:6, fontSize:11, color:C.accent, background:"rgba(34,197,94,0.12)", padding:"1px 6px", borderRadius:4 }}>auto</span>}
          </div>
          <div style={{ fontSize:12, color:C.muted }}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</div>
        </div>
        <button onClick={()=>setLocation(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}><X size={14}/></button>
      </div>
    </div>
  );

  return (
    <div>
      <label style={{ fontSize:12, color:C.muted, marginBottom:8, display:"block" }}>
        Location <span style={{ color:C.dim }}>(optional — shown as pin on map)</span>
      </label>
      {/* Tab toggle */}
      <div style={{ display:"flex", background:C.surface, borderRadius:8, padding:3, border:`1px solid ${C.border}`, marginBottom:12 }}>
        {[["gps","GPS Auto"],["manual","Manual Entry"]].map(([t,label])=>(
          <button key={t} onClick={()=>{ setTab(t); setGpsError(""); setSearchErr(""); }}
            style={{ flex:1, padding:"6px 0", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, transition:"all .2s",
              background:tab===t?C.accentGlow:"transparent", color:tab===t?C.accent:C.muted,
              borderStyle:"solid", borderWidth:1, borderColor:tab===t?C.dim:"transparent" }}>
            {t==="gps"?<><MapPin size={11} style={{verticalAlign:"middle",marginRight:4}}/>{label}</>:<>{label}</>}
          </button>
        ))}
      </div>

      {tab==="gps" && (
        <div>
          <button onClick={handleGetGPS} disabled={gpsLoading}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10, border:`1px dashed ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", transition:"all .2s", width:"100%" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.muted;}}>
            {gpsLoading?<Spinner size={14}/>:<MapPin size={14}/>}
            {gpsLoading?"Getting your location...":"Use my current GPS location"}
          </button>
          {gpsError&&<div style={{ fontSize:12, color:C.danger, marginTop:6 }}>{gpsError}</div>}
          <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>Your browser will ask for permission when clicked</div>
        </div>
      )}

      {tab==="manual" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* Address search */}
          <div style={{ display:"flex", gap:8 }}>
            <input style={{ flex:1, padding:"9px 12px", borderRadius:8, fontSize:13 }}
              placeholder="Search address or place name..." value={manualAddr}
              onChange={e=>setManualAddr(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleAddressSearch()}/>
            <button onClick={handleAddressSearch} disabled={searching}
              style={{ padding:"9px 14px", borderRadius:8, background:C.accent, border:"none", color:"#ffffff", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              {searching?<Spinner size={13}/>:null} Search
            </button>
          </div>
          {/* Or manual lat/lng */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ height:1, flex:1, background:C.border }}/>
            <span style={{ fontSize:12, color:C.muted }}>or enter coordinates</span>
            <div style={{ height:1, flex:1, background:C.border }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:4, display:"block" }}>Latitude</label>
              <input style={{ width:"100%", padding:"9px 12px", borderRadius:8, fontSize:13 }}
                placeholder="e.g. 28.6139" value={manualLat} onChange={e=>setManualLat(e.target.value)}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:4, display:"block" }}>Longitude</label>
              <input style={{ width:"100%", padding:"9px 12px", borderRadius:8, fontSize:13 }}
                placeholder="e.g. 77.2090" value={manualLng} onChange={e=>setManualLng(e.target.value)}/>
            </div>
          </div>
          <button onClick={handleManualSet}
            style={{ padding:"9px 0", borderRadius:8, background:"transparent", border:`1px solid ${C.dim}`, color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.muted;}}>
            <MapPin size={13}/> Set this location
          </button>
          {searchErr&&<div style={{ fontSize:12, color:C.danger }}>{searchErr}</div>}
        </div>
      )}
    </div>
  );
}

// ─── SHARED: ScannerLocation (compact version for AI Scanner result) ──────────
function ScannerLocation({ scannerLocation, setScannerLocation }) {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState("gps");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError]   = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualAddr, setManualAddr] = useState("");
  const [searching, setSearching] = useState(false);

  const handleGetGPS = () => {
    if (!navigator.geolocation) { setGpsError("Geolocation not supported."); return; }
    setGpsLoading(true); setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude:lat, longitude:lng } = pos.coords;
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          address = data.display_name?.split(",").slice(0,3).join(", ")||address;
        } catch(_){}
        setScannerLocation({ lat, lng, address }); setGpsLoading(false); setOpen(false);
      },
      (err) => { setGpsError("Permission denied or unavailable."); setGpsLoading(false); },
      { enableHighAccuracy:true, timeout:10000 }
    );
  };

  const handleAddressSearch = async () => {
    if (!manualAddr.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualAddr)}&format=json&limit=1`);
      const data = await res.json();
      if (data.length) {
        const { lat, lon, display_name } = data[0];
        setScannerLocation({ lat:parseFloat(lat), lng:parseFloat(lon), address:display_name.split(",").slice(0,3).join(", ") });
        setOpen(false);
      }
    } catch(_){}
    setSearching(false);
  };

  const handleManualSet = () => {
    const lat=parseFloat(manualLat), lng=parseFloat(manualLng);
    if (!isNaN(lat)&&!isNaN(lng)) { setScannerLocation({ lat, lng, address:manualAddr||`${lat.toFixed(5)}, ${lng.toFixed(5)}` }); setOpen(false); }
  };

  if (scannerLocation) return (
    <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:8, background:"rgba(34,197,94,0.06)", border:`1px solid ${C.dim}`, fontSize:12 }}>
      <MapPin size={13} color={C.accent}/>
      <div style={{ flex:1 }}>
        <span style={{ color:C.accent, fontWeight:600 }}>{scannerLocation.address}</span>
        {scannerLocation.auto && <span style={{ marginLeft:6, fontSize:11, color:C.accent, background:"rgba(34,197,94,0.15)", padding:"1px 6px", borderRadius:4 }}>auto</span>}
      </div>
      <button onClick={()=>setScannerLocation(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:2 }}><X size={12}/></button>
    </div>
  );

  return (
    <div style={{ marginTop:12 }}>
      {!open ? (
        <button onClick={()=>setOpen(true)}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:`1px dashed ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.muted;}}>
          <MapPin size={13}/> Add location (shows as pin on map)
        </button>
      ) : (
        <div style={{ padding:16, borderRadius:12, background:C.surface, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Add location</div>
            <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><X size={14}/></button>
          </div>
          <div style={{ display:"flex", background:C.card, borderRadius:8, padding:3, border:`1px solid ${C.border}`, marginBottom:12 }}>
            {[["gps","GPS"],["manual","Manual"]].map(([t,label])=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ flex:1, padding:"5px 0", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, transition:"all .2s",
                  background:tab===t?C.accentGlow:"transparent", color:tab===t?C.accent:C.muted }}>
                {label}
              </button>
            ))}
          </div>
          {tab==="gps" ? (
            <div>
              <button onClick={handleGetGPS} disabled={gpsLoading}
                style={{ width:"100%", padding:"8px 0", borderRadius:8, border:`1px solid ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                {gpsLoading?<Spinner size={13}/>:<MapPin size={13}/>} {gpsLoading?"Getting location...":"Use GPS"}
              </button>
              {gpsError&&<div style={{ fontSize:12, color:C.danger, marginTop:6 }}>{gpsError}</div>}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", gap:6 }}>
                <input style={{ flex:1, padding:"7px 10px", borderRadius:7, fontSize:12 }} placeholder="Search address..."
                  value={manualAddr} onChange={e=>setManualAddr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddressSearch()}/>
                <button onClick={handleAddressSearch} disabled={searching}
                  style={{ padding:"7px 12px", borderRadius:7, background:C.accent, border:"none", color:"#ffffff", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
                  {searching?<Spinner size={12}/>:"Go"}
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <input style={{ padding:"7px 10px", borderRadius:7, fontSize:12 }} placeholder="Lat e.g. 28.61"
                  value={manualLat} onChange={e=>setManualLat(e.target.value)}/>
                <input style={{ padding:"7px 10px", borderRadius:7, fontSize:12 }} placeholder="Lng e.g. 77.20"
                  value={manualLng} onChange={e=>setManualLng(e.target.value)}/>
              </div>
              <button onClick={handleManualSet}
                style={{ padding:"7px 0", borderRadius:7, border:`1px solid ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                <MapPin size={12}/> Set
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ADD WASTE (GPS location, saves to Supabase, realtime update) ─────────────
function AddWaste({ user }) {
  const [form, setForm]           = useState({ name:"", category:"", quantity:"1", unit:"items", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [location, setLocation]   = useState(null);

  // Auto-capture GPS silently on mount so every log gets a pin by default
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude:lat, longitude:lng } = pos.coords;
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await res.json();
          address = d.display_name?.split(",").slice(0,3).join(", ") || address;
        } catch(_) {}
        setLocation({ lat, lng, address, auto: true });
      },
      () => {}, // silent — user can manually set later
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const handleSubmit = async () => {
    if (!form.name||!form.category) { setError("Item name and category are required."); return; }
    setLoading(true); setError("");
    const pts = { recyclable:10, organic:5, hazardous:20, general:3 }[form.category];
    const co2Map = { recyclable:0.3, organic:0.1, hazardous:0.5, general:0.05 };
    const insertData = {
      user_id:user.id, item_name:form.name, category:form.category,
      quantity:parseFloat(form.quantity)||1, unit:form.unit, notes:form.notes, points_earned:pts,
    };
    if (location) { insertData.lat=location.lat; insertData.lng=location.lng; insertData.address=location.address; }
    const { error:insertError } = await supabase.from("waste_logs").insert(insertData);
    if (insertError) { setError(insertError.message); setLoading(false); return; }
    const { data:prof } = await supabase.from("profiles").select("green_points,co2_saved").eq("id",user.id).single();
    await supabase.from("profiles").update({
      green_points:(prof?.green_points||0)+pts,
      co2_saved:Math.round(((prof?.co2_saved||0)+(co2Map[form.category]||0.1))*100)/100,
    }).eq("id",user.id);
    setResult({...form, pts, cat:wasteCategories.find(c=>c.id===form.category), location});
    setSubmitted(true); setLoading(false);
  };

  if (submitted&&result) return (
    <div className="fade-in" style={{ padding:28 }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <div className="card glow" style={{ padding:36, textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:C.accentGlow, border:`1px solid ${C.accent}`, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CheckCircle size={32} color={C.accent}/>
          </div>
          <div className="heading" style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:8 }}>Saved to Supabase!</div>
          <div style={{ color:C.muted, marginBottom:8 }}>{result.name} · {result.quantity} {result.unit}</div>
          {result.location && (
            <div style={{ fontSize:12, color:C.accent, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <MapPin size={12}/> {result.location.address}
            </div>
          )}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:24 }}>
            <div style={{ padding:"10px 20px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}` }}>
              <div className="heading" style={{ fontSize:22, fontWeight:800, color:C.accent }}>+{result.pts}</div>
              <div style={{ fontSize:12, color:C.muted }}>Points</div>
            </div>
            <div style={{ padding:"10px 20px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
              <div className="heading" style={{ fontSize:16, fontWeight:800, color:C.text }}>{result.cat?.label}</div>
              <div style={{ fontSize:12, color:C.muted }}>Category</div>
            </div>
          </div>
          <button className="btn-primary" style={{ padding:"12px 32px", borderRadius:10, fontSize:14 }}
            onClick={()=>{ setSubmitted(false); setForm({name:"",category:"",quantity:"1",unit:"items",notes:""}); setLocation(null); }}>
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
          <div className="heading" style={{ fontWeight:800, fontSize:20, color:C.text, marginBottom:6 }}>Add Waste Item</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:28 }}>Log a waste item — saved directly to Supabase</p>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Item Name *</label>
              <input style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                placeholder="e.g. Plastic bottle, food scraps..." value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:10, display:"block" }}>Waste Category *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {wasteCategories.map(wc=>(
                  <div key={wc.id} onClick={()=>setForm({...form,category:wc.id})}
                    style={{ padding:14, borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .2s",
                      background:form.category===wc.id?`${wc.color}18`:C.surface, border:`1px solid ${form.category===wc.id?wc.color:C.border}` }}>
                    <wc.icon size={16} color={wc.color}/>
                    <span style={{ fontSize:14, color:form.category===wc.id?wc.color:C.text, fontWeight:form.category===wc.id?600:400 }}>{wc.label}</span>
                    {form.category===wc.id&&<CheckCircle size={14} color={wc.color} style={{ marginLeft:"auto" }}/>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Quantity</label>
                <input type="number" style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                  value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Unit</label>
                <select style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14 }}
                  value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                  {["items","kg","litres","bags"].map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Location — GPS or Manual */}
            <LocationPicker location={location} setLocation={setLocation}/>

            <div>
              <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:"block" }}>Notes (optional)</label>
              <textarea style={{ width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14, resize:"vertical", minHeight:80, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}
                placeholder="Any details..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
            </div>
            {error&&<div className="error-box">{error}</div>}
            <button className="btn-primary glow" style={{ padding:"14px 0", borderRadius:12, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onClick={handleSubmit} disabled={loading}>
              {loading&&<Spinner size={16}/>} Save to Database →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── ANALYTICS (live from Supabase) ──────────────────────────────────────────
function Analytics({ isAdmin, user }) {
  const [logs, setLogs]               = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      if (isAdmin) {
        const { data } = await supabase.from("waste_logs").select("*").order("created_at",{ascending:false}).limit(200);
        setLogs(data||[]);
        const { data:lb } = await supabase.from("profiles").select("name,green_points,co2_saved").order("green_points",{ascending:false}).limit(10);
        setLeaderboard(lb||[]);
      } else {
        const { data } = await supabase.from("waste_logs").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100);
        setLogs(data||[]);
      }
      setLoading(false);
    };
    load();
    const sub = supabase.channel("analytics-"+user.id)
      .on("postgres_changes",{event:"*",schema:"public",table:"waste_logs"},()=>load())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [isAdmin, user?.id]);

  const weeklyData = (() => {
    const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], counts=new Array(7).fill(0), now=new Date();
    logs.forEach(log=>{ const d=new Date(log.created_at),diff=Math.floor((now-d)/86400000); if(diff<7){ const idx=(d.getDay()+6)%7; counts[idx]++; } });
    return { labels:days, values:counts };
  })();
  const catBreakdown = (() => {
    const total=logs.length||1;
    return wasteCategories.map(wc=>({ cat:wc.label, color:wc.color, pct:Math.round((logs.filter(l=>l.category===wc.id).length/total)*100) }));
  })();
  const totalPts=logs.reduce((s,l)=>s+(l.points_earned||0),0), maxBar=Math.max(...weeklyData.values,1);

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      {loading ? <div style={{ textAlign:"center", padding:60 }}><Spinner size={32}/></div> : (<>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            { label:"Total Items",      value:logs.length,                                      icon:Trash2,        color:C.muted },
            { label:"Recyclable",       value:logs.filter(l=>l.category==="recyclable").length, icon:Recycle,       color:C.blue },
            { label:"Organic",          value:logs.filter(l=>l.category==="organic").length,    icon:Leaf,          color:C.accent },
            { label:"Hazardous Logged", value:logs.filter(l=>l.category==="hazardous").length,  icon:AlertTriangle, color:C.danger },
          ].map((k,i)=>(
            <div key={i} className="card" style={{ padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:12, color:C.muted }}>{k.label}</span>
                <div style={{ width:30, height:30, borderRadius:8, background:`${k.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><k.icon size={14} color={k.color}/></div>
              </div>
              <div className="heading" style={{ fontSize:26, fontWeight:800, color:C.text }}>{k.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
          <div className="card" style={{ padding:28 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:24 }}>
              {isAdmin?"All Users — Items This Week":"Your Items This Week"}
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:160 }}>
              {weeklyData.values.map((v,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div style={{ fontSize:12, color:C.muted }}>{v}</div>
                  <div className="chart-bar" style={{ width:"100%", height:`${(v/maxBar)*120}px`, background:v===Math.max(...weeklyData.values)?C.accent:`${C.accent}50`, minHeight:4 }}/>
                  <div style={{ fontSize:12, color:C.muted }}>{weeklyData.labels[i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding:28 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:20 }}>Category Breakdown</div>
            {catBreakdown.map((c,i)=>(
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, color:C.text }}>{c.cat}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{c.pct}%</span>
                </div>
                <div style={{ height:7, borderRadius:4, background:C.dim, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${c.pct}%`, background:c.color, borderRadius:4 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isAdmin&&leaderboard.length>0&&(
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text }}>Citizen Leaderboard</div>
              <button className="btn-ghost" style={{ padding:"6px 14px", borderRadius:8, fontSize:12, display:"flex", alignItems:"center", gap:6 }}><Download size={13}/> Export</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 100px" }}>
              <div style={{ padding:"8px 12px", fontSize:12, color:C.muted, gridColumn:"1/-1", display:"grid", gridTemplateColumns:"40px 1fr 100px", background:C.surface, borderRadius:8, marginBottom:6 }}>
                <span>#</span><span>Name</span><span>CO₂ Saved</span>
              </div>
              {leaderboard.map((row,i)=>(
                <div key={i} style={{ padding:"10px 12px", gridColumn:"1/-1", display:"grid", gridTemplateColumns:"40px 1fr 100px", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
                  <span style={{ fontSize:14, color:C.muted, fontWeight:700 }}>#{i+1}</span>
                  <span style={{ fontSize:14, color:C.text, fontWeight:500 }}>{row.name}</span>
                  <span style={{ fontSize:13, color:C.blue }}>{row.co2_saved} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {isAdmin&&(
          <div className="card" style={{ padding:24 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:20 }}>Hotspots Requiring Trucks</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {logs.length === 0 ? <div style={{ color:C.muted, fontSize:13 }}>Loading...</div> :
                (() => {
                  // Group logs by address to show zone summaries
                  const zones = {};
                  logs.forEach(l => {
                    const key = l.address || "Unknown location";
                    if (!zones[key]) zones[key] = { address:key, count:0, categories:new Set() };
                    zones[key].count++;
                    zones[key].categories.add(l.category);
                  });
                  return Object.values(zones).slice(0,8).map((z,i)=>{
                    const cats = [...z.categories];
                    const col = cats.includes("hazardous")?C.danger:cats.includes("recyclable")?C.blue:C.accent;
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 16px", borderRadius:12, background:C.surface, border:`1px solid ${C.border}` }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:col, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{z.address}</div>
                          <div style={{ fontSize:12, color:C.muted }}>{z.count} item{z.count>1?"s":""} · {cats.join(", ")}</div>
                        </div>
                        <div style={{ padding:"4px 12px", borderRadius:100, background:`${col}18`, border:`1px solid ${col}30`, fontSize:12, color:col, fontWeight:600 }}>
                          {z.count} log{z.count>1?"s":""}
                        </div>
                      </div>
                    );
                  });
                })()
              }
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

// ─── ADMIN DASHBOARD (from original App.jsx, with live Supabase data) ─────────
function AdminDashboard() {
  const [hotspots, setHotspots]   = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [logCount, setLogCount]   = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data:hs },{ count:uc },{ count:lc },{ data:logs }] = await Promise.all([
        supabase.from("hotspots").select("*"),
        supabase.from("profiles").select("*",{count:"exact",head:true}),
        supabase.from("waste_logs").select("*",{count:"exact",head:true}),
        supabase.from("waste_logs").select("id,item_name,category,address,created_at,points_earned").order("created_at",{ascending:false}).limit(6),
      ]);
      setHotspots(hs||[]); setUserCount(uc||0); setLogCount(lc||0); setRecentLogs(logs||[]); setLoading(false);
    };
    load();
    const sub = supabase.channel("admin-dash")
      .on("postgres_changes",{event:"*",schema:"public",table:"waste_logs"},()=>load())
      .on("postgres_changes",{event:"*",schema:"public",table:"profiles"},()=>load())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const levelColor = { high:C.danger, med:C.warn, low:C.accent };
  const adminStats = [
    { label:"Active Zones",    value:loading?"—":hotspots.length,               icon:MapPin,      color:C.blue,   delta:"live" },
    { label:"Registered Users",value:loading?"—":userCount,                     icon:Users,       color:C.accent, delta:"live" },
    { label:"Waste Logs Total",value:loading?"—":logCount,                      icon:Trash2,      color:C.muted,  delta:"live" },
    { label:"Critical Zones",  value:loading?"—":hotspots.filter(h=>h.level==="high").length, icon:AlertTriangle, color:C.danger, delta:"live" },
  ];

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Admin header */}
      <div className="card" style={{ padding:24, background:"linear-gradient(135deg,#fff5f5 0%,#fee2e2 100%)", borderColor:"rgba(220,38,38,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <Shield size={16} color={C.danger}/>
              <span style={{ fontSize:12, color:"#991b1b", fontWeight:700 }}>ADMIN CONTROL CENTRE</span>
            </div>
            <div className="heading" style={{ fontSize:24, fontWeight:800, color:"#7f1d1d" }}>Municipal Dashboard</div>
            <div style={{ color:"#991b1b", marginTop:4, fontSize:14, opacity:0.8 }}>Delhi Waste Management Authority · Live Supabase Data</div>
          </div>
          {!loading&&(
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", textAlign:"center" }}>
                <div className="heading" style={{ fontSize:20, fontWeight:800, color:C.danger }}>{hotspots.filter(h=>h.level==="high").length}</div>
                <div style={{ fontSize:12, color:C.muted }}>Critical Alerts</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, textAlign:"center" }}>
                <div className="heading" style={{ fontSize:20, fontWeight:800, color:C.accent }}>{userCount}</div>
                <div style={{ fontSize:12, color:C.muted }}>Registered Users</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.3)", textAlign:"center" }}>
                <div className="heading" style={{ fontSize:20, fontWeight:800, color:C.blue }}>{logCount}</div>
                <div style={{ fontSize:12, color:C.muted }}>Total Logs</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {adminStats.map((s,i)=>(
          <div key={i} className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:12, color:C.muted }}>{s.label}</span>
              <div style={{ width:30, height:30, borderRadius:8, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><s.icon size={14} color={s.color}/></div>
            </div>
            <div className="heading" style={{ fontSize:28, fontWeight:800, color:C.text }}>{s.value}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {loading ? <div style={{ textAlign:"center", padding:40 }}><Spinner size={32}/></div> : (<>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Critical zones */}
          <div className="card" style={{ padding:24 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>Critical Zones</div>
            {hotspots.filter(h=>h.level==="high").length===0 ? (
              <div style={{ color:C.muted, fontSize:13 }}>No critical zones right now.</div>
            ) : hotspots.filter(h=>h.level==="high").map((h,i,arr)=>{
              const truckOn=(h.collections_needed||0)>0;
              return (
              <div key={i} style={{ padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontWeight:600, color:C.text }}>{h.name}</span>
                  <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>{h.volume} kg</span>
                </div>
                <div style={{ height:5, borderRadius:3, background:C.dim, overflow:"hidden", marginBottom:10 }}>
                  <div style={{ height:"100%", width:`${Math.min((h.volume/3000)*100,100)}%`, background:C.danger, borderRadius:3 }}/>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button className="btn-primary" style={{ padding:"5px 14px", borderRadius:8, fontSize:12 }}>Dispatch</button>
                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:C.muted }}>Truck needed</span>
                    <button onClick={async()=>{ const n=(h.collections_needed||0)>0?0:1; await supabase.from("hotspots").update({collections_needed:n}).eq("id",h.id); }}
                      style={{ width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",background:truckOn?C.accent:C.dim,position:"relative",transition:"background .2s" }}>
                      <div style={{ position:"absolute",top:2,left:truckOn?20:2,width:18,height:18,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left .2s" }}/>
                    </button>
                    <span style={{ fontSize:12,fontWeight:600,color:truckOn?C.accent:C.muted }}>{truckOn?"Yes":"No"}</span>
                  </div>
                </div>
              </div>
            );})}
          </div>
          {/* Recent waste logs */}
          <div className="card" style={{ padding:24 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>Recent Waste Submissions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(() => {
                const catColor = { recyclable:C.blue, organic:C.accent, hazardous:C.danger, general:C.muted };
                // recentLogs is top 6 from waste_logs fetched in load()
                return (recentLogs||[]).slice(0,6).map((l,i)=>{
                  const col = catColor[l.category]||C.muted;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:col, flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{l.item_name}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{l.address||"No location"} · {new Date(l.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                      </div>
                      <div style={{ padding:"2px 8px", borderRadius:100, background:`${col}18`, fontSize:12, color:col, fontWeight:600, textTransform:"capitalize" }}>{l.category}</div>
                    </div>
                  );                });
              })()}
              {(!recentLogs||recentLogs.length===0)&&<div style={{ color:C.muted, fontSize:13 }}>No submissions yet.</div>}
            </div>
          </div>
        </div>

        {/* All hotspots */}
        <div className="card" style={{ padding:24 }}>
          <div className="heading" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>All Hotspots</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {hotspots.map((h,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:levelColor[h.level], flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{h.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{h.volume} kg · {h.collections_needed} truck{h.collections_needed>1?"s":""}</div>
                </div>
                <div style={{ padding:"2px 8px", borderRadius:100, background:`${levelColor[h.level]}18`, fontSize:12, color:levelColor[h.level], fontWeight:600, textTransform:"uppercase" }}>{h.level}</div>
              </div>
            ))}
          </div>
        </div>
      </>)}
    </div>
  );
}

// ─── HOTSPOTS PAGE ────────────────────────────────────────────────────────────
function HotspotsPage() {
  const [hotspots, setHotspots] = useState([]);
  const [wasteLogs, setWasteLogs] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState({});
  const levelColor = { high:C.danger, med:C.warn, low:C.accent };

  const loadData = async () => {
    const [{ data:hs }, { data:logs }] = await Promise.all([
      supabase.from("hotspots").select("*").order("volume",{ascending:false}),
      supabase.from("waste_logs").select("id,item_name,category,lat,lng,address,created_at,points_earned,user_id").order("created_at",{ascending:false}).limit(200),
    ]);
    setHotspots(hs||[]);
    setWasteLogs(logs||[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const sub = supabase.channel("hotspots-page")
      .on("postgres_changes",{event:"*",schema:"public",table:"hotspots"},()=>loadData())
      .on("postgres_changes",{event:"*",schema:"public",table:"waste_logs"},()=>loadData())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const toggleTruck = async (h) => {
    setToggling(t=>({...t,[h.id]:true}));
    const newVal = (h.collections_needed||0) > 0 ? 0 : 1;
    await supabase.from("hotspots").update({ collections_needed: newVal }).eq("id", h.id);
    setToggling(t=>({...t,[h.id]:false}));
  };

  if (loading) return <div style={{ padding:28, textAlign:"center" }}><Spinner size={32}/></div>;

  // Combine hotspots + waste logs into one unified list
  const wasteLogEntries = wasteLogs.map(l => ({
    _type: "log",
    id: l.id,
    name: l.item_name,
    sub: l.address || (l.lat ? `${l.lat?.toFixed(4)}, ${l.lng?.toFixed(4)}` : "No location"),
    category: l.category,
    date: new Date(l.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),
    pts: l.points_earned,
  }));

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:20 }}>
      {/* Summary counts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[["High","high",C.danger],["Medium","med",C.warn],["Low","low",C.accent]].map(([l,k,c],i)=>(
          <div key={i} className="card" style={{ padding:20, borderColor:`${c}30` }}>
            <div style={{ fontSize:12, color:C.muted }}>{l} Priority Zones</div>
            <div className="heading" style={{ fontSize:32, fontWeight:800, color:c, marginTop:4 }}>{hotspots.filter(h=>h.level===k).length}</div>
          </div>
        ))}
      </div>

      {/* Hotspot zones with truck toggle */}
      <div className="card" style={{ padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <Radio size={16} color={C.accent}/>
          <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text }}>Waste Hotspot Zones</div>
          <div style={{ marginLeft:"auto", fontSize:12, color:C.muted }}>{hotspots.length} zones · live</div>
        </div>
        {hotspots.length === 0 ? (
          <div style={{ color:C.muted, fontSize:13, padding:"20px 0", textAlign:"center" }}>No hotspot zones yet.</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {hotspots.map((h)=>{ const col=levelColor[h.level]; const truckOn=(h.collections_needed||0)>0; return (
              <div key={h.id} className="card" style={{ padding:20, borderColor:`${col}25` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`${col}18`, border:`1px solid ${col}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Radio size={18} color={col}/>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{h.name}</div>
                      <div style={{ fontSize:12, color:C.muted }}>Lat: {h.lat} · Lng: {h.lng}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ textAlign:"right" }}>
                      <div className="heading" style={{ fontSize:18, fontWeight:800, color:C.text }}>{h.volume} kg</div>
                      <div style={{ fontSize:12, color:C.muted }}>volume</div>
                    </div>
                    <div style={{ padding:"4px 12px", borderRadius:100, background:`${col}18`, border:`1px solid ${col}30`, fontSize:12, color:col, fontWeight:700, textTransform:"uppercase" }}>{h.level}</div>
                  </div>
                </div>
                <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:20 }}>
                    <div style={{ fontSize:13, color:h.trend==="up"?C.danger:C.accent }}>{h.trend==="up"?"↑ Increasing":"↓ Decreasing"}</div>
                  </div>
                  {/* Truck needed toggle */}
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:13, color:C.muted }}>Truck needed</span>
                    <button
                      onClick={()=>toggleTruck(h)}
                      disabled={toggling[h.id]}
                      style={{
                        width:46, height:26, borderRadius:13, border:"none", cursor:"pointer",
                        background: truckOn ? C.accent : C.dim,
                        position:"relative", transition:"background .2s", flexShrink:0,
                        opacity: toggling[h.id] ? 0.6 : 1,
                      }}>
                      <div style={{
                        position:"absolute", top:3, left: truckOn ? 23 : 3,
                        width:20, height:20, borderRadius:"50%", background:"#fff",
                        boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left .2s",
                      }}/>
                    </button>
                    <span style={{ fontSize:12, fontWeight:600, color: truckOn ? C.accent : C.muted, minWidth:20 }}>
                      {truckOn ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop:12, height:4, borderRadius:3, background:C.dim }}>
                  <div style={{ height:"100%", width:`${Math.min(Math.round(h.volume/30),100)}%`, background:col, borderRadius:3 }}/>
                </div>
              </div>
            ); })}
          </div>
        )}
      </div>

      {/* Recent waste log entries */}
      <div className="card" style={{ padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <MapPin size={16} color={C.blue}/>
          <div className="heading" style={{ fontWeight:700, fontSize:16, color:C.text }}>Recent Waste Log Entries</div>
          <div style={{ marginLeft:"auto", fontSize:12, color:C.muted }}>{wasteLogs.length} entries · live</div>
        </div>
        {wasteLogs.length === 0 ? (
          <div style={{ color:C.muted, fontSize:13, padding:"20px 0", textAlign:"center" }}>No waste logs yet.</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {wasteLogEntries.map((e,i)=>{
              const catColor = { recyclable:C.blue, organic:C.accent, hazardous:C.danger, general:C.muted };
              const col = catColor[e.category]||C.muted;
              return (
                <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:col, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{e.sub}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ padding:"2px 10px", borderRadius:100, background:`${col}15`, fontSize:12, color:col, fontWeight:600, textTransform:"capitalize", marginBottom:2 }}>{e.category}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{e.date} · +{e.pts}pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const sectionTitles = {
  dashboard:"My Dashboard", "admin-dashboard":"Admin Dashboard",
  scanner:"AI Scanner", map:"Waste Map", hotspots:"Waste Hotspots",
  "add-waste":"Add Waste", analytics:"Analytics", schedule:"Collection Schedule",
  users:"User Management", settings:"Settings",
};

function AppShell({ user, onLogout }) {
  const [section, setSection] = useState(user.role==="admin"?"admin-dashboard":"dashboard");
  const renderSection = () => {
    switch(section) {
      case "dashboard":       return <UserDashboard user={user}/>;
      case "admin-dashboard": return <AdminDashboard/>;
      case "scanner":         return <AIScanner user={user}/>;
      case "map":             return <MapView/>;
      case "hotspots":        return <HotspotsPage/>;
      case "add-waste":       return <AddWaste user={user}/>;
      case "analytics":       return <Analytics isAdmin={user.role==="admin"} user={user}/>;
      case "schedule":        return <Analytics isAdmin={true} user={user}/>;
      case "users":           return (
        <div className="fade-in" style={{ padding:28 }}>
          <div className="card" style={{ padding:24 }}>
            <div className="heading" style={{ fontWeight:700, fontSize:17, color:C.text, marginBottom:8 }}>Registered Citizens</div>
            <div style={{ color:C.muted, fontSize:14 }}>User management — data lives in your Supabase profiles table.</div>
          </div>
        </div>
      );
      default: return <div style={{ padding:28, color:C.muted }}>Coming soon</div>;
    }
  };
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#f0fdf4" }}>
      <Sidebar user={user} activeSection={section} setActiveSection={setSection} onLogout={onLogout}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TopBar title={sectionTitles[section]||"Verdian"} user={user}/>
        <div style={{ flex:1, overflowY:"auto", background:"#f0fdf4" }}>{renderSection()}</div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]     = useState("landing");
  const [user, setUser]     = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Seed sample data on first load (no-op if data already exists)
    seedSampleData().catch(console.warn);

    supabase.auth.getSession().then(async ({ data:{ session } }) => {
      if (session) {
        const { data:profile } = await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        setUser({ id:session.user.id, email:session.user.email, name:profile?.name||session.user.email.split("@")[0], role:profile?.role||"user", ...profile });
        setPage("app");
      }
      setBooting(false);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange(async (event,session) => {
      if (event==="SIGNED_OUT") { setUser(null); setPage("landing"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  if (booting) return (
    <div style={{ minHeight:"100vh", background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{css}</style>
      <div style={{ width:48, height:48, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Recycle size={24} color={C.accent}/>
      </div>
      <Spinner size={24}/>
      <div style={{ fontSize:13, color:C.muted }}>Connecting to Supabase...</div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {page==="landing" && <LandingPage onNavigate={setPage}/>}
      {page==="auth"    && <AuthPage onLogin={(u)=>{ setUser(u); setPage("app"); }}/>}
      {page==="app" && user && <AppShell user={user} onLogout={handleLogout}/>}
    </>
  );
}
