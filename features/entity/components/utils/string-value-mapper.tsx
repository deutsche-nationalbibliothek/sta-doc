import { StringValue, StringValueContainer } from '@/types/entity';
import { Fragment } from 'react';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';
import { Guard } from './guard';

interface GenericStringValueMapperProps {
  stringValueContainer: StringValueContainer;
  children: (
    stringValue: StringValue,
    qualifiers: JSX.Element,
    references: JSX.Element
  ) => JSX.Element;
  headerLevel: number;
}

export const GenericStringValueMapper: React.FC<
  GenericStringValueMapperProps
> = ({ stringValueContainer, children, headerLevel }) => (
  <>
    {stringValueContainer.values.map((stringValue, index) => (
      <Fragment key={index}>
        <Guard value={stringValue}>
          {(stringValue) => (
            <>
              {children(
                stringValue,
                stringValue.qualifiers && (
                  <Qualifiers
                    headerLevel={headerLevel}
                    qualifiers={stringValue.qualifiers}
                  />
                ),
                stringValue.references && (
                  <References
                    headerLevel={headerLevel}
                    references={stringValue.references}
                  />
                )
              )}
            </>
          )}
        </Guard>
      </Fragment>
    ))}
  </>
);
