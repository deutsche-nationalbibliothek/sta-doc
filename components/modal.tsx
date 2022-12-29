import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import { useState } from 'react';

interface ModalProps extends Omit<AntdModalProps, 'open' | 'onCancel'> {
  label: string;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { label, ...otherProps } = props;

  const showModal = () => {
    setIsOpen(true);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <a onClick={showModal}>{`${label}.`}</a>
      <AntdModal
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
        title={otherProps.title ?? label}
        {...otherProps}
      />
    </>
  );
};
