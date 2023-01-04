import { Collapse } from '@/components/collapse';
import { Entity } from '@/types/parsed/entity';
import { EntityDetails } from './details';

interface EmbeddedProps {
  entity: Entity;
}

export const Embedded: React.FC<EmbeddedProps> = ({ entity }) => {
  return (
    <Collapse>
      <EntityDetails embedded entity={entity} />
    </Collapse>
  );
};
