import {
  CodingsPreference,
} from '@/hooks/use-codings-preference';
import { Entity } from '@/types/parsed/entity';
import React from 'react';
import { Example } from '../examples/example';
import { GndFormatNeutral } from './gnd-format-neutral';

export interface GndImplementationProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

/**
 * GND implementation view: reuses Example scaffolding (descriptions, coding cards)
 * and only replaces format-neutral rendering with GND-specific prose.
 */
export const GndImplementation: React.FC<GndImplementationProps> = ({
  entity,
  codingsPreferences,
}) => (
  <Example
    entity={entity}
    codingsPreferences={codingsPreferences}
    showOpenInWindow={true}
    renderFormatNeutral={(formatNeutrals) => (
      <GndFormatNeutral formatNeutrals={formatNeutrals} />
    )}
  />
);
