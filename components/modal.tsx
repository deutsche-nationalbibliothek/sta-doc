import { Modal as AntdModal, ModalProps } from 'antd';
import { useState } from 'react';


export const Modal: React.FC<Omit<ModalProps, 'open' | 'onCancel'>> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <a onClick={showModal}>{`${props.title}.`}</a>
      <AntdModal
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
        {...props}
      />
    </>
  );
};
