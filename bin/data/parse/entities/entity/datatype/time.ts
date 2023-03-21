import { TimeValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseTimeValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
}

export const parseTimeValue = ({
  keyAccessOcc,
}: ParseTimeValue): Omit<TimeValue, keyof CommonValue> => {
  return {
    value: keyAccessOcc<string>('datavalue', 'value', 'time'),
  };
};
