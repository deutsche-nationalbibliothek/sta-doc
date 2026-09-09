import React from 'react';
import { render, screen } from '@testing-library/react';
import { GndImplementation } from './gnd-implementation';
import { GndFormatNeutral } from './gnd-format-neutral';
import type { ExampleProps } from '../examples/example';
import type { ExampleProcessingResult } from '@/utils/example-statements-reducer';
import type { Entity } from '@/types/parsed/entity';
import { Item } from '@/types/item';
import { Property } from '@/types/property';

const exampleCalls: ExampleProps[] = [];

jest.mock('../examples/example', () => ({
  Example: (props: ExampleProps) => {
    exampleCalls.push(props);
    return (
      <div data-testid="example-shell">
        {props.renderFormatNeutral?.([
          {
            label: 'ignored-default-label',
            propertyId: Property.definition,
            propertyLabel: 'Titel',
            staNotationLabel: 'P1',
            value: 'Musterwert',
            subfieldsGroup: {
              naming: [],
              relationType: [],
              addition: [],
              qualifier: [],
            },
          },
        ])}
      </div>
    );
  },
}));

jest.mock('@/entity/components/preview/link', () => ({
  EntityLink: ({ label }: { label: string }) => <span>{label}</span>,
}));

const entity = {
  id: 'Q1',
  staNotationLabel: 'Q1',
  statements: { header: [], table: [], body: [] },
} as Entity;

describe('GndImplementation', () => {
  beforeEach(() => {
    exampleCalls.length = 0;
  });

  it('imports and renders Example with GND formatNeutral override', () => {
    render(
      <GndImplementation entity={entity} codingsPreferences={['PICA3']} />
    );

    expect(screen.getByTestId('example-shell')).toBeInTheDocument();
    expect(exampleCalls).toHaveLength(1);
    expect(exampleCalls[0].entity).toBe(entity);
    expect(exampleCalls[0].codingsPreferences).toEqual(['PICA3']);
    expect(exampleCalls[0].showOpenInWindow).toBe(true);
    expect(typeof exampleCalls[0].renderFormatNeutral).toBe('function');

    // GND prose instead of Example's default italic label + value
    expect(screen.getByText(/Erfassen Sie/)).toBeInTheDocument();
    expect(screen.getByText('Musterwert')).toBeInTheDocument();
    expect(screen.getByText(/im Datenfeld/)).toBeInTheDocument();
    expect(screen.getByText('Titel')).toBeInTheDocument();
    expect(screen.queryByText('ignored-default-label')).not.toBeInTheDocument();
  });
});

describe('GndFormatNeutral', () => {
  const baseItem: ExampleProcessingResult['formatNeutral'][number] = {
    label: 'label',
    propertyId: Property['Element-of'],
    propertyLabel: 'Name',
    staNotationLabel: 'P2',
    value: 'Goethe',
    subfieldsGroup: {
      naming: [],
      relationType: [],
      addition: [],
      qualifier: [],
    },
  };

  it('renders GND relationship layout copy when layout is Q11801', () => {
    render(
      <GndFormatNeutral
        formatNeutrals={[
          { ...baseItem, formatNeutralLayoutId: Item.Q11801 },
        ]}
      />
    );

    expect(
      screen.getByText(/als in Beziehung stehende Entität/)
    ).toBeInTheDocument();
  });
});
