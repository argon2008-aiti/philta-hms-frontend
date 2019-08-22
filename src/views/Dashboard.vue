<template>
  <div class="page-container">
    <div class="page-header">
        <span class="header-title">Dashboard</span>
    </div>
    <Card dis-hover style="margin-top: 50px; min-height: 80vh;">
      <div class="page-contents">
          <h2>dashboard contents</h2>
      </div>
    </Card>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .page-container {
      background: #fcfcfc;
      padding: 40px 20px;
    }

    .page-header .header-title {
      font-size: 24px;
      letter-spacing: 2px;
      display: inline-block;
    }

    .page-contents {
      background: white;
      margin-top: 1px;
      padding: 10px;
    }

    .page-header {
        background: #fff;
        position: fixed;
        margin-left: 240px;
        padding: 20px 20px;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        -webkit-box-shadow: 0px 4px 4px -4px #dcdedc;
           -mox-box-shadow: 0px 4px 4px -4px #dcdedc;
        box-shadow: 0px 4px 4px -3px #dcdedc;
    }

</style>
