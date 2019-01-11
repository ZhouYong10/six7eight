<template>
    <el-row type="flex" justify="center">
        <el-col :lg="16" :md="20" :sm="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>平台基础信息</span>
                    <el-button style="float: right;"
                               type="primary" size="small"
                               v-if="notEdit && canEdit" @click="editInfo">编 辑</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="formRules" label-width="126px">
                    <el-form-item label="平台名称" prop="name">
                        <el-input v-model.trim="form.name" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="开放注册">
                        <el-switch
                                v-model="form.canRegister"
                                inactive-text="关闭注册"
                                active-text="开放注册"
                                :disabled="notEdit">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="开发添加下级">
                        <el-switch
                                v-model="form.canAddUser"
                                inactive-text="关闭添加下级"
                                active-text="开放添加下级"
                                :disabled="notEdit">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="用户最少提现金额">
                        <el-input-number v-model="form.userWithdrawMin" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="用户提现手续比例">
                        <el-input-number v-model="form.userWithdrawScale" :min="0" :max="1" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分站最少提现金额">
                        <el-input-number v-model="form.siteWithdrawMin" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分站提现手续比例">
                        <el-input-number v-model="form.siteWithdrawScale" :min="0" :max="1" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分站年费">
                        <el-input-number v-model="form.siteYearPrice" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="平台消费总成本">
                        <span>￥ {{form.baseFunds}}</span>
                    </el-form-item>
                    <el-form-item label="平台消费总利润">
                        <span>￥ {{form.allProfit}}</span>
                    </el-form-item>
                    <el-form-item>
                        <div style="float: right;" v-if="!notEdit">
                            <el-button size="small" @click="cancelEdit">取 消</el-button>
                            <el-button type="primary" size="small"
                                       @click="save">保 存</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";

    export default {
        name: "AdminInfo",
        async created() {
            this.form = await axiosGet('/platform/auth/platform/info');
        },
        data() {
            return {
                notEdit: true,
                form: {
                    name: '',
                    canRegister: true,
                    canAddUser: true,
                    userWithdrawMin: 0,
                    userWithdrawScale: 0,
                    siteWithdrawMin: 0,
                    siteWithdrawScale: 0,
                    siteYearPrice: 0,
                },
                formRules: {
                    name: [
                        { required: true, message: '请输入平台名称！', trigger: 'blur'},
                        { max: 20, message: '长度不能超过20 个字符'},
                    ],
                },
                oldForm: {}
            };
        },
        methods: {
            editInfo() {
                this.notEdit = false;
                this.oldForm = JSON.parse(JSON.stringify(this.form));
            },
            async save() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.notEdit = true;
                        await axiosPost('/platform/auth/platform/info/update', this.form);
                    } else {
                        return false;
                    }
                });
            },
            cancelEdit() {
                this.notEdit = true;
                this.form = this.oldForm;
                this.$refs.form.resetFields();
            }
        },
        computed: {
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editInfoPlatform';
                });
            },
        }
    }
</script>

<style lang="scss">

</style>