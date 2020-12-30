<template>
  <div class="info farming-pancake">
    <div class="container">
      <div class="info__image">
        <img src="../assets/images/cat.png" alt="">
      </div>
      <div class="info__title">Roobee Farm</div>
      <div class="farm-data farm-data__items">
        <div class="farm-data__item">
          <h2 class="title">Est. APY</h2>
          <span class="value">{{ toFixedTwo(apy) }} %</span>
        </div>
        <div class="farm-data__item">
          <h2 class="title">Total LPs bROOBEE/BNB Staked</h2>
          <span class="value">{{ toFixedTwo(roobeeFarmSupply / 1e18) }}</span>
        </div>
        <div class="farm-data__item">
          <h2 class="title">Daily ROOBEE Pool Rewards</h2>
          <span class="value">{{ numberWithSpaces(toFixedTwo(rewardPerBlock * 5760 * 15 / 1e18)) }}</span>
        </div>
      </div>
      <h2 class="farm-label">Farming with Pancake is over! You can claim your LP's</h2>
      <div class="balance">
        <div class="balance__inner">
          <div class="balance__item">
            <div class="balance__amount balance__amount--mb">
              {{ toFixedTwo(earned / 1e18) }}
            </div>
            <div class="balance__title balance__title--mb">ROOBEE earned</div>
            <div class="balance__button">
              <button class="button button--blue button--small" @click="harvest">Harvest</button>
            </div>
          </div>
          <div class="balance__item">
            <div class="balance__amount balance__amount--mb">
              {{ toFixedTwo(roobeeFarmBalance / 1e18) }}
            </div>
            <div class="balance__title balance__title--mb">bROOBEE-BNB LPs Token Staked</div>
            <transition name="fade" mode="out-in">
              <div class="balance__button" v-if="!isApproved" key="1">
                <button class="button button--yellow button--small" @click="approve">Approve bROOBEE-BNB LPs</button>
              </div>
              <div class="balance__buttons" v-else key="2">
                <button class="button button--mr button--yellow button--small button--mb" disabled>Deposit
                </button>
                <button class="button button--grey button--small" @click="showWithdrawModal">Withdraw</button>
              </div>
            </transition>
          </div>
        </div>
        <div class="balance__info">
          <div class="balance__icon">!</div>
          <div class="balance__name">Pro Tip</div> - Add your Pancakeswap bROOBEE-BNB LPs liquidity provider tokens to farm ROOBEE
        </div>
      </div>
    </div>
    <WithdrawModal ref="withdraw-modal" />
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import WithdrawModal from "@/components/WithdrawModal";
import toFixedTwo from '@/utils/toFixedTwo'

export default {
  name: "farming",

  components: {
    WithdrawModal
  },

  data() {
    return {
      isWithdrawModalShown: false
    }
  },

  async created() {
    if (!this.firstEnter) {
      await this.getRoobeeData();
    }
    if (!this.metamaskAccount) {
      this.$bus.$emit('open-wallet-modal');
    }
  },

  computed: {
    ...mapState(['roobeeBalance', 'roobeeFarmSupply', 'earned', 'rewardPerBlock', 'isApproved', 'firstEnter', 'roobeeFarmBalance', 'metamaskAccount']),
    ...mapGetters(['apy'])
  },

  methods: {
    ...mapActions(['getRoobeeData', 'harvest', 'approve']),

    showWithdrawModal() {
      this.$refs['withdraw-modal'].show = true
    },

    numberWithSpaces(x) {
      let parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    },

    toFixedTwo(num) {
      return toFixedTwo(num)
    }
  }
}

</script>
