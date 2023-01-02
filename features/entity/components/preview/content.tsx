import { Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
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
    ...entity.statements.text,
  ];

  const definition = statements.find((s) => s.property === Property.definition);
  const encoding = statements.find((s) => s.property === Property.Encoding);

  return (
    <>
      <Statements statements={[definition, encoding].filter((a) => a)} />
    </>
  );
};
