import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf, Trash2, MapPin, BarChart3, LogOut,
  User, Bell, Upload, CheckCircle, AlertTriangle,
  Recycle, TrendingUp, TrendingDown, Clock, Shield, Users,
  Map, ScanLine, Plus, X, Star, Activity, Download,
  Home, Radio, Settings, Loader
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  .leaflet-container { border-radius: 12px; }
  .leaflet-popup-content-wrapper { background: #ffffff; border: 1px solid #e2e8f0; color: #1a202c; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
  .leaflet-popup-tip { background: #ffffff; }
  .leaflet-popup-content { margin: 14px 18px; font-family: 'DM Sans', sans-serif; }
  .leaflet-popup-close-button { color: #888 !important; }
  .leaflet-control-zoom a { background: #ffffff !important; color: #16a34a !important; border-color: #d1fae5 !important; font-weight: 700 !important; }
  .leaflet-control-zoom a:hover { background: #f0fdf4 !important; }
  .leaflet-control-attribution { background: rgba(255,255,255,0.85) !important; color: #888 !important; font-size: 10px; }
  .leaflet-control-attribution a { color: #16a34a !important; }act";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf, Trash2, MapPin, BarChart3, LogOut,
  User, Bell, Upload, CheckCircle, AlertTriangle,
  Recycle, TrendingUp, TrendingDown, Clock, Shield, Users,
  Map, ScanLine, Plus, X, Star, Activity, Download,
  Home, Radio, Settings, Loader
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  .leaflet-container { border-radius: 12px; }
  .leaflet-popup-content-wrapper { background: #162019; border: 1px solid #1e3028; color: #e8f5ee; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  .leaflet-popup-tip { background: #162019; }
  .leaflet-popup-content { margin: 14px 18px; font-family: 'DM Sans', sans-serif; }
  .leaflet-control-zoom a { background: #162019 !important; color: #22c55e !important; border-color: #1e3028 !important; }
  .leaflet-control-zoom a:hover { background: #1e3028 !important; }
  .leaflet-control-attribution { background: rgba(10,15,13,0.8) !important; color: #6b8c78 !important; font-size: 10px; }
  .leaflet-control-attribution a { color: #22c55e !important; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 2px; }
  .syne { font-family: 'Syne', sans-serif; }
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
    { icon: ScanLine, title:"AI Scanner",       desc:"Snap a photo. Our model classifies waste in under 2 seconds with 94% accuracy." },
    { icon: Map,      title:"Live Hotspot Map", desc:"Real-time waste accumulation maps help municipalities dispatch trucks efficiently." },
    { icon: BarChart3,title:"Smart Analytics",  desc:"Track recycling rates, CO₂ savings, and collection schedules on one dashboard." },
    { icon: Leaf,     title:"Eco Rewards",      desc:"Earn green points for every item correctly classified. Redeem at partner stores." },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, overflowX:"hidden" }}>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"16px 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(10,15,13,0.95)" : "transparent",
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
          <button className="btn-primary glow-sm" style={{ padding:"8px 20px", borderRadius:8, fontSize:14 }} onClick={() => onNavigate("auth")}>Get Started →</button>
        </div>
      </nav>

      <div style={{ paddingTop:120, paddingBottom:80, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
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
      </div>

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

      <div style={{ padding:"60px 40px", textAlign:"center", borderTop:`1px solid ${C.border}` }}>
        <h2 className="syne" style={{ fontSize:32, fontWeight:800, color:C.text, marginBottom:16 }}>Join eco-conscious users</h2>
        <p style={{ color:C.muted, marginBottom:32 }}>Delhi · Mumbai · Bengaluru · Hyderabad · Chennai</p>
        <button className="btn-primary glow" style={{ padding:"16px 40px", borderRadius:12, fontSize:16 }} onClick={() => onNavigate("auth")}>
          Get Started — It's Free
        </button>
      </div>

      <div style={{ padding:"20px 40px", textAlign:"center", borderTop:`1px solid ${C.border}`, color:C.muted, fontSize:12 }}>
        © 2026 Verdian. Smart Waste Intelligence.
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
          <span className="syne" style={{ fontWeight:800, fontSize:24, color:C.text }}>VERDIAN</span>
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
                  style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
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
    { id:"dashboard",   icon:Home,     label:"Dashboard" },
    { id:"scanner",     icon:ScanLine, label:"AI Scanner" },
    { id:"map",         icon:Map,      label:"Waste Map" },
    { id:"hotspots",    icon:Radio,    label:"Hotspots" },
    { id:"add-waste",   icon:Plus,     label:"Add Waste" },
    { id:"analytics",   icon:BarChart3,label:"Analytics" },
  ];
  const adminLinks = [
    { id:"admin-dashboard", icon:Shield,    label:"Admin Overview" },
    { id:"map",             icon:Map,       label:"City Map" },
    { id:"hotspots",        icon:Radio,     label:"Hotspots" },
    { id:"schedule",        icon:Clock,     label:"Schedule" },
    { id:"analytics",       icon:BarChart3, label:"Analytics" },
    { id:"users",           icon:Users,     label:"Users" },
  ];
  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <div style={{ width:220, minHeight:"100vh", background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"20px 12px", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 6px", marginBottom:32 }}>
        <div style={{ width:32, height:32, background:C.accentGlow, border:`1px solid ${C.accent}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Recycle size={15} color={C.accent} />
        </div>
        <span className="syne" style={{ fontWeight:800, fontSize:17, color:C.text }}>VERDIAN</span>
      </div>

      <div style={{ padding:"6px 12px", borderRadius:8, background: user.role === "admin" ? "rgba(239,68,68,.1)" : C.accentGlow, border:`1px solid ${user.role === "admin" ? "rgba(239,68,68,.3)" : C.dim}`, marginBottom:20 }}>
        <div style={{ fontSize:10, color: user.role === "admin" ? C.danger : C.accent, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>
          {user.role === "admin" ? "🏛️ Admin" : "🌿 Citizen"}
        </div>
        <div style={{ fontSize:12, color:C.text, marginTop:2, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
      </div>

      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        {links.map(l => (
          <div key={l.id} className={`sidebar-link ${activeSection === l.id ? "active" : ""}`} onClick={() => setActiveSection(l.id)}>
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
    <div style={{ height:60, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0 }}>
      <div>
        <div className="syne" style={{ fontWeight:700, fontSize:17, color:C.text }}>{title}</div>
        <div style={{ fontSize:11, color:C.muted }}>
          {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", cursor:"pointer" }}>
          <Bell size={18} color={C.muted} />
        </div>
        <div style={{ width:36, height:36, borderRadius:"50%", background:C.accentGlow, border:`1px solid ${C.dim}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <User size={16} color={C.accent} />
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Recent logs
      const { data: logsData } = await supabase
        .from("waste_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setLogs(logsData || []);

      // Profile stats
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof) setProfile({ ...user, ...prof });

      // Rank: how many users have more points
      const { count } = await supabase
        .from("profiles")
        .select("*", { count:"exact", head:true })
        .gt("green_points", prof?.green_points || 0);
      setRank((count || 0) + 1);

      setLoading(false);
    };
    load();
  }, [user.id]);

  const catColor = { recyclable: C.blue, organic: C.accent, hazardous: C.danger, general: C.muted };

  return (
    <div className="fade-in" style={{ padding:28, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Welcome */}
      <div className="card glow" style={{ padding:28, background:"linear-gradient(135deg, #162019 0%, #0f1f14 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:160, height:160, background:"radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
        <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>Good morning 🌿</div>
        <div className="syne" style={{ fontSize:26, fontWeight:800, color:C.text }}>Hi, {profile.name?.split(" ")[0]}!</div>
        <div style={{ color:C.muted, marginTop:6, fontSize:14 }}>
          You've saved <span style={{ color:C.accent, fontWeight:600 }}>{profile.co2_saved || 0} kg</span> of CO₂ this month. Keep it up!
        </div>
        <div style={{ marginTop:20, display:"flex", gap:10 }}>
          <div style={{ padding:"6px 14px", borderRadius:8, background:C.accentGlow, border:`1px solid ${C.dim}`, fontSize:12, color:C.accent }}>🏆 Eco Hero</div>
          {rank && <div style={{ padding:"6px 14px", borderRadius:8, background:"rgba(59,130,246,.1)", border:`1px solid rgba(59,130,246,.3)`, fontSize:12, color:C.blue }}>Rank #{rank} in Delhi</div>}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          { label:"Items Scanned",  value: loading ? "—" : logs.length,             icon:ScanLine, color:C.blue },
          { label:"Green Points",   value: loading ? "—" : profile.green_points||0,  icon:Star,     color:C.accent },
          { label:"CO₂ Saved",      value: loading ? "—" : `${profile.co2_saved||0}kg`, icon:Leaf, color:C.accent },
          { label:"Streak",         value: loading ? "—" : `${profile.streak||0}d`,  icon:Activity, color:C.warn },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:12, color:C.muted }}>{s.label}</div>
              <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <s.icon size={14} color={s.color} />
              </div>
            </div>
            <div className="syne" style={{ fontSize:24, fontWeight:800, color:C.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Activity + Tips */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card" style={{ padding:24 }}>
          <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>Recent Activity</div>
          {loading ? <Spinner /> : logs.length === 0 ? (
            <div style={{ color:C.muted, fontSize:13 }}>No waste logged yet. Start scanning!</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {logs.map((log,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:catColor[log.category], flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{log.item_name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{log.category} · {new Date(log.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize:12, color:C.accent, fontWeight:600 }}>+{log.points_earned}pts</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding:24 }}>
          <div className="syne" style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:16 }}>🌱 Segregation Guide</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {wasteCategories.map((wc,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <wc.icon size={14} color={wc.color} />
                <span style={{ fontSize:13, color:wc.color, fontWeight:600, minWidth:80 }}>{wc.label}</span>
                <span style={{ fontSize:12, color:C.muted }}>{wc.examples.slice(0,2).join(", ")}</span>
              </div>
            ))}
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
                  <div style={{ marginTop:12, fontSize:11, color:C.muted, padding:"6px 14px", background:C.accentGlow, borderRadius:100, display:"inline-block" }}>
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
                      <div style={{ fontSize:11, color:C.muted }}>confidence</div>
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
                      <div style={{ fontSize:11, color:C.muted }}>{log.category}</div>
                    </div>
                    <div style={{ fontSize:11, color:C.accent }}>+{log.points_earned}pts</div>
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
                  style={{ padding:"5px 10px", borderRadius:8, fontSize:11 }}>
                  {f === "all" ? "All Zones" : f === "high" ? "🔴" : f === "med" ? "🟡" : "🟢"}
                </button>
              ))}
              <button onClick={() => setShowLogs(!showLogs)}
                className={`btn-ghost ${showLogs ? "tab-active" : ""}`}
                style={{ padding:"5px 10px", borderRadius:8, fontSize:11 }}>
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
            <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Legend:</div>
            {[["#ef4444","High Hotspot"],["#f59e0b","Med Hotspot"],["#22c55e","Low Hotspot"]].map(([c,l],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
            {[["♻️","Recyclable"],["🌿","Organic"],["⚠️","Hazardous"],["🗑️","General"]].map(([e,l],i)=>(
              <div key={i} style={{ fontSize:11, color:C.muted }}>{e} {l}</div>
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
                    <div style={{ display:"inline-flex", marginTop:6, padding:"3px 10px", borderRadius:100, background:`${levelColor[selectedHotspot.level]}20`, fontSize:11, color:levelColor[selectedHotspot.level], fontWeight:600 }}>
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
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(239,68,68,.1)", fontSize:11, color:C.danger }}>● Hotspot zones</div>
                <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(34,197,94,.1)", fontSize:11, color:C.accent }}>📍 Waste logs</div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding:18 }}>
            <div className="syne" style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>Active Hotspots</div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>{hotspots.length} zones · {wasteLogs.length} pinned logs</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {hotspots.filter(h => filter === "all" || h.level === filter).map((h,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}`, cursor:"pointer" }}
                  onClick={() => { setSelectedHotspot(h); setSelectedLog(null); if (mapObjRef.current) mapObjRef.current.setView([h.lat, h.lng], 13); }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:levelColor[h.level], flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{h.name}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{h.volume} kg · {h.collections_needed} truck{h.collections_needed>1?"s":""}</div>
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
              <div style={{ fontSize:11, color:C.muted }}>Points</div>
            </div>
            <div style={{ padding:"10px 20px", borderRadius:10, background:C.surface, border:`1px solid ${C.border}` }}>
              <div className="syne" style={{ fontSize:16, fontWeight:800, color:C.text }}>{result.cat?.label}</div>
              <div style={{ fontSize:11, color:C.muted }}>Category</div>
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
                    <div style={{ fontSize:11, color:C.muted }}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</div>
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
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10, border:`1px dashed ${C.dim}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", transition:"all .2s", width:"100%" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.dim; e.currentTarget.style.color = C.muted; }}>
                    {gpsLoading ? <Spinner size={15} /> : <MapPin size={15} />}
                    {gpsLoading ? "Getting your location..." : "Use my current GPS location"}
                  </button>
                  {gpsError && <div style={{ fontSize:12, color:C.danger, marginTop:6 }}>⚠ {gpsError}</div>}
                  <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>Click the button above — your browser will ask for permission</div>
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
                    <div style={{ fontSize:11, color:C.muted }}>{v}</div>
                    <div className="chart-bar" style={{ width:"100%", height:`${(v/maxBar)*120}px`, background:v===Math.max(...weeklyData.values)?C.accent:`${C.accent}50`, minHeight:4 }} />
                    <div style={{ fontSize:11, color:C.muted }}>{weeklyData.labels[i]}</div>
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
                <div style={{ padding:"8px 12px", fontSize:11, color:C.muted, gridColumn:"1/-1", display:"grid", gridTemplateColumns:"40px 1fr 120px 100px", background:C.surface, borderRadius:8, marginBottom:6 }}>
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
                      <div style={{ padding:"4px 12px", borderRadius:100, background:`${sc}18`, border:`1px solid ${sc}30`, fontSize:11, color:sc, fontWeight:600, textTransform:"capitalize" }}>{s.status}</div>
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
                <div style={{ fontSize:11, color:C.muted }}>Critical Zones</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:C.accentGlow, border:`1px solid ${C.dim}`, textAlign:"center" }}>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.accent }}>{userCount}</div>
                <div style={{ fontSize:11, color:C.muted }}>Registered Users</div>
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.3)", textAlign:"center" }}>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:C.blue }}>{logCount}</div>
                <div style={{ fontSize:11, color:C.muted }}>Total Logs</div>
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
                    <button className="btn-primary" style={{ padding:"5px 14px", borderRadius:8, fontSize:11 }}>Dispatch</button>
                    <button className="btn-ghost"   style={{ padding:"5px 14px", borderRadius:8, fontSize:11 }}>Details</button>
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
                      <div style={{ fontSize:11, color:C.muted }}>{h.volume} kg · {h.collections_needed} truck{h.collections_needed>1?"s":""}</div>
                    </div>
                    <div style={{ padding:"2px 8px", borderRadius:100, background:`${levelColor[h.level]}18`, fontSize:10, color:levelColor[h.level], fontWeight:600, textTransform:"uppercase" }}>{h.level}</div>
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
                      <div style={{ fontSize:11, color:C.muted }}>{s.time} · {s.type} · {s.truck}</div>
                    </div>
                    <div style={{ padding:"3px 10px", borderRadius:100, background:`${sc}18`, fontSize:10, color:sc, fontWeight:600, textTransform:"capitalize" }}>{s.status}</div>
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
                    <div style={{ fontSize:11, color:C.muted }}>volume</div>
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
