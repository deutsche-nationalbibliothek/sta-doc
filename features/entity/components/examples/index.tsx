import { Modal } from '@/components/modal';
import { WikiBaseValue } from '@/types/entity';
import { Card } from 'antd';
import { Example } from './example';

interface ExamplesProps {
  examples: WikiBaseValue[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  return (
    <>
      <Modal title={examples.length > 1 ? 'Beispiele' : 'Beispiel'}>
        {examples.map((example, index) => {
          return <Card style={{ backgroundColor: 'var(--primary-2) ' }} key={index}><Example example={example} /></Card>;
        })}
      </Modal>
    </>
  );
};
