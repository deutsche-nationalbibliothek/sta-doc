import { Segmented } from 'antd';
import {
  FetchingParam,
  useFetchingQueryParams,
} from '@/hooks/fetch-query-params-provider';

export default function SegmentedControl() {
  const { query, setFetchingParam } = useFetchingQueryParams();

  const options = [
    { value: 'default', label: 'No Mode' },
    { value: FetchingParam.live, label: 'Live' },
    { value: FetchingParam.prod, label: 'Prod' },
  ];

  return (
    <Segmented
      options={options}
      onChange={(value) => {
        setFetchingParam(
          value === 'default' ? undefined : (value as FetchingParam)
        );
      }}
    />
  );
}
