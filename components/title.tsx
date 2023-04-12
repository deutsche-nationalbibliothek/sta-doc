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

  const localLevel = (level <= 4 ? level : 4) as 1 | 2 | 3 | 4;
  const levelsTooHigh = level - 4;
  const style = levelsTooHigh > 0 ? { fontSize: 18 - levelsTooHigh } : {};
  const iconSize = 20 - level;

  return (
    <>
      {
        useHover((hovered) => (
          <div
          // style={{ display: 'flex', alignItems: 'center' }}
          >
            <CopyHeadlineAnchorLink
              style={{
                marginLeft: -35,
                padding: '15px 0px 15px 15px',
                fontSize: iconSize,
                visibility: hovered && level !== 1 ? 'visible' : 'hidden',
              }}
              anchor={key}
            />
            <Typography.Title
              data-actual-level={level}
              style={{
                ...style,
                display: 'inline-block',
                // paddingTop: 8,
                marginTop: -85,
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
