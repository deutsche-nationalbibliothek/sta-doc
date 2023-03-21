import { UrlValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseUrlValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
}

export const parseUrlValue = ({
  keyAccessOcc,
}: ParseUrlValue): Omit<UrlValue, keyof CommonValue> => {
  return {
    value: keyAccessOcc<string>('datavalue', 'value'),
  };
};
