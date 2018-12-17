<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="6">
            <div class="menu-btn" @click="triggerSideMenu">
                <i :class="{'el-icon-close': showSideMenu, 'el-icon-menu': !showSideMenu}" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/home">{{siteName}}</router-link>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="user-funds">
                <span>余额: ￥<span>{{funds}}</span></span>
                &nbsp;&nbsp;&nbsp;
                <span>冻结: ￥<span>{{freezeFunds}}</span></span>
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
    import {axiosGet, pageChangeMsg} from "@/utils";

    export default {
        name: "headerMenu",
        componentName: "headerMenu",
        created() {
            this.registerIoListener();
        },
        data() {
            return {
                showSideMenu: true,
            }
        },
        methods: {
            triggerSideMenu() {
                this.showSideMenu = !this.showSideMenu;
                this.$emit('show-side-menu', this.showSideMenu);
            },
            registerIoListener() {
                // 站点被禁用
                this.$options.sockets[this.siteId + 'siteIsBan'] = () => {
                    pageChangeMsg('当前站点已被禁用了！');
                    this.logout();
                };
                // 修改分站可用金额
                this.$options.sockets[this.siteId + 'changeFunds'] = (funds) => {
                    this.$store.commit('changeFunds', funds);
                };
                // 实时弹出平台发布的公告提示
                this.$options.sockets[this.siteId + 'addPlacardToSiteAdmin'] = (placard) => {
                    this.$message({
                        type: 'warning',
                        duration: 0,
                        showClose: true,
                        dangerouslyUseHTMLString: true,
                        message: '<p style="line-height: 22px; letter-spacing: 1px;">' + placard.content + '</p>'
                    })
                };
                // 修改站点名称
                this.$options.sockets[this.siteId + 'updateSiteName'] = (siteName) => {
                    this.$store.commit('changeSiteName', siteName);
                };
                // 修改分站资金和冻结资金
                this.$options.sockets[this.siteId + 'changeFundsAndFreezeFunds'] = (data) => {
                    this.$store.commit('changeFundsAndFreezeFunds', data);
                };
                // 修改管理员账户状态
                this.$options.sockets[this.userId + 'changeUserState'] = (state) => {
                    if (state === '禁用') {
                        axiosGet('/site/auth/logout').then(() => {
                            this.$store.commit('logout');
                            this.$router.push('/');
                            pageChangeMsg('您的账户被封禁了！');
                        });
                    }else{
                        this.$store.commit('changeUserState', state);
                        if (state === '冻结') {
                            pageChangeMsg('您的账户被冻结了！');
                        } else {
                            pageChangeMsg('您的账户正常启用了！');
                        }
                    }
                };
                // 修改管理员账户角色
                this.$options.sockets[this.userId + 'changeUserRole'] = (data) => {
                    this.$store.commit('changeUserRole', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色变更了！');
                };
                // 修改管理员角色信息
                this.$options.sockets[this.roleId + 'changeRights'] = (data) => {
                    this.$store.commit('changeRights', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色信息变更了！');
                };
            },
            async logout() {
                await axiosGet('/site/auth/logout');
                this.$store.commit('logout');
                this.$router.push('/');
            }
        },
        computed: {
            userId() {
                return this.$store.state.userId;
            },
            userState() {
                return this.$store.state.userState;
            },
            username() {
                return this.$store.state.username;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            roleName() {
                return this.$store.state.roleName;
            },
            siteId() {
                return this.$store.state.siteId;
            },
            siteName() {
                return this.$store.state.siteName;
            },
            funds() {
                return this.$store.state.funds;
            },
            freezeFunds() {
                return this.$store.state.freezeFunds;
            }
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