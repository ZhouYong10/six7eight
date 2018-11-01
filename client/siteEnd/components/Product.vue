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
                    prop="productTypeSite.name"
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
                    <div v-if="scope.row.type === 'type_site'">
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                        <el-button type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                    </div>
                    <div v-else>
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editPlatform(scope.row)">编 辑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑商品" :visible.sync="dialogPlatformVisible" top="6vh" width="36%" @closed="cancelDialogPlatform">
            <el-form :model="dialogPlatform" :rules="rulesPlatform" ref="dialogPlatform" :label-width="dialogLabelWidth">
                <el-form-item label="成本价格" prop="price">
                    <el-input v-model="dialogPlatform.price"></el-input>
                </el-form-item>
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input v-model="dialogPlatform.topPrice"></el-input>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input v-model="dialogPlatform.superPrice"></el-input>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input v-model="dialogPlatform.goldPrice"></el-input>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                            v-model="dialogPlatform.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPlatformVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePlatform">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="36%" @closed="cancelDialog">
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
    import {isNum} from "@/validaters";

    export default {
        name: "Product",
        async created() {
            this.tableData = await axiosGet('/site/auth/products');
        },
        data() {
            return {
                tableData: [],
                productTypes: [],
                dialogLabelWidth: '120px',
                dialogVisible: false,
                dialogTitle: '添加商品',
                dialog: {
                    productTypeId: '',
                    name: '',
                    price: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    attrs: [{name: '数量', min: 500}]
                },
                rules: {
                    productTypeId: [
                        { required: true, message: '请选择商品类别！', trigger: 'change' }
                    ],
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        {
                            validator: async (rule, value, callback) => {
                                let typeId = this.dialog.productTypeId;
                                let oldName;
                                if (this.dialog.product) {
                                    oldName = this.dialog.product.name;
                                }
                                if (value !== oldName && typeId) {
                                    let type = await axiosGet('/site/auth/' + typeId +'/product/' + value + '/exist');
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
                                    }else {
                                        callback();
                                    }
                                }else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let price = parseFloat(this.dialog.price);
                                if (isNum(value)) {
                                    if (parseFloat(value) < price) {
                                        callback(new Error('顶级代理价格不能低于商品成本价格！'));
                                    }else{
                                        callback();
                                    }
                                }else {
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
                                    }else{
                                        callback();
                                    }
                                }else {
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
                                    }else{
                                        callback();
                                    }
                                }else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                },
                dialogPlatformVisible: false,
                dialogPlatform: {
                    price: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true
                },
                rulesPlatform: {
                    price: [
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                if (isNum(value)) {
                                    let proProduct = this.dialogPlatform.proProduct;
                                    let price = parseFloat(proProduct.sitePrice);
                                    if (parseFloat(value) < price) {
                                        callback(new Error('不能小于平台限制价格： '+ price +' 元！'));
                                    }else {
                                        callback();
                                    }
                                }else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let topPrice = parseFloat(proProduct.topPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < topPrice) {
                                        callback(new Error('不能小于平台限制价格： '+ topPrice +' 元！'));
                                    }else{
                                        callback();
                                    }
                                }else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let superPrice = parseFloat(proProduct.superPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < superPrice) {
                                        callback(new Error('不能小于平台限制价格： '+ superPrice +' 元！'));
                                    }else{
                                        callback();
                                    }
                                }else {
                                    callback(new Error('商品价格必须为数字！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let goldPrice = parseFloat(proProduct.goldPrice);
                                if (isNum(value)) {
                                    if (parseFloat(value) < goldPrice) {
                                        callback(new Error('不能小于平台限制价格： '+ goldPrice +' 元！'));
                                    }else{
                                        callback();
                                    }
                                }else {
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
                    this.productTypes = await axiosGet('/site/auth/product/types');
                }
            },
            async setOnSale(product) {
                await axiosPost('/site/auth/product/set/onsale', {id: product.id, onSale: product.onSale});
                product.onSale = !product.onSale;
            },
            cancelDialogPlatform() {
                this.dialogPlatform = {
                    price: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true
                };
                this.$refs.dialogPlatform.resetFields();
            },
            cancelDialog() {
                this.dialogTitle = '添加商品';
                this.$refs.dialog.resetFields();
                this.dialog = {
                    productTypeId: '',
                    name: '',
                    price: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    attrs: [{name: '数量', min: 500}]
                };
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
                        let type = await axiosPost('/site/auth/product/add', this.dialog);
                        this.tableData.unshift(type);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async editPlatform(product) {
                this.dialogPlatform = {
                    id: product.id,
                    price: product.price,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    onSale: product.onSale,
                    proProduct: await axiosGet('/site/auth/prototype/of/' + product.id),
                    product: product
                };
                this.dialogPlatformVisible = true;
            },
            updatePlatform() {
                this.$refs.dialogPlatform.validate(async (valid) => {
                    if (valid) {
                        let updatedProduct = await axiosPost('/site/auth/product/update/platform', this.dialog);
                        this.dialog.product.price = updatedProduct.price;
                        this.dialog.product.topPrice = updatedProduct.topPrice;
                        this.dialog.product.superPrice = updatedProduct.superPrice;
                        this.dialog.product.goldPrice = updatedProduct.goldPrice;
                        this.dialog.product.onSale = updatedProduct.onSale;
                        this.dialogPlatformVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async edit(product) {
                await this.loadProductTypes();
                this.dialog = {
                    id: product.id,
                    productTypeId: product.productTypeSite.id,
                    name: product.name,
                    price: product.price,
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
                        let updatedProduct = await axiosPost('/site/auth/product/update', this.dialog);
                        this.dialog.product.productTypeSite = updatedProduct.productTypeSite;
                        this.dialog.product.name = updatedProduct.name;
                        this.dialog.product.price = updatedProduct.price;
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
                    await axiosGet('/site/auth/product/remove/' + id);
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