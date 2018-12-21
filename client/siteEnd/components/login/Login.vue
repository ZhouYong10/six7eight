<template>
    <div class="wrapper">
        <section id="content">
            <h1>678平台管理</h1>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
                     label-width="86px" >
                <el-form-item label="账户名" prop="username">
                    <el-input type="text" v-model.trim="ruleForm.username"
                              autofocus placeholder="请输入账户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"
                              placeholder="请输入账户密码"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="securityCode">
                    <el-row>
                        <el-col :span="12">
                            <el-input type="text" v-model.trim="ruleForm.securityCode"
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
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "site-end-login",
        async created() {
            this.ruleForm.securityImg = await axiosGet('/security/code');
        },
        data() {
            let validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账户名！'));
                }else if (value.length > 25) {
                    callback(new Error('请输入长度小于25位的账户名！'));
                }else {
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账户密码！'));
                } else {
                    callback();
                }
            };
            let validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码！'));
                } else if(value.length !== 4){
                    callback(new Error('请输入4位验证码！'))
                }else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    securityCode: '',
                    securityImg: ''
                },
                rules: {
                    username: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    securityCode: [
                        {validator: validateCode, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            async getCode() {
                this.ruleForm.securityImg = await axiosGet('/security/code');
            },
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let data = await axiosPost('/site/login', {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password,
                            securityCode: this.ruleForm.securityCode.toLowerCase()
                        });
                        if (data) {
                            this.$store.commit('login', data);
                            this.$router.push('/home');
                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style lang="scss">
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
</style>