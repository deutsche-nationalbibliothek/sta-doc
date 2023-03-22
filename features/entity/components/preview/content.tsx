import { Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { compact } from 'lodash';
import { Statements } from '../statements';

interface EntityPreviewContentProps {
  entity: Entity;
}

export const EntityPreviewContent: React.FC<EntityPreviewContentProps> = ({
  entity,
}) => {
  const statements = [
    ...entity.statements.header,
    ...entity.statements.table,
    ...entity.statements.body,
  ];

  const definition = statements.find((s) => s.property === Property.definition);

  return (
    <>
      <Statements statements={compact([definition])} />
    </>
  );
};
