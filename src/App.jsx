import { useState, useEffect, useRef } from "react";
import {
  Leaf, Trash2, Zap, MapPin, BarChart3, Camera, LogIn, LogOut,
  User, Settings, Bell, ChevronRight, Upload, CheckCircle, AlertTriangle,
  Recycle, FlameKindling, Package, Droplets, TrendingUp, TrendingDown,
  Calendar, Clock, Shield, Users, Map, ScanLine, Plus, X, Eye,
  ArrowRight, Star, Globe, Award, Activity, Filter, Download,
  Home, Menu, ChevronDown, Info, Cpu, Target, Radio
} from "lucide-react";

// ─── Color Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f0d",
  surface: "#111a15",
  card: "#162019",
  border: "#1e3028",
  accent: "#22c55e",
  accentDim: "#16a34a",
  accentGlow: "rgba(34,197,94,0.15)",
  warn: "#f59e0b",
  danger: "#ef4444",
  blue: "#3b82f6",
  text: "#e8f5ee",
  muted: "#6b8c78",
  dim: "#2d4a38",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
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
  .badge { display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:100px;font-size:11px;font-weight:500; }
  .map-cell { transition:all .2s; cursor:pointer; }
  .map-cell:hover { transform:scale(1.1); z-index:10; }
  .tab-active { background:${C.accentGlow};border-color:${C.accent}!important;color:${C.accent}!important; }
  .btn-primary { background:${C.accent};color:#0a0f0d;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s; }
  .btn-primary:hover { background:#4ade80;transform:translateY(-1px); }
  .btn-ghost { background:transparent;border:1px solid ${C.border};color:${C.muted};cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s; }
  .btn-ghost:hover { border-color:${C.accent};color:${C.accent}; }
  input,textarea,select { background:${C.surface};border:1px solid ${C.border};color:${C.text};font-family:'DM Sans',sans-serif;outline:none;transition:border .2s; }
  input:focus,textarea:focus,select:focus { border-color:${C.accent}; }
  .hotspot-high { background:rgba(239,68,68,.25);border:1px solid rgba(239,68,68,.5); }
  .hotspot-med { background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.4); }
  .hotspot-low { background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3); }
  .sidebar-link { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;color:${C.muted};transition:all .2s;border:1px solid transparent; }
  .sidebar-link:hover,.sidebar-link.active { background:${C.accentGlow};border-color:${C.dim};color:${C.accent}; }
  .card { background:${C.card};border:1px solid ${C.border};border-radius:16px; }
  .chart-bar { border-radius:4px 4px 0 0;transition:all .3s; }
  .notif-dot { position:absolute;top:2px;right:2px;width:6px;height:6px;background:${C.danger};border-radius:50%; }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const wasteCategories = [
  { id: "recyclable", label: "Recyclable", icon: Recycle, color: C.blue, examples: ["Paper","Plastic PET","Glass","Metal cans"] },
  { id: "organic", label: "Organic", icon: Leaf, color: C.accent, examples: ["Food scraps","Garden waste","Coffee grounds"] },
  { id: "hazardous", label: "Hazardous", icon: AlertTriangle, color: C.danger, examples: ["Batteries","Paint","Chemicals","E-waste"] },
  { id: "general", label: "General", icon: Trash2, color: C.muted, examples: ["Mixed plastic","Styrofoam","Contaminated items"] },
];

const hotspots = [
  { id:1, lat:28.65, lng:77.22, name:"Karol Bagh Zone", level:"high", volume:2400, trend:"up", collections:3 },
  { id:2, lat:28.70, lng:77.10, name:"Rohini Sector 9", level:"med", volume:1100, trend:"down", collections:2 },
  { id:3, lat:28.63, lng:77.28, name:"Lajpat Nagar", level:"high", volume:1950, trend:"up", collections:4 },
  { id:4, lat:28.68, lng:77.32, name:"Mayur Vihar", level:"low", volume:420, trend:"down", collections:1 },
  { id:5, lat:28.55, lng:77.20, name:"Saket", level:"med", volume:890, trend:"up", collections:2 },
  { id:6, lat:28.72, lng:77.24, name:"Pitampura", level:"low", volume:310, trend:"down", collections:1 },
];

const analyticsData = {
  weekly: [65, 72, 58, 80, 75, 90, 68],
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  categoryBreakdown: [
    { cat:"Recyclable", pct:38, color:C.blue },
    { cat:"Organic", pct:42, color:C.accent },
    { cat:"Hazardous", pct:8, color:C.danger },
    { cat:"General", pct:12, color:C.muted },
  ],
  kpis: [
    { label:"Tonnes Collected", value:"1,284", delta:"+12%", up:true },
    { label:"Recycling Rate", value:"67%", delta:"+4%", up:true },
    { label:"Hotspots Active", value:"14", delta:"-3", up:false },
    { label:"CO₂ Saved (kg)", value:"3,920", delta:"+18%", up:true },
  ]
};

