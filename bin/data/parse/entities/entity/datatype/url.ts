import { UrlValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseUrlValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
}

export const parseUrlValue = ({
  keyAccessOcc,
}: ParseUrlValue): Omit<UrlValue, keyof CommonValue> => {
  const snakType = keyAccessOcc('snaktype');
  const value =
    snakType === 'novalue'
      ? 'Kein Wert'
      : snakType === 'somevalue'
      ? 'Fehlender Wert'
      : keyAccessOcc<string>('datavalue', 'value');
  return {
    value,
  };
};
