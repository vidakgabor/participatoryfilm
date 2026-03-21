import { useState } from "react";
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
      />
      {!sidebarOpen && (
        <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
      )}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${!sidebarOpen ? 'pl-14' : ''}`}>
        {activeSection === "youth" && <YouthSection selectedLocation={selectedLocation} />}
        {activeSection === "organizer" && <OrganizerSection selectedLocation={selectedLocation} />}
        {activeSection === "comparison" && <ComparisonSection selectedLocation={selectedLocation} />}
        {activeSection === "openended" && <OpenEndedSection />}
        {activeSection === "acceptance-future" && <AcceptanceFutureSection selectedLocation={selectedLocation} />}
      </main>
    </div>
  );
};

export default Index;
