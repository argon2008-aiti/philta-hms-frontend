<template>
    <div class="the-header-container">
       <Row>
            <Col span="8">
                <div class="the-header-title">{{header_title}}</div>
            </Col>

            <Col span="16">
            </Col>
       </Row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            header_title: " ",
        }
    },

    watch: {
        '$route' (to, from) {
            this.header_title = to.meta.display_name;
        }
    },

    mounted() {
        this.header_title = this.$route.meta.display_name;
    }

}
</script>

<style scoped>
    .the-header-container {

    }
    .the-header-container .the-header-title {
      font-size: 24px;
      letter-spacing: 2px;
    }

</style>
