import { Plus } from "lucide-react";

interface Animal {
  id: number;
  emoji: string;
  name: string;
  species: string;
  age: string;
  location: string;
  note: string;
  tags: {
    vaccinated: boolean;
    neutered: boolean;
    ngo: string;
  };
}

export function AnimalHomes() {
  const animals: Animal[] = [
    {
      id: 1,
      emoji: "🐕",
      name: "Bruno",
      species: "Dog",
      age: "2 years",
      location: "Park View",
      note: "Friendly, loves children, needs spacious home",
      tags: { vaccinated: true, neutered: true, ngo: "Paws & Care" },
    },
    {
      id: 2,
      emoji: "🐈",
      name: "Mimi",
      species: "Cat",
      age: "1 year",
      location: "Green Valley",
      note: "Calm, indoor cat, good with other pets",
      tags: { vaccinated: true, neutered: false, ngo: "Street Cat Alliance" },
    },
    {
      id: 3,
      emoji: "🐕‍🦺",
      name: "Max",
      species: "Dog",
      age: "4 years",
      location: "Market Square",
      note: "Guard dog temperament, experienced owner needed",
      tags: { vaccinated: false, neutered: true, ngo: "Four Paws Rescue" },
    },
    {
      id: 4,
      emoji: "🐈‍⬛",
      name: "Shadow",
      species: "Cat",
      age: "6 months",
      location: "Garden Lane",
      note: "Playful kitten, litter trained",
      tags: { vaccinated: true, neutered: false, ngo: "Street Cat Alliance" },
    },
    {
      id: 5,
      emoji: "🐕",
      name: "Bella",
      species: "Dog",
      age: "3 years",
      location: "Sunrise Street",
      note: "Rescued from injury, fully recovered, gentle nature",
      tags: { vaccinated: true, neutered: true, ngo: "Animal Welfare Foundation" },
    },
    {
      id: 6,
      emoji: "🐈",
      name: "Whiskers",
      species: "Cat",
      age: "5 years",
      location: "Park View",
      note: "Senior cat, quiet companion, minimal care",
      tags: { vaccinated: true, neutered: true, ngo: "Hope for Strays" },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Animals Needing Homes
          </h2>
          <p className="text-gray-600">
            Give a stray a second chance at life
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">
          <Plus size={20} />
          Add Animal
        </button>
      </div>

      <button className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md">
        <Plus size={20} />
        Add Animal
      </button>

      <div className="space-y-6">
        {animals.map((animal) => (
          <div
            key={animal.id}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-[#FBBF24]/20"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex justify-center md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-[#FBBF24]/20 to-[#F97316]/20 rounded-2xl flex items-center justify-center text-5xl">
                  {animal.emoji}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800">
                      {animal.name}
                    </h3>
                    <p className="text-gray-600">
                      {animal.species} • {animal.age} • {animal.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{animal.note}</p>

                <div className="flex flex-wrap gap-2">
                  {animal.tags.vaccinated && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      Vaccinated
                    </span>
                  )}
                  {!animal.tags.vaccinated && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      Not Vaccinated
                    </span>
                  )}
                  {animal.tags.neutered && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                      Neutered
                    </span>
                  )}
                  <span className="px-3 py-1 bg-[#F97316]/20 text-[#F97316] rounded-full text-sm font-bold">
                    {animal.tags.ngo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-[#F97316] to-[#FBBF24] rounded-2xl p-8 text-center shadow-xl">
        <h3 className="text-white font-bold text-2xl mb-3">
          Have space for a stray?
        </h3>
        <p className="text-white/90 mb-6">
          Contact an NGO to foster or adopt. Every home matters!
        </p>
        <button className="bg-white text-[#F97316] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-md">
          Contact NGO
        </button>
      </div>
    </div>
  );
}
