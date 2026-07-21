import { Example } from '@/features/entity/components/examples/example';
import { readExamplePopupEntity } from '@/features/entity/components/examples/example-popup';
import { FetchEntity } from '@/features/entity/components/utils/fetch';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';
import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { EntityId } from '@/types/entity-id';
import { Entity } from '@/types/parsed/entity';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { Col, Row, Select, Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';

const resolveExampleNamespace = (entity: Entity): Namespace => {
  const pageTypeId = entity.pageType?.id;
  if (pageTypeId === Item['Example-GND-of-STA-documentation']) {
    return Namespace.GND;
  }
  if (pageTypeId === Item['Example-RDA-of-STA-documentation']) {
    return Namespace.RDA;
  }
  return entity.namespace ?? Namespace.STA;
};

const ExamplePopupContent: React.FC<{ entity: Entity }> = ({ entity }) => {
  const { t } = useTranslation('common');
  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();
  const namespace = resolveExampleNamespace(entity);
  const title = entity.label || t('example');
  const hasCodingValues = entity.statements.body.some(
    (statement) => statement.codings
  );

  return (
    <NamespaceThemeConfigProvider namespace={namespace}>
      <Head>
        <title>{title}</title>
      </Head>
      <div css={{ padding: 24 }}>
        <Row
          justify="space-between"
          align="middle"
          css={{ marginBottom: 16 }}
          gutter={[8, 8]}
        >
          <Col>
            <Typography.Title level={4} css={{ margin: 0 }}>
              {title}
            </Typography.Title>
          </Col>
          {hasCodingValues && (
            <Col>
              <Select
                placeholder="Codierung wählen"
                mode="multiple"
                value={codingsPreferences}
                onChange={onChange}
                size="small"
                css={{ minWidth: 180 }}
                options={codingsOptions.map((codingsOption, index) => ({
                  label: codingsOption,
                  value: codingsOption,
                  key: index,
                }))}
              />
            </Col>
          )}
        </Row>
        <Example
          entity={entity}
          codingsPreferences={codingsPreferences}
          showOpenInWindow={false}
        />
      </div>
    </NamespaceThemeConfigProvider>
  );
};

export default function ExamplePopupPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const entityId = router.query.entityId as EntityId | undefined;
  const [storedEntity, setStoredEntity] = useState<Entity | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    if (!entityId) {
      return;
    }
    setStoredEntity(readExamplePopupEntity(entityId));
    setCheckedStorage(true);
  }, [entityId]);

  if (!entityId || !checkedStorage) {
    return null;
  }

  if (storedEntity) {
    return <ExamplePopupContent entity={storedEntity} />;
  }

  return (
    <FetchEntity entityId={entityId} showSpinner>
      {(entityEntry, loading): JSX.Element => {
        if (loading) {
          return <span />;
        }
        if (!entityEntry?.entity) {
          return (
            <Typography.Paragraph type="secondary" css={{ padding: 24 }}>
              {t('example')}: Entity {entityId} wurde nicht gefunden.
            </Typography.Paragraph>
          );
        }
        return <ExamplePopupContent entity={entityEntry.entity} />;
      }}
    </FetchEntity>
  );
}

ExamplePopupPage.isPopupPage = true;
