import { useState, useEffect } from "react";
import { X, Phone, Plus, Loader2, Trash2 } from "lucide-react";
import { readBin, writeBin } from "../lib/jsonbin";

interface NGO {
  id: number;
  emoji: string;
  name: string;
  mission: string;
  raised: number;
  goal: number;
  contact: string;
  phone: string;
  paymentInfo: string;
}

const DEFAULT_NGOS: NGO[] = [
  { id: 1, emoji: "🐕", name: "Paws & Care Lahore", mission: "Rescue, rehabilitation, and rehoming strays across Lahore", raised: 45000, goal: 100000, contact: "pawscare@example.com", phone: "+92-300-1234567", paymentInfo: "JazzCash: 0300-1234567\nEasypaisa: 0300-1234567\nBank: HBL 12345678901234" },
  { id: 2, emoji: "🐈", name: "Street Cat Alliance", mission: "TNR programs and feeding stations for feral cats", raised: 28000, goal: 60000, contact: "streetcats@example.com", phone: "+92-321-9876543", paymentInfo: "JazzCash: 0321-9876543\nEasypaisa: 0321-9876543\nBank: MCB 98765432109876" },
  { id: 3, emoji: "💚", name: "Animal Welfare Foundation", mission: "Emergency medical care and shelter for injured animals", raised: 62000, goal: 80000, contact: "awf@example.com", phone: "+92-333-5551234", paymentInfo: "JazzCash: 0333-5551234\nEasypaisa: 0333-5551234\nBank: UBL 55512344321123" },
  { id: 4, emoji: "🏥", name: "Stray Care Clinic", mission: "Free vaccination and sterilization services", raised: 35000, goal: 75000, contact: "clinic@example.com", phone: "+92-345-7778888", paymentInfo: "JazzCash: 0345-7778888\nEasypaisa: 0345-7778888\nBank: ABL 77788899001122" },
  { id: 5, emoji: "🌟", name: "Hope for Strays", mission: "Community awareness and feeding programs", raised: 18000, goal: 50000, contact: "hope@example.com", phone: "+92-312-4445566", paymentInfo: "JazzCash: 0312-4445566\nEasypaisa: 0312-4445566\nBank: NBP 44455667788990" },
  { id: 6, emoji: "🐾", name: "Four Paws Rescue", mission: "Adoption drives and forever home placements", raised: 52000, goal: 90000, contact: "fourpaws@example.com", phone: "+92-302-1112233", paymentInfo: "JazzCash: 0302-1112233\nEasypaisa: 0302-1112233\nBank: SCB 11122334455667" },
];

