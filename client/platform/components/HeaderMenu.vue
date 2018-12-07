<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="6">
            <div class="menu-btn" @click="">
                <i class="el-icon-menu" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/home">{{platformName}}</router-link>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="user-funds">
                <span>成本: ￥<span>{{baseFunds}}</span></span>
                &nbsp;&nbsp;&nbsp;
                <router-link to="/home/platform/funds/record">
                    利润: ￥<span>{{profit}}</span>
                </router-link>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="user-role">
                <router-link to="/home/admin/info">
                    {{username}} ( {{roleName}} ) ({{userState}})
                </router-link>
                <span> | </span>
                <span class="logout" @click="logout">退出</span>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "header-menu",
        componentName: "header-menu",
        sockets: {
            changePlatformName(name) {
                this.$store.commit('changePlatformName', name);
            }
        },
        methods: {
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
    .header-menu {
        margin: 0;
        height: inherit;
        background: #1C2326;
        border-radius: 2px;
        .el-col{
            line-height: 50px;
            color: white;
        }
        .menu-btn{
            display: inline-block;
            width: 50px;
            text-align: center;
            cursor: pointer;
            border-right: 2px solid #3E4447;
            i{
                font-size: 30px;
                vertical-align: middle;
            }
        }
        .home{
            display: inline-block;
            padding-left: 5px;
            a{
                color: white;
                text-decoration: none;
                line-height: 50px;
            }
            .router-link-exact-active{
                color: #a7fb25;
            }
        }
        .user-funds{
            text-align: center;
            a{
                color: white;
                text-decoration: none;
            }
            .router-link-active{
                color: #a7fb25;
            }
        }
        .user-role{
            text-align: right;
            padding-right: 20px;
            a{
                color: white;
                text-decoration: none;
            }
            .router-link-active{
                color: #a7fb25;
            }
            .logout{
                cursor: pointer;
            }
        }
    }

</style>