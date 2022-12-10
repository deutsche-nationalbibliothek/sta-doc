import { Entity } from '@/types/parsed/entity';
import { Collapse } from 'antd';
import { useState } from 'react';
import { EntityDetails } from './details';

interface EmbeddedProps {
  entity: Entity;
}

export const Embedded: React.FC<EmbeddedProps> = ({ entity }) => {
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
        {isOpen && <EntityDetails embedded entity={entity} />}
      </Collapse.Panel>
    </Collapse>
  );
};
