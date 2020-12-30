<template>
  <transition name="modal-fade">
    <div class="modal-box " v-if="show" @click.self="show = false">
      <div class="overlay" @click="show = false"></div>
      <div class="modal">
        <button class="modal__close" @click="show = false">
          <img src="../assets/images/close.svg" alt="">
        </button>
        <div class="modal__container modal__container--height">
          <div class="modal__title">Select a wallet provider</div>
          <div class="modal__inner">
            <div class="wallet-item modal__item">
              <div class="wallet-item__icon">
                <img src="../assets/images/fox.png" alt="">
              </div>
              <div class="wallet-item__title">Metamask</div>
              <div class="wallet-item__button">
                <button class="button button--yellow button--small" :class="{'button--green': metamaskAccount}" @click="connectAccount">{{ metamaskAccount ? metamaskAccount : (metamaskConnector && metamaskConnector.status == 'NOT_INSTALLED' ? 'Install' : 'Connect') }}
                </button>
              </div>
            </div>
            <div class="wallet-item">
              <div class="wallet-item__icon">
                <img src="../assets/images/connect.svg" alt="">
              </div>
              <div class="wallet-item__title">WalletConnect</div>
              <div class="wallet-item__button">
                <button class="button button--yellow button--small ">Soon</button>
              </div>
            </div>
          </div>
          <div class="modal__cancel">
            <button class="button button--grey button--small" @click="show = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: "WalletModal",

  data() {
    return {
      show: false
    }
  },

  mounted() {
    this.$bus.$on('close-wallet-modal', () => {
      this.show = false;
    })
    this.$bus.$on('open-wallet-modal', () => {
      this.show = true;
    })
  },

  computed: {
    ...mapState(['metamaskAccount', 'metamaskConnector'])
  },

  methods: {
    ...mapActions(['connectAccount'])
  }
}
</script>
