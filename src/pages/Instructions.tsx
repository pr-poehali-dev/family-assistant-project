import { useState } from 'react';
import { sections, Section } from '@/components/instructions/sectionsData';
import SectionDetailView from '@/components/instructions/SectionDetailView';
import SectionsList from '@/components/instructions/SectionsList';

export default function Instructions() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  if (selectedSection) {
    return (
      <SectionDetailView 
        section={selectedSection}
        onBack={() => setSelectedSection(null)}
      />
    );
  }

  return (
    <SectionsList 
      sections={sections}
      onSelectSection={setSelectedSection}
    />
  );
}
