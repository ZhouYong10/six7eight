<template>
    <el-container style="height: inherit;">
        <el-header height="50px" style="padding:0;">
            <header-menu></header-menu>
        </el-header>
        <el-container style="overflow: hidden;">
            <el-aside width="260px" style="border-right: solid 1px #e6e6e6;">
                <side-menu></side-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import HeaderMenu from "./HeaderMenu.vue";
    import SideMenu from "./SideMenu.vue";
    export default {
        name: "platform-home",
        beforeCreate() {
            if (!this.user) {
                this.$router.push('/');
                this.$message.error('您还没有登录哦！');
            }
        },
        components: {
            HeaderMenu,
            SideMenu
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        }
    }
</script>

<style scoped>

</style>