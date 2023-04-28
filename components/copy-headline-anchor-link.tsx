import { useRouter } from '@/lib/next-use-router';
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
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
  const { asPath } = useRouter();

  const asPathWithoutFragmentRegex = /.*(?=#.*)|.*/;
  const pathMatch = asPath.match(asPathWithoutFragmentRegex) ?? [''];

  const onCopy = () => {
    const hasCopied =
      pathMatch &&
      copy(
        `${window.location.origin}${process.env.basePath ?? ''}${
          pathMatch[0]
        }#${anchor}`
      );
    const messageProps: { content: string; type: 'success' | 'error' } =
      hasCopied
        ? {
            type: 'success',
            content: 'Link kopiert!',
          }
        : {
            type: 'error',
            content: 'Fehler beim Link kopieren',
          };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    messageApi.open(messageProps);
  };

  return (
    <>
      {contextHolder}
      <CopyOutlined className="no-print" style={style} onClick={onCopy} />
    </>
  );
};
