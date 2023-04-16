import { Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { compact } from 'lodash';
import { Statements } from '../statements';
import { Divider, theme } from 'antd';

interface EntityPreviewContentProps {
  entity: Entity;
}

export const EntityPreviewContent: React.FC<EntityPreviewContentProps> = ({
  entity,
}) => {
  const { token } = theme.useToken();

  const statements = [
    ...entity.statements.header,
    ...entity.statements.table,
    ...entity.statements.body,
  ];

  const definition = compact([
    statements.find((s) => s.property === Property.definition),
  ]);

  return definition.length ? (
    <div
      css={{
        borderLeft: `4px solid ${token.colorPrimary}`,
        backgroundColor: token.colorPrimaryBorder,
        padding: '0 9px 0 5px',
        // borderRadius: `${token.borderRadiusOuter}px !important`,
      }}
    >
      <Divider />
      <Statements statements={definition} />
      <Divider />
    </div>
  ) : null;
};
