import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

import { ThemeContextProvider } from '@/context/ThemeContext';

const BrickFlowOs = lazy(() => import('./apps/BrickFlowOs'));

export default function RoutApp() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<PageLoader />}>
            <BrickFlowOs />
          </Suspense>
        </Provider>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}
