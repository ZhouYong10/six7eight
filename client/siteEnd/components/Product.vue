<template>
    <div style="height: 100%">

        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 20px;">
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
                    min-width="176">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="productTypeSite.name"
                    label="类别"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="minNum"
                    label="最少下单量"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="speed"
                    label="执行速度"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="商品属性"
                    min-width="110">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <p class="attr-desc" v-for="attr in scope.row.attrs">
                            {{ attr.name }}
                        </p>
                        <el-button slot="reference">商品属性</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="下单提示"
                    min-width="100">
                <template slot-scope="scope">
                    <el-popover
                            width="300"
                            placement="right"
                            trigger="click">
                        <span v-for="val in scope.row.orderTip.split('\n')">
                            {{ val }}<br/>
                        </span>
                        <el-button slot="reference">提示</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="sitePrice"
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
                    min-width="140">
                <template slot-scope="scope">
                    <div v-if="scope.row.type === 'type_site'">
                        <div v-if="scope.row.productTypeSite.onSale">
                            <el-switch v-model="scope.row.onSale"
                                       @change="setOnSale(scope.row)">
                            </el-switch>
                        </div>
                        <span v-else>已下架</span>
                    </div>
                    <span v-else>{{(scope.row.productTypeSite.onSale && scope.row.onSale) ? '已上架' : '已下架'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.type === 'type_site'">
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    </div>
                    <div v-else>
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editPlatform(scope.row)">编 辑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑商品" :visible.sync="dialogPlatformVisible" top="6vh" width="30%" @closed="cancelDialogPlatform">
            <el-form :model="dialogPlatform" :rules="rulesPlatform" ref="dialogPlatform" :label-width="dialogLabelWidth">
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input-number v-model="dialogPlatform.topPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input-number v-model="dialogPlatform.superPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input-number v-model="dialogPlatform.goldPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPlatformVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePlatform">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @open="loadField" @closed="cancelDialog">
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
                <el-form-item label="分站价格" prop="sitePrice">
                    <el-input-number v-model="dialog.sitePrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input-number v-model="dialog.topPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input-number v-model="dialog.superPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input-number v-model="dialog.goldPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="下单提示" prop="orderTip">
                    <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入下单提示内容，每行一条！"
                            v-model="dialog.orderTip">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="onSale">
                    <el-switch
                            v-model="dialog.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="最少下单数量" prop="minNum">
                    <el-input-number v-model="dialog.minNum" :min="1" :step="10" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="订单执行速度" prop="speed">
                    <el-input-number v-model="dialog.speed" :min="1" :step="10" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="商品属性">
                    <div style="color: red;">拖拽商品属性排序，该顺序对应用户下单表单生成顺序!</div>
                    <el-tree
                            ref="fieldTree"
                            :data="fields"
                            node-key="id"
                            :props="props"
                            show-checkbox
                            draggable
                            :allow-drop="allowDrop"
                            @node-drop="nodeDrop">
                    </el-tree>
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
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "Product",
        async created() {
            this.tableData = await axiosGet('/site/auth/products');
            this.$options.sockets[this.siteId + 'addProduct'] = (product) =>{
                this.tableData.unshift(product);
            };
            this.$options.sockets[this.siteId + 'updateType'] = (type) => {
                let products = this.tableData;
                let index = products.findIndex((item) => {
                    return item.productTypeSite.id === type.id;
                });
                let aim = products[index];
                aim.productTypeSite = type;
            };
            this.$options.sockets[this.siteId + 'updateProduct'] = (product) =>{
                let products = this.tableData;
                let index = products.findIndex((item) => {
                    return item.id === product.id;
                });
                let aim = products[index];
                aim.productTypeSite = product.productTypeSite;
                aim.name = product.name;
                aim.sitePrice = product.sitePrice;
                aim.topPrice = product.topPrice;
                aim.superPrice = product.superPrice;
                aim.goldPrice = product.goldPrice;
                aim.orderTip = product.orderTip;
                aim.onSale = product.onSale;
                aim.minNum = product.minNum;
                aim.speed = product.speed;
                aim.attrs = product.attrs;
            };
        },
        data() {
            return {
                tableData: [],
                productTypes: [],
                fields: [],
                props: {label: 'name'},
                dialogLabelWidth: '120px',
                dialogVisible: false,
                dialogTitle: '添加商品',
                dialog: {
                    productTypeId: '',
                    name: '',
                    sitePrice: 0,
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0,
                    orderTip: '',
                    onSale: true,
                    minNum: 500,
                    speed: 10
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
                    sitePrice: [
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' }
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let sitePrice = this.dialog.sitePrice;
                                if (value < sitePrice) {
                                    callback(new Error('顶级代理价格不能低于商品成本价格！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let topPrice = this.dialog.topPrice;
                                if (value < topPrice) {
                                    callback(new Error('超级代理价格不能低于顶级代理价格！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let superPrice = this.dialog.superPrice;
                                if (value < superPrice) {
                                    callback(new Error('金牌代理价格不能低于超级代理价格！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    orderTip: [
                        {required: true, message: '请输入下单提示内容，每行一条！', trigger: 'blur'}
                    ],
                },
                dialogPlatformVisible: false,
                dialogPlatform: {
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0
                },
                rulesPlatform: {
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let topPrice = proProduct.topPrice;
                                if (value < topPrice) {
                                    callback(new Error('不能小于平台限制价格： ￥'+ topPrice +' 元！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let superPrice = proProduct.superPrice;
                                let topPrice = this.dialogPlatform.topPrice;
                                if (value < superPrice) {
                                    callback(new Error('不能小于平台限制价格： ￥'+ superPrice +' 元！'));
                                }else if(value < topPrice){
                                    callback(new Error('超级代理价格不能低于顶级代理价格！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let proProduct = this.dialogPlatform.proProduct;
                                let goldPrice = proProduct.goldPrice;
                                let superPrice = this.dialogPlatform.superPrice;
                                if (value < goldPrice) {
                                    callback(new Error('不能小于平台限制价格： '+ goldPrice +' 元！'));
                                }else if(value < superPrice){
                                    callback(new Error('金牌代理价格不能低于超级代理价格！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return (row.productTypeSite.onSale && row.onSale) ? 'for-sale' : 'not-sale';
            },
            async loadProductTypes() {
                if (this.productTypes.length < 1) {
                    this.productTypes = await axiosGet('/site/auth/product/types');
                }
            },
            async loadField() {
                if (this.fields.length < 1) {
                    this.fields = await axiosGet('/site/auth/product/fields');
                }
            },
            allowDrop(dragNode, dropNode, type) {
                return type !== 'inner';
            },
            nodeDrop(node) {
                if (node.checked) {
                    this.$refs.fieldTree.setChecked(node.data, true);
                }
            },
            setOnSale(product) {
                axiosPost('/site/auth/product/set/onsale', {id: product.id, onSale: product.onSale});
            },
            cancelDialogPlatform() {
                this.dialogPlatform = {
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0
                };
                this.$refs.dialogPlatform.resetFields();
            },
            cancelDialog() {
                this.dialogTitle = '添加商品';
                this.dialog = {
                    productTypeId: '',
                    name: '',
                    sitePrice: 0,
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0,
                    orderTip: '',
                    onSale: true,
                    minNum: 500,
                    speed: 10
                };
                this.$refs.fieldTree.setCheckedNodes([]);
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        this.dialog.attrs = this.$refs.fieldTree.getCheckedNodes();
                        await axiosPost('/site/auth/product/add', this.dialog);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async editPlatform(product) {
                this.dialogPlatform = {
                    id: product.id,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    proProduct: await axiosGet('/site/auth/prototype/of/' + product.id)
                };
                this.dialogPlatformVisible = true;
            },
            updatePlatform() {
                this.$refs.dialogPlatform.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/site/auth/product/update/platform', {
                            id: this.dialogPlatform.id,
                            topPrice: this.dialogPlatform.topPrice,
                            superPrice: this.dialogPlatform.superPrice,
                            goldPrice: this.dialogPlatform.goldPrice
                        });
                        this.dialogPlatformVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async edit(product) {
                await this.loadProductTypes();
                await this.loadField();
                this.dialog = {
                    id: product.id,
                    productTypeId: product.productTypeSite.id,
                    name: product.name,
                    sitePrice: product.sitePrice,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    orderTip: product.orderTip,
                    onSale: product.onSale,
                    minNum: product.minNum,
                    speed: product.speed,
                    product: product,
                    edit: true
                };
                if (!this.$refs.fieldTree) {
                    setTimeout(() => {
                        this.$refs.fieldTree.setCheckedNodes(product.attrs);
                    }, 100);
                } else {
                    this.$refs.fieldTree.setCheckedNodes(product.attrs);
                }
                this.dialogTitle = '编辑商品';
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let info = this.dialog;
                        let attrs = this.$refs.fieldTree.getCheckedNodes();
                        await axiosPost('/site/auth/product/update', {
                            id: info.id,
                            productTypeId: info.productTypeId,
                            name: info.name,
                            sitePrice: info.sitePrice,
                            topPrice: info.topPrice,
                            superPrice: info.superPrice,
                            goldPrice: info.goldPrice,
                            orderTip: info.orderTip,
                            onSale: info.onSale,
                            minNum: info.minNum,
                            speed: info.speed,
                            attrs: attrs
                        });
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
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