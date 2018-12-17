<template>
    <el-container style="height: inherit;">
        <el-header height="50px" style="padding:0;">
            <header-menu @show-side-menu="sideMenuShow = $event"></header-menu>
        </el-header>
        <el-container style="overflow: hidden;">
            <transition name="side-menu">
                <el-aside v-show="sideMenuShow" width="220px" style="border-right: solid 1px #e6e6e6;">
                    <side-menu></side-menu>
                </el-aside>
            </transition>
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
                sideMenuShow: true
            }
        },
        components: {
            HeaderMenu,
            SideMenu
        }
    }
</script>

<style scoped>
    .side-menu-enter, .side-menu-leave-to{
        margin-left: -221px;
    }
    .side-menu-enter-active, .side-menu-leave-active{
        transition: margin-left 0.5s;
    }
</style>