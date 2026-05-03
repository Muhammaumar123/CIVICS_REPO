import { useState, useEffect, useRef } from "react";
import { Lock, LogOut, Plus, X, MapPin, Loader2 } from "lucide-react";
import { readBin, writeBin } from "../lib/jsonbin";

declare global {
  interface Window { L: any; }
}

interface BowlLocation {
  id: number;
  name: string;
  note: string;
  lat: number;
  lng: number;
}

const FAISAL_TOWN_CENTER = { lat: 31.4761, lng: 74.3044 };

function QRCodeImage({ url, size = 160 }: { url: string; size?: number }) {
  const encodedUrl = encodeURIComponent(url);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&bgcolor=ffffff&color=000000&margin=2`;
  return <img src={qrSrc} alt="QR Code" width={size} height={size} className="rounded-lg" />;
}

export function BowlMap() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBowlName, setNewBowlName] = useState("");
  const [newBowlNote, setNewBowlNote] = useState("");
  const [loginError, setLoginError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [selectedBowl, setSelectedBowl] = useState<BowlLocation | null>(null);
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [bowlLocations, setBowlLocations] = useState<BowlLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mapRef = useRef<any>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    readBin("bowls").then((data) => {
      setBowlLocations(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (window.L) { setMapReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapDivRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(mapDivRef.current, { center: [FAISAL_TOWN_CENTER.lat, FAISAL_TOWN_CENTER.lng], zoom: 15 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    map.on("click", (e: any) => setClickedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng }));
    return () => { map.remove(); mapRef.current = null; };
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current) return;
    const L = window.L;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const bowlIcon = L.divIcon({
      html: `<div style="background:#F97316;border:3px solid white;border-radius:50% 50% 50% 0;width:28px;height:28px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:13px;">🥣</span></div>`,
      iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -30], className: "",
    });
    bowlLocations.forEach((bowl) => {
      const marker = L.marker([bowl.lat, bowl.lng], { icon: bowlIcon })
        .addTo(mapRef.current)
        .bindPopup(`<div style="font-family:Nunito,sans-serif;min-width:160px;"><div style="font-weight:700;color:#F97316;font-size:14px;margin-bottom:4px;">🥣 ${bowl.name}</div><div style="color:#555;font-size:12px;">${bowl.note}</div></div>`);
      markersRef.current.push(marker);
    });
  }, [bowlLocations, mapReady]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { setIsAuthenticated(true); setLoginError(""); setPassword(""); }
    else setLoginError("Incorrect password.");
  };

  const handleAddBowl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBowlName.trim() || !newBowlNote.trim()) return;
    const lat = clickedLatLng?.lat ?? FAISAL_TOWN_CENTER.lat + (Math.random() - 0.5) * 0.01;
    const lng = clickedLatLng?.lng ?? FAISAL_TOWN_CENTER.lng + (Math.random() - 0.5) * 0.01;
    const newBowl: BowlLocation = { id: Date.now(), name: newBowlName, note: newBowlNote, lat, lng };
    const updated = [...bowlLocations, newBowl];
    setSaving(true);
    await writeBin("bowls", updated);
    setBowlLocations(updated);
    setSaving(false);
    setNewBowlName(""); setNewBowlNote(""); setClickedLatLng(null); setShowAddModal(false);
  };

  const handleDeleteBowl = async (id: number) => {
    const updated = bowlLocations.filter((b) => b.id !== id);
    setSaving(true);
    await writeBin("bowls", updated);
    setBowlLocations(updated);
    setSaving(false);
  };

  const mapPageUrl = typeof window !== "undefined" ? window.location.origin + "/" : "";

  return (
    <div className="relative">
      <div className="relative" style={{ height: "560px" }}>
        <div ref={mapDivRef} className="absolute inset-0 z-0" style={{ height: "100%" }} />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-50 z-10">
            <div className="text-center text-gray-600"><div className="text-5xl mb-3">🗺️</div><p className="font-bold">Loading Faisal Town Map…</p></div>
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-2xl p-4 shadow-xl">
          <p className="text-xs text-gray-600 font-bold text-center mb-2">Scan to open map</p>
          <QRCodeImage url={mapPageUrl} size={120} />
          <p className="text-[10px] text-gray-400 text-center mt-2">PawPoint Faisal Town</p>
        </div>
        {isAuthenticated && !showAddModal && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 text-sm text-gray-600 shadow">
            💡 Click on the map to pick a location, then press +
          </div>
        )}
        {isAuthenticated && showAddModal && clickedLatLng && (
          <div className="absolute top-4 left-4 z-10 bg-orange-100 border-2 border-[#F97316] rounded-xl px-4 py-2 text-sm font-bold text-[#F97316]">
            📍 Location picked on map
          </div>
        )}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-2xl p-5 shadow-xl w-72 max-w-[calc(100vw-2rem)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[#F97316] text-base">🥣 Active Feeding Bowls</h3>
            <div className="flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin text-[#F97316]" />}
              {isAuthenticated && (
                <button onClick={() => setShowAddModal(true)} className="bg-[#F97316] text-white p-1.5 rounded-lg hover:bg-[#ea580c] transition-colors"><Plus size={18} /></button>
              )}
            </div>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-4"><Loader2 size={20} className="animate-spin text-[#F97316]" /></div>
            ) : bowlLocations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">No bowls added yet</p>
            ) : bowlLocations.map((location) => (
              <div key={location.id} className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedBowl(location); if (mapRef.current) mapRef.current.setView([location.lat, location.lng], 17); }}
                  className="flex-1 text-left bg-[#FFFBF5] rounded-xl p-3 border-2 border-[#FBBF24]/30 hover:border-[#F97316]/50 transition-colors"
                >
                  <p className="font-bold text-gray-800 text-sm">{location.name}</p>
                  <p className="text-xs text-gray-500">{location.note}</p>
                </button>
                {isAuthenticated && (
                  <button onClick={() => handleDeleteBowl(location.id)} className="flex-shrink-0 bg-red-100 text-red-500 hover:bg-red-200 p-2 rounded-lg transition-colors"><X size={16} /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-2"><Lock className="text-gray-400" size={22} /><h3 className="font-bold text-gray-800 text-lg">Admin Login</h3></div>
            <p className="text-sm text-gray-500 mb-4">Only admin can add or delete bowl points</p>
            <form onSubmit={handleAdminLogin} className="flex gap-3">
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(""); }} placeholder="Enter admin password"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
              <button type="submit" className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">Login</button>
            </form>
            {loginError && <p className="text-sm text-red-500 mt-2">{loginError}</p>}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-lg flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><Lock size={18} /></div>
                <h3 className="font-bold text-lg">Admin Access Granted</h3>
              </div>
              <p className="text-sm text-white/80">Click on map then press + to add a bowl</p>
            </div>
            <button onClick={() => { setIsAuthenticated(false); setPassword(""); }} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
              <LogOut size={18} /><span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800">Add New Bowl Location</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            {clickedLatLng ? (
              <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-green-700 font-bold">
                <MapPin size={16} />Location picked: {clickedLatLng.lat.toFixed(5)}, {clickedLatLng.lng.toFixed(5)}
              </div>
            ) : (
              <div className="mb-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-700">
                💡 Close this and click on the map to pick exact location, or submit to place automatically.
              </div>
            )}
            <form onSubmit={handleAddBowl} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location Name</label>
                <input type="text" value={newBowlName} onChange={(e) => setNewBowlName(e.target.value)} placeholder="e.g., Central Park Gate"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Short Note</label>
                <input type="text" value={newBowlNote} onChange={(e) => setNewBowlNote(e.target.value)} placeholder="e.g., Under the tree, near bench"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" required />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md flex items-center justify-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />} Add Bowl
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
