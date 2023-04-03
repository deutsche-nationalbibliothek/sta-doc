import { UrlValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseUrlValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
  isMissingValue: boolean;
}

export const parseUrlValue = ({
  keyAccessOcc,
  isMissingValue,
}: ParseUrlValue): Omit<UrlValue, keyof CommonValue> => {
  return {
    value: !isMissingValue ? keyAccessOcc<string>('datavalue', 'value') : '',
  };
};
