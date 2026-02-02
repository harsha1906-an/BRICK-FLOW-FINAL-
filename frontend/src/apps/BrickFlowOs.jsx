import { lazy, Suspense, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import { ProfileContextProvider } from '@/context/profileContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';
import { notification, App } from 'antd';
import AntdGlobal from '@/utils/antdGlobal';

const ErpApp = lazy(() => import('./ErpApp'));
import ChatWidget from '@/components/ChatWidget';

const DefaultApp = () => (
  <App>
    <AntdGlobal />
    <Localization>
      <AppContextProvider>
        <ProfileContextProvider>
          <Suspense fallback={<PageLoader />}>
            <ErpApp />
            <ChatWidget />
          </Suspense>
        </ProfileContextProvider>
      </AppContextProvider>
    </Localization>
  </App>
);

export default function BrickFlowOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  // console.log(
  //   '🚀 Welcome to BRICKFLOW ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@brickflowapp.com for more information.'
  // );

  // // Online state
  // const [isOnline, setIsOnline] = useState(navigator.onLine);

  // useEffect(() => {
  //   // Update network status
  //   const handleStatusChange = () => {
  //     setIsOnline(navigator.onLine);
  //     if (!isOnline) {
  //       console.log('🚀 ~ useEffect ~ navigator.onLine:', navigator.onLine);
  //       notification.config({
  //         duration: 20,
  //         maxCount: 1,
  //       });
  //       // Code to execute when there is internet connection
  //       notification.error({
  //         message: 'No internet connection',
  //         description: 'Cannot connect to the Internet, Check your internet network',
  //       });
  //     }
  //   };

  //   // Listen to the online status
  //   window.addEventListener('online', handleStatusChange);

  //   // Listen to the offline status
  //   window.addEventListener('offline', handleStatusChange);

  //   // Specify how to clean up after this effect for performance improvment
  //   return () => {
  //     window.removeEventListener('online', handleStatusChange);
  //     window.removeEventListener('offline', handleStatusChange);
  //   };
  // }, [navigator.onLine]);

  if (!isLoggedIn)
    return (
      <App>
        <AntdGlobal />
        <Localization>
          <AuthRouter />
        </Localization>
      </App>
    );
  else {
    return <DefaultApp />;
  }
}
