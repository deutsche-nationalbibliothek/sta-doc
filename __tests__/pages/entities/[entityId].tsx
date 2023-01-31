import React from 'react';
import { genericMatchSnapshot } from '../../../test-utils';
import { EntityDetails } from '../../../features/entity/components/details';
import entities from '../../../data/parsed/entities.json';
jest.mock('next/router', () => require('next-router-mock'));

describe('renders EntityDetails', () => {
  Object.keys(entities)
    .forEach((entityId) => {
      it(`${entityId} unchanged`, () => {
        genericMatchSnapshot(
          <EntityDetails entity={entities[entityId].entity} />,
          entityId
        );
      });
    });
});
