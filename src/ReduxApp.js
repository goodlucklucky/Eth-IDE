import '@/menu';

import { GlobalModals, autoUpdater } from '@goodlucklucky/global';
import React, { Component, Suspense, lazy } from 'react';
import Welcome, { checkDependencies } from '@goodlucklucky/welcome';
import { config, updateStore } from '@/redux';
import redux, { Provider } from '@goodlucklucky/redux';

import Auth from '@goodlucklucky/auth';
import { LoadingScreen } from '@goodlucklucky/ui-components';
import { NotificationSystem } from '@goodlucklucky/notification';
import Routes from './components/Routes';
import fileOps from '@goodlucklucky/file-ops';
import icon from './components/icon.png';

const Header = lazy(() =>
  import('./components/Header' /* webpackChunkName: "header" */)
);

export default class ReduxApp extends Component {
  state = {
    loaded: false,
    dependencies: false,
  };

  async componentDidMount() {
    await redux.init(config, updateStore).then(onReduxLoaded);
    this.refresh();
  }

  refresh = async () => {
    const dependencies = await checkDependencies();
    this.setState({ loaded: true, dependencies });
    autoUpdater.check();
  };

  skip = () => {
    this.setState({ loaded: true, dependencies: true });
  };

  render() {
    if (!this.state.loaded) {
      return <LoadingScreen />;
    }

    if (!this.state.dependencies) {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <Welcome
            isReady={checkDependencies}
            onGetStarted={this.skip}
            truffleSubtitle={`The library used to create and compile a project.`}
            enableTutorial={false}
          />
          <NotificationSystem />
          <GlobalModals icon={icon} />
        </Suspense>
      );
    }
    return (
      <Provider store={redux.store}>
        {/* The div below can test if Tailwind CSS works. */}
        <div className="hidden"></div>
        <div
          className="body"
          style={{ paddingTop: this.state.dependencies ? '49px' : '0' }}
        >
          <Routes>
            <Header history={this.props.history} />
            <NotificationSystem />
            <GlobalModals icon={icon} />
          </Routes>
        </div>
      </Provider>
    );
  }
}

async function onReduxLoaded() {
  Auth.restore();
  const version = await fileOps.current.getAppVersion();
  redux.dispatch('SET_VERSION', { version });
}
