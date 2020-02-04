<template>
    <div class="layout">
        <Layout>
            <Sider style="position: fixed; background: #fff; height: 100%; z-index: 1000;">
                <TheSideBar></TheSideBar>
            </Sider>
            <Layout style="margin-left: 240px;">
                <Content>
                    <slot/>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import TheSideBar from '@/components/TheSideBar';

export default {
    components: {
        TheSideBar,
    }
}
</script>

<style>
    .ivu-layout-header {
        background: #fff;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        margin-left: 240px;
        padding: 0px 20px;
        height: auto;
        -webkit-box-shadow: 0px 4px 4px -4px #dcdedc;
           -mox-box-shadow: 0px 4px 4px -4px #dcdedc;
        box-shadow: 0px 4px 4px -3px #dcdedc;
    }

    .ivu-layout {
        background: #dcdee2;
    }

    .layout {
        position: relative;
        overflow: hidden;
    }

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
    
    .section-header-text {
        color: #9F9F9F;
        font-size: 11px;
        letter-spacing: 2px;
        /*font-weight: bold;*/
    }

    .section-card {
        margin-top: 5px;
    }
</style>
