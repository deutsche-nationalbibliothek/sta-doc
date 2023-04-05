import { Item } from '@/types/item';
import { WikibasePointerValue } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import React from 'react';
import { EntityLink } from '../preview/link';
import { MissingValueGuard } from '../missing-value';

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
        <EntityLink {...wikibasePointer}>
          <>
            <ArrowRightOutlined />
            {wikibasePointer.label}
          </>
        </EntityLink>
      ) : (
        <EntityLink {...wikibasePointer} />
      )}
    </MissingValueGuard>
  );
};
