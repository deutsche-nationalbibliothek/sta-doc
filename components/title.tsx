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

  return (
    <>
      {
        useHover((hovered) => (
          <div>
            <CopyHeadlineAnchorLink
              style={{
                marginLeft: -35,
                padding: '20px 0px 15px 15px',
                fontSize: 20 - level,
                visibility: hovered && level !== 1 ? 'visible' : 'hidden',
              }}
              anchor={key}
            />
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
