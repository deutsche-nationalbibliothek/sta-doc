import { WikibasePointerValue } from '@/types/parsed/entity';
import { notification } from 'antd';
import React, { useEffect } from 'react';

const Context = React.createContext({ name: 'Default' });

interface EntityAnnotationProps {
  annotation: WikibasePointerValue;
}
export const EntityAnnotation: React.FC<EntityAnnotationProps> = ({
  annotation,
}) => {
  const [api, contextHolder] = notification.useNotification({ maxCount: 1 });
  useEffect(() => {
    api.info({
      message: undefined,
      description: (
        <Context.Consumer>{() => annotation.label}</Context.Consumer>
      ),
      placement: 'bottomRight',
      duration: null,
    });
  }, [annotation.label, api]);

  return <>{contextHolder}</>;
};
