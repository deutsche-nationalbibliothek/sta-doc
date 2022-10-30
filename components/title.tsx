import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';

// todo handle level props higher than 4
interface LocalTitleProps extends TitleProps {
  level: number;
}

export const Title: React.FC<LocalTitleProps> = (props) => {
  const { level, ...otherProps } = props;
  const localLevel = level <= 4 ? level : 4;
  return <Typography.Title data-actual-level={level} level={localLevel} {...otherProps} />;
};
