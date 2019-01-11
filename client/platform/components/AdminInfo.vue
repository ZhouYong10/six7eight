<template>
    <el-row type="flex" justify="center">
        <el-col :lg="16" :md="20" :sm="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账户信息</span>
                    <el-button style="float: right;"
                               type="primary" size="small"
                               v-if="notEdit" @click="userEdit">编 辑</el-button>
                </div>
                <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
                    <el-form-item label="开户时间">
                        {{user.registerTime}}
                    </el-form-item>
                    <el-form-item label="最近登录时间">
                        {{user.lastLoginTime}}
                    </el-form-item>
                    <el-form-item label="账户名">
                        {{user.username}}
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-button type="primary" plain size="small" @click="dialogVisible = true">重置密码</el-button>
                    </el-form-item>
                    <el-form-item label="状态">
                        {{user.state}}
                    </el-form-item>
                    <el-form-item label="角色">
                        {{user.role ? user.role.name : ''}}
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model.trim="user.phone" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="微信" prop="weixin">
                        <el-input v-model.trim="user.weixin" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input v-model.trim="user.qq" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model.trim="user.email" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div style="float: right;" v-if="!notEdit">
                            <el-button size="small" @click="cancelUserEdit">取 消</el-button>
                            <el-button type="primary" size="small"
                                       @click="saveUser">保 存</el-button>
                        </div>
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePass">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";

    export default {
        name: "AdminInfo",
        async created() {
            this.user = await axiosGet('/platform/auth/admin/info/' + this.userId);
        },
        data() {
            return {
                user: {},
                oldUser: {},
                notEdit: true,
                userRules: {
                    phone: [
                        {max: 14, message: '长度不能超过14个字符！', trigger: 'blur'}
                    ],
                    weixin: [
                        {max: 18, message: '长度不能超过18个字符！', trigger: 'blur'}
                    ],
                    qq: [
                        {max: 16, message: '长度不能超过16个字符！', trigger: 'blur'}
                    ],
                    email: [
                        {max: 32, message: '长度不能超过32个字符！', trigger: 'blur'}
                    ]
                },
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
                            if(await axiosPost('/platform/auth/compare/pass', {password: value})){
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
            userEdit() {
                this.notEdit = false;
                this.oldUser = JSON.parse(JSON.stringify(this.user));
            },
            async saveUser() {
                this.$refs.userForm.validate(async (valid) => {
                    if (valid) {
                        this.notEdit = true;
                        await axiosPost('/platform/auth/adminInfo/update', {
                            id: this.user.id,
                            phone: this.user.phone,
                            weixin: this.user.weixin,
                            qq: this.user.qq,
                            email: this.user.email
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancelUserEdit() {
                this.notEdit = true;
                this.user = this.oldUser;
                this.$refs.userForm.resetFields();
            },
            cancelDialog() {
                this.$refs.rePassForm.resetFields();
            },
            changePass() {
                this.$refs.rePassForm.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/platform/auth/change/pass', {pass: this.form.newPass});
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            userId() {
                return this.$store.state.userId;
            }
        }
    }
</script>

<style lang="scss">

</style>