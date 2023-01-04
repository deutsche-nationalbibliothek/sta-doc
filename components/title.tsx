import { Headline } from '@/types/headline';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';
import { useHover } from 'react-use';
import { CopyHeadlineAnchorLink } from './copy-headline-anchor-link';

interface LocalTitleProps extends Omit<TitleProps, 'level' | 'id' | 'style'> {
  headline: Headline;
}

// todo, make sure property is not blacklisted before calling
export const Title: React.FC<LocalTitleProps> = (props) => {
  const { headline, children, ...otherProps } = props;
  if (!headline) {
    return <>No Headline</>;
  }
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
                position: 'relative',
                left: 0,
                marginLeft: -18 - 15,
                fontSize: 20 - level,
                visibility: hovered && level !== 1 ? 'visible' : 'hidden',
                padding: '5px 0px 5px 15px',
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
