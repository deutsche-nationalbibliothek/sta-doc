import { Modal } from '@/components/modal';
import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { WikiBaseValue } from '@/types/parsed/entity';
import { Card, Select } from 'antd';
import { Example } from './example';

interface ExamplesProps {
  examples: WikiBaseValue[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  const label = examples.length > 1 ? 'Beispiele. ' : 'Beispiel. ';

  const { namespace } = useNamespace();
  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();

  return (
    <>
      <Modal
        label={label}
        title={
          <div style={{ height: 24, transform: 'translateX(0)' }}>
            {label}
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
                example={example}
                codingsPreferences={codingsPreferences}
              />
            </Card>
          );
        })}
      </Modal>
    </>
  );
};
