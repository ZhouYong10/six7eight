<template>
    <div style="padding: 8px 4px;" v-html="siteDoc"></div>
</template>

<script>
    import {axiosGet} from "@/slfaxios";

    export default {
        name: "site-document",
        async created() {
            this.siteDoc = await axiosGet('/site/auth/load/site/document');

        },
        data() {
            return {
                siteDoc: ''
            }
        }
    }
</script>

<style scoped>

</style>