import { Film, Users, BarChart3, GitCompare, MessageSquareText, HeartHandshake, PanelLeftClose, PanelLeft } from "lucide-react";
import { PdfExportButton } from "./PdfExportButton";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  locations: string[];
  isOpen: boolean;
  onToggle: () => void;
  onBeforeExport?: () => Promise<void>;
  onAfterExport?: () => void;
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
  isOpen,
  onToggle,
  onBeforeExport,
  onAfterExport,
}: DashboardSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:static z-50 top-0 left-0 min-h-screen h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-sidebar-primary" />
              <h1 className="text-sm font-display font-bold">Doktori disszertáció</h1>
            </div>
            <p className="text-xs text-sidebar-muted">Hosszú távú eredmények és utánkövetés</p>
            <p className="text-xs text-sidebar-muted">Részvételi filmes workshopok résztvevőinek tapasztalatai és változásmintázatai.</p>
            <p className="text-xs text-sidebar-muted">Vidák Gábor</p>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded hover:bg-sidebar-accent transition-colors text-sidebar-muted hover:text-sidebar-foreground"
            title="Menü elrejtése"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <nav className="py-4">
          <p className="px-5 text-[10px] uppercase tracking-widest text-sidebar-muted mb-2">Szekciók</p>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSectionChange(s.id);
                if (window.innerWidth < 1024) onToggle();
              }}
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

        <div className="px-5 pb-4">
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

        <div className="px-5 pb-4">
          <p className="text-[10px] uppercase tracking-widest text-sidebar-muted mb-2">Export</p>
          <PdfExportButton
            filename="impact-dashboard-export"
            selectedLocation={selectedLocation}
            onBeforeExport={onBeforeExport}
            onAfterExport={onAfterExport}
          />
        </div>

        <div className="flex-1" />
      </aside>
    </>
  );
}

export function SidebarToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-3 left-3 z-30 p-2 rounded-md bg-card border border-border shadow-sm hover:bg-accent transition-colors"
      title="Menü megnyitása"
    >
      <PanelLeft className="w-5 h-5 text-foreground" />
    </button>
  );
}
