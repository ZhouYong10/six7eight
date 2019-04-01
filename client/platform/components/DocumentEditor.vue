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
                msg: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue + UEditor + v-model双向绑定</h2>',
                myConfig: {
                    autoHeightEnabled:false,
                    initialFrameHeight:600,
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