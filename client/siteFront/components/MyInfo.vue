<template>
    <el-row type="flex" justify="center" :gutter="20">
        <el-col>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账户信息</span>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="notEdit" @click="notEdit = false">编 辑</el-button>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="!notEdit" @click="saveUser">保 存</el-button>
                </div>
                <el-form ref="form" :model="user" label-width="120px">
                    <el-form-item label="账户名">
                        <el-input v-model="user.username" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-button type="primary" plain size="small" @click="dialogVisible = true">重置密码</el-button>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="user.phone" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input v-model="user.weixin" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input v-model="user.qq" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="user.email" :disabled="notEdit"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
        <el-col>
            <el-card class="box-card">
                <el-form ref="form" :model="user" label-width="120px">
                    <el-form-item label="开户时间">
                        {{user.registerTime}}
                    </el-form-item>
                    <el-form-item label="最近登录时间">
                        {{user.lastLoginTime}}
                    </el-form-item>
                    <el-form-item label="状态">
                        {{user.state}}
                    </el-form-item>
                    <el-form-item label="角色">
                        {{user.role.name}}
                    </el-form-item>
                    <el-form-item label="可用金额">
                        {{user.funds}}
                    </el-form-item>
                    <el-form-item label="冻结金额">
                        {{user.freezeFunds}}
                    </el-form-item>
                    <el-form-item label="返利金额">
                        {{user.profit}}
                    </el-form-item>
                    <el-form-item label="上级" v-if="user.parent">
                        {{user.parent.username}}
                    </el-form-item>
                    <el-form-item label="下级/人">
                        {{user.childrenNum}}
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-dialog title="重置密码" :visible.sync="dialogVisible" width="30%" @closed="cancelDialog">
            <el-form :model="form" :rules="formRules" ref="rePassForm" label-width="100px">
                <el-form-item label="原密码" prop="pass">
                    <el-input type="password" v-model="form.pass"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="form.newPass"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="rePass">
                    <el-input type="password" v-model="form.rePass"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changePass">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminInfo",
        async created() {
            this.user = await axiosGet('/user/auth/user/info/' + this.userId);
        },
        data() {
            return {
                user: {role:{}},
                notEdit: true,
                dialogVisible: false,
                form: {
                    pass: '',
                    newPass: '',
                    rePass: ''
                },
                formRules: {
                    pass: [
                        {required: true, message: '请输入原密码！', trigger: 'blur'},
                        {validator: async (rule, value, callback) =>{
                            if(await axiosPost('/user/auth/compare/pass', {password: value})){
                                callback();
                            }else{
                                callback(new Error('原密码错误！'));
                            }
                            }, trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码！', trigger: 'blur'},
                        {validator: (rule, value, callback) =>{
                                if(value === this.form.pass){
                                    callback(new Error('新密码不能和原密码相同！'));
                                }
                                callback();
                            }, trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (this.form.rePass !== '') {
                                    this.$refs.rePassForm.validateField('rePass');
                                }
                                callback();
                            }, trigger: 'change'}
                    ],
                    rePass: [
                        {required: true, message: '请重复新密码！', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.form.newPass) {
                                    callback(new Error('两次输入的密码不一致！'));
                                }
                                callback();
                            }, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            async saveUser() {
                this.notEdit = true;
                await axiosPost('/user/auth/user/update', {
                    id: this.user.id,
                    username: this.user.username,
                    phone: this.user.phone,
                    weixin: this.user.weixin,
                    qq: this.user.qq,
                    email: this.user.email
                });
                this.$store.commit('updateUsername', this.user.username);
            },
            cancelDialog() {
                this.$refs.rePassForm.resetFields();
            },
            changePass() {
                this.$refs.rePassForm.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/user/auth/change/pass', {pass: this.form.newPass});
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            userId() {
                return this.$store.state.user.id;
            }
        }
    }
</script>

<style lang="scss">

</style>