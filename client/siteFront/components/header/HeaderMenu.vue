<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="6">
            <div class="menu-btn" @click="triggerSideMenu">
                <i :class="{'el-icon-close': showSideMenu, 'el-icon-menu': !showSideMenu}" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/">{{siteName}}</router-link>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="user-funds" v-if="isLogin">
                <span>余额:￥ <span>{{funds}}</span></span>
                &nbsp;&nbsp;&nbsp;
                <span>冻结:￥ <span>{{freezeFunds}}</span></span>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="user-role">
                <span v-if="isLogin">
                    <router-link to="/self/info">
                        {{username}} ( {{roleName}} ) ({{userState}})
                    </router-link>
                    <span> | </span>
                    <span class="logout" @click="logout">退出</span>
                </span>
                <span v-else>
                    <span class="logon" @click="dialogVisible = true">登录</span>
                    <span v-if="canRegister && canSiteRegister">
                        <span> | </span>
                        <span class="login" @click="registerVisible = true">注册</span>
                    </span>
                </span>
            </div>
        </el-col>

        <el-dialog :visible.sync="dialogVisible" fullscreen @closed="cancelDialog" @open="loginCode">
            <div class="wrapper">
                <section class="content">
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
                </section>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="registerVisible" fullscreen @closed="cancelRegister" @open="registerCode">
            <div class="wrapper">
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
    import {axiosGet, axiosPost, pageChangeMsg} from "@/utils";

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
                showSideMenu: true,
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
                                let user = await axiosGet('/user/check/' + value + '/exist');
                                if (user) {
                                    callback(new Error('账户: ' + value + ' 已经存在！'));
                                } else {
                                    callback();
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
                        { min: 4, message: '请输入4位验证码！', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            triggerSideMenu() {
                this.showSideMenu = !this.showSideMenu;
                this.$emit('show-side-menu', this.showSideMenu);
            },
            registerFundsListener(userId) {
                if (userId) {
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
                this.resetForm()
            },
            cancelRegister() {
                this.resetRegister();
            },
            async getCode() {
                return await axiosGet('/security/code');
            },
            submitForm() {
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        let data = await axiosPost('/user/login', {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password,
                            securityCode: this.ruleForm.securityCode.toLowerCase()
                        });
                        if (data) {
                            this.$store.commit('login', data);
                            this.$router.push('/');
                            this.dialogVisible = false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitRegister() {
                this.$refs.register.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/user/register', {
                            username: this.register.username,
                            password: this.register.password,
                            rePassword: this.register.rePassword,
                            securityCode: this.register.securityCode.toLowerCase()
                        });
                        let data = await axiosPost('/user/login', {
                            username: this.register.username,
                            password: this.register.password,
                            securityCode: this.register.securityCode.toLowerCase()
                        });
                        if (data) {
                            this.$store.commit('login', data);
                            this.$router.push('/');
                            this.registerVisible = false;
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
                color: #409EFF;
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
                color: #409EFF;
            }
            .logon, .logout, .login{
                cursor: pointer;
            }
        }

        .el-dialog__header {
            padding: 0;
            button{
                z-index: 100;
                .el-dialog__close{
                    color: white;
                }
                .el-dialog__close:hover{
                    color: #000;
                }
            }
        }
        .el-dialog__body{
            padding: 0;
            height: inherit;
        }
        @keyframes animate-cloud{
            from {
                background-position: 600px 100%;
            }
            to {
                background-position: 0 100%;
            }
        }
        .wrapper{
            background:url(cloud.jpg) 0 bottom repeat-x  #049ec4;
            animation: animate-cloud 20s linear infinite;
            width: auto;
            height: 100%;
            position: relative;
            z-index: 0;
        }
        .content {
            background: #f9f9f9;
            background: linear-gradient(top,  rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
            box-shadow: 0 1px 0 #fff inset;
            border: 1px solid #c4c6ca;
            margin: 0 auto;
            padding: 25px 0 0;
            position: relative;
            top: 136px;
            text-align: center;
            text-shadow: 0 1px 0 #fff;
            width: 400px;
        }
        .content h1 {
            color: #7E7E7E;
            font: bold 25px Helvetica, Arial, sans-serif;
            letter-spacing: -0.05em;
            line-height: 20px;
            margin: 0 0 30px;
        }
        .content h1:before,
        .content h1:after {
            content: "";
            height: 1px;
            position: absolute;
            top: 36px;
            width: 27%;
        }
        .content h1:after {
            background: rgb(126,126,126);
            background: linear-gradient(left,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
            right: 12px;
        }
        .content h1:before {
            background: rgb(126,126,126);
            background: linear-gradient(right,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
            left: 12px;
        }
        .content:after,
        .content:before {
            background: #f9f9f9;
            background: linear-gradient(top,  rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
            border: 1px solid #c4c6ca;
            content: "";
            display: block;
            height: 100%;
            left: -1px;
            position: absolute;
            width: 100%;
        }
        .content:after {
            transform: rotate(3deg);
            top: 0;
            z-index: -1;
        }
        .content:before {
            transform: rotate(-3deg);
            top: 0;
            z-index: -1;
        }
        .content form {
            padding: 0 30px 0 0;
        }
    }

</style>