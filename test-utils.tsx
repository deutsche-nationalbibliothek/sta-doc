import { render } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import HeadlinesProvider from './hooks/headlines';
import Layout from './components/layout';
import IsLoadingContextProvider from './hooks/use-loading-state';
import { CodingsPreferencesProvider } from './hooks/use-codings-preference';
import { NamespaceProvider } from './hooks/use-namespace';
import deDE from 'antd/lib/locale/de_DE';
import InitialHeadlinesProvider from './hooks/initial-headlines';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
import FetchingQueryParamProvider from './hooks/fetching-query-param-provider';
import ApplicationProfileQueryParamProvider from './hooks/use-application-profile-query-param-provider';
import { ConfigProvider } from 'antd';
// import InitialHeadlinesProvider from './hooks/initial-headlines';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const genericRender = (component: ReactElement, name: string) => {
  const wrapper = ({ children }: { children?: ReactNode }) => {
    return (
      <>
        <ConfigProvider locale={deDE}>
          <QueryParamProvider adapter={NextAdapter}>
            <ApplicationProfileQueryParamProvider>
              <FetchingQueryParamProvider>
                <NamespaceProvider>
                  <InitialHeadlinesProvider>
                    <HeadlinesProvider>
                      <IsLoadingContextProvider>
                        <CodingsPreferencesProvider>
                          <Layout>
                            <MemoryRouterProvider>
                              {children}
                            </MemoryRouterProvider>
                          </Layout>
                        </CodingsPreferencesProvider>
                      </IsLoadingContextProvider>
                    </HeadlinesProvider>
                  </InitialHeadlinesProvider>
                </NamespaceProvider>
              </FetchingQueryParamProvider>
            </ApplicationProfileQueryParamProvider>
          </QueryParamProvider>
        </ConfigProvider>
      </>
    );
  };
  try {
    return render(component, { wrapper });
  } catch (e) {
    console.log('error with', name);
    throw e;
  }
};
export const genericMatchSnapshot = (component: ReactElement, name: string) =>
  expect(genericRender(component, name)).toMatchSnapshot(name);
