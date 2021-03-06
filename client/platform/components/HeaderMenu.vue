<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :lg="5" :md="5" :sm="7" :xs="7">
            <div class="menu-btn hidden-sm-and-up" @click="openSideMenu">
                <i class="fa fa-bars fa-2x" title="菜单"></i>
                <el-badge :value="messageNum" :hidden="messageNum < 1"
                          class="message-badge"/>
            </div>
            <div class="home">
                <router-link to="/home">
                    <i class="fa fa-home fa-2x" title="首页"></i>
                    <span class="hidden-sm-and-down">{{platformName}}</span>
                </router-link>
                <i class="fa fa-refresh fa-2x"
                   style="cursor: pointer; margin-left: 12px;"
                   @click="refreshTips"
                   title="刷新提示消息"></i>
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
    import {showSideMenu} from "@/utils";
    import {axiosGet} from "@/slfaxios";

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
            async refreshTips(e) {
                let classList = e.target.classList;
                classList.add('fa-spin');
                let data = await axiosGet('/platform/auth/refresh/menus');
                this.$store.commit('login', data);
                this.$message({
                    message: '刷新成功！',
                    type: 'success',
                    duration: 1500
                });
                classList.remove('fa-spin');
            },
            async logout() {
                await axiosGet('/platform/auth/logout');
                this.$store.commit('logout');
                this.$router.push('/');
            }
        },
        computed: {
            messageNum() {
                let menus = this.$store.state.menus;
                let num = 0;
                menus.forEach(menu => {
                    num += menu.waitCount;
                });
                return num;
            },
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
    .message-badge{
        position: absolute;
        top: -10px;
        left: 24px;
    }
</style>