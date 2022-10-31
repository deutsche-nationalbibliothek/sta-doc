import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';
import slugify from 'slugify';

// todo handle level props higher than 4
interface LocalTitleProps extends TitleProps {
  level: number;
  label: string;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { level, label, children, ...otherProps } = props;
  const localLevel = level <= 4 ? level : 4;
  return (
    <Typography.Title
      data-actual-level={level}
      id={slugify(label)}
      level={localLevel}
      {...otherProps}
    >
      {children ?? label}
    </Typography.Title>
  );
};
