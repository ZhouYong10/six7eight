<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :lg="5" :md="5" :sm="7" :xs="7">
            <div class="menu-btn hidden-sm-and-up" @click="openSideMenu">
                <i class="fa fa-bars fa-2x" title="菜单"></i>
                <el-badge :value="dealMessageNum" :hidden="dealMessageNum < 1"
                          class="message-badge"/>
            </div>
            <div class="home">
                <router-link to="/home">
                    <i class="fa fa-home fa-2x" title="首页"></i>
                    <span class="hidden-sm-and-down">{{siteName}}</span>
                </router-link>
                <i class="fa fa-refresh fa-2x"
                   style="cursor: pointer; margin-left: 12px;"
                   @click="refreshTips"
                   title="刷新提示消息"></i>
            </div>
        </el-col>
        <el-col :lg="12" :md="12" :sm="6" :xs="5">
            <div class="user-funds" v-if="showFundsSite">
                <router-link to="/home/consume/records">
                    <span class="hidden-sm-and-down">
                    <span>余额: ￥</span><span>{{funds}}</span>
                    &nbsp;&nbsp;&nbsp;
                    <span>冻结: ￥</span><span>{{freezeFunds}}</span>
                </span>
                    <el-popover
                            class="hidden-sm-and-up"
                            placement="bottom"
                            trigger="click">
                        <p>余额:￥ <span>{{funds}}</span></p>
                        <p>冻结:￥ <span>{{freezeFunds}}</span></p>
                        <i class="fa fa-cny fa-2x" slot="reference"></i>
                    </el-popover>
                </router-link>
            </div>
        </el-col>
        <el-col :lg="7" :md="7" :sm="11" :xs="12">
            <div class="user-role">
                <el-popover
                        popper-class="popover-message"
                        @show="loadMessages"
                        v-model="showMessage"
                        placement="bottom"
                        trigger="click">
                    <sf-message :data.sync="messages" @remove="removeMsg" @check="checkMsg"></sf-message>
                    <div slot="reference" style="display: inline-block">
                            <span class="message hidden-sm-and-up" style="position: relative;">
                                <i class="fa fa-envelope fa-2x"></i>
                                <el-badge :value="messageNum" :hidden="messageNum < 1"
                                          class="message-badge" style="position: absolute; top: -21px; left: 18px;"/>
                            </span>

                        <span class="message hidden-sm-and-down" style="position: relative;">
                                <span>消 息</span>
                                <el-badge :value="messageNum" :hidden="messageNum < 1"
                                          class="message-badge" style="position: absolute; top: -24px; left: 22px;"/>
                            </span>
                    </div>
                </el-popover>
                <span>&nbsp;  &nbsp;</span>
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
    import {pageChangeMsg, showSideMenu} from "@/utils";
    import {axiosGet} from "@/slfaxios";
    import message from "@/components/Message.vue";

    export default {
        name: "headerMenu",
        componentName: "headerMenu",
        created() {
            this.registerIoListener();
        },
        components: {
            'sf-message': message
        },
        data() {
            return {
                messages: [],
                showMessage: false
            }
        },
        methods: {
            openSideMenu() {
                showSideMenu();
            },
            async refreshTips(e) {
                let classList = e.target.classList;
                classList.add('fa-spin');
                let datas = await axiosGet('/site/auth/refresh/menus/messages');
                this.$store.commit('login', datas);
                this.$message({
                    message: '刷新成功！',
                    type: 'success',
                    duration: 1500
                });
                classList.remove('fa-spin');
            },
            async loadMessages() {
                let [messages, total] = await axiosGet('/site/auth/load/user/messages');
                this.messages = messages;
                this.$store.commit('changeMessageNum', total);
            },
            async removeMsg(msg) {
                await axiosGet(`/site/auth/delete/message/${msg.id}`);
                this.$store.commit('minusMessageNum');
            },
            async checkMsg(msg) {
                this.showMessage = false;
                this.$router.push(`${msg.frontUrl}?aimId=${msg.aimId}`);
                this.$store.commit('minusMessageNum');
                await axiosGet(`/site/auth/delete/message/${msg.id}`);
            },
            registerIoListener() {
                // 增加用户消息提示
                this.$options.sockets[this.userId + 'plusMessageNum'] = () => {
                    this.$store.commit('plusMessageNum');
                };
                // 站点被禁用
                this.$options.sockets[this.siteId + 'siteIsBan'] = () => {
                    pageChangeMsg('当前站点已被禁用了！');
                    this.logout();
                };
                // 修改分站可用金额
                this.$options.sockets[this.siteId + 'changeFunds'] = (funds) => {
                    this.$store.commit('changeFunds', funds);
                };
                // 修改分站冻结金额
                this.$options.sockets[this.siteId + 'changeFreezeFunds'] = (freezeFunds) => {
                    this.$store.commit('changeFreezeFunds', freezeFunds);
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
                this.$options.sockets[this.siteId + 'editPlacardToSiteAdmin'] = (placard) => {
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
            dealMessageNum() {
                let menus = this.$store.state.menus;
                let num = 0;
                menus.forEach(menu => {
                    num += menu.waitCount;
                });
                return num;
            },
            messageNum() {
                return this.$store.state.messageNum;
            },
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
            },
            showFundsSite() {
                return this.$store.state.permissions.some(item => {
                    return item === 'showFundsSite';
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