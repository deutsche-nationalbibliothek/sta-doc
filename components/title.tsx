import { QueryHighlighter } from '@/lib/highlighter';
import { Headline } from '@/types/headline';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';
import { useHover } from 'react-use';
import { CopyHeadlineAnchorLink } from './copy-headline-anchor-link';

interface LocalTitleProps extends Omit<TitleProps, 'level' | 'id' | 'style'> {
  headline: Headline;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { headline, children, ...otherProps } = props;
  const { level, title, key } = headline;

  const localLevel = (level <= 5 ? level : 5) as 1 | 2 | 3 | 4 | 5;
  const levelsTooHigh = level - 4;
  const style = levelsTooHigh > 0 ? { fontSize: 18 - levelsTooHigh } : {};
  const iconSize = 20 - level * 1.2;

  return (
    <>
      {
        useHover((hovered) => (
          <div
            css={{
              marginBottom: '0.5em',
              marginLeft: -30,

              '@media print': {
                marginLeft: 0,
              },
            }}
          >
            <CopyHeadlineAnchorLink
              style={{
                position: 'relative',
                padding: `0px 0px 5px 15px`,
                visibility: hovered && level !== 1 ? 'visible' : 'hidden',
                fontSize: iconSize,
              }}
              anchor={key}
            />
            <Typography.Title
              data-actual-level={level}
              style={{
                ...style,
                display: 'inline-block',
                marginBottom: 0,
              }}
              id={key}
              level={localLevel}
              {...otherProps}
            >
              {children ?? <QueryHighlighter textToHighlight={title} />}
            </Typography.Title>
          </div>
        ))[0]
      }
    </>
  );
};
