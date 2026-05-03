import { useState, useEffect } from "react";
import { X, Plus, Loader2, Trash2, Send } from "lucide-react";
import { readBin, writeBin } from "../lib/jsonbin";

interface Vacancy {
  id: number;
  ngoName: string;
  animalType: string;
  spots: number;
  description: string;
  contact: string;
  phone: string;
  postedAt: string;
}

interface ContactForm {
  name: string;
  phone: string;
  message: string;
}

export function VacancyBoard() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contactVacancy, setContactVacancy] = useState<Vacancy | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [contactForm, setContactForm] = useState<ContactForm>({ name: "", phone: "", message: "" });
  const [form, setForm] = useState({ ngoName: "", animalType: "Cat", spots: "1", description: "", contact: "", phone: "" });

  useEffect(() => {
    readBin("vacancies").then((data) => {
      setVacancies(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "admin123") { setIsAdmin(true); setAdminError(""); setAdminPass(""); }
    else setAdminError("Incorrect password.");
  };

  const handlePostVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVacancy: Vacancy = {
      id: Date.now(),
      ngoName: form.ngoName,
      animalType: form.animalType,
      spots: Number(form.spots),
      description: form.description,
      contact: form.contact,
      phone: form.phone,
      postedAt: new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
    };
    const updated = [...vacancies, newVacancy];
    setSaving(true);
    await writeBin("vacancies", updated);
    setVacancies(updated);
    setSaving(false);
    setShowAddModal(false);
    setForm({ ngoName: "", animalType: "Cat", spots: "1", description: "", contact: "", phone: "" });
  };

  const handleDeleteVacancy = async (id: number) => {
    const updated = vacancies.filter((v) => v.id !== id);
    setSaving(true);
    await writeBin("vacancies", updated);
    setVacancies(updated);
    setSaving(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would send an email/message. For now we just show success.
    setContactSent(true);
    setTimeout(() => { setContactSent(false); setContactVacancy(null); setContactForm({ name: "", phone: "", message: "" }); }, 3000);
  };

  const animalEmoji: Record<string, string> = {
    Cat: "🐈", Dog: "🐕", Kitten: "🐱", Puppy: "🐶", Bird: "🐦", Rabbit: "🐇", Other: "🐾",
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#F97316]" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🏠 NGO Vacancy Board</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          NGOs post open spots for animals. If you have a pet to give away, find an NGO with space and contact them directly.
        </p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start">
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">
          <Plus size={18} /> Post a Vacancy (NGOs)
        </button>

        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="flex gap-3">
            <input type="password" value={adminPass} onChange={(e) => { setAdminPass(e.target.value); setAdminError(""); }}
              placeholder="Admin password"
              className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-white text-sm" />
            <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm">Admin Login</button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-green-600 font-bold">✅ Admin mode — you can delete posts</span>
            <button onClick={() => setIsAdmin(false)} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
            {saving && <Loader2 size={18} className="animate-spin text-[#F97316]" />}
          </div>
        )}
        {adminError && <p className="text-sm text-red-500">{adminError}</p>}
      </div>

      {/* Vacancies grid */}
      {vacancies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-[#FBBF24]/40">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="font-bold text-xl text-gray-700 mb-2">No vacancies posted yet</h3>
          <p className="text-gray-500">NGOs can post open spots using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#FBBF24]/20 relative">
              {isAdmin && (
                <button onClick={() => handleDeleteVacancy(vacancy.id)} className="absolute top-3 right-3 bg-red-100 text-red-500 hover:bg-red-200 p-1.5 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FBBF24]/20 to-[#F97316]/20 rounded-2xl flex items-center justify-center text-3xl">
                  {animalEmoji[vacancy.animalType] || "🐾"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{vacancy.ngoName}</h3>
                  <p className="text-sm text-gray-500">{vacancy.postedAt}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] rounded-full text-sm font-bold">
                    {vacancy.animalType}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {vacancy.spots} spot{vacancy.spots > 1 ? "s" : ""} available
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{vacancy.description}</p>
              </div>

              <button
                onClick={() => { setContactVacancy(vacancy); setContactSent(false); }}
                className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send size={18} /> Contact This NGO
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Post vacancy modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800">Post a Vacancy</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handlePostVacancy} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">NGO Name</label>
                <input type="text" value={form.ngoName} onChange={(e) => setForm({ ...form, ngoName: e.target.value })}
                  placeholder="Your NGO name" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Animal Type</label>
                <select value={form.animalType} onChange={(e) => setForm({ ...form, animalType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]">
                  {["Cat", "Dog", "Kitten", "Puppy", "Bird", "Rabbit", "Other"].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Number of Spots Available</label>
                <input type="number" min="1" max="20" value={form.spots} onChange={(e) => setForm({ ...form, spots: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., We have space for 2 adult cats, vaccinated preferred" rows={3} required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Email</label>
                <input type="email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="ngo@example.com" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92-300-0000000" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md flex items-center justify-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />} Post Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact NGO modal */}
      {contactVacancy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-gray-800">Contact {contactVacancy.ngoName}</h3>
              <button onClick={() => setContactVacancy(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            {contactSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Message Sent!</h4>
                <p className="text-gray-600">The NGO will contact you shortly on the phone number you provided.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#FFFBF5] rounded-xl p-4 border-2 border-[#FBBF24]/30 mb-5">
                  <p className="text-sm text-gray-600 mb-1">You are contacting about:</p>
                  <p className="font-bold text-gray-800">{contactVacancy.animalType} vacancy — {contactVacancy.spots} spot{contactVacancy.spots > 1 ? "s" : ""}</p>
                  <p className="text-sm text-gray-500 mt-1">📧 {contactVacancy.contact} | 📞 {contactVacancy.phone}</p>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                    <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your full name" required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Phone</label>
                    <input type="text" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+92-300-0000000" required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                    <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell the NGO about your pet — species, age, health status, reason for giving away..." rows={4} required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F97316] focus:outline-none bg-[#FFFBF5]" />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setContactVacancy(null)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md flex items-center justify-center gap-2">
                      <Send size={18} /> Send Message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
