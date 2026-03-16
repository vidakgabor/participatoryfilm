import { Film, Users, BarChart3, GitCompare, MessageSquareText, HeartHandshake } from "lucide-react";
import { PdfExportButton } from "./PdfExportButton";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  locations: string[];
}

const sections = [
  { id: "youth", label: "Hátrányos helyzetű fiatalok", icon: Users },
  { id: "organizer", label: "ELTE hallgatók", icon: Film },
  { id: "comparison", label: "Összehasonlítás", icon: GitCompare },
  { id: "openended", label: "Nyitott kérdések", icon: MessageSquareText },
  { id: "acceptance-future", label: "Elfogadás & Jövőkép", icon: HeartHandshake },
];

export function DashboardSidebar({
  activeSection,
  onSectionChange,
  selectedLocation,
  onLocationChange,
  locations,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-sidebar-primary" />
          <h1 className="text-sm font-display font-bold">Impact Dashboard</h1>
        </div>
        <p className="text-xs text-sidebar-muted">Részvételi Filmes Program</p>
        <p className="text-xs text-sidebar-muted">Hosszútávú hatásvizsgálat</p>
      </div>

      <nav className="flex-1 py-4">
        <p className="px-5 text-[10px] uppercase tracking-widest text-sidebar-muted mb-2">Szekciók</p>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
              activeSection === s.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary"
                : "text-sidebar-muted hover:bg-sidebar-accent/50 border-l-2 border-transparent"
            }`}
          >
            <s.icon className="w-4 h-4" />
            <span>{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-5 border-t border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-muted mb-2">Szűrők</p>
        <label className="text-xs text-sidebar-muted block mb-1">Helyszín</label>
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full bg-sidebar-accent text-sidebar-foreground text-xs rounded px-2 py-1.5 border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-primary"
        >
          <option value="all">Összes helyszín</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="p-5 border-t border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-muted mb-2">Export</p>
        <PdfExportButton
          sectionIds={["youth", "organizer", "comparison", "openended", "acceptance-future"]}
          filename="impact-dashboard-export"
        />
      </div>
    </aside>
  );
}
