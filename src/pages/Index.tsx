import { useState, useCallback } from "react";
import { DashboardSidebar, SidebarToggleButton } from "@/components/DashboardSidebar";
import { YouthSection } from "@/components/YouthSection";
import { OrganizerSection } from "@/components/OrganizerSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { OpenEndedSection } from "@/components/OpenEndedSection";
import { AcceptanceFutureSection } from "@/components/AcceptanceFutureSection";
import { locations } from "@/data/youthData";
import { orgLocations } from "@/data/organizerData";

const allLocations = [...new Set([...locations, ...orgLocations])].sort();

const ALL_SECTIONS = ["youth", "organizer", "comparison", "openended", "acceptance-future"] as const;

const Index = () => {
  const [activeSection, setActiveSection] = useState("youth");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exportingAll, setExportingAll] = useState(false);

  const showAllForExport = useCallback(async (show: boolean) => {
    setExportingAll(show);
    // Wait for React to render all sections
    await new Promise(r => setTimeout(r, 800));
  }, []);

  const sectionsToRender = exportingAll ? ALL_SECTIONS : [activeSection];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={allLocations}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onShowAllForExport={showAllForExport}
      />
      {!sidebarOpen && (
        <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
      )}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${!sidebarOpen ? 'pl-14' : ''}`}>
        {sectionsToRender.map(section => (
          <div
            key={section}
            style={exportingAll && section !== activeSection ? { position: 'absolute', left: '-9999px', width: '900px' } : {}}
          >
            {section === "youth" && <YouthSection selectedLocation={selectedLocation} />}
            {section === "organizer" && <OrganizerSection selectedLocation={selectedLocation} />}
            {section === "comparison" && <ComparisonSection selectedLocation={selectedLocation} />}
            {section === "openended" && <OpenEndedSection />}
            {section === "acceptance-future" && <AcceptanceFutureSection selectedLocation={selectedLocation} />}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Index;
