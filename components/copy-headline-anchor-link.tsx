import { useRouter } from '@/lib/next-use-router';
import { LinkOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { PropsWithStyle } from 'index';
import React from 'react';

// pass either anchor or url
interface CopyIconProps extends PropsWithStyle {
  anchor?: string;
  url?: string;
  className?: string;
}

export const CopyHeadlineAnchorLink: React.FC<CopyIconProps> = ({
  className,
  anchor,
  url,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { asPath } = useRouter();

  const asPathWithoutFragmentRegex = /.*(?=#.*)|.*/;
  const pathMatch = asPath.match(asPathWithoutFragmentRegex) ?? [''];

  const relevantUrl =
    url ??
    (anchor &&
      `${window.location.origin}${process.env.basePath ?? ''}${
        pathMatch[0]
      }#${anchor}`);

  if (!relevantUrl) {
    return null;
  }

  const onCopy = () => {
    const hasCopied = pathMatch && copy(relevantUrl);
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
      <LinkOutlined
        css={{ color: 'gray' }}
        className={`${className ? className : ''} no-print`}
        onClick={onCopy}
      />
    </>
  );
};
