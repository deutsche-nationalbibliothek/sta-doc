import { TimeValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseTimeValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
}

export const parseTimeValue = ({
  keyAccessOcc,
}: ParseTimeValue): Omit<TimeValue, keyof CommonValue> => {
  const snakType = keyAccessOcc('snaktype');
  const value =
    snakType === 'novalue'
      ? 'Kein Wert'
      : snakType === 'somevalue'
      ? 'Fehlender Wert'
      : keyAccessOcc<string>('datavalue', 'value', 'time');

  return {
    value,
  };
};
