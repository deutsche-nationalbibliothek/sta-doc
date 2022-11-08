import { Entity } from '@/types/entity';
import { Collapse } from 'antd';
import { useState } from 'react';
import { EntityDetails } from './details';

interface EmbeddedProps {
  entity: Entity;
  headerLevel: number;
}

export const Embedded: React.FC<EmbeddedProps> = ({ entity, headerLevel }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapse
      onChange={(keys) => setIsOpen(!!keys.length)}
      defaultActiveKey={['1']}
    >
      <Collapse.Panel
        header={isOpen ? '' : 'Weiterführende Informationen'}
        key="1"
      >
        {isOpen && (
          <EntityDetails
            embedded
            headerLevel={headerLevel + 1}
            entity={entity}
          />
        )}
      </Collapse.Panel>
    </Collapse>
  );
};
