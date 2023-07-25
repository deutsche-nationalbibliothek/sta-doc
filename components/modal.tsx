import { useRouter } from '@/lib/next-use-router';
import { css } from '@emotion/react';
import { Modal as AntdModal, ModalProps as AntdModalProps, theme } from 'antd';
import { useEffect, useState } from 'react';

interface ModalProps extends Omit<AntdModalProps, 'open' | 'onCancel'> {
  label?: JSX.Element | string;
  disableLabelOnOpen?: boolean;
  // flag to control to render either a span or an anchor
  renderSpan?: boolean;
  closeOnRouteChange?: boolean;
}

// TODO
// export const DraggableModal: React.FC<ModalProps> = (props) => {
//   return (
//     <Modal
//       {...props}
//       modalRender={(modal) => (
//         <Draggable
//           disabled={disabled}
//           bounds={bounds}
//           onStart={(event: DraggableEvent, uiData: DraggableData) =>
//             onStart(event, uiData)
//           }
//         >
//           <div ref={draggleRef}>{modal}</div>
//         </Draggable>
//       )}
//     ></Modal>
//   );
// };

export const Modal: React.FC<ModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = theme.useToken();
  const { asPath } = useRouter();

  useEffect(() => {
    if (props.closeOnRouteChange) {
      return () => {
        setIsOpen(false);
      };
    }
  }, [asPath, props.closeOnRouteChange]);

  const { label, ...otherProps } = props;

  const showModal = () => {
    setIsOpen(true);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {props.renderSpan ? (
        <span onClick={showModal}>{label}</span>
      ) : (
        <a onClick={showModal}>{label}</a>
      )}
      <AntdModal
        title={
          props.disableLabelOnOpen !== undefined &&
          (isOpen ? '' : otherProps.title || label)
        }
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
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
