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

<style scoped>
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
</style>
