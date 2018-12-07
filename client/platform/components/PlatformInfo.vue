<template>
    <el-row type="flex" justify="center">
        <el-col :lg="16" :md="20" :sm="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>平台基础信息</span>
                    <el-button style="float: right;"
                               type="primary" size="small"
                               v-if="notEdit && canEdit" @click="notEdit = false">编 辑</el-button>
                </div>
                <el-form ref="form" :model="form" label-width="160px">
                    <el-form-item label="平台名称">
                        <el-input v-model="form.name" :disabled="notEdit"></el-input>
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
                    <el-form-item label="金牌代理升级价格">
                        <el-input-number v-model="form.goldUpPrice" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="超级代理升级价格">
                        <el-input-number v-model="form.superUpPrice" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="用户升级上级分成比例">
                        <el-input-number v-model="form.upperRatio" :min="0" :max="1" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="用户升级站点分成比例">
                        <el-input-number v-model="form.siteRatio" :min="0" :max="1" :controls="false" :disabled="notEdit"></el-input-number>
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
                            <el-button size="small" @click="notEdit = true">取 消</el-button>
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
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminInfo",
        async created() {
            this.form = await axiosGet('/platform/auth/platform/info');
        },
        data() {
            return {
                user: {role:{}},
                notEdit: true,
                form: {
                    name: '',
                    canRegister: true,
                    canAddUser: true,
                    goldUpPrice: '',
                    superUpPrice: '',
                    upperRatio: '',
                    siteRatio: '',
                    siteYearPrice: '',
                }
            };
        },
        methods: {
            async save() {
                this.notEdit = true;
                await axiosPost('/platform/auth/platform/info/update', this.form);
                this.$store.commit('changePlatformName', this.form.name);
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