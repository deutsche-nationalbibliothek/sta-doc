import { Title } from '@/components/title';
import { WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import React from 'react';
import { EntityLink } from '../preview/link';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';
import { MissingValueGuard } from '../missing-value';
import { WikibaseLink } from './wikibase-link';
import { Embedded } from '../embedded';

interface WikibasePointerProps {
  wikibasePointer: WikibasePointerValue;
  isSeeItemOrProperty?: boolean;
  property?: Property;
}

export const WikibasePointer: React.FC<WikibasePointerProps> = ({
  wikibasePointer,
  isSeeItemOrProperty = false,
  property,
}) => {
  return (
    <MissingValueGuard data={wikibasePointer}>
      <React.Fragment>
        {wikibasePointer.headline ? (
          <Title headline={wikibasePointer.headline}>
            <EntityLink {...wikibasePointer}>
              {wikibasePointer.label}{' '}
            </EntityLink>
          </Title>
        ) : (
          <WikibaseLink
            showArrow={isSeeItemOrProperty}
            wikibasePointer={wikibasePointer}
          />
        )}
        {wikibasePointer.references && (
          <References references={wikibasePointer.references} />
        )}
        {wikibasePointer.qualifiers && (
          <Qualifiers
            qualifiers={
              property && property === Property.Subfields
                ? wikibasePointer.qualifiers.filter(
                    (qualifier) => qualifier.property !== Property.Repetition
                  )
                : wikibasePointer.qualifiers
            }
          />
        )}
        {wikibasePointer.embedded && (
          <Embedded entity={wikibasePointer.embedded} />
        )}
      </React.Fragment>
    </MissingValueGuard>
  );
};
