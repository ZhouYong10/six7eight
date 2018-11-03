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

        <el-dialog title="添加商品" :visible.sync="dialogVisible" top="6vh" width="36%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="类别" prop="productTypeId">
                    <el-select v-model="dialog.productTypeId" placeholder="请选择商品类别" @visible-change="loadProductTypes">
                        <el-option v-for="type in productTypes"
                                   :key="type.id"
                                   :label="type.name"
                                   :value="type.id"></el-option>
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
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑商品" :visible.sync="dialogEditVisible" top="6vh" width="36%" @closed="cancelDialogEdit">
            <el-form :model="dialogEdit" :rules="rulesEdit" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialogEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="成本价格" prop="price">
                    <el-input v-model="dialogEdit.price"></el-input>
                </el-form-item>
                <el-form-item label="分站价格" prop="sitePrice">
                    <el-input v-model="dialogEdit.sitePrice"></el-input>
                </el-form-item>
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input v-model="dialogEdit.topPrice"></el-input>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input v-model="dialogEdit.superPrice"></el-input>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input v-model="dialogEdit.goldPrice"></el-input>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                            v-model="dialogEdit.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="最少下单数量" prop="num">
                    <el-input-number v-model="dialogEdit.attrs[0].min" :min="100" :step="100" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item
                        v-for="(attr, index) in dialogEdit.attrs"
                        :label="'属性' + (index + 1)"
                        :key="index"
                        :prop="'index'">
                    <el-row>
                        <el-col :span="16">
                            <el-input v-model="attr.name"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button v-if="index != 0" @click.prevent="removeEditAttr(attr)">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditAttr">新增属性</el-button>
                <el-button @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost, deepClone} from "@/utils";
    import {isNum} from "@/validaters";

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
                    productTypeId: '',
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
                    productTypeId: [
                        {required: true, message: '请选择商品类别!', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入商品名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let typeId = this.dialog.productTypeId;
                                if (typeId) {
                                    let type = await axiosGet('/platform/auth/' + typeId + '/product/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    price: [
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                if (isNum(value)) {
                                    if (parseFloat(value) < 0) {
                                        callback(new Error('价格不能为负数！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    sitePrice: [
                        { required: true, message: '请填写商品分站价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let price = parseFloat(this.dialog.price);
                                if (isNum(value)) {
                                    if (parseFloat(value) < price) {
                                        callback(new Error('分站价格不能低于成本价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let sitePrice = parseFloat(this.dialog.sitePrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < sitePrice) {
                                        callback(new Error('顶级代理价格不能低于分站价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let topPrice = parseFloat(this.dialog.topPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < topPrice) {
                                        callback(new Error('超级代理价格不能低于顶级代理价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let superPrice = parseFloat(this.dialog.superPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < superPrice) {
                                        callback(new Error('金牌代理价格不能低于超级代理价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                },
                dialogEditVisible: false,
                dialogEdit: {
                    name: '',
                    price: '',
                    sitePrice: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    attrs: [{name: '数量', min: 500}]
                },
                rulesEdit: {
                    name: [
                        {required: true, message: '请输入商品名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let typeId = this.dialogEdit.product.productType.id;
                                let oldName = this.dialogEdit.product.name;
                                if (value !== oldName) {
                                    let type = await axiosGet('/platform/auth/' + typeId + '/product/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    price: [
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                if (isNum(value)) {
                                    if (parseFloat(value) < 0) {
                                        callback(new Error('价格不能为负数！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    sitePrice: [
                        { required: true, message: '请填写商品分站价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let price = parseFloat(this.dialogEdit.price);
                                if (isNum(value)) {
                                    if (parseFloat(value) < price) {
                                        callback(new Error('分站价格不能低于成本价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let sitePrice = parseFloat(this.dialogEdit.sitePrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < sitePrice) {
                                        callback(new Error('顶级代理价格不能低于分站价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let topPrice = parseFloat(this.dialogEdit.topPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < topPrice) {
                                        callback(new Error('超级代理价格不能低于顶级代理价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let superPrice = parseFloat(this.dialogEdit.superPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < superPrice) {
                                        callback(new Error('金牌代理价格不能低于超级代理价格！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.onSale ? 'for-sale' : 'not-sale';
            },
            async loadProductTypes() {
                if (this.productTypes.length < 1) {
                    this.productTypes = await axiosGet('/platform/auth/product/types');
                }
            },
            async setOnSale(product) {
                await axiosPost('/platform/auth/product/set/onsale', {id: product.id, onSale: product.onSale});
                product.onSale = !product.onSale;
            },
            cancelDialog() {
                this.dialog = {
                    productTypeId: '',
                    name: '',
                    price: '',
                    sitePrice: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    attrs: [{name: '数量', min: 500}]
                };
                this.$refs.dialog.resetFields();
            },
            cancelDialogEdit() {
                console.log('------------------------------------');
                this.$refs.dialogEdit.resetFields();
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
            addEditAttr() {
                this.dialogEdit.attrs.push({
                    name: ''
                });
            },
            removeEditAttr(item) {
                let index = this.dialogEdit.attrs.indexOf(item);
                if (index !== -1) {
                    this.dialogEdit.attrs.splice(index, 1)
                }
            },
            async edit(product) {
                this.dialogEdit = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    sitePrice: product.sitePrice,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    onSale: product.onSale,
                    attrs: deepClone(product.attrs),
                    product: product
                };
                this.dialogEditVisible = true;
            },
            update() {
                this.$refs.dialogEdit.validate(async (valid) => {
                    if (valid) {
                        let info = this.dialogEdit;
                        let updatedProduct = await axiosPost('/platform/auth/product/update', {
                            id: info.id,
                            name: info.name,
                            price: info.price,
                            sitePrice: info.sitePrice,
                            topPrice: info.topPrice,
                            superPrice: info.superPrice,
                            goldPrice: info.goldPrice,
                            onSale: info.onSale,
                            attrs: info.attrs,
                        });
                        this.dialog.product.name = updatedProduct.name;
                        this.dialog.product.price = updatedProduct.price;
                        this.dialog.product.sitePrice = updatedProduct.sitePrice;
                        this.dialog.product.topPrice = updatedProduct.topPrice;
                        this.dialog.product.superPrice = updatedProduct.superPrice;
                        this.dialog.product.goldPrice = updatedProduct.goldPrice;
                        this.dialog.product.onSale = updatedProduct.onSale;
                        this.dialog.product.attrs = deepClone(updatedProduct.attrs);
                        this.dialogEditVisible = false;
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