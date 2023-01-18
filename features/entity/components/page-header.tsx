import { Title } from '@/components/title';
import { Namespace } from '@/types/namespace';
import { Entity, isStringValue, Statement } from '@/types/parsed/entity';
import { PageHeader, Switch, Typography } from 'antd';
import React from 'react';
import { NamespaceImage } from './namespace-image';

interface EntityPageHeaderProps {
  entity: Entity;
  namespace: Namespace;
  isRdaRessourceType: boolean;
  staNotationStatement?: Statement;
  view: {
    get: string;
    set: (newValue: string) => void;
  };
}

export const EntityPageHeader: React.FC<EntityPageHeaderProps> = ({
  entity,
  namespace,
  isRdaRessourceType,
  staNotationStatement,
  view,
}) => {
  const staNotationInfo = staNotationStatement &&
    isStringValue(staNotationStatement.string[0].values[0]) && {
      label: staNotationStatement.label,
      value: staNotationStatement.string[0].values[0].value,
    };

  const isApplicationProfileView = view.get === 'application-profile';

  return (
    <PageHeader
      title={<Title headline={entity.headline} />}
      extra={
        <>
          <div>
            {namespace && <NamespaceImage />}
            {isRdaRessourceType && (
              <>
                <br />
                <Switch
                  title="Anwendungsprofil"
                  checked={isApplicationProfileView}
                  onChange={() =>
                    view.set(
                      isApplicationProfileView
                        ? undefined
                        : 'application-profile'
                    )
                  }
                />
                <Typography.Text strong={isApplicationProfileView}>
                  Anwendungsprofil
                </Typography.Text>
              </>
            )}
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
  );
};
