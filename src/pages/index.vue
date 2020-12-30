<template>
    <div class="index-page">
      <div class="info">
        <div class="container">
          <div class="title index-page__title">
            <h1>Roobee Farm</h1>
            <div class="index-page__title-logo">
              <img src="/pics/roobee-new-year.png" alt="Roobee Farm V2">
            </div>
          </div>
          <div class="balance">
            <div class="balance__inner">
              <Card title="bROOBEE/BNB" farm-link="/farming_pancake" top-icon="/pics/pancake.png" currency-icon="/pics/bnb.png" daily-pool="25 000" :finished="true" />
              <Card title="bROOBEE/BNB" farm-link="/farming_bnb" top-icon="/pics/burger.png" currency-icon="/pics/bnb.png" daily-pool="25 000" />
              <Card title="bROOBEE/BURGER" farm-link="/farming_burger" top-icon="/pics/burger.png" currency-icon="/pics/burger.png" daily-pool="25 000" />
            </div>
            <div class="balance__info">
              <div class="balance__icon">!</div>
              <div class="balance__name">Pro Tip</div> - Check Roobee.Finance on <a href="https://bscscan.com/yieldfarms" target="_blank">https://bscscan.com/yieldfarms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Index',

  components: {
    Card: () => import('@/components/Card')
  }
}
</script>
