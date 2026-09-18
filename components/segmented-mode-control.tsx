import { Segmented } from 'antd';
import {
  FetchingParam,
  useFetchingQueryParams,
} from '@/hooks/fetch-query-params-provider';
import { Span } from 'next/dist/trace';

function SegmentedControlLabel({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  return (
    <span css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {isActive && (
        <div
          css={{
            width: 8,
            height: 8,
            borderRadius: 50,
            backgroundColor: 'red',
            // fontWeight: 700,
          }}
        />
      )}
      {label}
    </span>
  );
}

export default function SegmentedControl() {
  const { query, setFetchingParam } = useFetchingQueryParams();

  const currentValue = query.live ?? 'default';

  const options = [
    {
      value: 'default',
      label: <SegmentedControlLabel label="NO MODE" isActive={false} />,
    },
    {
      value: FetchingParam.prod,
      label: (
        <SegmentedControlLabel
          label="PROD"
          isActive={currentValue === FetchingParam.prod}
        />
      ),
    },
    {
      value: FetchingParam.live,
      label: (
        <SegmentedControlLabel
          label="LIVE"
          isActive={currentValue === FetchingParam.live}
        />
      ),
    },
  ];

  return (
    <Segmented
      options={options}
      value={currentValue}
      onChange={(value) => {
        setFetchingParam(
          value === 'default' ? undefined : (value as FetchingParam)
        );
      }}
    />
  );
}
