import React, { PureComponent } from 'react';
import headerActions, { AuthModal, Header, NavGuard } from '@goodlucklucky/header';
import redux, { connect } from '@goodlucklucky/redux';

import { BaseProjectManager } from '@goodlucklucky/workspace';
import EthSdk from '@goodlucklucky/eth-sdk';
import { IpcChannel } from '@goodlucklucky/ipc';
import { List } from 'immutable';
import { actions } from '@goodlucklucky/workspace';
import { createProject } from '../lib/bsn';
import keypairManager from '@goodlucklucky/keypair';
import { networkManager } from '@goodlucklucky/network';

keypairManager.kp = EthSdk.kp;
networkManager.addSdk(EthSdk, EthSdk.networks);
networkManager.addSdk(EthSdk, EthSdk.customNetworks);

function networkCustomGroupData(networkMap) {
  return Object.keys(networkMap)
    .map((name) => ({
      group: 'others',
      icon: 'fas fa-vial',
      id: name,
      name: name,
      fullName: name,
      notification: `Switched to <b>${name}</b>.`,
      url: networkMap[name].url,
      networkId: networkMap[name]?.networkId || name,
      chainId: networkMap[name]?.chainId || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const customeNetworkGroup = networkCustomGroupData(
  redux.getState()?.customNetworks.toJS()
);
if (customeNetworkGroup.length > 0)
  networkManager.addSdk(EthSdk, customeNetworkGroup);

class HeaderWithRedux extends PureComponent {
  state = {
    interval: null,
  };

  componentDidMount() {
    actions.history = this.props.history;
    headerActions.history = this.props.history;
    this.refresh();
    this.navGuard = new NavGuard(this.props.history);
  }

  async refresh() {
    if (process.env.DEPLOY === 'bsn') {
      networkManager.networks = [];
      this.getNetworks();
      clearInterval(this.state.interval);
      const interval = setInterval(() => this.getNetworks(), 30 * 1000);
      this.setState({ interval });
    } else {
      const customeRefreshNetworkGroup = networkCustomGroupData(
        this.props.customNetworks.toJS()
      );
      if (
        JSON.stringify(customeRefreshNetworkGroup) !==
        JSON.stringify(customeNetworkGroup)
      )
        networkManager.addSdk(EthSdk, customeRefreshNetworkGroup);
    }
  }

  async getNetworks() {
    try {
      const ipc = new IpcChannel('bsn');
      const projects = await ipc.invoke('projects', { chain: 'eth' });
      const remoteNetworks = projects.map((project) => {
        const url = project.endpoints?.find((endpoint) =>
          endpoint.startsWith('http')
        );
        return {
          id: `bsn_${project.id}`,
          group: 'BSN',
          name: `${project.network.name}/${project.name}`,
          fullName: `${project.network.name} - ${project.name}`,
          icon: 'fas fa-globe',
          notification: `Switched to <b>${project.network.name}</b>.`,
          url,
          chainId: project.id,
          projectKey: project.key,
          symbol: 'ETH',
          raw: project,
        };
      });
      networkManager.addSdk(EthSdk, remoteNetworks);
      this.setNetwork({ redirect: false, notify: false });
    } catch (error) {
      networkManager.networks = [];
    }
  }

  setNetwork(options) {
    if (!networkManager.network && networkManager.networks.length) {
      networkManager.setNetwork(networkManager.networks[0], options);
    }
  }

  getTestNetworks = (group) => {
    return networkManager.networks.filter(
      (item) =>
        item.group === group &&
        item.chainId &&
        (group === 'others' ? true : item.fullName.includes('Testnet'))
    );
  };

  groupedNetworks = (networksByGroup) => {
    const networkList = [];
    const groups = networksByGroup.toJS();
    const keys = Object.keys(groups);
    keys.forEach((key, index) => {
      groups[key].forEach((network) => {
        network.testnet = [];
        if (
          network.name === 'Mainnet' ||
          network.id === 'dev' ||
          network.fullName === 'Custom Network'
        ) {
          if (network.id !== 'dev') {
            network.testnet = this.getTestNetworks(network.group);
          }
          networkList.push(network);
        }
      });
      if (index === keys.length - 2) {
        networkList.push({ divider: true });
      }
    });
    return networkList;
  };

  setCreateProject = () => {
    const cp = async function (params) {
      return await createProject.call(
        this,
        {
          networkManager,
          bsnChannel: new IpcChannel('bsn'),
          projectChannel: BaseProjectManager.channel,
        },
        params
      );
    };
    return process.env.DEPLOY === 'bsn' && cp;
  };

  renderLogo() {
    if (process.env.REACT_APP_LOGO) {
      return (
        <div
          className="d-flex align-items-center"
          style={{ margin: '7px 17px' }}
        >
          <img
            src={require(process.env.REACT_APP_LOGO).default}
            style={{ background: 'transparent', height: '100%' }}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    console.debug('[render] HeaderWithRedux');
    const { uiState, profile, projects, contracts, accounts, network } =
      this.props;
    const selectedProject = projects.get('selected')?.toJS() || {};

    const networkList = List(networkManager.networks);
    const networkGroups = networkList.groupBy((n) => n.group);
    const groupedNetworks = this.groupedNetworks(networkGroups);
    const selectedNetwork = networkList.find((n) => n.id === network) || {};

    const browserAccounts = uiState.get('browserAccounts') || [];
    const starred = accounts.getIn([network, 'accounts'])?.toJS() || [];
    const starredContracts =
      contracts.getIn([network, 'starred'])?.toJS() || [];
    const selectedContract = contracts.getIn([network, 'selected']) || '';
    const selectedAccount = accounts.getIn([network, 'selected']) || '';

    return (
      <Header
        profile={profile}
        projects={projects}
        selectedProject={selectedProject}
        selectedContract={selectedContract}
        selectedAccount={selectedAccount}
        starred={starred}
        starredContracts={starredContracts}
        browserAccounts={browserAccounts}
        network={selectedNetwork}
        networkList={groupedNetworks}
        AuthModal={AuthModal}
        createProject={this.setCreateProject()}
        logo={this.renderLogo()}
      />
    );
  }
}

export default connect([
  'uiState',
  'profile',
  'projects',
  'contracts',
  'accounts',
  'network',
  'customNetworks',
])(HeaderWithRedux);