const scheduleItems = [
  { zone:"Karol Bagh", time:"07:00 AM", type:"Mixed", status:"completed", truck:"DL-01-CX" },
  { zone:"Lajpat Nagar", time:"09:30 AM", type:"Organic", status:"in-progress", truck:"DL-03-GR" },
  { zone:"Rohini", time:"11:00 AM", type:"Recyclable", status:"pending", truck:"DL-07-BC" },
  { zone:"Saket", time:"02:00 PM", type:"Hazardous", status:"pending", truck:"DL-05-HZ" },
  { zone:"Mayur Vihar", time:"04:30 PM", type:"General", status:"pending", truck:"DL-09-MW" },
];

const aiWasteItems = [
  { name:"Plastic Bottle", category:"recyclable", confidence:94, guidance:"Rinse and place in blue bin. Remove cap separately.", points:10 },
  { name:"Apple Core", category:"organic", confidence:99, guidance:"Place in green bin. Compostable.", points:5 },
  { name:"Old Battery", category:"hazardous", confidence:97, guidance:"Take to nearest e-waste collection point. Do not mix with regular waste.", points:20 },
  { name:"Newspaper", category:"recyclable", confidence:91, guidance:"Keep dry and bundle with other paper. Place in blue bin.", points:8 },
  { name:"Leftover Food", category:"organic", confidence:96, guidance:"Seal in a bag and place in green compost bin.", points:5 },
  { name:"Paint Can", category:"hazardous", confidence:88, guidance:"Contact municipal hazardous waste disposal. Never pour in drain.", points:25 },
];

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const stats = [
    { val: "2.1B", label: "Tonnes landfilled yearly" },
    { val: "67%", label: "Recyclables misclassified" },
    { val: "₹48K Cr", label: "Recycling value lost" },
    { val: "94%", label: "Our AI accuracy" },
  ];

  const features = [
    { icon: ScanLine, title: "AI Scanner", desc: "Snap a photo. Our model classifies waste in under 2 seconds with 94% accuracy." },
    { icon: Map, title: "Live Hotspot Map", desc: "Real-time waste accumulation maps help municipalities dispatch trucks efficiently." },
    { icon: BarChart3, title: "Smart Analytics", desc: "Track recycling rates, CO₂ savings, and collection schedules on one dashboard." },
    { icon: Leaf, title: "Eco Rewards", desc: "Earn green points for every item correctly classified. Redeem at partner stores." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,15,13,0.95)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all .3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.accentGlow, border: `1px solid ${C.accent}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Recycle size={18} color={C.accent} />
          </div>
          <span className="syne" style={{ fontWeight: 800, fontSize: 20, color: C.text }}>VERDIAN</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ padding: "8px 20px", borderRadius: 8, fontSize: 14 }} onClick={() => onNavigate("auth")}>Sign In</button>
          <button className="btn-primary" style={{ padding: "8px 20px", borderRadius: 8, fontSize: 14 }} onClick={() => onNavigate("auth")}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background glows */}
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 200, left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="fade-in" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: C.accentGlow, border: `1px solid ${C.dim}`, marginBottom: 24 }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 500 }}>AI-Powered Waste Intelligence Platform</span>
          </div>
          <h1 className="syne" style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, color: C.text }}>
            Smarter Waste.<br />
            <span style={{ color: C.accent }}>Greener Cities.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Verdian uses computer vision and real-time analytics to classify waste, guide citizens, and optimize municipal collection routes — reducing landfill burden by up to 40%.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary glow-sm" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 16 }} onClick={() => onNavigate("auth")}>
              Start Scanning Free
            </button>
            <button className="btn-ghost" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 16 }} onClick={() => onNavigate("auth")}>
              Admin Demo →
            </button>
          </div>
        </div>

        {/* Hero UI Preview */}
        <div className="fade-in" style={{ maxWidth: 900, margin: "60px auto 0", padding: "0 24px" }}>
          <div className="card glow" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {["Recyclable — 38%", "Organic — 42%", "Hazardous — 8%"].map((label, i) => (
                <div key={i} style={{ padding: 16, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{label.split("—")[0].trim()}</div>
                  <div style={{ height: 6, borderRadius: 3, background: C.dim, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: [38,42,8][i]+"%", background: [C.blue, C.accent, C.danger][i], borderRadius: 3 }} />
                  </div>
                  <div className="syne" style={{ fontSize: 20, fontWeight: 700, marginTop: 8, color: C.text }}>{[38,42,8][i]}%</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 16, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ScanLine size={22} color={C.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.muted }}>AI Classification Result</div>
                <div style={{ fontWeight: 600, color: C.text }}>Plastic PET Bottle → Recyclable ✓</div>
              </div>
              <div style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(34,197,94,.15)", border: `1px solid ${C.dim}`, fontSize: 12, color: C.accent }}>94% confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "40px 40px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 36, fontWeight: 800, color: C.accent }}>{s.val}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, color: C.text }}>Everything in one platform</h2>
            <p style={{ color: C.muted, marginTop: 12 }}>Built for citizens and city managers alike</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: 28, display: "flex", gap: 18, alignItems: "flex-start", cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentGlow, border: `1px solid ${C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={20} color={C.accent} />
                </div>
                <div>
                  <div className="syne" style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "60px 40px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <h2 className="syne" style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>Join 12,000+ eco-conscious users</h2>
        <p style={{ color: C.muted, marginBottom: 32 }}>Delhi • Mumbai • Bengaluru • Hyderabad • Chennai</p>
        <button className="btn-primary glow" style={{ padding: "16px 40px", borderRadius: 12, fontSize: 16 }} onClick={() => onNavigate("auth")}>
          Get Started — It's Free
        </button>
      </div>

      <div style={{ padding: "20px 40px", textAlign: "center", borderTop: `1px solid ${C.border}`, color: C.muted, fontSize: 12 }}>
        © 2026 Verdian. Smart Waste Intelligence.
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = () => {
    onLogin({ name: form.name || "Aarav Singh", email: form.email || "aarav@verdian.ai", role });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Background */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, background: C.accentGlow, border: `1px solid ${C.accent}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Recycle size={20} color={C.accent} />
          </div>
          <span className="syne" style={{ fontWeight: 800, fontSize: 24, color: C.text }}>VERDIAN</span>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <h2 className="syne" style={{ fontWeight: 800, fontSize: 24, color: C.text, marginBottom: 4 }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
            {isLogin ? "Sign in to your Verdian account" : "Join the green revolution"}
          </p>

          {/* Role Toggle */}
          <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 24, border: `1px solid ${C.border}` }}>
            {["user", "admin"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s",
                  background: role === r ? C.accent : "transparent", color: role === r ? "#0a0f0d" : C.muted }}>
                {r === "user" ? "🌿 Citizen" : "🏛️ Admin"}
              </button>
            ))}
          </div>

          {!isLogin && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Full Name</label>
              <input style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
                placeholder="Aarav Singh" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Email</label>
            <input style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
              placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Password</label>
            <input type="password" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
              placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button className="btn-primary glow" style={{ width: "100%", padding: "13px 0", borderRadius: 10, fontSize: 15 }} onClick={handleSubmit}>
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: C.muted }}>
            {isLogin ? "No account?" : "Have an account?"}{" "}
            <span style={{ color: C.accent, cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.dim}`, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.muted }}>
            Demo: Just click <strong style={{ color: C.accent }}>Sign In</strong> — no credentials needed
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeSection, setActiveSection, onLogout }) {
  const userLinks = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "scanner", icon: ScanLine, label: "AI Scanner" },
    { id: "map", icon: Map, label: "Waste Map" },
    { id: "hotspots", icon: Radio, label: "Hotspots" },
    { id: "add-waste", icon: Plus, label: "Add Waste" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  const adminLinks = [
    { id: "admin-dashboard", icon: Shield, label: "Admin Overview" },
    { id: "map", icon: Map, label: "City Map" },
    { id: "hotspots", icon: Radio, label: "Hotspots" },
    { id: "schedule", icon: Calendar, label: "Schedule" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "users", icon: Users, label: "Users" },
  ];

  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <div style={{ width: 220, minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px", marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, background: C.accentGlow, border: `1px solid ${C.accent}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Recycle size={15} color={C.accent} />
        </div>
        <span className="syne" style={{ fontWeight: 800, fontSize: 17, color: C.text }}>VERDIAN</span>
      </div>

      {/* Role badge */}
      <div style={{ padding: "6px 12px", borderRadius: 8, background: user.role === "admin" ? "rgba(239,68,68,.1)" : C.accentGlow, border: `1px solid ${user.role === "admin" ? "rgba(239,68,68,.3)" : C.dim}`, marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: user.role === "admin" ? C.danger : C.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
          {user.role === "admin" ? "🏛️ Admin" : "🌿 Citizen"}
        </div>
        <div style={{ fontSize: 12, color: C.text, marginTop: 2, fontWeight: 500 }}>{user.name}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map(l => (
          <div key={l.id} className={`sidebar-link ${activeSection === l.id ? "active" : ""}`}
            onClick={() => setActiveSection(l.id)}>
            <l.icon size={16} />
            <span>{l.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        <div className="sidebar-link" onClick={() => setActiveSection("settings")}>
          <Settings size={16} /><span>Settings</span>
        </div>
        <div className="sidebar-link" style={{ color: C.danger }} onClick={onLogout}>
          <LogOut size={16} /><span>Sign Out</span>
        </div>
      </div>
    </div>
  );
}

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ title, user }) {
  return (
    <div style={{ height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
      <div>
        <div className="syne" style={{ fontWeight: 700, fontSize: 17, color: C.text }}>{title}</div>
        <div style={{ fontSize: 11, color: C.muted }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={18} color={C.muted} />
          <div className="notif-dot" />
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <User size={16} color={C.accent} />
        </div>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
function UserDashboard({ user }) {
  const userStats = [
    { label: "Items Scanned", value: "142", icon: ScanLine, color: C.blue },
    { label: "Green Points", value: "1,840", icon: Star, color: C.accent },
    { label: "CO₂ Saved", value: "28 kg", icon: Leaf, color: C.accent },
    { label: "Streak", value: "12 days", icon: Activity, color: C.warn },
  ];

  const recentActivity = [
    { item: "Plastic Bottle", cat: "Recyclable", time: "2h ago", pts: +10 },
    { item: "Food Waste", cat: "Organic", time: "5h ago", pts: +5 },
    { item: "Old Battery", cat: "Hazardous", time: "Yesterday", pts: +20 },
    { item: "Newspaper", cat: "Recyclable", time: "Yesterday", pts: +8 },
  ];

  const catColor = { Recyclable: C.blue, Organic: C.accent, Hazardous: C.danger, General: C.muted };

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome */}
      <div className="card glow" style={{ padding: 28, background: "linear-gradient(135deg, #162019 0%, #0f1f14 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Good morning 🌿</div>
        <div className="syne" style={{ fontSize: 26, fontWeight: 800, color: C.text }}>Hi, {user.name.split(" ")[0]}!</div>
        <div style={{ color: C.muted, marginTop: 6, fontSize: 14 }}>You've saved <span style={{ color: C.accent, fontWeight: 600 }}>28 kg</span> of CO₂ this month. Keep it up!</div>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <div style={{ padding: "6px 14px", borderRadius: 8, background: C.accentGlow, border: `1px solid ${C.dim}`, fontSize: 12, color: C.accent }}>🏆 Eco Hero Badge</div>
          <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(59,130,246,.1)", border: `1px solid rgba(59,130,246,.3)`, fontSize: 12, color: C.blue }}>Rank #43 in Delhi</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {userStats.map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={14} color={s.color} />
              </div>
            </div>
            <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Quick Actions</div>
          {[
            { label: "Scan Waste", icon: Camera, color: C.accent, desc: "Use AI camera" },
            { label: "Add Manually", icon: Plus, color: C.blue, desc: "Log waste item" },
            { label: "View Map", icon: MapPin, color: C.warn, desc: "Hotspots near you" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <a.icon size={17} color={a.color} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{a.label}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{a.desc}</div>
              </div>
              <ChevronRight size={14} color={C.muted} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Recent Activity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColor[a.cat], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{a.item}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{a.cat} · {a.time}</div>
                </div>
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>+{a.pts}pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segregation Tips */}
      <div className="card" style={{ padding: 24 }}>
        <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>🌱 Segregation Guide</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {wasteCategories.map((wc, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <wc.icon size={16} color={wc.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: wc.color }}>{wc.label}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {wc.examples.map((e, j) => (
                  <div key={j} style={{ fontSize: 11, color: C.muted, paddingLeft: 8, borderLeft: `2px solid ${wc.color}40` }}>{e}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI SCANNER ───────────────────────────────────────────────────────────────
function AIScanner() {
  const [phase, setPhase] = useState("idle"); // idle | scanning | result
  const [selectedItem, setSelectedItem] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const [history, setHistory] = useState([aiWasteItems[2], aiWasteItems[0]]);
  const [activeTab, setActiveTab] = useState("camera");

  const startScan = (item) => {
    setPhase("scanning");
    setSelectedItem(item || aiWasteItems[Math.floor(Math.random() * aiWasteItems.length)]);
    setTimeout(() => setPhase("result"), 2400);
  };

  const handleManual = () => {
    if (!manualInput.trim()) return;
    const found = aiWasteItems.find(i => i.name.toLowerCase().includes(manualInput.toLowerCase()))
      || { name: manualInput, category: "general", confidence: 78, guidance: "Place in general waste bin. Ensure it is dry and non-hazardous.", points: 5 };
    setSelectedItem(found);
    setPhase("result");
  };

  const reset = () => { setPhase("idle"); setSelectedItem(null); setManualInput(""); };

  const catMeta = { recyclable: { color: C.blue, label: "♻️ Recyclable", bin: "Blue Bin" }, organic: { color: C.accent, label: "🌿 Organic", bin: "Green Bin" }, hazardous: { color: C.danger, label: "⚠️ Hazardous", bin: "Red Collection" }, general: { color: C.muted, label: "🗑️ General", bin: "Black Bin" } };

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Main scanner area */}
        <div className="card" style={{ padding: 28 }}>
          <div className="syne" style={{ fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 6 }}>AI Waste Classifier</div>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Upload a photo or describe the item. Our AI will classify and guide disposal.</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["camera", "upload", "manual"].map(t => (
              <button key={t} onClick={() => { setActiveTab(t); reset(); }}
                className={`btn-ghost ${activeTab === t ? "tab-active" : ""}`}
                style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, textTransform: "capitalize" }}>
                {t === "camera" ? "📷 Camera" : t === "upload" ? "📁 Upload" : "✏️ Manual"}
              </button>
            ))}
          </div>

          {phase === "idle" && (
            <div>
              {activeTab !== "manual" ? (
                <div style={{ border: `2px dashed ${C.dim}`, borderRadius: 16, padding: 48, textAlign: "center", cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}
                  onClick={() => startScan()}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: C.accentGlow, border: `1px solid ${C.dim}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activeTab === "camera" ? <Camera size={28} color={C.accent} /> : <Upload size={28} color={C.accent} />}
                  </div>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>
                    {activeTab === "camera" ? "Open Camera" : "Upload Image"}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted }}>Click to simulate scan</div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: C.muted, marginBottom: 8, display: "block" }}>Describe your waste item</label>
                    <input style={{ width: "100%", padding: "12px 16px", borderRadius: 10, fontSize: 14 }}
                      placeholder="e.g. Plastic bottle, old battery, food scraps..."
                      value={manualInput} onChange={e => setManualInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleManual()} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: C.muted, marginBottom: 8, display: "block" }}>Or select common items</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {aiWasteItems.slice(0, 5).map((item, i) => (
                        <button key={i} className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12 }}
                          onClick={() => { setManualInput(item.name); setSelectedItem(item); setPhase("result"); }}>
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-primary" style={{ padding: "12px 24px", borderRadius: 10, fontSize: 14 }} onClick={handleManual}>
                    Classify →
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === "scanning" && (
            <div style={{ padding: "60px 0", textAlign: "center", position: "relative" }}>
              <div style={{ width: 120, height: 120, border: `2px solid ${C.accent}`, borderRadius: 16, margin: "0 auto 24px", position: "relative", overflow: "hidden" }}>
                <ScanLine size={48} color={C.accent} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.3 }} />
                <div className="scan-line" />
              </div>
              <div className="syne" style={{ fontWeight: 700, fontSize: 18, color: C.text }}>Analyzing waste...</div>
              <div style={{ color: C.muted, marginTop: 8, fontSize: 13 }}>AI model processing image</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
                {["Object detection","Material analysis","Classification"].map((s, i) => (
                  <div key={i} style={{ padding: "4px 10px", borderRadius: 100, background: C.accentGlow, border: `1px solid ${C.dim}`, fontSize: 11, color: C.muted }}>
                    <div className="pulse-dot" style={{ display: "inline-block", marginRight: 4, verticalAlign: "middle" }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "result" && selectedItem && (() => {
            const meta = catMeta[selectedItem.category];
            return (
              <div className="fade-in">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={20} color={C.accent} />
                    <span style={{ fontWeight: 600, color: C.text }}>Classification complete</span>
                  </div>
                  <button className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }} onClick={reset}>Scan another</button>
                </div>

                <div style={{ padding: 24, borderRadius: 16, background: `${meta.color}12`, border: `1px solid ${meta.color}30`, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{selectedItem.name}</div>
                      <div style={{ fontSize: 18, color: meta.color, fontWeight: 600 }}>{meta.label}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: meta.color, fontFamily: "Syne" }}>{selectedItem.confidence}%</div>
                      <div style={{ fontSize: 11, color: C.muted }}>confidence</div>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: C.dim, overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ height: "100%", width: `${selectedItem.confidence}%`, background: meta.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ padding: "8px 16px", borderRadius: 10, background: `${meta.color}20`, border: `1px solid ${meta.color}40`, fontSize: 13, color: meta.color, fontWeight: 600 }}>
                      🗑️ {meta.bin}
                    </div>
                    <div style={{ padding: "8px 16px", borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.dim}`, fontSize: 13, color: C.accent, fontWeight: 600 }}>
                      +{selectedItem.points} pts
                    </div>
                  </div>
                </div>

                <div style={{ padding: 20, borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 8, fontSize: 14 }}>📋 Disposal Guidance</div>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{selectedItem.guidance}</p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* History */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 14 }}>Scan History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...history, ...aiWasteItems.slice(3,5)].map((item, i) => {
                const meta = catMeta[item.category];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{meta.label.split(" ")[1]}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.accent }}>+{item.points}pts</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>Today's Score</div>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div className="syne" style={{ fontSize: 40, fontWeight: 800, color: C.accent }}>43</div>
              <div style={{ fontSize: 12, color: C.muted }}>green points earned</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.text }}>6</div>
                <div style={{ fontSize: 11, color: C.muted }}>Items</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.blue }}>3</div>
                <div style={{ fontSize: 11, color: C.muted }}>Recyclable</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.accent }}>2</div>
                <div style={{ fontSize: 11, color: C.muted }}>Organic</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.danger }}>1</div>
                <div style={{ fontSize: 11, color: C.muted }}>Hazardous</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
function MapView() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [filter, setFilter] = useState("all");

  const levelColor = { high: C.danger, med: C.warn, low: C.accent };

  // Grid-based map representation
  const grid = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 14; c++) {
      const hs = hotspots.find(h => {
        const row = Math.round((h.lat - 28.5) / 0.03);
        const col = Math.round((h.lng - 77.05) / 0.025);
        return row === r && col === c;
      });
      grid.push({ r, c, hotspot: hs || null });
    }
  }

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Map */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className="syne" style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Delhi Waste Map</div>
              <div style={{ fontSize: 12, color: C.muted }}>Real-time waste accumulation zones</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all","high","med","low"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn-ghost ${filter === f ? "tab-active" : ""}`}
                  style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, textTransform: "capitalize" }}>
                  {f === "all" ? "All" : f === "high" ? "🔴 High" : f === "med" ? "🟡 Medium" : "🟢 Low"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid map */}
          <div style={{ background: "#0d1a10", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
            {/* Map background texture */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 40%, rgba(34,197,94,0.04) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(59,130,246,0.03) 0%, transparent 50%)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 3, position: "relative" }}>
              {grid.map((cell, i) => {
                const hs = cell.hotspot;
                const visible = !hs || filter === "all" || filter === hs.level;
                if (hs && visible) {
                  const col = levelColor[hs.level];
                  return (
                    <div key={i} className="map-cell"
                      style={{ aspectRatio: "1", borderRadius: 6, background: `${col}30`, border: `1px solid ${col}60`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                      onClick={() => setSelectedHotspot(hs)}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}` }} />
                      {hs.level === "high" && <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: `${col}10`, animation: "pulse 2s infinite" }} />}
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.06)" }} />
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center" }}>
              {[["high", "High Alert"], ["med", "Moderate"], ["low", "Low"]].map(([l, label]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor[l] }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspot Detail / List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {selectedHotspot ? (
            <div className="card fade-in" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Zone Detail</div>
                <button onClick={() => setSelectedHotspot(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: `${levelColor[selectedHotspot.level]}15`, border: `1px solid ${levelColor[selectedHotspot.level]}30`, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{selectedHotspot.name}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, padding: "3px 10px", borderRadius: 100, background: `${levelColor[selectedHotspot.level]}20`, fontSize: 11, color: levelColor[selectedHotspot.level], fontWeight: 600 }}>
                  {selectedHotspot.level.toUpperCase()} PRIORITY
                </div>
              </div>
              {[
                ["Waste Volume", `${selectedHotspot.volume} kg`],
                ["Pending Collections", selectedHotspot.collections],
                ["Trend", selectedHotspot.trend === "up" ? "↑ Increasing" : "↓ Decreasing"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <button className="btn-primary" style={{ width: "100%", padding: "10px 0", borderRadius: 10, fontSize: 13, marginTop: 16 }}>
                Dispatch Truck →
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: 18 }}>
              <div className="syne" style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>Click a zone for details</div>
              <div style={{ fontSize: 12, color: C.muted }}>Select any highlighted cell on the map</div>
            </div>
          )}

          <div className="card" style={{ padding: 18 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>Active Hotspots</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hotspots.filter(h => filter === "all" || h.level === filter).map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer", transition: "border .2s" }}
                  onClick={() => setSelectedHotspot(h)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = levelColor[h.level]}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor[h.level], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{h.volume} kg · {h.collections} trucks needed</div>
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
function AddWaste() {
  const [form, setForm] = useState({ name: "", category: "", quantity: "1", unit: "items", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    if (!form.name || !form.category) return;
    const cat = wasteCategories.find(c => c.id === form.category);
    const pts = { recyclable: 10, organic: 5, hazardous: 20, general: 3 }[form.category];
    setResult({ ...form, pts, cat });
    setSubmitted(true);
  };

  if (submitted && result) return (
    <div className="fade-in" style={{ padding: 28 }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card glow" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.accent}`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={32} color={C.accent} />
          </div>
          <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>Waste Logged!</div>
          <div style={{ color: C.muted, marginBottom: 24 }}>{result.name} · {result.quantity} {result.unit}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            <div style={{ padding: "10px 20px", borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.dim}` }}>
              <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>+{result.pts}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Points earned</div>
            </div>
            <div style={{ padding: "10px 20px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{result.cat.label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Category</div>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: "12px 32px", borderRadius: 10, fontSize: 14 }} onClick={() => { setSubmitted(false); setForm({ name: "", category: "", quantity: "1", unit: "items", notes: "" }); }}>
            Log Another Item
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: 28 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="card" style={{ padding: 32 }}>
          <div className="syne" style={{ fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 6 }}>Add Waste Item</div>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Manually log a waste item to earn green points</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Item Name *</label>
              <input style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
                placeholder="e.g. Plastic bottle, Food scraps..." value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: C.muted, marginBottom: 10, display: "block" }}>Waste Category *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                {wasteCategories.map(wc => (
                  <div key={wc.id} onClick={() => setForm({ ...form, category: wc.id })}
                    style={{ padding: 14, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all .2s",
                      background: form.category === wc.id ? `${wc.color}18` : C.surface,
                      border: `1px solid ${form.category === wc.id ? wc.color : C.border}` }}>
                    <wc.icon size={16} color={wc.color} />
                    <span style={{ fontSize: 14, color: form.category === wc.id ? wc.color : C.text, fontWeight: form.category === wc.id ? 600 : 400 }}>{wc.label}</span>
                    {form.category === wc.id && <CheckCircle size={14} color={wc.color} style={{ marginLeft: "auto" }} />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Quantity</label>
                <input type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
                  value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Unit</label>
                <select style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14 }}
                  value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {["items", "kg", "litres", "bags"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: C.muted, marginBottom: 6, display: "block" }}>Notes (optional)</label>
              <textarea style={{ width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14, resize: "vertical", minHeight: 80, background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                placeholder="Any additional details..." value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button className="btn-primary glow" style={{ padding: "14px 0", borderRadius: 12, fontSize: 15 }} onClick={handleSubmit}>
              Log Waste Item →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function Analytics({ isAdmin }) {
  const maxBar = Math.max(...analyticsData.weekly);

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {analyticsData.kpis.map((k, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{k.label}</div>
            <div className="syne" style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{k.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {k.up ? <TrendingUp size={13} color={C.accent} /> : <TrendingDown size={13} color={C.danger} />}
              <span style={{ fontSize: 12, color: k.up ? C.accent : C.danger }}>{k.delta} this month</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Bar Chart */}
        <div className="card" style={{ padding: 28 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 24 }}>Weekly Collection (tonnes)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
            {analyticsData.weekly.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, color: C.muted }}>{v}</div>
                <div className="chart-bar" style={{ width: "100%", height: `${(v / maxBar) * 120}px`, background: i === 5 ? C.accent : `${C.accent}50`, minHeight: 4 }} />
                <div style={{ fontSize: 11, color: C.muted }}>{analyticsData.labels[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut / breakdown */}
        <div className="card" style={{ padding: 28 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20 }}>Category Breakdown</div>
          {analyticsData.categoryBreakdown.map((c, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.text }}>{c.cat}</span>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{c.pct}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: C.dim, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 4, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule (admin only) */}
      {isAdmin && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Today's Collection Schedule</div>
            <button className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={13} /> Export
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scheduleItems.map((s, i) => {
              const statusColor = s.status === "completed" ? C.accent : s.status === "in-progress" ? C.warn : C.muted;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
                  <div style={{ minWidth: 140, fontWeight: 600, fontSize: 14, color: C.text }}>{s.zone}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.muted, fontSize: 13, minWidth: 100 }}>
                    <Clock size={12} />{s.time}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: C.muted }}>{s.type} waste</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{s.truck}</div>
                  <div style={{ padding: "4px 12px", borderRadius: 100, background: `${statusColor}18`, border: `1px solid ${statusColor}30`, fontSize: 11, color: statusColor, fontWeight: 600, textTransform: "capitalize" }}>
                    {s.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const adminStats = [
    { label: "Active Zones", value: "48", icon: MapPin, color: C.blue, delta: "+2" },
    { label: "Trucks Active", value: "23", icon: Recycle, color: C.accent, delta: "5 idle" },
    { label: "Complaints Today", value: "7", icon: AlertTriangle, color: C.danger, delta: "-3" },
    { label: "Recycling Rate", value: "67%", icon: TrendingUp, color: C.accent, delta: "+4%" },
  ];

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Admin header */}
      <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, #1a0f0f 0%, #200f0f 100%)", borderColor: "rgba(239,68,68,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Shield size={16} color={C.danger} />
              <span style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>ADMIN CONTROL CENTRE</span>
            </div>
            <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: C.text }}>Municipal Dashboard</div>
            <div style={{ color: C.muted, marginTop: 4, fontSize: 14 }}>Delhi Waste Management Authority · Zone 7</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: C.danger }}>2</div>
              <div style={{ fontSize: 11, color: C.muted }}>Critical Alerts</div>
            </div>
            <div style={{ padding: "10px 16px", borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.dim}`, textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>94%</div>
              <div style={{ fontSize: 11, color: C.muted }}>System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {adminStats.map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.muted }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={14} color={s.color} />
              </div>
            </div>
            <div className="syne" style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.delta} vs yesterday</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Critical zones */}
        <div className="card" style={{ padding: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>🔴 Critical Zones</div>
          {hotspots.filter(h => h.level === "high").map((h, i) => (
            <div key={i} style={{ padding: "14px 0", borderBottom: i === 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: C.text }}>{h.name}</span>
                <span style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>{h.volume} kg</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: C.dim, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: "80%", background: C.danger, borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-primary" style={{ padding: "5px 14px", borderRadius: 8, fontSize: 11 }}>Dispatch</button>
                <button className="btn-ghost" style={{ padding: "5px 14px", borderRadius: 8, fontSize: 11 }}>Details</button>
              </div>
            </div>
          ))}
        </div>

        {/* Collection schedule preview */}
        <div className="card" style={{ padding: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>📅 Today's Schedule</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scheduleItems.slice(0, 4).map((s, i) => {
              const sc = s.status === "completed" ? C.accent : s.status === "in-progress" ? C.warn : C.muted;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.zone}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{s.time} · {s.type}</div>
                  </div>
                  <div style={{ padding: "2px 8px", borderRadius: 100, background: `${sc}18`, fontSize: 10, color: sc, fontWeight: 600, textTransform: "capitalize" }}>{s.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* City users table */}
      <div className="card" style={{ padding: 24 }}>
        <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Top Citizens by Green Points</div>
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 100px 100px 100px", gap: 0 }}>
          <div style={{ padding: "8px 12px", fontSize: 11, color: C.muted, gridColumn: "1/-1", display: "grid", gridTemplateColumns: "40px 1fr 100px 100px 100px", background: C.surface, borderRadius: 8, marginBottom: 6 }}>
            <span>#</span><span>Name</span><span>Items</span><span>Points</span><span>CO₂ Saved</span>
          </div>
          {[
            ["Priya Sharma", 234, 4200, "38 kg"],
            ["Rahul Mehta", 198, 3750, "32 kg"],
            ["Aarav Singh", 142, 1840, "28 kg"],
            ["Kavya Nair", 121, 1600, "21 kg"],
          ].map((row, i) => (
            <div key={i} style={{ padding: "10px 12px", gridColumn: "1/-1", display: "grid", gridTemplateColumns: "40px 1fr 100px 100px 100px", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: C.muted, fontWeight: 700 }}>#{i+1}</span>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{row[0]}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{row[1]}</span>
              <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{row[2]}</span>
              <span style={{ fontSize: 13, color: C.blue }}>{row[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOTSPOTS PAGE ────────────────────────────────────────────────────────────
function HotspotsPage() {
  const levelColor = { high: C.danger, med: C.warn, low: C.accent };

  return (
    <div className="fade-in" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 4 }}>
        {[["High", hotspots.filter(h=>h.level==="high").length, C.danger], ["Medium", hotspots.filter(h=>h.level==="med").length, C.warn], ["Low", hotspots.filter(h=>h.level==="low").length, C.accent]].map(([l, n, c], i) => (
          <div key={i} className="card" style={{ padding: 20, borderColor: `${c}30` }}>
            <div style={{ fontSize: 12, color: C.muted }}>{l} Priority Zones</div>
            <div className="syne" style={{ fontSize: 32, fontWeight: 800, color: c, marginTop: 4 }}>{n}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {hotspots.map((h, i) => {
          const col = levelColor[h.level];
          return (
            <div key={i} className="card" style={{ padding: 22, borderColor: `${col}25` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${col}18`, border: `1px solid ${col}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Radio size={20} color={col} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Lat: {h.lat} · Lng: {h.lng}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{h.volume} kg</div>
                    <div style={{ fontSize: 11, color: C.muted }}>volume</div>
                  </div>
                  <div style={{ padding: "6px 14px", borderRadius: 100, background: `${col}18`, border: `1px solid ${col}30`, fontSize: 12, color: col, fontWeight: 700, textTransform: "uppercase" }}>
                    {h.level}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 20 }}>
                <div style={{ fontSize: 13, color: C.muted }}>🚛 {h.collections} collection{h.collections>1?"s":""} needed</div>
                <div style={{ fontSize: 13, color: h.trend === "up" ? C.danger : C.accent }}>
                  {h.trend === "up" ? "↑ Volume increasing" : "↓ Volume decreasing"}
                </div>
              </div>
              <div style={{ marginTop: 14, height: 5, borderRadius: 3, background: C.dim }}>
                <div style={{ height: "100%", width: `${Math.round(h.volume / 25)}%`, background: col, borderRadius: 3, maxWidth: "100%" }} />
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
  dashboard: "My Dashboard", "admin-dashboard": "Admin Dashboard",
  scanner: "AI Scanner & Decoder", map: "Waste Map", hotspots: "Waste Hotspots",
  "add-waste": "Add Waste", analytics: "Analytics", schedule: "Collection Schedule",
  users: "User Management", settings: "Settings",
};

function AppShell({ user, onLogout }) {
  const [section, setSection] = useState(user.role === "admin" ? "admin-dashboard" : "dashboard");

  const renderSection = () => {
    switch (section) {
      case "dashboard": return <UserDashboard user={user} />;
      case "admin-dashboard": return <AdminDashboard />;
      case "scanner": return <AIScanner />;
      case "map": return <MapView />;
      case "hotspots": return <HotspotsPage />;
      case "add-waste": return <AddWaste />;
      case "analytics": return <Analytics isAdmin={user.role === "admin"} />;
      case "schedule": return <Analytics isAdmin={true} />;
      case "users": return (
        <div className="fade-in" style={{ padding: 28 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 16 }}>Registered Citizens</div>
            <div style={{ color: C.muted, fontSize: 14 }}>User management module — 12,048 active users across Delhi zones.</div>
          </div>
        </div>
      );
      default: return <div style={{ padding: 28, color: C.muted }}>Coming soon</div>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar user={user} activeSection={section} setActiveSection={setSection} onLogout={onLogout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={sectionTitles[section] || "Verdian"} user={user} />
        <div style={{ flex: 1, overflowY: "auto" }}>{renderSection()}</div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const handleLogin = (u) => { setUser(u); setPage("app"); };
  const handleLogout = () => { setUser(null); setPage("landing"); };

  return (
    <>
      <style>{css}</style>
      {page === "landing" && <LandingPage onNavigate={setPage} />}
      {page === "auth" && <AuthPage onLogin={handleLogin} />}
      {page === "app" && user && <AppShell user={user} onLogout={handleLogout} />}
    </>
  );
}
