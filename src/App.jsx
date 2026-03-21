import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf, Trash2, MapPin, BarChart3, LogOut,
  User, Bell, Upload, CheckCircle, AlertTriangle,
  Recycle, TrendingUp, TrendingDown, Clock, Shield, Users,
  Map as MapIcon, ScanLine, Plus, X, Star, Activity, Download,
  Home, Radio, Settings, Loader, Award, Zap, RefreshCw, 
  ChevronRight, Globe, Zap as Energy, TrendingUp as Profit, Cpu, Target
} from "lucide-react";

// ─── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
  "https://fhitqdahjiupsehqevta.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaXRxZGFoaml1cHNlaHFldnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU5NjgsImV4cCI6MjA4OTY4MTk2OH0.JrqjT_AGvcwDp5l3oAPsMujUrim8zWoLxHtwONXH5h8"
);

// ─── Color Tokens & Styles ──────────────────────────────────────────────────
const C = {
  bg: "#0a0f0d", surface: "#111a15", card: "#162019", border: "#1e3028",
  accent: "#22c55e", accentDim: "#16a34a", accentGlow: "rgba(34,197,94,0.15)",
  warn: "#f59e0b", danger: "#ef4444", blue: "#3b82f6",
  text: "#e8f5ee", muted: "#6b8c78", dim: "#2d4a38",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
  
  .syne { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; letter-spacing: -0.01em; }
  .btn-primary { background:${C.accent}; color:#0a0f0d; border:none; cursor:pointer; font-weight:600; transition:all .2s; border-radius:8px; }
  .btn-primary:hover { background:#4ade80; transform:translateY(-1px); }
  .btn-ghost { background:transparent; border:1px solid ${C.border}; color:${C.muted}; cursor:pointer; transition:all .2s; border-radius:8px; }
  .btn-ghost:hover { border-color:${C.accent}; color:${C.accent}; }
  
  .leaflet-container { border-radius: 16px; background: #f8fafc; }
  .sidebar-link { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; cursor:pointer; font-size:14px; color:${C.muted}; transition:all .2s; }
  .sidebar-link.active { background:${C.accentGlow}; color:${C.accent}; border: 1px solid ${C.dim}; }
  
  @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
  .fade-in { animation: fadeIn 0.5s ease forwards; }
`;

// ─── LANDING PAGE (Restored original UI) ──────────────────────────────────────
function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    const m = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", h);
    window.addEventListener("mousemove", m);
    return () => { window.removeEventListener("scroll", h); window.removeEventListener("mousemove", m); };
  }, []);

  const stats = [
    { val: "2.1B", label: "Tonnes landfilled", icon: Globe },
    { val: "67%", label: "Misclassified waste", icon: AlertTriangle },
    { val: "48K Cr", label: "Lost value (INR)", icon: Profit },
    { val: "94%", label: "AI Accuracy", icon: Cpu },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <style>{css}</style>
      
      {/* Background Glow */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 0,
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
        transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
        transition: "transform 0.3s ease-out",
      }} />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,15,13,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Recycle color={C.accent} size={28} />
          <span className="syne" style={{ fontSize: 22 }}>VERDIAN</span>
        </div>
        <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => onNavigate("auth")}> Launch App </button>
      </nav>

      <div style={{ paddingTop: 160, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: C.accentGlow, borderRadius: 100, border: `1px solid ${C.dim}`, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, background: C.accent, borderRadius: "50%" }} />
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>NEXT-GEN WASTE INTELLIGENCE</span>
        </div>
        <h1 className="syne" style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 1, marginBottom: 24 }}>
          Smarter Waste.<br/><span style={{ color: C.accent }}>Greener Cities.</span>
        </h1>
        <p style={{ maxWidth: 600, margin: "0 auto 48px", color: C.muted, fontSize: 18, lineHeight: 1.6 }}>
          Transforming municipal management with real-time AI classification and biometric-verified collection logs.
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          {stats.map((s, i) => (
            <div key={i} className="fade-in" style={{ background: C.surface, padding: 24, borderRadius: 16, border: `1px solid ${C.border}`, textAlign: "left" }}>
              <s.icon size={20} color={C.accent} style={{ marginBottom: 12 }} />
              <div className="syne" style={{ fontSize: 28 }}>{s.val}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP COMPONENT ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("map");
  const [wasteReports, setWasteReports] = useState([]);
  const mapRef = useRef(null);
  const L = window.L;

  // 1. Fetch & Subscribe to Real-time Data
  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase.from("waste_reports").select("*");
      if (data) setWasteReports(data);
    };
    fetchReports();

    const channel = supabase.channel("realtime-waste")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "waste_reports" }, (payload) => {
        setWasteReports(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 2. Initialize Map (Light Mode)
  useEffect(() => {
    if (section === "map" && !mapRef.current && L) {
      mapRef.current = L.map("map-container").setView([28.6139, 77.2090], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current);
    }
    
    if (mapRef.current && L) {
      // Clear existing markers
      mapRef.current.eachLayer(layer => { if (layer instanceof L.Marker) mapRef.current.removeLayer(layer); });
      // Add markers from reports
      wasteReports.forEach(r => {
        if (r.lat && r.lng) {
          L.marker([r.lat, r.lng]).addTo(mapRef.current)
            .bindPopup(`<b>${r.category}</b><br/>Status: ${r.status || 'Reported'}`);
        }
      });
    }
  }, [section, wasteReports, L]);

  if (page === "landing") return <LandingPage onNavigate={setPage} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg }}>
      <style>{css}</style>
      
      {/* Sidebar */}
      <div style={{ width: 260, borderRight: `1px solid ${C.border}`, padding: 24, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <Recycle color={C.accent} size={24} />
          <span className="syne" style={{ fontSize: 18 }}>VERDIAN</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div className={`sidebar-link ${section === "map" ? "active" : ""}`} onClick={() => setSection("map")}>
            <MapIcon size={18} /> Live Map
          </div>
          <div className={`sidebar-link ${section === "report" ? "active" : ""}`} onClick={() => setSection("report")}>
            <Plus size={18} /> Add Waste
          </div>
          <div className={`sidebar-link ${section === "admin" ? "active" : ""}`} onClick={() => setSection("admin")}>
            <BarChart3 size={18} /> Admin Dashboard
          </div>
        </div>
        <button className="sidebar-link" onClick={() => setPage("landing")} style={{ marginTop: "auto" }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {section === "map" && (
          <div className="fade-in" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 className="syne" style={{ marginBottom: 20 }}>Hotspot Overview</h2>
            <div id="map-container" style={{ flex: 1, minHeight: 400 }} />
          </div>
        )}

        {section === "report" && (
          <div className="fade-in" style={{ maxWidth: 500 }}>
            <h2 className="syne" style={{ marginBottom: 24 }}>New Waste Report</h2>
            <ReportForm onReported={() => setSection("map")} />
          </div>
        )}

        {section === "admin" && (
           <div className="fade-in">
             <h2 className="syne" style={{ marginBottom: 24 }}>System Health</h2>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
               <div style={{ background: C.card, padding: 24, borderRadius: 16, border: `1px solid ${C.border}` }}>
                 <div style={{ color: C.muted, fontSize: 14 }}>Active Reports</div>
                 <div className="syne" style={{ fontSize: 32 }}>{wasteReports.length}</div>
               </div>
               <div style={{ background: C.card, padding: 24, borderRadius: 16, border: `1px solid ${C.border}` }}>
                 <div style={{ color: C.muted, fontSize: 14 }}>System Status</div>
                 <div style={{ color: C.accent, fontWeight: 600 }}>Live & Connected</div>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD WASTE FORM (With Click-to-GPS) ───────────────────────────────────────
function ReportForm({ onReported }) {
  const [loading, setLoading] = useState(false);
  const [loc, setLoc] = useState(null);

  const getGPS = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Please enable GPS")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cat = e.target.category.value;
    
    await supabase.from("waste_reports").insert([
      { category: cat, lat: loc?.lat, lng: loc?.lng, status: "pending" }
    ]);
    
    setLoading(false);
    onReported();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <select name="category" style={{ padding: 12, borderRadius: 8, background: C.surface, color: C.text, border: `1px solid ${C.border}` }}>
        <option>Organic</option>
        <option>Recyclable</option>
        <option>Hazardous</option>
      </select>
      
      <button type="button" onClick={getGPS} className="btn-ghost" style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <MapPin size={18} /> {loc ? `Fixed: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` : "Get My Location"}
      </button>

      <button type="submit" disabled={loading} className="btn-primary" style={{ padding: 14 }}>
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
