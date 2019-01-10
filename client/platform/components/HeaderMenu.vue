<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :lg="5" :md="5" :sm="7" :xs="7">
            <div class="menu-btn hidden-sm-and-up" @click="openSideMenu">
                <i class="fa fa-bars fa-2x" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/home">
                    <i class="fa fa-home fa-2x" title="首页"></i>
                    <span class="hidden-sm-and-down">{{platformName}}</span>
                </router-link>
            </div>
        </el-col>
        <el-col :lg="12" :md="12" :sm="6" :xs="5">
            <div class="user-funds" v-if="showProfit">
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
                        <i class="fa fa-cny fa-2x" slot="reference"></i>
                    </el-popover>
                </router-link>
            </div>
        </el-col>
        <el-col :lg="7" :md="7" :sm="11" :xs="12">
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
    import {axiosGet, showSideMenu} from "@/utils";

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
            openSideMenu() {
                showSideMenu();
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
            showProfit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'showBasePriceProfitPlatform';
                });
            }
        }
    }
</script>

<style lang="scss">

</style>