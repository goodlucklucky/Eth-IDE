import Immutable, { List, Map } from 'immutable';

export { redux as profile } from '@goodlucklucky/auth';
export { redux as projects } from '@goodlucklucky/workspace';
export { redux as keypairs } from '@goodlucklucky/keypair';
export { redux as tokens } from '@goodlucklucky/explorer';
export { redux as abis } from '@goodlucklucky/eth-sdk';
export { redux as customNetworks } from '@goodlucklucky/eth-network';
export { redux as queue } from '@goodlucklucky/queue';

export const version = {
  default: Immutable.fromJS({}),
  persist: true,
  actions: {
    SET_VERSION: {
      reducer: (state, { payload }) => state.merge(payload),
    },
  },
};

export const globalConfig = {
  default: Immutable.fromJS({}),
  persist: true,
  actions: {
    UPDATE_GLOBAL_CONFIG: {
      reducer: (state, { payload }) => state.mergeDeep(payload),
    },
  },
};

export const uiState = {
  default: Immutable.fromJS({}),
  persist: false,
  actions: {
    UPDATE_UI_STATE: {
      reducer: (state, { payload }) => state.merge(payload),
    },
  },
};

export const contracts = {
  default: Immutable.fromJS({
    dev: {
      selected: '',
      tabs: [],
      starred: [],
    },
    testnet: {
      selected: '',
      tabs: [],
      starred: [],
    },
  }),
  persist: true,
  actions: {
    CREATE_TABS: {
      reducer: (state) =>
        state.updateIn(['dev', 'tabs'], (tabs = List([])) => tabs),
    },
    SET_CONTRACT_TABS: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'tabs'], Immutable.fromJS(payload.tabs)),
    },
    SELECT_CONTRACT: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'selected'], payload.contract),
    },
    SET_STARRED_CONTRACTS: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'starred'], List(payload.starred)),
    },
  },
};

export const accounts = {
  default: Immutable.fromJS({
    dev: {
      loading: false,
      selected: '',
      accounts: [],
      tabs: [],
    },
    testnet: {
      loading: false,
      selected: '',
      accounts: [],
      tabs: [],
    },
  }),
  persist: true,
  actions: {
    CREATE_TABS: {
      reducer: (state) =>
        state.updateIn(['dev', 'tabs'], (tabs = List([])) => tabs),
    },
    SET_ACCOUNT_TABS: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'tabs'], Immutable.fromJS(payload.tabs)),
    },
    SET_STARRED: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'accounts'], List(payload.starred)),
    },
    SELECT_ACCOUNT: {
      reducer: (state, { payload }) =>
        state.setIn([payload.network, 'selected'], payload.account),
    },
    REMOVE_ACCOUNT: {
      reducer: (state, { payload }) => {
        let index = state
          .getIn([payload.network, 'accounts'])
          .indexOf(payload.account);
        if (index === -1) {
          return state;
        }
        return state.updateIn([payload.network, 'accounts'], (data) =>
          data.remove(index)
        );
      },
    },
  },
};

export const network = {
  default: '',
  persist: true,
  actions: {
    SELECT_NETWORK: {
      reducer: (_, { payload }) => payload,
    },
  },
};

export const loadNetworkResources = {
  default: false,
  persist: false,
  actions: {
    LOAD_NETWORK_RESOURCES: {
      reducer: (_, { payload }) => payload,
    },
  },
};

export const workspacePath = {
  default: '',
  persist: true,
  actions: {
    SETTING_WORKSPACE_PATH: {
      reducer: (_, { payload }) => payload,
    },
  },
};

export const customNetworkModalStatus = {
  default: false,
  persist: false,
  actions: {
    CUSTOM_MODAL_STATUS: {
      reducer: (_, { payload }) => payload,
    },
  },
};

export const loginRedirectPath = {
  default: '',
  persist: true,
  actions: {
    SET_LOGIN_REDIRECT_PATH: {
      reducer: (_, { payload }) => payload,
    },
  },
};

// TODO: merge the network Info
export const networkConnect = {
  default: false,
  persist: false,
  actions: {
    CHANGE_NETWORK_STATUS: {
      reducer: (_, { payload }) => payload,
    },
  },
};

export const chainList = {
  default: Immutable.fromJS({
    networks: [],
  }),
  persist: false,
  actions: {
    SET_CHAIN_LIST: {
      reducer: (state, { payload }) =>
        state.setIn(['networks'], Immutable.fromJS(payload)),
    },
  },
};
