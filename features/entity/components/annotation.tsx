import { WikibasePointerValue } from '@/types/parsed/entity';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { WikibaseLink } from './wikibase-pointers/wikibase-link';
import { WikibaseStatementLink } from './wikibase-statement-link';

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
        <Context.Consumer>
          {() => (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <WikibaseLink wikibasePointer={annotation} />
              {annotation.statementId && (
                <WikibaseStatementLink statementId={annotation.statementId} />
              )}
            </span>
          )}
        </Context.Consumer>
      ),
      placement: 'bottomRight',
      duration: null,
    });
  }, [annotation, api]);

  return <>{contextHolder}</>;
};
