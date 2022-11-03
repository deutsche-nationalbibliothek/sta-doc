import { WikiBaseValue } from '@/types/entity';
import { Card, Modal } from 'antd';
import { useState } from 'react';

interface ExamplesProps {
  examples: WikiBaseValue[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    console.log({ examples });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const label = examples.length > 1 ? 'Beispiele' : 'Beispiel';

  return (
    <>
      <a onClick={showModal}>{`${label}.`}</a>
      <Modal
        title={label}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        {examples.map((example, index) => {
          // todo, implement examples output
          return <Card key={index}>{example.label}</Card>;
        })}
      </Modal>
    </>
  );
};