export function NGODonation() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ emoji: "🐾", name: "", mission: "", raised: "", goal: "", contact: "", phone: "", paymentInfo: "" });

  useEffect(() => {
    readBin("ngos").then((data) => {
      if (data.length > 0) {
        setNgos(data);
      } else {
        writeBin("ngos", DEFAULT_NGOS).then(() => setNgos(DEFAULT_NGOS));
      }
      setLoading(false);
    }).catch(() => { setNgos(DEFAULT_NGOS); setLoading(false); });
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "admin123") { setIsAdmin(true); setAdminError(""); setAdminPass(""); }
    else setAdminError("Incorrect password.");
  };

  const handleAddNGO = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNGO: NGO = {
      id: Date.now(),
      emoji: form.emoji,
      name: form.name,
      mission: form.mission,
      raised: Number(form.raised) || 0,
      goal: Number(form.goal) || 100000,
      contact: form.contact,
      phone: form.phone,
      paymentInfo: form.paymentInfo,
    };
    const updated = [...ngos, newNGO];
    setSaving(true);
    await writeBin("ngos", updated);
    setNgos(updated);
    setSaving(false);
    setShowAddModal(false);
    setForm({ emoji: "🐾", name: "", mission: "", raised: "", goal: "", contact: "", phone: "", paymentInfo: "" });
  };

  const handleDeleteNGO = async (id: number) => {
    const updated = ngos.filter((n) => n.id !== id);
    setSaving(true);
    await writeBin("ngos", updated);
    setNgos(updated);
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#F97316]" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Support Our Partner NGOs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Every donation helps provide food, medical care, and shelter to stray animals in Faisal Town</p>
      </div>

      {/* Admin bar */}
      <div className="mb-8">
        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="flex gap-3 max-w-md">
            <input type="password" value={adminPass} onChange={(e) => { setAdminPass(e.target.value); setAdminError(""); }}
              placeholder="Admin password to manage NGOs"
              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-white text-sm" />
            <button type="submit" className="px-4 py-2 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors text-sm">Login</button>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">
              <Plus size={18} /> Add NGO
            </button>
            <button onClick={() => setIsAdmin(false)} className="text-sm text-gray-500 hover:text-gray-700">Logout Admin</button>
            {saving && <Loader2 size={18} className="animate-spin text-[#F97316]" />}
          </div>
        )}
        {adminError && <p className="text-sm text-red-500 mt-2">{adminError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map((ngo) => {
          const progress = (ngo.raised / ngo.goal) * 100;
          return (
            <div key={ngo.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#FBBF24]/20 relative">
              {isAdmin && (
                <button onClick={() => handleDeleteNGO(ngo.id)} className="absolute top-3 right-3 bg-red-100 text-red-500 hover:bg-red-200 p-1.5 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{ngo.emoji}</div>
                <h3 className="font-bold text-xl text-gray-800">{ngo.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 min-h-[48px]">{ngo.mission}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-[#F97316]">Rs {ngo.raised.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-[#FBBF24]/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F97316] to-[#FBBF24] transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Goal: Rs {ngo.goal.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedNGO(ngo)} className="flex-1 bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">Donate / Contact</button>
                <a href={`tel:${ngo.phone}`} className="bg-green-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md flex items-center justify-center"><Phone size={20} /></a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donate modal */}
      {selectedNGO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div><div className="text-4xl mb-2">{selectedNGO.emoji}</div><h3 className="font-bold text-xl text-gray-800">{selectedNGO.name}</h3></div>
              <button onClick={() => setSelectedNGO(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div><p className="text-sm font-bold text-gray-700 mb-1">Email</p><p className="text-gray-600">{selectedNGO.contact}</p></div>
              <div><p className="text-sm font-bold text-gray-700 mb-1">Phone</p><p className="text-gray-600">{selectedNGO.phone}</p></div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Payment Information</p>
                <div className="bg-[#FFFBF5] rounded-xl p-4 border-2 border-[#FBBF24]/30">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-['Nunito']">{selectedNGO.paymentInfo}</pre>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedNGO(null)} className="w-full mt-6 bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">Close</button>
          </div>
        </div>
      )}

      {/* Add NGO modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800">Add New NGO</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddNGO} className="space-y-3">
              {[
                { label: "Emoji", key: "emoji", placeholder: "🐾" },
                { label: "NGO Name", key: "name", placeholder: "e.g., Paws of Hope" },
                { label: "Mission", key: "mission", placeholder: "One line mission statement" },
                { label: "Amount Raised (Rs)", key: "raised", placeholder: "0" },
                { label: "Goal Amount (Rs)", key: "goal", placeholder: "100000" },
                { label: "Email", key: "contact", placeholder: "ngo@example.com" },
                { label: "Phone", key: "phone", placeholder: "+92-300-0000000" },
                { label: "Payment Info", key: "paymentInfo", placeholder: "JazzCash: ..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
                  {key === "paymentInfo" ? (
                    <textarea value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder} rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5] text-sm" />
                  ) : (
                    <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5] text-sm"
                      required={["name", "mission", "contact", "phone"].includes(key)} />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md flex items-center justify-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />} Add NGO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}