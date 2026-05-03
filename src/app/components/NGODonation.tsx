import { useState } from "react";
import { X, Phone } from "lucide-react";

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

export function NGODonation() {
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  const ngos: NGO[] = [
    {
      id: 1,
      emoji: "🐕",
      name: "Paws & Care Lahore",
      mission: "Rescue, rehabilitation, and rehoming strays across Lahore",
      raised: 45000,
      goal: 100000,
      contact: "pawscare@example.com",
      phone: "+92-300-1234567",
      paymentInfo: "JazzCash: 0300-1234567\nEasypaisa: 0300-1234567\nBank: HBL 12345678901234",
    },
    {
      id: 2,
      emoji: "🐈",
      name: "Street Cat Alliance",
      mission: "TNR programs and feeding stations for feral cats",
      raised: 28000,
      goal: 60000,
      contact: "streetcats@example.com",
      phone: "+92-321-9876543",
      paymentInfo: "JazzCash: 0321-9876543\nEasypaisa: 0321-9876543\nBank: MCB 98765432109876",
    },
    {
      id: 3,
      emoji: "💚",
      name: "Animal Welfare Foundation",
      mission: "Emergency medical care and shelter for injured animals",
      raised: 62000,
      goal: 80000,
      contact: "awf@example.com",
      phone: "+92-333-5551234",
      paymentInfo: "JazzCash: 0333-5551234\nEasypaisa: 0333-5551234\nBank: UBL 55512344321123",
    },
    {
      id: 4,
      emoji: "🏥",
      name: "Stray Care Clinic",
      mission: "Free vaccination and sterilization services",
      raised: 35000,
      goal: 75000,
      contact: "clinic@example.com",
      phone: "+92-345-7778888",
      paymentInfo: "JazzCash: 0345-7778888\nEasypaisa: 0345-7778888\nBank: ABL 77788899001122",
    },
    {
      id: 5,
      emoji: "🌟",
      name: "Hope for Strays",
      mission: "Community awareness and feeding programs",
      raised: 18000,
      goal: 50000,
      contact: "hope@example.com",
      phone: "+92-312-4445566",
      paymentInfo: "JazzCash: 0312-4445566\nEasypaisa: 0312-4445566\nBank: NBP 44455667788990",
    },
    {
      id: 6,
      emoji: "🐾",
      name: "Four Paws Rescue",
      mission: "Adoption drives and forever home placements",
      raised: 52000,
      goal: 90000,
      contact: "fourpaws@example.com",
      phone: "+92-302-1112233",
      paymentInfo: "JazzCash: 0302-1112233\nEasypaisa: 0302-1112233\nBank: SCB 11122334455667",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Support Our Partner NGOs
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Every donation helps provide food, medical care, and shelter to stray animals in Faisal Town
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map((ngo) => {
          const progress = (ngo.raised / ngo.goal) * 100;

          return (
            <div
              key={ngo.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#FBBF24]/20"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{ngo.emoji}</div>
                <h3 className="font-bold text-xl text-gray-800">{ngo.name}</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4 min-h-[48px]">
                {ngo.mission}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-[#F97316]">
                    Rs {ngo.raised.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-[#FBBF24]/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F97316] to-[#FBBF24] transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  Goal: Rs {ngo.goal.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedNGO(ngo)}
                  className="flex-1 bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md"
                >
                  Donate / Contact
                </button>
                <a
                  href={`tel:${ngo.phone}`}
                  className="bg-green-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md flex items-center justify-center"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {selectedNGO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-4xl mb-2">{selectedNGO.emoji}</div>
                <h3 className="font-bold text-xl text-gray-800">
                  {selectedNGO.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNGO(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Email</p>
                <p className="text-gray-600">{selectedNGO.contact}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Phone</p>
                <p className="text-gray-600">{selectedNGO.phone}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Payment Information
                </p>
                <div className="bg-[#FFFBF5] rounded-xl p-4 border-2 border-[#FBBF24]/30">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-['Nunito']">
                    {selectedNGO.paymentInfo}
                  </pre>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedNGO(null)}
              className="w-full mt-6 bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
