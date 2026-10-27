import React from 'react';
import { genericRender } from '../../../test-utils';
import { EntityDetails } from '../../../features/entity/components/details';
import { entityRepository } from '../../../features/entity/entity-repository';

jest.mock('next/router', () => require('next-router-mock'));

describe('renders EntityDetails', () => {
  entityRepository.getAll("de").forEach((entityEntry) => {
    it(`${entityEntry.entity.id} renders without crashing`, () => {
      const { container } = genericRender(
        <EntityDetails entity={entityEntry.entity} />,
        entityEntry.entity.id
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});