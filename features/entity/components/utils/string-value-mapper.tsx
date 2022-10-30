import { StringValue, StringValueContainer } from '@/types/entity';
import { Fragment } from 'react';
import { Guard } from './guard';

interface GenericStringValueMapperProps {
  stringValueContainer: StringValueContainer;
  children: (stringValue: StringValue) => JSX.Element;
}

export const GenericStringValueMapper: React.FC<
  GenericStringValueMapperProps
> = ({ stringValueContainer, children }) => (
  <>
    {stringValueContainer.values.map((stringValue, index) => (
      <Fragment key={index}>
        <Guard value={stringValue}>{children}</Guard>
      </Fragment>
    ))}
  </>
);
