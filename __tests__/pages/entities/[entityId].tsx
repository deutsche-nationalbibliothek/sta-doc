import React from 'react';
import { genericMatchSnapshot } from '../../../test-utils';
import { EntityDetails } from '../../../features/entity/components/details';
import { screen, waitFor } from '@testing-library/react';
import { entityRepository } from '../../../features/entity/entity-repository';

jest.mock('next/router', () => require('next-router-mock'));

describe('renders EntityDetails', () => {
  entityRepository.getAll("de").forEach((entityEntry) => {
    it(`${entityEntry.entity.id} unchanged`, async () => {
      genericMatchSnapshot(<EntityDetails entity={entityEntry.entity} />, entityEntry.entity.id);
      await waitFor(() => {
        expect(screen.getByText(entityEntry.headline?.title as string));
      });
    });
  });
});