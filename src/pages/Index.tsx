import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={allLocations}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "youth" && <YouthSection selectedLocation={selectedLocation} />}
        {activeSection === "organizer" && <OrganizerSection selectedLocation={selectedLocation} />}
        {activeSection === "comparison" && <ComparisonSection selectedLocation={selectedLocation} />}
        {activeSection === "openended" && <OpenEndedSection />}
      </main>
    </div>
  );
};

export default Index;
