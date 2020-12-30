<template>
  <div class="farm-page">
    <div class="container">
      <div class="info__image">
        <img src="../assets/images/cat.png" alt="">
      </div>
      <h1 class="farm-title">Roobee Farm on BurgerSwap</h1>
      <div class="farm-data">
        <div class="farm-data__top">
          <div class="farm-data__top-side">
            <h2 class="title">Time to next distribution</h2>
            <span class="value">{{ timeLeft }}</span>
          </div>
          <div class="farm-data__top-center">
            <div class="farm-data__top-center-content">
              <h2 class="title">{{ pair }}</h2>
              <div class="pair">
                <div class="roobee">
                  <img src="/pics/roobee.png" alt="ROOBEE">
                </div>
                <img :src="currencyIcon" :alt="pair" class="currency">
              </div>
            </div>
          </div>
          <div class="farm-data__top-side">
            <h2 class="title">Daily bROOBEE Pool Rewards</h2>
            <span class="value">25 000 bROOBEE</span>
          </div>
        </div>
        <div class="farm-data__card">
          <div class="top">
            <div class="reward">
              <span class="title">Current Rewards</span>
              <span class="value">{{ currentRewards }}</span>
            </div>
            <div class="roobee">
              <img src="/pics/roobee.png" alt="ROOBEE">
            </div>
            <div class="reward">
              <span class="title">Total rewards</span>
              <span class="value">{{ totalRewards }}</span>
            </div>
          </div>
          <div class="reward apy">
            <span class="title">APY</span>
            <span class="value">{{ apy }} %</span>
          </div>
        </div>
      </div>
      <h2 class="farm-label">Add Liquidity to <a :href="pairLink">{{ pair }} on BurgerSwap</a> pool to farm bROOBEE!</h2>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {mapState, mapActions} from 'vuex';

export default {
  name: "farming",

  data() {
    return {
      timeLeft: 0,
      finishPeriodInterval: null
    }
  },

  async created() {
    this.startFinishPeriodTimer();

    if (!this.metamaskAccount) {
      this.$bus.$emit('open-wallet-modal');
    }

    this.getRewards();
  },

  watch: {
    metamaskAccount() {
      this.getRewards();
    }
  },

  computed: {
    ...mapState(['metamaskAccount', 'currentBurgerRewards', 'totalBurgerRewards', 'currentBNBRewards', 'totalBNBRewards', 'apyBurger', 'apyBNB']),

    pair() {
      if (this.$route.name == 'farming burger')
        return 'bROOBEE/BURGER'
      else if (this.$route.name == 'farming bnb')
        return 'bROOBEE/BNB'

      return ''
    },

    pairLink() {
      if (this.$route.name == 'farming burger')
        return 'https://burgerswap.org/?type=1&from=BURGER&to=bROOBEE'
      else if (this.$route.name == 'farming bnb')
        return 'https://burgerswap.org/?type=1&from=BNB&to=bROOBEE'

      return ''
    },

    currencyIcon() {
      if (this.$route.name == 'farming burger')
        return '/pics/burger.png'
      else if (this.$route.name == 'farming bnb')
        return '/pics/bnb.png'

      return ''
    },

    currency() {
      if (this.$route.name == 'farming burger')
        return 'BURGER'
      else if (this.$route.name == 'farming bnb')
        return 'BNB'

      return ''
    },

    currentRewards() {
      if (this.currency == 'BURGER')
        return this.currentBurgerRewards || 0
      else if (this.currency == 'BNB')
        return this.currentBNBRewards || 0
      return 0
    },

    totalRewards() {
      if (this.currency == 'BURGER')
        return this.totalBurgerRewards || 0
      else if (this.currency == 'BNB')
        return this.totalBNBRewards || 0
      return 0
    },

    apy() {
      if (this.currency == 'BURGER')
        return this.apyBurger || 0
      else if (this.currency == 'BNB')
        return this.apyBNB || 0
      return 0
    }
  },

  methods: {
    ...mapActions(['getRewards']),

    startFinishPeriodTimer() {
      const timeToEndOfDayUTC = moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(1, 'days').unix()
      if (timeToEndOfDayUTC - moment().unix() > 0) {
        this.finishPeriodInterval = setInterval(() => {
          let delta = timeToEndOfDayUTC - moment().unix();
          const days = Math.floor(delta / 86400);
          delta -= days * 86400;
          const hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;
          const minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;
          const seconds = delta % 60;
          this.timeLeft = `${days < 10 ? `0${days}` : days}:${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        }, 1000);
      } else {
        clearInterval(this.finishPeriodInterval);
        this.timeLeft = 0;
      }
    }
  }
}

</script>
<style scoped>
</style>
