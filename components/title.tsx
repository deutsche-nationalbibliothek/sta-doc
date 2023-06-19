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

const maxLevel = 5;

// prefix to deactivate default scroll to anchor: https://stackoverflow.com/a/67477942
export const titleIdPrefix = 'title-';

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { headline, children, ...otherTitleProps } = props;
  const { level, title, key } = headline;

  const localLevel = (level <= maxLevel ? level : maxLevel) as
    | 1
    | 2
    | 3
    | 4
    | 5;
  const levelsTooHigh = level - maxLevel;
  const style =
    levelsTooHigh > 0 ? { fontSize: `${18 - levelsTooHigh}px !important` } : {};
  const iconSize = 20 - level * 1.2;

  return (
    <>
      {
        useHover((hovered) => (
          <div
            css={{
              position: 'relative',
              '@media print': {
                marginLeft: 0,
              },
            }}
          >
            <Typography.Title
              data-actual-level={level}
              css={{
                ...style,
                display: 'inline-block',
              }}
              id={`${titleIdPrefix}${key}`}
              level={localLevel}
              {...otherTitleProps}
            >
              {children ?? <QueryHighlighter textToHighlight={title} />}
            </Typography.Title>
            <CopyHeadlineAnchorLink
              css={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                margin: 'auto',
                paddingBottom: '0.5em',
                visibility: hovered && level !== 1 ? 'visible' : 'hidden',
                fontSize: iconSize,
              }}
              anchor={key}
            />
          </div>
        ))[0]
      }
    </>
  );
};
