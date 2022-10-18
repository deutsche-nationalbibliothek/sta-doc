import { render } from '@testing-library/react';
import { ReactElement } from 'react';

const genericRender = (component: ReactElement, name: string) => {
  try {
    return render(component).container
  } catch (e) {
    console.log('error with', name)
    throw e
  }
}
export const genericMatchSnapshot = (component: ReactElement, name: string) => expect(genericRender(component, name)).toMatchSnapshot(name)
