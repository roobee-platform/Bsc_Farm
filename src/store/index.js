import Vue from 'vue'
import Vuex from 'vuex'
import apiRequest from '@/utils/apiRequest'

import createContract from '@/utils/contract';
import WalletModule from './WalletModule';
import MetamaskConnector from '@/utils/MetamaskConnector.js'

Vue.use(Vuex)

const BN = require('bn.js');

export default new Vuex.Store({
  state: {
    metamaskConnector: null,
    roobeeFarm: null,
    roobeeToken: null,
    kovanStaking: null,
    graph: null,

    // user specific data
    metamaskAccount: null,
    roobeeBalance: 0,
    isApproved: false,
    earned: 0,
    availableToDeposit: 0,
    roobeeFarmBalance: 0,

    // common data
    roobeeSupply: 0,
    roobeeFarmSupply: 0,
    finishPeriod: 0,
    rewardPerToken: 0,
    rewardPerBlock: 0,
    rewardsDuration: 0,
    stakingTotalSupply: 0,

    firstEnter: true,

    // new variables
    rewardsEndIn: 1612249200, // 2feb21 7AM GMT (timestamp in s)
    currentBurgerRewards: null,
    currentBNBRewards: null,
    totalBurgerRewards: null,
    totalBNBRewards: null,
    apyBurger: null,
    apyBNB: null
  },

  mutations: {
    setRoobeeFarm(state, payload) {
      state.roobeeFarm = payload
    },

    setRoobeeToken(state, payload) {
      state.roobeeToken = payload
    },

    setRoobeeTokenSupply(state, payload) {
      state.roobeeSupply = payload
    },

    setRoobeeFarmSupply(state, payload) {
      state.roobeeFarmSupply = payload
    },

    setKovanStaking(state, payload) {
      state.kovanStaking = payload
    },

    setRoobeeBalance(state, payload) {
      state.roobeeBalance = payload
    },

    setRewardPerToken(state, payload) {
      state.rewardPerToken = payload
    },

    setRewardPerBlock(state, payload) {
      state.rewardPerBlock = payload
    },

    setFinishPeriod(state, payload) {
      state.finishPeriod = payload
    },

    setEarned(state, payload) {
      state.earned = payload
    },

    setFirstEnter(state, payload) {
      state.firstEnter = payload
    },

    setIsApproved(state, payload) {
      state.isApproved = payload
    },

    setRoobeeFarmBalance(state, payload) {
      state.roobeeFarmBalance = payload
    },

    setRewardsDuration(state, payload) {
      state.rewardsDuration = payload
    },

    setGraph(state, payload) {
      state.graph = payload;
    },

    setStakingTotalSupply(state, payload) {
      state.stakingTotalSupply = payload;
    },

    setMetamaskConnector(state, payload) {
      state.metamaskConnector = payload
    },
    
    setMetamaskAccount(state, payload) {
      state.metamaskAccount = payload
    },

    setRewards(state, payload) {
      if (payload['BURGER-bROOBEE']) {
        state.currentBurgerRewards = payload['BURGER-bROOBEE'].current;
        state.totalBurgerRewards = payload['BURGER-bROOBEE'].total;
        state.apyBurger = payload['BURGER-bROOBEE'].apy;
      }
      if (payload['WBNB-bROOBEE']) {
        state.currentBNBRewards = payload['WBNB-bROOBEE'].current;
        state.totalBNBRewards = payload['WBNB-bROOBEE'].total;
        state.apyBNB = payload['WBNB-bROOBEE'].apy;
      }
    },

    resetUser(state) {
      state.metamaskAccount = null;
      state.roobeeBalance = 0;
      state.isApproved = false;
      state.earned = 0;
      state.availableToDeposit = 0;
      state.roobeeFarmBalance = 0;
      localStorage.removeItem('account-unlocked');
    }
  },

  actions: {
    // new
    async getRewards({commit, state}) {
      if (state.metamaskAccount) {
        const res = await apiRequest.get(`https://api.roobee.finance/address/${state.metamaskAccount}/rewardBalance:get`)
        if (res.data) {
          commit('setRewards', res.data.pairs);
        } 
      }
    },

    // --------------------------

    async connectMetamask({state, commit, dispatch}) {
      // getting general roobee data
      dispatch('getRoobeeData');

      if (!state.metamaskConnector) {
        commit('setMetamaskConnector', new MetamaskConnector())
        // creating contracts
        commit('setRoobeeFarm', createContract('farm'));
        commit('setRoobeeToken', createContract('rewards'));
        commit('setKovanStaking', createContract('staking'));

        if (!state.metamaskConnector || state.metamaskConnector.status == 'NOT_INSTALLED') {
          localStorage.removeItem('account-unlocked')
        } else {
          state.metamaskConnector.eth.on('accountsChanged', async (accounts) => {
            if (!state.firstEnter) {
              if (accounts[0]) {
                commit('setMetamaskAccount', accounts[0])
                dispatch('getUserData')
                dispatch('getRewards')
              } else {
                commit('resetUser');
              }
            }
          })
        }
      }

      if (localStorage.getItem('account-unlocked') == 'true') {
        dispatch('connectAccount');
      }

      commit('setFirstEnter', false);
    },

    async connectAccount({state, commit, dispatch}) {
      const accounts = await state.metamaskConnector.getAccounts();
      if (accounts) {
        if (accounts.status == 'CONNECTED') {
          commit('setMetamaskAccount', accounts.data[0])
          localStorage.setItem('account-unlocked', true);
          if (!state.firstEnter) {
            Vue.prototype.$toasted.success('Successfully connected to the account');
            Vue.prototype.$bus.$emit('close-wallet-modal');
          }
          dispatch('getUserData');
        } else if (accounts.status == 'NOT_INSTALLED') {
          Vue.prototype.$toasted.error("You must install Metamask first", {duration: 5000});
          window.open('https://metamask.io/', '_blank');
        }
      } else {
        if (!state.firstEnter) {
          Vue.prototype.$toasted.error("Couldn't find any accounts");
        }
      }
    },

    async getUserData({commit, state}) {
      if (state.metamaskAccount) {
        if (!state.roobeeToken) {
          Vue.prototype.$toasted.error(`Roobee Token: the contract is not connected`, { duration: 5000 });
          return 
        }
        if (!state.roobeeFarm) {
          Vue.prototype.$toasted.error(`Roobee Farm: the contract is not connected`, { duration: 5000 });
          return
        }
        if (!state.roobeeFarm) {
          Vue.prototype.$toasted.error(`Kovan Staking: the contract is not connected`, { duration: 5000 });
          return
        }

        commit('setRoobeeBalance', await state.roobeeToken.methods.balanceOf(state.metamaskAccount).call());
        commit('setEarned', await state.roobeeFarm.methods.earned(state.metamaskAccount).call());
        commit('setIsApproved', (await state.kovanStaking.methods.allowance(state.metamaskAccount, process.env.VUE_APP_FARM_ADDRESS).call()) > 0);
        commit('setRoobeeFarmBalance', await state.roobeeFarm.methods.balanceOf(state.metamaskAccount).call())
      }
    },

    async getRoobeeData({ commit, state }) {
      if (state.roobeeToken) {
        try {
          commit('setRoobeeTokenSupply', await state.roobeeToken.methods.totalSupply().call());
        } catch (err) {
          if (checkNetwork()) {
            console.error(`Roobee Token: ${err.message}`);
            Vue.prototype.$toasted.error(`Roobee Token: ${err.message}`, { duration: 5000 });
          }
        }
      }
      if (state.roobeeFarm) {
        try {
          commit('setRewardPerToken', await state.roobeeFarm.methods.rewardPerToken().call());
          commit('setRewardPerBlock', await state.roobeeFarm.methods.rewardRate().call());
          commit('setFinishPeriod', await state.roobeeFarm.methods.periodFinish().call());
          commit('setRewardsDuration', await state.roobeeFarm.methods.rewardsDuration().call());
          commit('setRoobeeFarmSupply', await state.roobeeFarm.methods.totalSupply().call());
        } catch (err) {
          if (checkNetwork()) {
            console.error(`Roobee Farm: ${err.message}`);
            Vue.prototype.$toasted.error(`Roobee Farm: ${err.message}`, { duration: 5000 });
          }
        }
      }
      if (state.kovanStaking) {
        try {
          commit('setStakingTotalSupply', await state.kovanStaking.methods.totalSupply().call());
        } catch(err) {
          if (checkNetwork()) {
            console.error(`Staking: ${err.message}`);
            Vue.prototype.$toasted.error(`Staking: ${err.message}`, { duration: 5000 });
          }
        }
      }

      // graph
      var xhr = new XMLHttpRequest();
      xhr.onload = () => {
        commit('setGraph', JSON.parse(xhr.responseText).data);
      };
      xhr.open("POST", "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2", true);
      let data = "{\"operationName\":\"tokens\",\"variables\":{},\"query\":\"fragment TokenFields on Token {\\n  id\\n  name\\n  symbol\\n  derivedETH\\n  tradeVolume\\n  tradeVolumeUSD\\n  untrackedVolumeUSD\\n  totalLiquidity\\n  txCount\\n  __typename\\n}\\n\\nquery tokens {\\n  tokens(where: {id: \\\"0xa31b1767e09f842ecfd4bc471fe44f830e3891aa\\\"}) {\\n    ...TokenFields\\n    __typename\\n  }\\n  pairs0: pairs(where: {token0: \\\"0xa31b1767e09f842ecfd4bc471fe44f830e3891aa\\\"}, first: 50, orderBy: reserveUSD, orderDirection: desc) {\\n    id\\n    __typename\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }}\\n}\\n\"}"
      xhr.send(data);
    },

    async harvest({ state, dispatch }) {
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.roobeeFarm) {
        Vue.prototype.$toasted.success('Please wait', { duration: 0 });
        const res = await state.roobeeFarm.methods.getReward().send({from: state.metamaskAccount})
        Vue.prototype.$toasted.clear();
        if (res.status) {
          Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
          dispatch('getUserData');
        }
      } else {
        Vue.prototype.$toasted.error(`Roobee Farm: the contract is not connected`, { duration: 5000 });
      }
    },

    async approve({ state, dispatch }) {
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.kovanStaking) {
        try {
          await state.kovanStaking.methods
            .approve(process.env.VUE_APP_FARM_ADDRESS, process.env.VUE_APP_UINT_MAX)
            .send({from:state.metamaskAccount});
          dispatch('getUserData');
        } catch (err) {
          Vue.prototype.$toasted.error(err.message, { duration: 5000 });
        }
      } else {
        Vue.prototype.$toasted.error(`Kovan Staking: the contract is not connected`, { duration: 5000 });
      }
    },

    async withdraw({ state, dispatch }, amount) {
      if (state.roobeeFarm) {
        try {
          Vue.prototype.$toasted.success('Please wait', { duration: 0 });
          const res = await state.roobeeFarm.methods.withdraw((new BN((amount * 1e18).toLocaleString('fullwide', {useGrouping:false}), 10))).send({from:state.metamaskAccount});
          Vue.prototype.$toasted.clear();
          if (res.status) {
            Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
            dispatch('getUserData');
          }
        } catch (err) {
          if (err.code == 'INVALID_ARGUMENT')
            Vue.prototype.$toasted.error(`Placeholder cannot be empty`, { duration: 5000 });
          else {
            console.error(`Withdraw: ${err.message}`);
            Vue.prototype.$toasted.error(err.message, { duration: 5000 });
          }
        }
      } else {
        Vue.prototype.$toasted.error(`Roobee Farm: the contract is not connected`, { duration: 5000 });
      }
    },
  },

  getters: {
    apy(state) {
      if (state.graph && state.stakingTotalSupply) {
        const token0 = state.graph.pairs0[0].token0;
        const yReward = (state.rewardPerBlock / state.roobeeFarmSupply) * 31536000
        const roobeePrice = token0.derivedETH
        const totalLiquidity = token0.totalLiquidity * 2 * token0.derivedETH
        const lpPrice = totalLiquidity / (state.stakingTotalSupply/1e18)
        if (lpPrice)
          // apy = (yReward * roobeePrice) / lpPrice * 100
          return (yReward * roobeePrice) / lpPrice * 100
      }
      return 0
    }
  },

  modules: {
    wallet: WalletModule
  }
})

const checkNetwork = () => {
  networkError();
  if (window.ethereum.networkVersion == process.env.VUE_APP_NETWORK_NUMBER) return true
  return false
}

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const networkError = debounce(() => {
  console.error(`Wrong network, connect to ${process.env.VUE_APP_NETWORK_NAME}`);
  Vue.prototype.$toasted.error(`Wrong network, connect to ${process.env.VUE_APP_NETWORK_NAME}`, { duration: 0 });
}, 2000);
