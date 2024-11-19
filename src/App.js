import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';

import Auth from '@goodlucklucky/auth';
import { LoadingScreen } from '@goodlucklucky/ui-components';
import ReactGA from 'react-ga4';
import platform from '@goodlucklucky/platform';

const Router = platform.isDesktop ? HashRouter : BrowserRouter;
const ReduxApp = lazy(() =>
  import('./ReduxApp' /* webpackChunkName: "components" */)
);

export default function App() {
  useEffect(() => {
    if (process.env.GA_MEASUREMENT_ID) {
      ReactGA.initialize(process.env.GA_MEASUREMENT_ID.toString());
    }
  }, []);
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route
            path="/callback"
            render={(props) => {
              Auth.callback(props);
              return <LoadingScreen />;
            }}
          />
          <Route component={ReduxApp} />
        </Switch>
      </Suspense>
    </Router>
  );
}
