import Draggable, { DraggableData, DraggableEvent } from '@/lib/draggable';
import { useRouter } from '@/lib/next-use-router';
import { css } from '@emotion/react';
import { Modal as AntdModal, ModalProps as AntdModalProps, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface ModalProps extends Omit<AntdModalProps, 'open' | 'onCancel'> {
  label?: JSX.Element | string;
  disableLabelOnOpen?: boolean;
  // flag to control to render either a span or an anchor
  renderSpan?: boolean;
  closeOnRouteChange?: boolean;
}

export const DraggableModal: React.FC<ModalProps> = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const onEnableDraggable = () => {
    if (disabled) {
      setDisabled(false);
    }
  };

  const onDisableDraggable = () => {
    if (!disabled) {
      setDisabled(true);
    }
  };

  return (
    <Modal
      {...props}
      isDraggable
      onEnableDraggable={onEnableDraggable}
      onDisableDraggable={onDisableDraggable}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event: DraggableEvent, uiData: DraggableData) =>
            onStart(event, uiData)
          }
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    ></Modal>
  );
};

interface DraggableModalExtraProps {
  isDraggable?: boolean;
  onEnableDraggable?: () => void;
  onDisableDraggable?: () => void;
}

export const Modal: React.FC<ModalProps & DraggableModalExtraProps> = (
  props
) => {
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

  const titleLabel =
    isOpen && !props.disableLabelOnOpen && (otherProps.title || label);

  return (
    <>
      {props.renderSpan ? (
        <span onClick={showModal}>{label}</span>
      ) : (
        <a onClick={showModal}>{label}</a>
      )}
      <AntdModal
        open={isOpen}
        onCancel={onCancel}
        footer={[]}
        width={720}
        {...otherProps}
        title={
          props.isDraggable ? (
            <div
              onMouseEnter={props.onEnableDraggable}
              onMouseLeave={props.onDisableDraggable}
              css={{ cursor: 'move' }}
            >
              {titleLabel}
            </div>
          ) : (
            titleLabel
          )
        }
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
