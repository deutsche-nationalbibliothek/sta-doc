import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';
import slugify from 'slugify';

// @ts-ignore
interface LocalTitleProps extends TitleProps {
  level: number;
  label: string;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { level, label, children, ...otherProps } = props;
  const localLevel = (level <= 4 ? level : 4) as 1 | 2 | 3 | 4;
  const levelsTooHigh = level - 4;
  const style = levelsTooHigh > 0 ? { fontSize: 18 - levelsTooHigh } : {};

  return (
    <Typography.Title
      data-actual-level={level}
      style={{
        ...style,
        paddingTop: '3em',
        marginTop: '-2em',
      }}
      id={slugify(label)}
      level={localLevel}
      {...otherProps}
    >
      {children ?? label}
    </Typography.Title>
  );
};
