import slugify from 'slugify';
import { PreMappedStatement } from '.';
import { Headline } from '../../../../../types/headline';
import { Namespace } from '../../../../../types/namespace';
import {
  Maybe,
  StatementValue,
  StringValue,
  StringValueContainer,
} from '../../../../../types/parsed/entity';

export type AddHeadline = (
  title: string,
  level: number,
  ignore?: boolean,
  namespace?: Namespace | undefined
) => {
  title: string;
  key: string;
  level: number;
};

export const headlinesParser = (headlines: Headline[], noHeadline = false) => {
  const addHeadline = (
    title: string,
    level: number,
    ignore = false,
    namespace?: Namespace
  ) => {
    const isHeadlineAlreadyInCollection = (key: string) =>
      headlines.some((headline) => headline.key === key);

    const findAvailableKey = (key: string, index: number): string => {
      const nextHeadline = `${key}-${index}`;
      if (isHeadlineAlreadyInCollection(nextHeadline)) {
        return findAvailableKey(key, index + 1);
      } else {
        return nextHeadline;
      }
    };

    const sluggedLabel = slugify(title);
    const headline = {
      title,
      key: isHeadlineAlreadyInCollection(sluggedLabel)
        ? findAvailableKey(sluggedLabel, 1)
        : sluggedLabel,
      level,
    };

    if (!ignore && !noHeadline) {
      headlines.push(namespace ? { ...headline, namespace } : headline);
    }

    return headline;
  };
  return {
    addHeadline,
    // headlines,
  };
};

export const stringMapper = (val: PreMappedStatement): StatementValue => {
  const stringTransform = (stringValues: StringValue[]) => {
    const groupReducer = (acc: StringValueContainer[], value: StringValue) => {
      const { itemType, ...otherValues } = value;
      if (
        acc.length > 0 &&
        acc[acc.length - 1].itemType === (itemType || 'default')
      ) {
        const prevAcc = [...acc];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const lastEntry = prevAcc.pop() as StringValueContainer;
        const stringValueContainers: StringValueContainer[] = [
          ...prevAcc,
          {
            ...lastEntry,
            values: lastEntry
              ? [...lastEntry.values, otherValues]
              : [otherValues],
          } as StringValueContainer,
        ];
        return stringValueContainers;
      } else {
        const jjj: StringValueContainer = {
          itemType: itemType || 'default',
          values: [otherValues as Maybe<StringValue>],
        };
        const jj: StringValueContainer[] = [...acc, jjj];
        return jj;
      }
    };
    const groupedContent = stringValues.reduce(
      groupReducer,
      [] as StringValueContainer[]
    );

    return groupedContent;
  };
  if (val && 'string' in val && val.string) {
    return {
      ...val,
      string: stringTransform(val.string),
    };
  } else {
    return val as unknown as StatementValue;
  }
  // return val && 'string' in val && val.string
  //   ? {
  //       ...val,
  //       string: stringTransform(val.string),
  //     }
  //   : (val as unknown as Statement);
};
