<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :lg="6" :sm="12">
            <div class="menu-btn hidden-sm-and-up" @click="showSideMenu">
                <i class="fa fa-bars fa-2x" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/home">
                    <i class="fa fa-home fa-2x" title="首页"></i>
                    <span class="hidden-sm-and-down">{{platformName}}</span>
                </router-link>
            </div>
        </el-col>
        <el-col :lg="12" :sm="6">
            <div class="user-funds">
                <router-link to="/home/platform/funds/record">
                    <span class="hidden-sm-and-down">
                        <span>成本: ￥</span><span>{{baseFunds}}</span>
                        &nbsp;&nbsp;&nbsp;
                        <span>利润: ￥</span><span>{{profit}}</span>
                    </span>
                    <el-popover
                            class="hidden-sm-and-up"
                            placement="bottom"
                            trigger="hover">
                        <p>成本:￥ <span>{{baseFunds}}</span></p>
                        <p>利润:￥ <span>{{profit}}</span></p>
                        <i class="fa fa-money fa-2x" slot="reference"></i>
                    </el-popover>
                </router-link>
            </div>
        </el-col>
        <el-col :sm="8">
            <div class="user-role">
                <router-link to="/home/admin/info">
                    <i class="fa fa-user-circle fa-2x hidden-sm-and-up"></i>
                    <span class="hidden-sm-and-down"> {{username}} ( {{roleName}} ) ({{userState}})</span>
                </router-link>
                <span> | </span>
                <span class="logout" @click="logout">退出</span>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import {axiosGet, triggerSideMenu} from "@/utils";

    export default {
        name: "header-menu",
        componentName: "header-menu",
        sockets: {
            changePlatformName(name) {
                this.$store.commit('changePlatformName', name);
            },
            platformChangeFunds(data) {
                this.$store.commit('platformChangeFunds', data);
            }
        },
        methods: {
            showSideMenu() {
                triggerSideMenu();
            },
            async logout() {
                await axiosGet('/platform/auth/logout');
                this.$store.commit('logout');
                this.$router.push('/');
            }
        },
        computed: {
            platformName() {
                let platformName = this.$store.state.platformName;
                return platformName ? platformName : '';
            },
            baseFunds() {
                let baseFunds = this.$store.state.baseFunds;
                return baseFunds ? baseFunds : '';
            },
            profit() {
                let profit = this.$store.state.profit;
                return profit ? profit : '';
            },
            username() {
                let username = this.$store.state.username;
                return username ? username : '';
            },
            roleName() {
                let roleName = this.$store.state.roleName;
                return roleName ? roleName : '';
            },
            userState() {
                let userState = this.$store.state.userState;
                return userState ? userState : '';
            },
        }
    }
</script>

<style lang="scss">

</style>