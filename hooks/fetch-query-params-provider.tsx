import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQueryParam } from 'use-query-params';
import {
  editorFeatures,
} from '@/lib/sta-editor-features';


declare global {
  interface Window {
    data?: (fetchingParam: FetchingParam) => void;
  }
}

type UseQueryParamSetter<T> = ReturnType<typeof useQueryParam<T>>[1];

export enum FetchingParam {
  test = 'test',
  live = 'live',
  prod = 'prod',
}

/** PostgreSQL ReadStage for sta-doc view (?stage=), not Wikibase ?live=. */
export type ReadStageParam = 'working' | 'preview' | 'live';

const READ_STAGES = new Set<string>(['working', 'preview', 'live']);

export function isReadStageParam(value: string | null | undefined): value is ReadStageParam {
  return value != null && READ_STAGES.has(value);
}

interface RouterQuery {
  live: FetchingParam | undefined;
  stage: ReadStageParam | undefined;
  edit: boolean;
  locale: string;
  query: string | undefined;
}

type FetchingQueryParamsContext = {
  query: RouterQuery;
};

export type QueryParam = string;

// param is only used for typing context
const FetchingQueryParamsContext = createContext(
  {} as FetchingQueryParamsContext
);

export default function FetchingQueryParamsProvider({
  children,
}: {
  children: JSX.Element;
}) {
  // const locale = useRouter().locale;
  const [live, setLive] = useQueryParam('live') as [
    FetchingParam | undefined,
    UseQueryParamSetter<FetchingParam | undefined>,
  ];

  const [stageRaw] = useQueryParam('stage') as [
    string | undefined,
    UseQueryParamSetter<string | undefined>,
  ];
  const stage = isReadStageParam(stageRaw) ? stageRaw : undefined;

  const [editRaw] = useQueryParam('edit') as [
    string | undefined,
    UseQueryParamSetter<string | undefined>,
  ];
  const edit = editRaw === '1' || editRaw === 'true';

  const effectiveStage =
    editorFeatures.postgresReadEnabled && stage ? stage : undefined;
  const effectiveEdit =
    editorFeatures.editorEnabled && edit ? edit : false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('data' in window)) {
        window.data = (fetchingParam?: FetchingParam) => setLive(fetchingParam);
      }
    }
  }, [setLive]);

  const query = useMemo(() => {
    const queryObj: Partial<RouterQuery> = {};

    if (live) {
      queryObj.live = live;
    }

    if (effectiveStage) {
      queryObj.stage = effectiveStage;
    }

    if (effectiveEdit) {
      queryObj.edit = effectiveEdit;
    }

    return queryObj as RouterQuery;
  }, [live, effectiveStage, effectiveEdit]);

  return (
    <FetchingQueryParamsContext.Provider
      value={{
        query
      }}
    >
      {children}
    </FetchingQueryParamsContext.Provider>
  );
}

export const useFetchingQueryParams = () =>
  useContext(FetchingQueryParamsContext);
