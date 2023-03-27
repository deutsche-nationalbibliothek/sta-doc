import { StringGroup, StringValue } from '@/types/parsed/entity';
import { Fragment } from 'react';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';

interface GenericStringValueMapperProps {
  stringValueContainer: StringGroup;
  children: (
    stringValue: StringValue,
    qualifiers: JSX.Element | undefined,
    references: JSX.Element | undefined,
    index: number
  ) => JSX.Element;
}

export const GenericStringValueMapper: React.FC<
  GenericStringValueMapperProps
> = ({ stringValueContainer, children }) => (
  <>
    {stringValueContainer.values.map((stringValue, index) => (
      <Fragment key={index}>
        {children(
          stringValue,
          stringValue.qualifiers ? (
            <Qualifiers qualifiers={stringValue.qualifiers} />
          ) : undefined,
          stringValue.references ? (
            <References references={stringValue.references} />
          ) : undefined,
          index
        )}
      </Fragment>
    ))}
  </>
);
