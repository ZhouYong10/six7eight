<template>
    <div style="height: 100%">

        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 50px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="创建日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="productType.name"
                    label="类别"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="商品属性"
                    min-width="120">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <p class="site-desc" v-for="attr in scope.row.attrs">{{ attr.name }}</p>
                        <el-button slot="reference">商品属性</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="成本价格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="sitePrice"
                    label="分站价格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="topPrice"
                    label="顶级代理价格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="superPrice"
                    label="超级代理价格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="goldPrice"
                    label="金牌代理价格"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="60">
                <template slot-scope="scope">
                    {{ scope.row.onSale ? '上架' : '下架'}}
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加商品" :visible.sync="dialogVisible" top="6vh" width="36%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="类别" prop="type">
                    <el-select v-model="dialog.type" placeholder="请选择商品类别" @visible-change="loadProductTypes">
                        <el-option v-for="type in productTypes"
                                   :key="type.id"
                                   :label="type.name"
                                   :value="type.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="成本价格" prop="price">
                    <el-input v-model="dialog.price"></el-input>
                </el-form-item>
                <el-form-item label="分站价格" prop="sitePrice">
                    <el-input v-model="dialog.sitePrice"></el-input>
                </el-form-item>
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input v-model="dialog.topPrice"></el-input>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input v-model="dialog.superPrice"></el-input>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input v-model="dialog.goldPrice"></el-input>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                            v-model="dialog.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="最少下单数量" prop="num">
                    <el-input-number v-model="dialog.attrs[0].min" :min="100" :step="100" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item
                        v-for="(attr, index) in dialog.attrs"
                        :label="'属性' + (index + 1)"
                        :key="index"
                        :prop="'index'">
                    <el-row>
                        <el-col :span="16">
                            <el-input v-model="attr.name"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button v-if="index != 0" @click.prevent="removeAttr(attr)">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAttr">新增属性</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!dialog.edit" type="primary" @click="add">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "ProductAll",
        async created() {
            this.tableData = await axiosGet('/platform/auth/products');
        },
        data() {
            return {
                tableData: [],
                productTypes: [],
                dialogLabelWidth: '120px',
                dialogVisible: false,
                dialog: {
                    type: '',
                    name: '',
                    price: '',
                    sitePrice: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    attrs: [{name: '数量', min: 500}]
                },
                rules: {
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let oldName = this.dialog.oldName;
                                if (value !== oldName) {
                                    let type = await axiosGet('/platform/auth/product/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品: ' + value + ' 已经存在！'));
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
            async loadProductTypes(isVisible) {
                if (this.productTypes.length < 1 && isVisible) {
                    this.productTypes = await axiosGet('/platform/auth/product/types');
                }
            },
            cancelDialog() {
                this.$refs.dialog.resetFields();
                this.dialog.attrs = [{name: '数量', min: 500}];
            },
            addAttr() {
                this.dialog.attrs.push({
                    name: ''
                });
            },
            removeAttr(item) {
                let index = this.dialog.attrs.indexOf(item);
                if (index !== -1) {
                    this.dialog.attrs.splice(index, 1)
                }
            },
            async add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let type = await axiosPost('/platform/auth/product/add', this.dialog);
                        this.tableData.unshift(type);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(type) {
                this.dialogVisible = true;
                this.dialog.id = type.id;
                this.dialog.name = type.name;
                this.dialog.oldName = type.name;
                this.dialog.onSale = type.onSale;
                this.dialog.type = type;
                this.dialog.edit = true;
            },
            async update() {
                await axiosPost('/platform/auth/product/type/update', {
                    id: this.dialog.id,
                    name: this.dialog.name,
                    onSale: this.dialog.onSale
                });
                this.dialog.type.name = this.dialog.name;
                this.dialog.type.onSale = this.dialog.onSale;
                this.dialogVisible = false;
            },
            async remove(id) {
                this.$confirm('此操作将永久删除所选角色！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/role/remove/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
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