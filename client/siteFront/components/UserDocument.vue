<template>
    <div style="padding: 8px 4px;" v-html="userDoc"></div>
</template>

<script>
    import {axiosGet} from "@/slfaxios";

    export default {
        name: "user-document",
        async created() {
            this.userDoc = await axiosGet('/user/load/user/document');

        },
        data() {
            return {
                userDoc: ''
            }
        }
    }
</script>

<style scoped>

</style>