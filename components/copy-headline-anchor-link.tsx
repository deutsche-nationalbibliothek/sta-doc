import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import React, { CSSProperties } from 'react';

interface CopyIconProps {
  style?: CSSProperties;
  anchor: string;
}

export const CopyHeadlineAnchorLink: React.FC<CopyIconProps> = ({
  style,
  anchor,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onCopy = () => {
    const hasCopied = copy(
      `${window.location.origin}${router.asPath.match(/.*(?=#.*)|.*/)[0]
      }#${anchor}`
    );
    if (hasCopied) {
      messageApi.open({
        type: 'success',
        content: 'Link kopiert!',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Fehler beim Link kopieren',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <CopyOutlined style={style} onClick={onCopy} />
    </>
  );
};
