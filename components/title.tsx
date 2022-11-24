import { Headline } from '@/types/headline';
import { CopyOutlined } from '@ant-design/icons';
import { message, Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import React from 'react';
import { useHover } from 'react-use';

interface LocalTitleProps extends Omit<TitleProps, 'level' | 'id' | 'style'> {
  headline: Headline;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { headline, children, ...otherProps } = props;
  const { level, title, key } = headline;
  const router = useRouter();

  const localLevel = (level <= 4 ? level : 4) as 1 | 2 | 3 | 4;
  const levelsTooHigh = level - 4;
  const style = levelsTooHigh > 0 ? { fontSize: 18 - levelsTooHigh } : {};

  const onCopy = () => {
    const hasCopied = copy(
      `${window.location.origin}${router.asPath.match(/.*(?=#.*)|.*/)[0]
      }#${key}`
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
      {
        useHover((hovered) => (
          <div>
            {
              <CopyOutlined
                style={{
                  position: 'relative',
                  left: 0,
                  marginLeft: -18 - 10,
                  fontSize: 20 - level,
                  visibility: hovered && level !== 1 ? 'visible' : 'hidden',
                  padding: '5px 0px 5px 10px',
                }}
                onClick={onCopy}
              />
            }
            <Typography.Title
              data-actual-level={level}
              style={{
                ...style,
                display: 'inline-block',
                paddingTop: 10,
                // marginTop: -85,
              }}
              id={key}
              level={localLevel}
              {...otherProps}
            >
              {children ?? title}
            </Typography.Title>
          </div>
        ))[0]
      }
    </>
  );
};
