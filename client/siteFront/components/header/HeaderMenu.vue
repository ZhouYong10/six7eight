<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :lg="5" :md="5" :sm="7" :xs="6">
            <div class="menu-btn hidden-sm-and-up" @click="openSideMenu">
                <i class="fa fa-bars fa-2x" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/">
                    <i class="fa fa-home fa-2x" title="首页"></i>
                    <span class="hidden-sm-and-down">{{siteName}}</span>
                </router-link>
            </div>
        </el-col>
        <el-col :lg="12" :md="12" :sm="6" :xs="6">
            <div class="user-funds" v-if="isLogin">
                <router-link to="/consume/records">
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
                <div v-if="isLogin">
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
                    <router-link to="/self/info">
                        <i class="fa fa-user-circle fa-2x hidden-sm-and-up"></i>
                        <span class="hidden-sm-and-down"> {{username}} ( {{roleName}} ) ({{userState}})</span>
                    </router-link>
                    <span>&nbsp; | &nbsp;</span>
                    <span class="logout" @click="logout">退 出</span>
                </div>
                <div v-else>
                    <span class="logon" @click="dialogVisible = true">登 录</span>
                    <span v-if="canRegister && canSiteRegister">
                        <span>&nbsp; | &nbsp;</span>
                        <span class="login" @click="registerVisible = true">注 册</span>
                    </span>
                </div>
            </div>
        </el-col>

        <el-dialog class="login-dialog" :visible.sync="dialogVisible" @closed="cancelDialog" @open="loginCode">
            <div class="login-box">
                <div class="content">
                    <h1>{{siteName}}</h1>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
                             label-width="86px" >
                        <el-form-item label="账户名" prop="username">
                            <el-input type="text" v-model.trim="ruleForm.username" autofocus placeholder="请输入账户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password" placeholder="请输入账户密码"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="securityCode">
                            <el-row>
                                <el-col :span="12">
                                    <el-input type="text" v-model.trim="ruleForm.securityCode"
                                              placeholder="不区分大小写"></el-input>
                                </el-col>
                                <el-col :span="9" :offset="3">
                                    <div @click="loginCode" v-html="ruleForm.securityImg"
                                         style="height: 40px; cursor:pointer;">
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="resetForm()">重置</el-button>
                            <el-button type="primary" @click="submitForm()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <el-dialog class="login-dialog" :visible.sync="registerVisible" @closed="cancelRegister" @open="registerCode">
            <div class="login-box">
                <section class="content">
                    <h1>{{siteName}}</h1>
                    <el-form :model="register" status-icon :rules="registerRules" ref="register"
                             label-width="86px" >
                        <el-form-item label="账户名" prop="username">
                            <el-input type="text" v-model.trim="register.username" autofocus placeholder="请输入账户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="register.password" placeholder="请输入账户密码"></el-input>
                        </el-form-item>
                        <el-form-item label="重复密码" prop="rePassword">
                            <el-input type="password" v-model="register.rePassword" placeholder="请重复账户密码"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="securityCode">
                            <el-row>
                                <el-col :span="12">
                                    <el-input type="text" v-model.trim="register.securityCode"
                                              placeholder="不区分大小写"></el-input>
                                </el-col>
                                <el-col :span="9" :offset="3">
                                    <div @click="registerCode" v-html="register.securityImg"
                                         style="height: 40px; cursor:pointer;">
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="resetRegister">重置</el-button>
                            <el-button type="primary" @click="submitRegister">提交</el-button>
                        </el-form-item>
                    </el-form>
                </section>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import {pageChangeMsg, showSideMenu} from "@/utils";
    import {axiosGet, axiosPost} from "@/slfaxios";
    import {hasBackslash} from '@/validaters';
    import message from "@/components/Message.vue";

    export default {
        name: "headerMenu",
        componentName: "headerMenu",
        created() {
            this.registerIoListener(this.siteId);
            this.registerFundsListener(this.isLogin);
        },
        sockets: {
            changePlatformInfo(data) {
                this.$store.commit('changePlatformInfo', data);
            }
        },
        watch: {
            siteId(val) {
                this.registerIoListener(val);
            },
            isLogin(val) {
                this.registerFundsListener(val);
            }
        },
        data() {
            return {
                messages: [],
                showMessage: false,
                dialogVisible: false,
                ruleForm: {
                    username: '',
                    password: '',
                    securityCode: '',
                    securityImg: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账户名！', trigger: 'blur'},
                        { max: 25, message: '长度不能超过25 个字符', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入账户密码！', trigger: 'blur'}
                    ],
                    securityCode: [
                        { required: true, message: '请输入验证码！', trigger: 'blur'},
                        { max: 4, message: '请输入4位验证码！', trigger: 'blur'},
                        { min: 4, message: '请输入4位验证码！', trigger: 'blur'}
                    ]
                },

                registerVisible: false,
                register: {
                    username: '',
                    password: '',
                    rePassword: '',
                    securityCode: '',
                    securityImg: ''
                },
                registerRules: {
                    username: [
                        { required: true, message: '请输入账户名！', trigger: 'blur'},
                        { max: 25, message: '长度不能超过25 个字符', trigger: 'blur'},
                        { validator: async (rule, value, callback)=>{
                                if (!hasBackslash(value)) {
                                    let user = await axiosPost('/user/check/username/exist', {username: value});
                                    if (user) {
                                        callback(new Error('账户: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback(new Error('账户名中不能包含特殊字符“/”!'));
                                }
                            }, trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入账户密码！', trigger: 'blur'},
                        { validator: (rule, value, callback)=>{
                                if (this.register.rePassword !== '') {
                                    this.$refs.register.validateField('rePassword');
                                }
                                callback();
                            }, trigger: 'change'}
                    ],
                    rePassword: [
                        { required: true, message: '请再次输入账户密码！', trigger: 'blur'},
                        {validator: (rule, value, callback) => {
                                if (value !== this.register.password) {
                                    callback(new Error('两次输入的密码不一致！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'change'}
                    ],
                    securityCode: [
                        { required: true, message: '请输入验证码！', trigger: 'blur'},
                        { max: 4, message: '请输入4位验证码！', trigger: 'blur'},
                    ]
                }
            };
        },
        components: {
            'sf-message': message
        },
        methods: {
            openSideMenu() {
                showSideMenu()
            },
            async loadMessages() {
                let [messages, total] = await axiosGet('/user/auth/load/messages');
                this.messages = messages;
                this.$store.commit('changeMessageNum', total);
            },
            async removeMsg(msg) {
                await axiosGet(`/user/auth/delete/message/${msg.id}`);
                this.$store.commit('minusMessageNum');
            },
            async checkMsg(msg) {
                this.showMessage = false;
                this.$router.push(`${msg.frontUrl}?aimId=${msg.aimId}`);
                this.$store.commit('minusMessageNum');
                await axiosGet(`/user/auth/delete/message/${msg.id}`);
            },
            registerFundsListener(userId) {
                if (userId) {
                    // 增加消息提示
                    this.$options.sockets[userId + 'plusMessageNum'] = () => {
                        this.$store.commit('plusMessageNum');
                    };

                    // 修改用户可用金额
                    this.$options.sockets[userId + 'changeFunds'] = (funds) => {
                        this.$store.commit('changeUserFunds', funds);
                    };

                    // 修改账户冻结金额
                    this.$options.sockets[userId + 'changeFreezeFunds'] = (freezeFunds) => {
                        this.$store.commit('changeFreezeFunds', freezeFunds);
                    };

                    // 修改账户可用金额和冻结金额
                    this.$options.sockets[userId + 'changeFundsAndFreezeFunds'] = (data) => {
                        this.$store.commit('changeFundsAndFreezeFunds', data);
                    };

                    // 修改用户状态
                    this.$options.sockets[userId + 'changeState'] = (state) => {
                        if (state === '禁用') {
                            axiosGet('/user/auth/logout').then(() => {
                                axiosGet('/user/init/data').then( (data)=> {
                                    this.$store.commit('logout', data);
                                    this.$router.push('/');
                                    pageChangeMsg('您的账户被封禁了！');
                                });
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

                    // 修改用户角色信息
                    this.$options.sockets[this.roleId + 'changeRights'] = (data) => {
                        this.$store.commit('changeRights', data);
                        this.$router.push('/');
                        pageChangeMsg('您的角色权限变更了！');
                    };
                }
            },
            registerIoListener(siteId) {
                if (siteId) {
                    // 公告提示
                    this.$options.sockets[siteId + 'addPlacardToFrontUser'] = (placard) => {
                        this.$message({
                            type: 'warning',
                            duration: 0,
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: '<p style="line-height: 22px; letter-spacing: 1px;">' + placard.content + '</p>'
                        })
                    };
                    this.$options.sockets[siteId + 'editPlacardToFrontUser'] = (placard) => {
                        this.$message({
                            type: 'warning',
                            duration: 0,
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: '<p style="line-height: 22px; letter-spacing: 1px;">' + placard.content + '</p>'
                        })
                    };

                    this.$options.sockets[siteId + 'updateSiteName'] = (siteName) => {
                        this.$store.commit('changeSiteName', siteName);
                    };

                    this.$options.sockets[siteId + 'changeCanSiteRegister'] = (canSiteRegister) => {
                        this.$store.commit('changeCanSiteRegister', canSiteRegister);
                    };
                }
            },
            logout() {
                axiosGet('/user/auth/logout').then(() => {
                    axiosGet('/user/init/data').then( (data)=> {
                        this.$store.commit('logout', data);
                        this.$router.push('/');
                    });
                });
            },
            async loginCode() {
                this.ruleForm.securityImg = await this.getCode();
            },
            async registerCode() {
                this.register.securityImg = await this.getCode();
            },
            cancelDialog() {
                this.ruleForm = {
                    username: '',
                    password: '',
                    securityCode: '',
                    securityImg: ''
                };
                this.resetForm()
            },
            cancelRegister() {
                this.register = {
                    username: '',
                    password: '',
                    rePassword: '',
                    securityCode: '',
                    securityImg: ''
                };
                this.resetRegister();
            },
            async getCode() {
                return await axiosGet('/security/code');
            },
            submitForm() {
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        if (!this.ruleForm.isCommitted) {
                            this.ruleForm.isCommitted = true;
                            let data = await axiosPost('/user/login', {
                                username: this.ruleForm.username,
                                password: this.ruleForm.password,
                                securityCode: this.ruleForm.securityCode.toLowerCase()
                            });
                            if (data) {
                                this.$store.commit('login', data);
                                this.$router.push('/');
                                this.dialogVisible = false;
                            }else{
                                this.ruleForm.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitRegister() {
                this.$refs.register.validate(async (valid) => {
                    if (valid) {
                        if (!this.register.isCommitted) {
                            this.register.isCommitted = true;
                            let result = await axiosPost('/user/register', {
                                username: this.register.username,
                                password: this.register.password,
                                rePassword: this.register.rePassword,
                                securityCode: this.register.securityCode.toLowerCase()
                            });
                            if (result) {
                                let data = await axiosPost('/user/login', {
                                    username: this.register.username,
                                    password: this.register.password,
                                    securityCode: this.register.securityCode.toLowerCase()
                                });
                                this.$store.commit('login', data);
                                this.$router.push('/');
                                this.registerVisible = false;
                            }else {
                                this.register.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
            resetRegister() {
                this.$refs.register.resetFields();
            }
        },
        computed: {
            canSiteRegister() {
                return this.$store.state.canSiteRegister;
            },
            canRegister() {
                return this.$store.state.canRegister;
            },
            isLogin() {
                return this.$store.state.userId;
            },
            messageNum() {
                return this.$store.state.messageNum;
            },
            funds() {
                return this.$store.state.funds;
            },
            freezeFunds() {
                return this.$store.state.freezeFunds;
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
            userState() {
                return this.$store.state.userState;
            },
            siteId() {
                return this.$store.state.siteId;
            },
            siteName() {
                return this.$store.state.siteName;
            }
        }
    }
</script>

<style lang="scss">
    .login-dialog{
        background: rgba(0,0,0,0);
        .el-dialog{
            height: 0;
            margin: 0 auto!important;
            width: auto;

            .el-dialog__header, .el-dialog__body{
                padding: 0;
                widows: 0;
                height: 0;
                .el-dialog__headerbtn {
                    display: none;
                }
            }
        }
    }
</style>