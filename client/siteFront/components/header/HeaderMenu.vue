<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="6">
            <div class="menu-btn" @click="">
                <i class="el-icon-menu" title="菜单"></i>
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
                    <span> | </span>
                    <span class="login">注册</span>
                </span>
            </div>
        </el-col>

        <el-dialog :visible.sync="dialogVisible" fullscreen @closed="cancelDialog" @open="openDialog">
            <div class="wrapper">
                <section id="content">
                    <h1>678平台管理</h1>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
                             label-width="86px" >
                        <el-form-item label="账户名" prop="username">
                            <el-input type="text" v-model="ruleForm.username" autofocus></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="securityCode">
                            <el-row>
                                <el-col :span="12">
                                    <el-input type="text" v-model="ruleForm.securityCode"
                                              placeholder="不区分大小写"></el-input>
                                </el-col>
                                <el-col :span="9" :offset="3">
                                    <div @click="getCode()" v-html="ruleForm.securityImg"
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
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "headerMenu",
        componentName: "headerMenu",
        created() {
            this.registerIoListener(this.siteId);
            this.registerFundsListener(this.isLogin);
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
                }
            };
        },
        methods: {
            registerFundsListener(userId) {
                if (userId) {
                    this.$options.sockets[userId + 'changeFreezeFunds'] = (freezeFunds) => {
                        this.$store.commit('changeFreezeFunds', freezeFunds);
                    };
                }
            },
            registerIoListener(siteId) {
                if (siteId) {
                    this.$options.sockets[siteId + 'updateSiteName'] = (siteName) => {
                        this.$store.commit('changeSiteName', siteName);
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
            async openDialog() {
                this.ruleForm.securityImg = await axiosGet('/security/code');
            },
            cancelDialog() {
                this.resetForm()
            },
            async getCode() {
                this.ruleForm.securityImg = await axiosGet('/security/code');
            },
            submitForm() {
                this.$refs['ruleForm'].validate(async (valid) => {
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
            resetForm() {
                this.$refs['ruleForm'].resetFields();
            }
        },
        computed: {
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
        #content {
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
        #content h1 {
            color: #7E7E7E;
            font: bold 25px Helvetica, Arial, sans-serif;
            letter-spacing: -0.05em;
            line-height: 20px;
            margin: 0 0 30px;
        }
        #content h1:before,
        #content h1:after {
            content: "";
            height: 1px;
            position: absolute;
            top: 36px;
            width: 27%;
        }
        #content h1:after {
            background: rgb(126,126,126);
            background: linear-gradient(left,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
            right: 12px;
        }
        #content h1:before {
            background: rgb(126,126,126);
            background: linear-gradient(right,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
            left: 12px;
        }
        #content:after,
        #content:before {
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
        #content:after {
            transform: rotate(3deg);
            top: 0;
            z-index: -1;
        }
        #content:before {
            transform: rotate(-3deg);
            top: 0;
            z-index: -1;
        }
        #content form {
            padding: 0 30px 0 0;
        }
    }

</style>