<template>
  <div class="card" :class="{finished}">
    <img :src="topIcon" class="card__top-icon">
    <div class="card__header">
      <h2 class="card__title">{{ title }}</h2>
    </div>
    <div class="card__body">
      <div class="card__currencies">
        <div class="card__roobee-icon">
          <img src="/pics/roobee.png">
        </div>
        <img :src="currencyIcon" class="card__currency-icon">
      </div>
      <span class="card__rewards">
        <h3>Rewards end in</h3>
        <span>{{ finished ? '0' : timeLeft }}</span>
      </span>
    </div>
    <div class="card__footer">
      <div class="double">
        <span class="title">Daily ROOBEE pool</span>
        <span class="value">{{ dailyPool }} ROOBEE</span>
      </div>
      <router-link :to="farmLink" class="start" :class="{finished}">{{ finished ? 'FINISHED' : 'START FARMING' }}</router-link>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {mapState} from 'vuex'

export default {
  props: ['title', 'farmLink', 'topIcon', 'currencyIcon', 'dailyPool', 'finished'],

  data() {
    return {
      timeLeft: 0,
      finishPeriodInterval: null
    }
  },

  created() {
    if (!this.finished)
      this.startFinishPeriodTimer();
  },

  computed: {
    ...mapState(['rewardsEndIn'])
  },

  methods: {
    startFinishPeriodTimer() {
      if (this.rewardsEndIn - moment().unix() > 0) {
        this.finishPeriodInterval = setInterval(() => {
          let delta = this.rewardsEndIn - moment().unix();
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
