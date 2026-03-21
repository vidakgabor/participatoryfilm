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

const Index = () => {
  const [activeSection, setActiveSection] = useState("youth");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exportMode, setExportMode] = useState(false);

  const onBeforeExport = useCallback(async () => {
    setExportMode(true);
    await new Promise(r => setTimeout(r, 800));
  }, []);

  const onAfterExport = useCallback(() => {
    setExportMode(false);
  }, []);

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
        onBeforeExport={onBeforeExport}
        onAfterExport={onAfterExport}
      />
      {!sidebarOpen && (
        <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
      )}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${!sidebarOpen ? 'pl-14' : ''}`}>
        <div className={activeSection === "youth" || exportMode ? "" : "hidden"}>
          <YouthSection selectedLocation={selectedLocation} />
        </div>
        <div className={activeSection === "organizer" || exportMode ? "" : "hidden"}>
          <OrganizerSection selectedLocation={selectedLocation} />
        </div>
        <div className={activeSection === "comparison" || exportMode ? "" : "hidden"}>
          <ComparisonSection selectedLocation={selectedLocation} />
        </div>
        <div className={activeSection === "openended" || exportMode ? "" : "hidden"}>
          <OpenEndedSection />
        </div>
        <div className={activeSection === "acceptance-future" || exportMode ? "" : "hidden"}>
          <AcceptanceFutureSection selectedLocation={selectedLocation} />
        </div>
      </main>
    </div>
  );
};

export default Index;
