<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                :default-sort = "{prop: 'sortNum', order: 'ascending'}"
                height="93%">
            <el-table-column
                    prop="sortNum"
                    label="排序"
                    sortable
                    width="80">
            </el-table-column>
            <el-table-column
                    label="创建日期"
                    sortable
                    :sort-method="sortByDate"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    label="创建账户"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 'type_site'">{{scope.row.createUser}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="onSale"
                    label="上/下架"
                    min-width="120"
                    :filters="[{text: '平台上架', value: true}]"
                    :filter-multiple="false"
                    :filter-method="filterOnSale"
                    :filtered-value="[true]">
                <template slot-scope="scope">
                    <el-switch v-if="canOnSale"
                               v-model="scope.row.onSale"
                               @change="setOnSale(scope.row)">
                    </el-switch>
                    <span v-else>{{ scope.row.onSale ? '已上架' : '已下架'}}</span>
                </template>
                <!--<template slot-scope="scope">
                    <el-switch v-if="scope.row.type === 'type_site' && canOnSale"
                               v-model="scope.row.onSale"
                               @change="setOnSale(scope.row)">
                    </el-switch>
                    <span v-else>{{ scope.row.onSale ? '已上架' : '已下架'}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <div v-if="scope.row.type === 'type_site' && canEdit">
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                            v-model="dialog.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="排序" prop="sortNum">
                    <el-input-number v-model="dialog.sortNum" :min="1" :step="1" :precision="0" controls-position="right"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!dialog.edit" type="primary" @click="add">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";
    import {sortProductType} from "@/utils";

    export default {
        name: "ProductType",
        async created() {
            this.tableData = await axiosGet('/site/auth/product/types');
            this.$options.sockets[this.roleId + 'addType'] = (type) =>{
                this.tableData.unshift(type);
                this.tableData.sort(sortProductType);
            };
            this.$options.sockets[this.siteId + 'updateType'] = (type) => {
                let aim = this.tableData.find(item => {
                    return item.id === type.id;
                });
                aim.name = type.name;
                aim.onSale = type.onSale;
                aim.sortNum = type.sortNum;
                if (aim.productType) {
                    aim.productType.onSale = type.productType.onSale;
                }
                this.tableData.sort(sortProductType);
            };
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialogTitle: '添加商品类别',
                dialog: {
                    name: '',
                    onSale: true,
                    sortNum: 1,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let oldName;
                                if (this.dialog.type) {
                                    oldName = this.dialog.type.name;
                                }
                                if (value !== oldName) {
                                    let type = await axiosGet('/site/auth/product/type/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品类别: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.onSale ? 'for-sale' : 'not-sale';
            },
            sortByDate(a, b) {
                return Date.parse(a.createTime) - Date.parse(b.createTime);
            },
            cancelDialog() {
                this.dialogTitle = "添加商品类别";
                this.dialog = {
                    name: '',
                    onSale: true,
                    sortNum: 1,
                };
                this.$refs.dialog.resetFields();
            },
            filterOnSale(value, row) {
                if (row.productType) {
                    return row.productType.onSale === value;
                } else {
                    return true;
                }
            },
            async setOnSale(type) {
                let platformOnsale = await axiosGet('/site/auth/product/' + type.id + '/platform/type/onsale');
                if (platformOnsale) {
                    axiosPost('/site/auth/product/type/set/onsale', {id: type.id, onSale: type.onSale});
                } else {
                    type.onSale = false;
                    this.$message.error('该商品类别已被平台下架！');
                }
            },
            // setOnSale(type) {
            //     axiosPost('/site/auth/product/type/set/onsale', {id: type.id, onSale: type.onSale});
            // },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/site/auth/product/type/add', {
                                name: this.dialog.name,
                                onSale: this.dialog.onSale,
                                sortNum: this.dialog.sortNum
                            });
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            edit(type) {
                this.dialogTitle = '编辑商品类别';
                this.dialog = {
                    id: type.id,
                    name: type.name,
                    onSale: type.onSale,
                    sortNum: type.sortNum,
                    type: type,
                    edit: true
                };
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/site/auth/product/type/update', {
                                id: this.dialog.id,
                                name: this.dialog.name,
                                onSale: this.dialog.onSale,
                                sortNum: this.dialog.sortNum,
                            });
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        computed:{
            siteId() {
                return this.$store.state.siteId;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addProductTypeSite';
                });
            },
            canOnSale() {
                return this.$store.state.permissions.some(item => {
                    return item === 'onSaleProductTypeSite';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editProductTypeSite';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .for-sale {
        background: #F0F9EB;
    }

    .el-table .not-sale {
        background: #FEF0F0;
    }
</style>