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
import { WikibaseStatementLink } from '../wikibase-statement-link';

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
  const statementLink = wikibasePointer.statementId ? (
    <WikibaseStatementLink statementId={wikibasePointer.statementId} />
  ) : null;

  return (
    <MissingValueGuard data={wikibasePointer}>
      <React.Fragment>
        {wikibasePointer.headline ? (
          <Title headline={wikibasePointer.headline}>
            <EntityLink {...wikibasePointer}>
              {wikibasePointer.label}{' '}
            </EntityLink>
            {statementLink}
          </Title>
        ) : (
          <>
            <WikibaseLink
              showArrow={isSeeItemOrProperty}
              wikibasePointer={wikibasePointer}
            />
            {statementLink}
          </>
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
