import { Title } from '@/components/title';
import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import React, { useEffect } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { NamespaceImage } from './namespace-image';
import { PageHeader, Typography } from 'antd';
import { Entity, isStringValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
import { RdaRessourceTypeEntity } from './rda-ressource-type';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
}) => {
  const { namespace, onSetByPageType, onResetNamespace } = useNamespace();
  useInitialScroll(!embedded);

  useEffect(() => {
    if (!embedded && entity.pageType?.id) {
      onSetByPageType(entity.pageType);
    }
    return onResetNamespace;
  }, [embedded, entity.pageType?.id]);

  const staNotationStatement = entity.statements.header.find(
    (s) => s.property === Property['STA-Notation']
  );

  const staNotationInfo = staNotationStatement &&
    isStringValue(staNotationStatement.string[0].values[0]) && {
    label: staNotationStatement.label,
    value: staNotationStatement.string[0].values[0].value,
  };

  const elementsStatement = entity.statements.text.find(
    (statement) => statement.property === Property.Elements
  );

  return (
    <>
      {!embedded && (
        <PageHeader
          title={<Title headline={entity.headline} />}
          extra={
            <>
              <div>
                {namespace && <NamespaceImage />}
                {staNotationInfo && (
                  <>
                    <Typography.Paragraph style={{ textAlign: 'center' }}>
                      <Typography.Text strong>
                        {staNotationInfo.label}:
                      </Typography.Text>
                      <br />
                      <Typography.Text>{staNotationInfo.value}</Typography.Text>
                    </Typography.Paragraph>
                  </>
                )}
              </div>
            </>
          }
        />
      )}

      {entity.pageType.id === Item['RDA-Ressource-Type'] &&
        elementsStatement ? (
        <RdaRessourceTypeEntity entity={entity} />
      ) : (
        <>
          {entity.statements.header.length > 0 && (
            <Statements statements={entity.statements.header} />
          )}
          {entity.statements.table.length > 0 && (
            <TableStatements
              statements={entity.statements.table}
            />
          )}
          {entity.statements.text.length > 0 && (
            <Statements statements={entity.statements.text} />
          )}
        </>
      )}
    </>
  );
};
