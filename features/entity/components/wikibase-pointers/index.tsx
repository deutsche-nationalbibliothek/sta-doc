import { WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import React from 'react';
import { Examples } from '../examples';
import { compact, groupBy } from 'lodash';
import { WikibasePointer } from './wikibase-pointer';
import { WikibaseLink } from './wikibase-link';
import { UnorderedList } from '@/components/unordered-list';
import { GndImplementations } from '../gnd-implementation';

interface WikibasePointersProps {
  wikibasePointers: WikibasePointerValue[];
  property: Property;
}

export const WikibasePointers: React.FC<WikibasePointersProps> = ({
  wikibasePointers,
  property,
}) => {
  const isSeeItemOrProperty =
    property === Property['see-(Item)'] ||
    property === Property['see-(property)'];

  const propSpecificGroups =
    property === Property.Elements ||
    property === Property.Subfields ||
    property === Property['data-fields'] ||
    property === Property['example(s)'] || 
    property === Property['Implementation-in-the-GND'];

  const wikibasePointerGroups = groupBy(wikibasePointers, (wikibasePointer) =>
    propSpecificGroups &&
    ('headline' in wikibasePointer ||
      'references' in wikibasePointer ||
      ('qualifiers' && 'headline' in wikibasePointer) ||
      'embedded' in wikibasePointer)
      ? 'extras'
      : 'simples'
  );

  return (
    <>
      {wikibasePointerGroups.extras && wikibasePointerGroups.extras.length && (
        <>
          {property === Property['example(s)'] ||
          property === Property['Implementation-in-the-GND'] ? (
            <>
              {property === Property['example(s)'] ? (
                <Examples
                  examples={compact(
                    wikibasePointerGroups.extras.map((w) => w.embedded)
                  )}
                />
              ) : (
                <GndImplementations
                  implementations={compact(
                    wikibasePointerGroups.extras.map((w) => w.embedded)
                  )}
                />
              )}
            </>
          ) : (
            wikibasePointerGroups.extras.map((wikibasePointer, index) => (
              <React.Fragment key={index}>
                <WikibasePointer
                  wikibasePointer={wikibasePointer}
                  property={property}
                  isSeeItemOrProperty={isSeeItemOrProperty}
                />
                {index !== wikibasePointerGroups.extras.length - 1 && <br />}
              </React.Fragment>
            ))
          )}
        </>
      )}
      {wikibasePointerGroups.simples &&
        wikibasePointerGroups.simples.length &&
        (wikibasePointerGroups.simples.length > 1 ? (
          isSeeItemOrProperty ? (
            wikibasePointerGroups.simples.map((wikibasePointer, index) => (
              <React.Fragment key={index}>
                <WikibaseLink
                  showArrow={isSeeItemOrProperty}
                  wikibasePointer={wikibasePointer}
                />
                {index !== wikibasePointerGroups.simples.length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            <UnorderedList>
              <>
                {wikibasePointerGroups.simples.map((wikibasePointer, index) => (
                  <li key={index}>
                    <React.Fragment key={index}>
                      <WikibasePointer
                        wikibasePointer={wikibasePointer}
                        property={property}
                        isSeeItemOrProperty={isSeeItemOrProperty}
                      />
                    </React.Fragment>
                  </li>
                ))}
              </>
            </UnorderedList>
          )
        ) : (
          <WikibaseLink
            showArrow={isSeeItemOrProperty}
            wikibasePointer={wikibasePointerGroups.simples[0]}
          />
        ))}
    </>
  );
};
