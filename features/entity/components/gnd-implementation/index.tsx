import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { Entity } from '@/types/parsed/entity';
import {
  GndImplementation,
  GndImplementationProps,
} from './gnd-implementation';
import { Card, Divider, Row, Select, theme } from 'antd';
import { Namespace } from '@/types/namespace';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';
import { Collapse } from '@/components/collapse';
import { Fragment } from 'react';

interface GndImplementationsProps {
  implementations: Entity[];
}

export const GndImplementations: React.FC<GndImplementationsProps> = ({
  implementations,
}) => {
  const label =
    implementations.length > 1 ? 'GND-Umsetzungen ' : 'GND-Umsetzung ';
  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();
  const implementationsNamespace = Namespace.GND;

  return (
    <NamespaceThemeConfigProvider namespace={implementationsNamespace}>
      {implementations.map((implementation, index) => (
        <>
          <Collapse
            defaultOpen={true}
            labelOpen={label}
            labelClosed={label}
            extra={
              <Select
                placeholder="Codierung wählen"
                mode="multiple"
                value={codingsPreferences}
                onChange={onChange}
                size="small"
                css={{
                  minWidth: 180,
                  position: 'relative',
                  bottom: 3,
                  right: 24,
                }}
                options={codingsOptions.map((codingsOption, index) => ({
                  label: codingsOption,
                  value: codingsOption,
                  key: index,
                }))}
              />
            }
          >
            <>
              <Row
                justify="end"
                css={{
                  width: '98%',
                }}
              >
              </Row>
              <GndImplementationCard
                entity={implementation}
                codingsPreferences={codingsPreferences}
                key={index}
                lastIndex={index === implementations.length - 1}
              />
            </>
          </Collapse>
        </>
      ))}
    </NamespaceThemeConfigProvider>
  );
};

const GndImplementationCard: React.FC<
  GndImplementationProps & { lastIndex: boolean }
> = ({ entity, codingsPreferences, lastIndex }) => {
  const { token } = theme.useToken();

  return (
    <Fragment>
      <Card
        css={{
          '& > .ant-card-body': { padding: 2 },
          border: 'none',
        }}
      >
        <GndImplementation
          entity={entity}
          codingsPreferences={codingsPreferences}
        />
      </Card>
      {!lastIndex && (
        <Divider
          css={{
            borderBlockStart: `1px solid ${token.colorPrimaryBorder}`,
            margin: '8px 0 16px 0',
          }}
        />
      )}
    </Fragment>
  );
};
