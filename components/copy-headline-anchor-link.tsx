import { useRouter } from '@/lib/next-use-router';
import { LinkOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { PropsWithStyle } from 'index';
import React from 'react';
import useTranslation from 'next-translate/useTranslation';

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
  const { t } = useTranslation('common');

  const cleanPath = asPath.replace(/(\?q=.*?(?=#|$))|(#.*)/g,'');

  const relevantUrl =
    url ??
    (anchor &&
      `${window.location.origin}${process.env.basePath ?? ''}${
        cleanPath
      }#${anchor}`);

  if (!relevantUrl) {
    return null;
  }

  const onCopy = () => {
    const hasCopied = cleanPath && copy(relevantUrl);
    const messageProps: { content: string; type: 'success' | 'error' } =
      hasCopied
        ? {
            type: 'success',
            content: t('link-copied'),
          }
        : {
            type: 'error',
            content: t('error-copying-link'),
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
