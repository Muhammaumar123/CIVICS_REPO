import { Outlet, Link, useLocation } from "react-router";

export function Layout() {
  const location = useLocation();

  const tabs = [
    { path: "/", label: "🥣 Bowl Map" },
    { path: "/donate", label: "🤝 Donate" },
    { path: "/homes", label: "🏠 Find Home" },
    { path: "/food-guide", label: "📋 Food Guide" },
    { path: "/vacancies", label: "🐾 Vacancies" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-['Nunito']">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F97316] to-[#FBBF24] shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🐾</span>
              </div>
              <h1 className="text-white font-bold text-xl md:text-2xl">PawPoint Faisal Town</h1>
            </div>
          </div>
          <nav className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive(tab.path)
                    ? "bg-white text-[#F97316] font-bold shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
