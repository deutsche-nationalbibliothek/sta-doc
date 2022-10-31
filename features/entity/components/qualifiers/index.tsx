import { Statement } from '@/types/entity';
import { Property } from '@/types/property';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Collapse, Layout } from 'antd';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { EntityDetails } from '../details';

interface QualifiersProps {
  qualifiers: Statement[];
  headerLevel: number;
}

export const Qualifiers: React.FC<QualifiersProps> = ({
  qualifiers,
  headerLevel,
}) => {
  const qualifierMap = {
    [Property['embeddedin(item)']]: () => <></>,
    [Property['embedded(item)']]: (qualifier: Statement) => {
      const [isOpen, setIsOpen] = useState(true);
      return qualifier['wikibasePointer'].map((wikiBaseItem, index) => (
        <React.Fragment key={index}>
          {'embedded' in wikiBaseItem && wikiBaseItem.embedded && (
            <Collapse
              onChange={(keys) => setIsOpen(!!keys.length)}
              defaultActiveKey={['1']}
            >
              <Collapse.Panel
                header={isOpen ? '' : 'Weiterführende Informationen'}
                key="1"
              >
                <EntityDetails
                  embedded
                  headerLevel={headerLevel + 1}
                  entity={wikiBaseItem.embedded}
                />
              </Collapse.Panel>
            </Collapse>
          )}
        </React.Fragment>
      ));
    },
    [Property['embedded(property)']]: () => <></>,
    [Property['see(item)']]: (qualifier: Statement) =>
      qualifier['wikibasePointer'].map(
        (wikiBaseItem) =>
          'link' in wikiBaseItem && (
            <Link key={wikiBaseItem.link} href={wikiBaseItem.link}>
              <ArrowRightOutlined />
              {wikiBaseItem.label}
            </Link>
          )
      ),
    [Property['see(property)']]: (qualifier: Statement) =>
      qualifier['wikibasePointer'].map(
        (wikiBaseItem) =>
          'link' in wikiBaseItem && (
            <Link key={wikiBaseItem.link} href={wikiBaseItem.link}>
              <ArrowRightOutlined />
              {wikiBaseItem.label}
            </Link>
          )
      ),
  };
  return (
    <>
      {qualifiers.map((qualifier, index) => (
        <React.Fragment key={index}>
          {qualifier.property in qualifierMap &&
            qualifierMap[qualifier.property](qualifier)}
        </React.Fragment>
      ))}
    </>
  );
};
