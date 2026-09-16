import { useState } from 'react';
import { Segmented } from 'antd';
import { FetchingParam } from '@/hooks/fetch-query-params-provider';

export default function SegmentedControl() {
  const [value, setValue] = useState<string>('prod');

  const options = [
    { value: undefined, label: 'Default' },
    { value: FetchingParam.live, label: 'Live' },
    { value: FetchingParam.prod, label: 'Prod' },
  ];

  return <Segmented options={options} value={value} onChange={setValue} />;
}
