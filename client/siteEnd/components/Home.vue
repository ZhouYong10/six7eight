<template>
    <el-container style="height: inherit;">
        <el-header height="50px" style="padding:0;">
            <header-menu @show-side-menu="showSideMenu"></header-menu>
        </el-header>
        <el-container style="overflow: hidden;">
            <el-aside width="200px" style="border-right: solid 1px #e6e6e6;" :style="{marginLeft: sideMenuMarginLeft +'px'}">
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
        name: "siteHome",
        data() {
            return {
                sideMenuMarginLeft: 0
            }
        },
        methods: {
            showSideMenu(isShow) {
                this.sideMenuMarginLeft = isShow ? 0 : -201;
            }
        },
        components: {
            HeaderMenu,
            SideMenu
        }
    }
</script>

<style scoped>

</style>