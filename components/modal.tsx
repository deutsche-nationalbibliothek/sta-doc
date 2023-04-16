import { Modal as AntdModal, ModalProps as AntdModalProps, theme } from 'antd';
import { useState } from 'react';

interface ModalProps extends Omit<AntdModalProps, 'open' | 'onCancel'> {
  label?: JSX.Element | string;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { token } = theme.useToken();

  const { label, ...otherProps } = props;

  const showModal = () => {
    setIsOpen(true);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <a onClick={showModal}>{label}</a>
      <AntdModal
        css={{
          '& .ant-modal-content': {
            backgroundColor: token.colorPrimaryBorder,
            // '& *:not(.ant-card-body)': {
            //   backgroundColor: `${token.colorPrimaryBorder}`,
            // },
          },
        }}
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
        title={otherProps.title || label}
        {...otherProps}
      />
    </>
  );
};
