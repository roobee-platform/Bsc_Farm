<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

import {mapActions, mapMutations} from 'vuex';

export default {
  name: 'App',

  components: { Footer, Header },

  data() {
    return {
      clickedData: false,
      msg: "This is demo net work"
    }
  },

  async created() {
    await this.connectMetamask();
  },

  methods: {
    ...mapActions(['connectMetamask', 'setMetamaskData']),
    ...mapMutations(['setFirstEnter']),

    clicked() {
      this.clicked = !this.clicked
    }
  },
}

</script>
<style lang="scss">
@import 'assets/scss/app.scss';

</style>
