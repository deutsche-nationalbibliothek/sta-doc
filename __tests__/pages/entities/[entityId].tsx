import React from 'react';
import { genericMatchSnapshot } from '../../../test-utils';
import { EntityDetails } from '../../../features/entity/components/details';
import entities from '../../../data/parsed/entities.json';
import { Entity } from '../../../types/parsed/entity';
import { screen, waitFor } from '@testing-library/react';
jest.mock('next/router', () => require('next-router-mock'));

describe('renders EntityDetails', () => {
  Object.keys(entities).forEach((entityId) => {
    it(`${entityId} unchanged`, async () => {
      const { entity } = entities[entityId] as { entity: Entity };
      genericMatchSnapshot(<EntityDetails entity={entity} />, entityId);
      await waitFor(() => {
        expect(screen.getByText(entity.headline?.title as string));
      });
    });
  });
});
