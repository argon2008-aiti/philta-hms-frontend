<template>
    <div class="page-contents">
        <img src="../assets/no_data.png" alt="no-data" width="100px" height="100px">
        <p style="color: #A8A8A8; margin-top: 10px; font-size: 16px;">
            {{message}}
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            message: {
                type: String,
                default: "There are no patients to show!"
            },
        },
        
    }
</script>

<style scoped>
    .page-contents {
        height: 100%;
    }

</style>