<template>
  <header class="header">
    <div class="container">
      <div class="header__inner">
        <router-link :to="{name: 'index'}" class="header__logo">
          <img src="../../assets/images/logo.svg" alt="roobee">
        </router-link>
        <nav class="header__nav">
          <router-link :to="{name: 'index'}" class="header__link header__link--home">Home</router-link>
          <router-link to="/farming_pancake" class="header__link">
            <span>Pancake</span>
            <img src="/pics/pancake.png" alt="Pancake">
          </router-link>
          <router-link to="/farming_bnb" class="header__link">
            <span>BNB</span>
            <img src="/pics/bnb.png" alt="BNB">
          </router-link>
          <router-link to="/farming_burger" class="header__link">
            <span>Burger</span>
            <img src="/pics/burger.png" alt="Burger">
          </router-link>
          <router-link :to="{name: 'about'}" class="header__link">About</router-link>
          <a href="https://roobee.finance/" target="_blank" class="header__link">ETH Network</a>
        </nav>
        <div class="header__box">
          <a href="#" class="button header__button" @click.prevent="showModal" :class="{'button--green': metamaskAccount}">{{ metamaskAccount ? `${metamaskAccount.substring(0, 4)}...${metamaskAccount.substring(42 - 4)}` : 'Unlock wallet' }}</a>
          <div class="header__menu">
            <div class="header__menu-icon" @click="menuStatus =! menuStatus"></div>
            <transition name="fade">
              <div class="header__list" v-if="menuStatus">
                <router-link :to="{name: 'index'}" class="header__link header__link--active">Home</router-link>
                <router-link to="/farming_pancake" class="header__link">
                  <span>Pancake</span>
                  <img src="/pics/pancake.png" alt="Pancake">
                </router-link>
                <router-link to="/farming_bnb" class="header__link">
                  <span>BNB</span>
                  <img src="/pics/bnb.png" alt="BNB">
                </router-link>
                <router-link to="/farming_burger" class="header__link">
                  <span>Burger</span>
                  <img src="/pics/burger.png" alt="Burger">
                </router-link>
                <router-link :to="{name: 'about'}" class="header__link">About</router-link>
                <a href="https://roobee.finance/" target="_blank" class="header__link">ETH Network</a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <WalletModal ref="modal"/>
  </header>
</template>

<script>
import WalletModal from "@/components/WalletModal";
import {mapState} from 'vuex'

export default {
  name: "Header",
  components: {
    WalletModal,
  },

  data () {
    return {
      menuStatus: false
    }
  },

  watch: {
    $route() {
      this.menuStatus = false;
    }
  },

  computed: {
    ...mapState(['metamaskAccount'])
  },

  methods: {
    showModal () {
      this.$refs.modal.show = true
    },
  }
}
</script>
