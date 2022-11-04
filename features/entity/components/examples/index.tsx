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
          // todo, implement examples output
          return <Card key={index}><Example example={example} /></Card>;
        })}
      </Modal>
    </>
  );
};
