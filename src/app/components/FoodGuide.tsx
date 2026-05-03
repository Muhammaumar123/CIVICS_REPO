import { Check, X } from "lucide-react";

interface FoodItem { name: string; }
interface AnimalGuide {
  type: string;
  emoji: string;
  safe: FoodItem[];
  never: FoodItem[];
}

function QRCodeImage({ url, size = 192 }: { url: string; size?: number }) {
  const encodedUrl = encodeURIComponent(url);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&bgcolor=ffffff&color=000000&margin=2`;
  return (
    <img
      src={qrSrc}
      alt="QR Code for Food Guide"
      width={size}
      height={size}
      className="rounded-lg mx-auto"
    />
  );
}

export function FoodGuide() {
  const guides: AnimalGuide[] = [
    {
      type: "Dogs", emoji: "🐕",
      safe: [
        { name: "Plain cooked chicken" }, { name: "Plain rice" },
        { name: "Boiled eggs" },          { name: "Carrots" },
        { name: "Plain roti (no spices)" },{ name: "Pumpkin" },
      ],
      never: [
        { name: "Chocolate" },        { name: "Onions & garlic" },
        { name: "Grapes & raisins" }, { name: "Spicy food" },
        { name: "Bones (cooked)" },   { name: "Avocado" },
      ],
    },
    {
      type: "Cats", emoji: "🐈",
      safe: [
        { name: "Plain cooked fish" },          { name: "Plain chicken" },
        { name: "Boiled eggs" },                { name: "Plain rice (small amounts)" },
        { name: "Cooked meat" },                { name: "Cat food (wet/dry)" },
      ],
      never: [
        { name: "Milk (most cats are lactose intolerant)" },
        { name: "Onions & garlic" }, { name: "Chocolate" },
        { name: "Raw fish" },        { name: "Grapes & raisins" },
        { name: "Spicy food" },
      ],
    },
    {
      type: "General Tips", emoji: "🌾",
      safe: [
        { name: "Fresh water always available" }, { name: "Small portions, multiple times" },
        { name: "Clean bowls regularly" },        { name: "Avoid street leftovers" },
        { name: "No added salt or sugar" },       { name: "Room temperature food" },
      ],
      never: [
        { name: "Spoiled or moldy food" }, { name: "Sharp bones" },
        { name: "Alcohol" },               { name: "Caffeine" },
        { name: "Heavily processed foods" },{ name: "Xylitol (artificial sweetener)" },
      ],
    },
  ];

  // QR points to this page
  const foodGuideUrl = typeof window !== "undefined"
    ? window.location.origin + "/food-guide"
    : "https://pawpoint-faisaltown.vercel.app/food-guide";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Safe Feeding Guide</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Know what's safe and what's harmful before you feed strays
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {guides.map((guide) => (
          <div
            key={guide.type}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#FBBF24]/20"
          >
            <div className="bg-gradient-to-r from-[#F97316] to-[#FBBF24] p-6 text-center">
              <div className="text-5xl mb-3">{guide.emoji}</div>
              <h3 className="text-white font-bold text-2xl">{guide.type}</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={20} />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">Safe to Feed</h4>
                </div>
                <ul className="space-y-2">
                  {guide.safe.map((item) => (
                    <li key={item.name} className="flex items-start gap-3 text-gray-700">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="text-red-600" size={20} />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">Never Feed</h4>
                </div>
                <ul className="space-y-2">
                  {guide.never.map((item) => (
                    <li key={item.name} className="flex items-start gap-3 text-gray-700">
                      <X className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FBBF24]/20">
        <div className="text-center">
          <h3 className="font-bold text-2xl text-gray-800 mb-2">Print & Attach to Bowl Stations</h3>
          <p className="text-gray-600 mb-6">
            Scan this QR code to open the full feeding guide on any phone
          </p>

          <div className="inline-block bg-white p-6 rounded-2xl shadow-md border-2 border-[#FBBF24]/30">
            <QRCodeImage url={foodGuideUrl} size={192} />
            <p className="text-sm text-gray-600 mt-4 font-bold">Scan to View Feeding Guide</p>
            <p className="text-xs text-gray-400 mt-1 break-all max-w-[192px] mx-auto">{foodGuideUrl}</p>
          </div>

          <div className="mt-6 bg-[#FFFBF5] rounded-xl p-4 border-2 border-[#FBBF24]/30 max-w-lg mx-auto">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Tip:</span> Laminate the printed guide to protect it from weather.
              Attach it near feeding bowls so everyone knows what's safe!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
