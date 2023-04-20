import { WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import React from 'react';
import { Examples } from '../examples';
import { compact } from 'lodash';
import { WikibasePointer } from './wikibase-pointer';
import { WikibaseLink } from './wikibase-link';
import { UnorderedList } from '@/components/unorderd-list';

interface WikibasePointersProps {
  wikibasePointers: WikibasePointerValue[];
  property: Property;
  hideLinkLabels?: boolean;
}

export const WikibasePointers: React.FC<WikibasePointersProps> = ({
  wikibasePointers,
  property,
  hideLinkLabels,
}) => {
  const isSeeItemOrProperty =
    property === Property['see-(Item)'] ||
    property === Property['see-(property)'];

  const isSimpleList =
    wikibasePointers.length > 1 &&
    wikibasePointers.every(
      (wikibasePointer) =>
        !(
          'headline' in wikibasePointer ||
          'references' in wikibasePointer ||
          'qualifiers' in wikibasePointer ||
          'embedded' in wikibasePointer
        )
    );

  return isSimpleList ? (
    <UnorderedList>
      <>
        {wikibasePointers.map((wikibasePointer, index) => (
          <li key={index}>
            <WikibaseLink
              showArrow={isSeeItemOrProperty}
              wikibasePointer={wikibasePointer}
              hideLinkLabels={hideLinkLabels}
            />
          </li>
        ))}
      </>
    </UnorderedList>
  ) : (
    <>
      {property === Property['example(s)'] ? (
        <Examples examples={compact(wikibasePointers.map((w) => w.embedded))} />
      ) : (
        wikibasePointers.map((wikibasePointer, index) => (
          <WikibasePointer
            wikibasePointer={wikibasePointer}
            key={index}
            property={property}
            isSeeItemOrProperty={isSeeItemOrProperty}
            hideLinkLabels={hideLinkLabels}
          />
        ))
      )}
    </>
  );
};
