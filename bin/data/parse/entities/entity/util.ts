import slugify from 'slugify';
import { PreMappedStatement } from '.';
import { Headline } from '../../../../../types/headline';
import { Namespace } from '../../../../../types/namespace';
import {
  StatementValue,
  StringValue,
  StringGroup,
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
    const groupReducer = (acc: StringGroup[], value: StringValue) => {
      const { itemType, ...otherValues } = value;
      if (
        acc.length > 0 &&
        acc[acc.length - 1].itemType === (itemType || 'default')
      ) {
        const prevAcc = [...acc];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const lastEntry = prevAcc.pop() as StringGroup;
        const stringValueContainers: StringGroup[] = [
          ...prevAcc,
          {
            ...lastEntry,
            values: lastEntry
              ? [...lastEntry.values, otherValues]
              : [otherValues],
          } as StringGroup,
        ];
        return stringValueContainers;
      } else {
        const stringGroup: StringGroup = {
          itemType: itemType || 'default',
          values: [otherValues as StringValue],
        };
        const stringGroups: StringGroup[] = [...acc, stringGroup];
        return stringGroups;
      }
    };
    const groupedContent = stringValues.reduce(
      groupReducer,
      [] as StringGroup[]
    );

    return groupedContent;
  };
  if (val && 'stringGroups' in val && val.stringGroups) {
    return {
      ...val,
      stringGroups: stringTransform(val.stringGroups),
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
