<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="82%">
            <el-table-column
                    label="建站日期"
                    min-width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="名称"
                    min-width="120">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <p class="site-desc">名称: {{ scope.row.name }}</p>
                        <p class="site-desc">域名: {{ scope.row.address }}</p>
                        <p class="site-desc">电话: {{ scope.row.phone }}</p>
                        <p class="site-desc">微信: {{ scope.row.weixin }}</p>
                        <p class="site-desc">qq: {{ scope.row.qq }}</p>
                        <p class="site-desc">email: {{ scope.row.email }}</p>
                        <p class="site-desc">SEO关键字: {{ scope.row.seoKey }}</p>
                        <p class="site-desc">描述: {{ scope.row.description }}</p>
                        <el-button size="small" slot="reference">{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="94">
                <template slot-scope="scope">
                    <el-select v-if="canChangeState" size="small" v-model="scope.row.state" @change="changeSiteState(scope.row)">
                        <el-option value="正常" label="正常"></el-option>
                        <el-option value="冻结" label="冻结"></el-option>
                        <el-option value="禁用" label="禁用"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.state}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="可用资金"
                    min-width="110">
                <template slot-scope="scope">
                    <span class="siteFunds" @click="openSiteFundsRecord(scope.row)">{{scope.row.funds}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="冻结资金"
                    prop="freezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="备注"
                    prop="remark"
                    :show-overflow-tooltip="true"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    label="联系方式"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="bottom"
                            trigger="click">
                        <p class="contact-way">电话: {{ scope.row.phone }}</p>
                        <p class="contact-way">微信: {{ scope.row.weixin }}</p>
                        <p class="contact-way">QQ: {{ scope.row.qq }}</p>
                        <p class="contact-way">Emial: {{ scope.row.email }}</p>
                        <el-button size="small" slot="reference">联系</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button v-if="canEdit"
                               type="primary" size="small"
                               @click="edit(scope.row)">编 辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="text-align: center;"
                :pager-count="5"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20, 25, 30, 35, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTotal">
        </el-pagination>

        <el-dialog title="添加分站" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="管理员名" prop="username">
                    <el-input v-model.trim="dialog.username"></el-input>
                </el-form-item>
                <el-form-item label="站点名" prop="name">
                    <el-input v-model.trim="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model.trim="dialog.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              placeholder="请输入站点备注"
                              v-model="dialog.remark"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model.trim="dialog.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model.trim="dialog.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.trim="dialog.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model.trim="dialog.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="add">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑分站" :visible.sync="dialogEditVisible" top="3vh" width="30%" @closed="cancelDialogEdit">
            <el-form :model="dialogEdit" :rules="dialogEditRules" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="站点名" prop="name">
                    <el-input v-model.trim="dialogEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model.trim="dialogEdit.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              placeholder="请输入站点备注"
                              v-model="dialogEdit.remark"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model.trim="dialogEdit.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model.trim="dialogEdit.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.trim="dialogEdit.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model.trim="dialogEdit.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="update">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="siteFundsTitle" :visible.sync="siteFundsVisible"
                   top="3vh" width="88%" @closed="cancelSiteFunds"
                   :close-on-click-modal="false">
            <el-radio-group v-model="siteFundsChooseType"  size="small" @change="siteFundsTypeChoosed">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="充值"></el-radio-button>
                <el-radio-button label="提现"></el-radio-button>
                <el-radio-button label="消费"></el-radio-button>
                <el-radio-button label="返利"></el-radio-button>
            </el-radio-group>
            <el-table
                    :data="siteFundsRecord"
                    :row-class-name="siteFundsTableRowClassName"
                    height="100%">
                <el-table-column
                        label="日期"
                        :show-overflow-tooltip="true"
                        width="155">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        min-width="60">
                </el-table-column>
                <el-table-column
                        prop="baseFunds"
                        label="成本"
                        min-width="90">
                </el-table-column>
                <el-table-column
                        prop="oldFunds"
                        label="之前利润"
                        min-width="90">
                </el-table-column>
                <el-table-column
                        label="金额"
                        min-width="110">
                    <template slot-scope="scope">
                        <i v-if="scope.row.upOrDown === 'plus_consume'" class="fa fa-plus" style="color: #004eff"></i>
                        <i v-else class="fa fa-minus" style="color: #ff2525"></i>
                        <span>{{ scope.row.funds}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="newFunds"
                        label="之后利润"
                        min-width="90">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述"
                        min-width="200">
                </el-table-column>
            </el-table>
            <el-pagination
                    style="text-align: center;"
                    :pager-count="5"
                    @size-change="siteFundsHandleSizeChange"
                    @current-change="siteFundsHandleCurrentChange"
                    :current-page="siteFundsCurrentPage"
                    :page-sizes="[5, 10, 15, 20, 25, 30, 35, 40]"
                    :page-size="siteFundsPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="siteFundsDataTotal">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";
    import {hasBackslash} from "@/validaters";

    export default {
        name: "Sites",
        async created() {
            await this.getTableData();
        },
        sockets: {
            mgSiteChangeState(site) {
                let aim = this.tableData.find((item) => {
                    return item.id === site.id;
                });
                aim.state = site.state;
            }
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogLabelWidth: '100px',
                dialogVisible: false,
                dialog: {
                    username: '',
                    name: '',
                    address: '',
                    remark: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogRules: {
                    username: [
                        { required: true, message: '请输入站点管理员账户名！', trigger: 'blur'},
                        { max: 20, message: '长度不能超过20个字符！'},
                        {validator: async (rule, value, callback) => {
                                if (!hasBackslash(value)) {
                                    let admin = await axiosPost('/platform/auth/site/admin/username/exist', {username: value});
                                    if (admin) {
                                        callback(new Error('账户名： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }else{
                                    callback(new Error('管理员账户名中不能包含特殊字符“/”!'));
                                }
                            }, trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '请输入站点名称！', trigger: 'blur'},
                        { max: 16, message: '长度不能超过16个字符！'},
                        {validator: async (rule, value, callback) => {
                                if (!hasBackslash(value)) {
                                    let site = await axiosPost('/platform/auth/site/name/exist', {name: value});
                                    if (site) {
                                        callback(new Error('分站： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }else{
                                    callback(new Error('站点名中不能包含特殊字符“/”!'));
                                }
                            }, trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '请输入站点域名！', trigger: 'blur'},
                        {validator: async (rule, value, callback) => {
                                let site = await axiosPost('/platform/auth/site/address/exist', {address: value});
                                if (site) {
                                    callback(new Error('分站域名： ' + value + ' 已经存在！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    remark: [
                        { max: 1000, message: '备注内容不能超过1000个字符！', trigger: 'blur'},
                    ],
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
                dialogEditVisible: false,
                dialogEdit: {
                    name: '',
                    address: '',
                    remark: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogEditRules: {
                    name: [
                        { required: true, message: '请输入站点名称！'},
                        { max: 16, message: '长度不能超过16个字符！'},
                        {validator: async (rule, value, callback) => {
                                if (!hasBackslash(value)) {
                                    let oldName = this.dialogEdit.site.name;
                                    if (value !== oldName) {
                                        let site = await axiosPost('/platform/auth/site/name/exist', {name: value});
                                        if (site) {
                                            callback(new Error('分站： ' + value + ' 已经存在！'));
                                        }else {
                                            callback();
                                        }
                                    }
                                }else{
                                    callback(new Error('站点名中不能包含特殊字符“/”!'));
                                }
                            }, trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '请输入站点域名！'},
                        {validator: async (rule, value, callback) => {
                                let oldAddress = this.dialogEdit.site.address;
                                if (value !== oldAddress) {
                                    let site = await axiosPost('/platform/auth/site/address/exist', {address: value});
                                    if (site) {
                                        callback(new Error('分站域名： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ],
                    remark: [
                        { max: 1000, message: '备注内容不能超过1000个字符！', trigger: 'blur'},
                    ],
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
                siteFundsVisible: false,
                siteFundsTitle: '',
                siteFundsAimSiteId: '',
                siteFundsChooseType: '全部',
                siteFundsRecord: [],
                siteFundsCurrentPage: 1,
                siteFundsPageSize: 10,
                siteFundsDataTotal: 0,
            }
        },
        methods: {
            async openSiteFundsRecord(site) {
                this.siteFundsAimSiteId = site.id;
                await this.loadSiteFundsRecord();
                this.siteFundsTitle = `${site.name} 的资金记录:`;
                this.siteFundsVisible = true;
            },
            siteFundsTableRowClassName({row}) {
                return row.upOrDown;
            },
            async siteFundsTypeChoosed() {
                this.siteFundsCurrentPage = 1;
                await this.loadSiteFundsRecord();
            },
            cancelSiteFunds() {
                this.siteFundsTitle = '';
                this.siteFundsPageSize = 10;
                this.siteFundsCurrentPage = 1;
                this.siteFundsDataTotal = 0;
                this.siteFundsRecord = [];
                this.siteFundsAimSiteId = '';
                this.siteFundsChooseType = '全部';
            },
            async siteFundsHandleSizeChange(size) {
                this.siteFundsPageSize = size;
                await this.loadSiteFundsRecord();
            },
            async siteFundsHandleCurrentChange(page) {
                this.siteFundsCurrentPage = page;
                await this.loadSiteFundsRecord();
            },
            async loadSiteFundsRecord() {
                let [datas, total] = await axiosGet(`/platform/auth/site/${this.siteFundsAimSiteId}/funds/records/${this.siteFundsChooseType}?currentPage=${this.siteFundsCurrentPage}&pageSize=${this.siteFundsPageSize}`);
                this.siteFundsRecord = datas;
                this.siteFundsDataTotal = total;
            },
            tableRowClassName({row}) {
                switch (row.state){
                    case '正常':
                        return 'normal-row';
                    case '冻结':
                        return 'freeze-row';
                    default:
                        return 'ban-row';
                }
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/sites?currentPage=' +
                    this.currentPage + '&pageSize=' + this.pageSize);
                this.tableData = datas;
                this.dataTotal = total;
            },
            async handleSizeChange(size) {
                this.pageSize = size;
                await this.getTableData();
            },
            async handleCurrentChange(page) {
                this.currentPage = page;
                await this.getTableData();
            },
            cancelDialog() {
                this.dialog = {
                    username: '',
                    name: '',
                    address: '',
                    remark: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialog.resetFields();
            },
            cancelDialogEdit() {
                this.dialogEdit = {
                    name: '',
                    address: '',
                    remark: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialogEdit.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let site = await axiosPost('/platform/auth/site/add', this.dialog);
                            if (site) {
                                this.tableData.unshift(site);
                                this.dialogVisible = false;
                            }else{
                                this.dialog.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            async changeSiteState(site) {
                await axiosPost('/platform/auth/site/change/state', {id: site.id, state: site.state});
            },
            edit(site) {
                this.dialogEdit = {
                    id: site.id,
                    name: site.name,
                    address: site.address,
                    remark: site.remark,
                    phone: site.phone,
                    weixin: site.weixin,
                    qq: site.qq,
                    email: site.email,
                    site: site
                };
                this.dialogEditVisible = true;
            },
            update() {
                this.$refs.dialogEdit.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialogEdit.isCommitted) {
                            this.dialogEdit.isCommitted = true;
                            let info = this.dialogEdit;
                            let result = await axiosPost('/platform/auth/site/update', {
                                id: info.id,
                                name: info.name,
                                address: info.address,
                                remark: info.remark,
                                phone: info.phone,
                                weixin: info.weixin,
                                qq: info.qq,
                                email: info.email
                            });
                            if (result) {
                                let site = this.dialogEdit.site;
                                site.name = info.name;
                                site.address = info.address;
                                site.remark = info.remark;
                                site.phone = info.phone;
                                site.weixin = info.weixin;
                                site.qq = info.qq;
                                site.email = info.email;
                                this.dialogEditVisible = false;
                            }else{
                                this.dialogEdit.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addSitePlatform';
                });
            },
            canChangeState() {
                return this.$store.state.permissions.some(item => {
                    return item === 'changeSiteStatePlatform';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editSitePlatform';
                });
            },
        }
    }
</script>

<style lang="scss">
    .el-table .normal-row {
        background: #F0F9EB;
    }

    .el-table .freeze-row {
        background: #FDF5E6;
    }

    .el-table .ban-row {
        background: #FEF0F0;
    }
    .siteFunds{
        cursor: pointer;
        color: #78ade2;
    }
    .siteFunds:hover {
        color: #409EFF;
    }
    .el-table .plus_consume {
        background: #F0F9EB;
    }
    .el-table .minus_consume {
        background: #FEF0F0;
    }
</style>