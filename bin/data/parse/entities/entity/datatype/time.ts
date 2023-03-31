import { TimeValue, CommonValue } from '../../../../../../types/parsed/entity';

interface ParseTimeValue {
  keyAccessOcc: <T>(...keys: string[]) => T;
  isMissingValue: boolean;
}

export const parseTimeValue = ({
  keyAccessOcc,
  isMissingValue,
}: ParseTimeValue): Omit<TimeValue, keyof CommonValue> => {
  return {
    value: !isMissingValue ? keyAccessOcc<string>('datavalue', 'value') : '',
  };
};
