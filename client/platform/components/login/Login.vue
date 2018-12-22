<template>
    <div class="login-box">
        <section class="content">
            <h1>管理员登录</h1>
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
                    <el-button @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "platformLogin",
        async created() {
            this.ruleForm.securityImg = await axiosGet('/security/code');
        },
        data() {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    securityCode: '',
                    securityImg: ''
                },
                rules: {
                    username: [
                        { validator: (rule, value, callback) => {
                                if (value === '') {
                                    callback(new Error('请输入账户名！'));
                                }else if (value.length > 25) {
                                    callback(new Error('请输入长度小于25位的账户名！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur' }
                    ],
                    password: [
                        { validator: (rule, value, callback) => {
                                if (value === '') {
                                    callback(new Error('请输入账户密码！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur' }
                    ],
                    securityCode: [
                        {validator: (rule, value, callback) => {
                                if (value === '') {
                                    callback(new Error('请输入验证码！'));
                                } else if(value.length !== 4){
                                    callback(new Error('请输入4位验证码！'))
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            async getCode() {
                this.ruleForm.securityImg = await axiosGet('/security/code');
            },
            submitForm() {
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        let data = await axiosPost('/platform/login', {
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
            resetForm() {
                this.$refs.ruleForm.resetFields();
            }
        }
    }
</script>

<style lang="scss">

</style>