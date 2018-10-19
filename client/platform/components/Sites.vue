<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 66px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="建站日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="名称"
                    min-width="180">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="300"
                            trigger="click">
                        <p class="site-desc">名称: {{ scope.row.name }}</p>
                        <p class="site-desc">域名: {{ scope.row.address }}</p>
                        <p class="site-desc">电话: {{ scope.row.phone }}</p>
                        <p class="site-desc">微信: {{ scope.row.weixin }}</p>
                        <p class="site-desc">qq: {{ scope.row.qq }}</p>
                        <p class="site-desc">email: {{ scope.row.email }}</p>
                        <p class="site-desc">SEO关键字: {{ scope.row.seoKey }}</p>
                        <p class="site-desc">描述: {{ scope.row.description }}</p>
                        <el-button slot="reference">{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="用户可用资金"
                    prop="userFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="用户冻结资金"
                    prop="userFreezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点可用资金"
                    prop="funds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点冻结资金"
                    prop="freezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点返利"
                    prop="profit"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="del(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="站名" prop="name">
                    <el-input v-model="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model="dialog.address"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialog.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model="dialog.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="dialog.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dialog.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="cancelDialog">重置</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!dialog.edit" type="primary" size="small" @click="add">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" size="small" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    const pureSite = {
        name: '',
        address: '',
        phone: '',
        weixin: '',
        qq: '',
        email: ''
    };
    export default {
        name: "Sites",
        async created() {
            this.tableData = await axiosGet('/platform/auth/sites');
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                dialogLabelWidth: '100px',
                dialogTitle: '添加站点',
                dialog: pureSite,
                dialogRules: {
                    name: [
                        { required: true, message: '请输入站点名！'},
                        { max: 48, message: '长度不能超过48个字符！'}

                    ],
                    address: [
                        { required: true, message: '请输入站点域名！'}

                    ]
                }
            }
        },
        methods: {
            cancelDialog() {
                this.dialogTitle = '添加站点';
                this.dialog = pureSite;
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let site = await axiosPost('/platform/auth/site/add', this.dialog);
                        this.tableData.unshift(site);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(site) {
                this.dialog = {
                    id: site.id,
                    name: site.name,
                    address: site.address,
                    phone: site.phone,
                    weixin: site.weixin,
                    qq: site.qq,
                    email: site.email,
                    site: site,
                    edit: true
                };
                this.dialogTitle = '编辑站点';
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let site = await axiosPost('/platform/auth/site/update', this.dialog);
                        this.dialog.site.name = site.name;
                        this.dialog.site.address = site.address;
                        this.dialog.site.phone = site.phone;
                        this.dialog.site.weixin = site.weixin;
                        this.dialog.site.qq = site.qq;
                        this.dialog.site.email = site.email;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            del(id) {
                this.$confirm('此操作将永久删除所选管理员！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/admin/del/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
    }
</script>

<style lang="scss">


</style>