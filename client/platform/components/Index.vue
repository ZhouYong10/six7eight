<template>
    <h1>首先显示的一些信息</h1>
</template>

<script>
    export default {
        name: "NoPage",
        async created() {
            console.log(this.userRights, ' ==================================')
        },
        computed: {
            userRights() {
                return this.$store.state.rights;
            }
        }
    }
</script>

<style scoped>

</style>