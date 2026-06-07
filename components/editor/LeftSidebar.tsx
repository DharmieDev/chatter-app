import { Compass, HelpCircle, Settings, Sparkle } from "lucide-react";


export function LeftSidebar() {
  return (
    <aside className="w-16 border-r border-zinc-800 bg-[#121212] flex flex-col items-center py-4 flex-shrink-0 z-10 hidden sm:flex">
      
      {/* Top Logo / Brand Button */}
      {/* Recreating the orange rounded square from your mock */}
      <button 
        className="w-10 h-10 bg-[#e05e3a] rounded-xl flex items-center justify-center text-zinc-900 mb-8 transition-transform hover:scale-105 shadow-lg shadow-orange-900/20"
        title="Go to Dashboard"
      >
        {/* Using a Sparkle icon to represent the 4-point star in your image */}
        <Sparkle className="w-5 h-5 fill-current" />
      </button>

      {/* Primary Navigation Group */}
      <nav className="flex flex-col gap-3 w-full px-3">
        {/* The first icon looks like a target/compass, active state */}
        <NavItem icon={<Compass className="w-5 h-5" />} active={true} />
        {/* The second icon looks like settings/configuration */}
        <NavItem icon={<Settings className="w-5 h-5" />} />
      </nav>

      {/* Flexible spacer pushes the bottom items down */}
      <div className="flex-1" />

      {/* Bottom Action Group */}
      <div className="w-full px-3 pb-2">
        <NavItem icon={<HelpCircle className="w-5 h-5" />} />
      </div>
      
    </aside>
  );
}

// --- Helper Component ---
// This ensures all your side navigation buttons share the exact same hover 
// transitions and dimensions, keeping the UI perfectly aligned.
function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button 
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto
        ${active 
          ? 'bg-zinc-800/80 text-zinc-300 shadow-sm' // Active state
          : 'bg-transparent text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300' // Inactive state
        }
      `}
    >
      {icon}
    </button>
  );
}