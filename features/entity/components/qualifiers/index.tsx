import { Statement, WikiBaseValue } from '@/types/entity';
import { Property } from '@/types/property';
import { Collapse, Typography } from 'antd';
import React from 'react';
import { useState } from 'react';
import { EntityDetails } from '../details';
import { Examples } from '../examples';
import { StringStatement } from '../statements/string';
import { WikibasePointer } from '../statements/wikibase-pointer';

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
                {isOpen && (
                  <EntityDetails
                    embedded
                    headerLevel={headerLevel + 1}
                    entity={wikiBaseItem.embedded}
                  />
                )}
              </Collapse.Panel>
            </Collapse>
          )}
        </React.Fragment>
      ));
    },
    [Property['embedded(property)']]: () => <></>,
    [Property['see(item)']]: (qualifier: Statement) => (
      <WikibasePointer wikibaseValues={qualifier.wikibasePointer} />
    ),
    [Property['see(property)']]: (qualifier: Statement) => (
      <WikibasePointer wikibaseValues={qualifier.wikibasePointer} />
    ),
    [Property['example(s)']]: (qualifier: Statement) => {
      return (
        <Examples
          examples={
            qualifier.wikibasePointer.filter(
              (wikibasePointer) => 'label' in wikibasePointer
            ) as WikiBaseValue[]
          }
        />
      );
    },
    default: (qualifier: Statement) => {
      return (
        qualifier.string && (
          <Typography.Paragraph>
            <Typography.Text strong>{qualifier.label}:</Typography.Text>
            <StringStatement
              statement={qualifier.string}
              headerLevel={headerLevel}
            />
          </Typography.Paragraph>
        )
      );
    },
  };
  return (
    <>
      {qualifiers
        .sort(
          (qualifier1, qualifier2) =>
            sorting.indexOf(qualifier1.property) -
            sorting.indexOf(qualifier2.property)
        )
        .map((qualifier, index) => {
          return (
            <React.Fragment key={index}>
              {' '}
              {qualifier.property in qualifierMap
                ? qualifierMap[qualifier.property](qualifier)
                : qualifierMap.default(qualifier)}
            </React.Fragment>
          );
        })}
    </>
  );
};

const sorting = [Property['see(item)'], Property['see(property)']];
