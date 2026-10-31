import React from 'react';
import { PhysicalLogbookCard } from './PhysicalLogbookCard';

interface MainIdeaBuilderProps {
  generatedEntry: any;
  generationSource: any;
  handleClearView: () => void;
}

export function MainIdeaBuilder({
  generatedEntry,
  generationSource,
  handleClearView,
}: MainIdeaBuilderProps) {
  return (
    <PhysicalLogbookCard
      content={generatedEntry}
      source={generationSource}
      onClear={handleClearView}
    />
  );
}

export default MainIdeaBuilder;