import { css } from '@emotion/react';
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
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
        title={otherProps.title || label}
        {...otherProps}
        css={css(otherProps.className ?? '', {
          '& .ant-modal-header': {
            borderBottom: `1px solid ${token.colorPrimaryBorder}`,
            paddingBottom: 4,
          },
        })}
      />
    </>
  );
};
