import React, { PureComponent } from 'react';

import Project from '@goodlucklucky/eth-project';
import { connect } from '@goodlucklucky/redux';
import platform from '@goodlucklucky/platform';

class ProjectWithProps extends PureComponent {
  async componentDidMount() {
    this.props.cacheLifecycles.didRecover(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  render() {
    const { projects, uiState, match } = this.props;
    if (!match?.params) {
      return null;
    }
    const { username, project } = match?.params;
    const selected = projects.get('selected')?.toJS() || {};

    let type, projectRoot;
    if (username === 'local') {
      type = 'Local';
      projectRoot = selected.path;
    } else {
      type = 'Remote';
      projectRoot = selected.id ? `${username}/${project}` : undefined;
    }

    return type === 'Local' && platform.isWeb ? null : (
      <Project
        theme="goodlucklucky"
        projectRoot={projectRoot}
        type={type}
        signer={uiState.get('signer')}
      />
    );
  }
}

export default connect(['uiState', 'projects'])(ProjectWithProps);
