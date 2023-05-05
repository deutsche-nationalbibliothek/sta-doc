import { useRouter } from '@/lib/next-use-router';
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { PropsWithStyle } from 'index';
import React from 'react';

interface CopyIconProps extends PropsWithStyle {
  anchor: string;
  className?: string;
}

export const CopyHeadlineAnchorLink: React.FC<CopyIconProps> = ({
  className,
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
      <CopyOutlined
        className={`${className ? className : ''} no-print`}
        onClick={onCopy}
      />
    </>
  );
};
