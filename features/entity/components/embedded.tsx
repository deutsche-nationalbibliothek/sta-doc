import { Collapse } from '@/components/collapse';
import { Entity } from '@/types/parsed/entity';
import { EntityDetails } from './details';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';

interface EmbeddedProps {
  entity: Entity;
}

export const Embedded: React.FC<EmbeddedProps> = ({ entity }) => {
  return (
    <NamespaceThemeConfigProvider namespace={entity.namespace}>
      <Collapse
        labelOpen={entity.contextOfUseLabel}
        labelClosed={entity.contextOfUseLabel}
      >
        <EntityDetails embedded entity={entity} />
      </Collapse>
    </NamespaceThemeConfigProvider>
  );
};
