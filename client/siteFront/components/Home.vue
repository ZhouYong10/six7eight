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
    import HeaderMenu from "./header/HeaderMenu.vue";
    import SideMenu from "./SideMenu.vue";
    import {axiosGet} from "@/utils";
    export default {
        name: "home",
        async beforeCreate() {
            // let initData = await axiosGet('/user/init');

        },
        components: {
            HeaderMenu,
            SideMenu
        }
    }
</script>

<style scoped>

</style>