<template>
    <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: "vue-ueditor",
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                msg: '',
                myConfig: {
                    initialFrameHeight: 800,
                    initialFrameWidth:'100%'
                }
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss">

</style>