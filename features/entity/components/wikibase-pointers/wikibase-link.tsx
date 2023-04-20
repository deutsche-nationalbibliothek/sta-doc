import { Item } from '@/types/item';
import { WikibasePointerValue } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined, LogoutOutlined } from '@ant-design/icons';
import { EntityLink } from '../preview/link';
import { MissingValueGuard } from '../missing-value';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';

interface WikibaseLinkProps {
  wikibasePointer: WikibasePointerValue;
  showArrow?: boolean;
  hideLinkLabels?: boolean;
}
export const WikibaseLink = ({
  wikibasePointer,
  showArrow,
  hideLinkLabels = false,
}: WikibaseLinkProps) => {
  if (isPropertyBlacklisted(wikibasePointer.id as Item)) {
    return null;
  }
  return (
    <MissingValueGuard data={wikibasePointer}>
      <NamespaceThemeConfigProvider namespace={wikibasePointer.namespace}>
        <EntityLink {...wikibasePointer}>
          {hideLinkLabels ? (
            <LogoutOutlined />
          ) : (
            <>
              {showArrow && <ArrowRightOutlined />}
              {wikibasePointer.label}
            </>
          )}
        </EntityLink>
      </NamespaceThemeConfigProvider>
    </MissingValueGuard>
  );
};
