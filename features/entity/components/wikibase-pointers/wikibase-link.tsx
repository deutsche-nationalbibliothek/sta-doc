import { Item } from '@/types/item';
import { WikibasePointerValue } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import React from 'react';
import { EntityLink } from '../preview/link';
import { MissingValueGuard } from '../missing-value';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';

interface WikibaseLinkProps {
  wikibasePointer: WikibasePointerValue;
  showArrow?: boolean;
}
export const WikibaseLink = ({
  wikibasePointer,
  showArrow,
}: WikibaseLinkProps) => {
  if (isPropertyBlacklisted(wikibasePointer.id as Item)) {
    return null;
  }
  return (
    <MissingValueGuard data={wikibasePointer}>
      {showArrow ? (
        <NamespaceThemeConfigProvider namespace={wikibasePointer.namespace}>
          <EntityLink {...wikibasePointer}>
            <>
              <ArrowRightOutlined css={{ marginRight: '0.2em' }} />{' '}
              {wikibasePointer.label}
            </>
          </EntityLink>
        </NamespaceThemeConfigProvider>
      ) : (
        <EntityLink {...wikibasePointer} />
      )}
    </MissingValueGuard>
  );
};
