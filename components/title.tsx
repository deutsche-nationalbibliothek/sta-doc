import { Headline } from '@/types/headline';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';

interface LocalTitleProps extends Omit<TitleProps, 'level' | 'id' | 'style'> {
  headline: Headline;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { headline, children, ...otherProps } = props;
  const { level, label, key } = headline;

  const localLevel = (level <= 4 ? level : 4) as 1 | 2 | 3 | 4;
  const levelsTooHigh = level - 4;
  const style = levelsTooHigh > 0 ? { fontSize: 18 - levelsTooHigh } : {};

  return (
    <Typography.Title
      data-actual-level={level}
      style={{
        ...style,
        paddingTop: 100,
        marginTop: -85,
      }}
      id={key}
      level={localLevel}
      {...otherProps}
    >
      {children ?? label}
    </Typography.Title>
  );
};
