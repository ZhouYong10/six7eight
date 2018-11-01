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
                    min-width="100">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <p class="attr-desc" v-for="attr in scope.row.attrs">
                            {{ attr.name }}
                            <span v-if="attr.min">(最少: {{attr.min}})</span>
                        </p>
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
                    label="上/下架"
                    min-width="70">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="small" @click="setOnSale(scope.row)">
                        {{ scope.row.onSale ? '下 架' : '上 架'}}
                    </el-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="36%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="类别" prop="type">
                    <el-select v-model="dialog.productType.name" placeholder="请选择商品类别" @visible-change="loadProductTypes">
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

    const pureProduct = {
        productType: {},
        name: '',
        price: '',
        sitePrice: '',
        topPrice: '',
        superPrice: '',
        goldPrice: '',
        onSale: true,
        attrs: [{name: '数量', min: 500}]
    };

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
                dialogTitle: '添加商品',
                dialog: pureProduct,
                rules: {
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let oldName;
                                if (this.dialog.product) {
                                    oldName = this.dialog.product.name;
                                }
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
            async setOnSale(product) {
                await axiosPost('/platform/auth/product/set/onsale', {id: product.id, onSale: product.onSale});
                product.onSale = !product.onSale;
            },
            cancelDialog() {
                this.dialogTitle = '添加商品';
                this.dialog = pureProduct;
                this.$refs.dialog.resetFields();
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
            add() {
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
            edit(product) {
                this.dialog = {
                    id: product.id,
                    productType: product.productType,
                    name: product.name,
                    price: product.price,
                    sitePrice: product.sitePrice,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    onSale: product.onSale,
                    attrs: product.attrs,
                    product: product,
                    edit: true
                };
                this.dialogTitle = '编辑商品';
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let updatedProduct = await axiosPost('/platform/auth/product/update', this.dialog);
                        this.dialog.product.productType = updatedProduct.productType;
                        this.dialog.product.name = updatedProduct.name;
                        this.dialog.product.price = updatedProduct.price;
                        this.dialog.product.sitePrice = updatedProduct.sitePrice;
                        this.dialog.product.topPrice = updatedProduct.topPrice;
                        this.dialog.product.superPrice = updatedProduct.superPrice;
                        this.dialog.product.goldPrice = updatedProduct.goldPrice;
                        this.dialog.product.onSale = updatedProduct.onSale;
                        this.dialog.product.attrs = updatedProduct.attrs;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            remove(id) {
                this.$confirm('此操作将永久删除所选商品！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/product/remove/' + id);
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

    .attr-desc{
        margin: 6px 0;
    }
</style>