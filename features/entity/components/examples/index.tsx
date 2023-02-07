import { Modal } from '@/components/modal';
import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { Entity } from '@/types/parsed/entity';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Card, Select, Typography } from 'antd';
import { Example } from './example';

interface ExamplesProps {
  examples: Entity[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  const label = examples.length > 1 ? 'Beispiele ' : 'Beispiel ';

  const { namespace } = useNamespace();
  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();

  const labelReactElement = (
    <>
      <Typography.Text strong>{label}</Typography.Text>
      <MenuUnfoldOutlined
        style={{ color: 'var(--link-color)', fontSize: 'large' }}
      />
    </>
  );

  return (
    <>
      <Modal
        label={
          <>
            <br />
            {labelReactElement}
          </>
        }
        title={
          <div style={{ height: 24, transform: 'translateX(0)' }}>
            {labelReactElement}
            {namespace === Namespace.GND && (
              <Select
                mode="multiple"
                value={codingsPreferences}
                onChange={onChange}
                size="small"
                style={{ width: 160, position: 'fixed', right: 24 }}
                options={codingsOptions.map((codingsOption, index) => ({
                  label: codingsOption,
                  value: codingsOption,
                  key: index,
                }))}
              />
            )}
          </div>
        }
      >
        {examples.map((example, index) => {
          return (
            <Card style={{ backgroundColor: 'var(--primary-2)' }} key={index}>
              <Example
                entity={example}
                codingsPreferences={codingsPreferences}
              />
            </Card>
          );
        })}
      </Modal>
    </>
  );
};
