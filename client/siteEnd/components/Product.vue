<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>
        <el-select v-model="aimProductTypeId" size="small"
                   @change="chooseTypeShow"
                   @visible-change="loadProductTypes">
            <el-option key="0"
                       label="全部"
                       value="allTypeProducts"></el-option>
            <el-option key="1"
                       label="自营业务"
                       value="siteSelfProducts"></el-option>
            <el-option key="2"
                       label="平台业务"
                       value="platformProducts"></el-option>
            <el-option v-for="type in productTypes"
                       :key="type.id"
                       :label="type.name"
                       :value="type.id"></el-option>
        </el-select>
        <el-button v-if="canBatchEdit"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-edit"
                   @click="dialogBatchVisible = true">批量加价</el-button>
        <el-button v-if="canBatchBack"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-back"
                   @click="batchPriceBack">恢复原价</el-button>
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                :default-sort = "{prop: 'productTypeSite.name', order: 'ascending'}"
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
                    prop="productTypeSite.name"
                    label="类别"
                    sortable
                    :sort-method="sortByType"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    label="创建账户"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 'type_site'">{{scope.row.createUser}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="上/下架"
                    min-width="80">
                <template slot-scope="scope">
                    <div v-if="scope.row.productTypeSite.onSale">
                        <el-switch v-if="canOnSale" v-model="scope.row.onSale"
                                   @change="setOnSale(scope.row)">
                        </el-switch>
                        <span v-else>{{scope.row.onSale ? '已上架' : '已下架'}}</span>
                    </div>
                    <span v-else>已下架</span>
                </template>
                <!--<template slot-scope="scope">
                    <div v-if="scope.row.type === 'type_site'">
                        <div v-if="scope.row.productTypeSite.onSale">
                            <el-switch v-if="canOnSale" v-model="scope.row.onSale"
                                       @change="setOnSale(scope.row)">
                            </el-switch>
                            <span v-else>{{scope.row.onSale ? '已上架' : '已下架'}}</span>
                        </div>
                        <span v-else>已下架</span>
                    </div>
                    <span v-else>{{(scope.row.productTypeSite.onSale && scope.row.onSale) ? '已上架' : '已下架'}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="minNum"
                    label="最少下单"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="speed"
                    label="执行速度"
                    min-width="60">
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
                    min-width="80">
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
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="topPrice"
                    label="一级价格"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="superPrice"
                    label="二级价格"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="goldPrice"
                    label="三级价格"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button v-if="canEdit && scope.row.type === 'type_site'"
                                   type="primary" size="small"
                                   @click="edit(scope.row)">编 辑</el-button>
                        <el-button v-else-if="canEdit"
                                   type="primary" size="small"
                                   @click="editPlatform(scope.row)">编 辑</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑商品" :visible.sync="dialogPlatformVisible" top="6vh" width="30%" @closed="cancelDialogPlatform">
            <el-form :model="dialogPlatform" :rules="rulesPlatform" ref="dialogPlatform" :label-width="dialogLabelWidth">
                <el-form-item label="一级代理价格" prop="topPrice">
                    <el-input-number v-model="dialogPlatform.topPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="二级代理价格" prop="superPrice">
                    <el-input-number v-model="dialogPlatform.superPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="三级代理价格" prop="goldPrice">
                    <el-input-number v-model="dialogPlatform.goldPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPlatformVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePlatform">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="批量加价" :visible.sync="dialogBatchVisible" top="6vh" width="30%" @closed="cancelDialogBatch">
            <el-form :model="dialogBatch" :rules="rulesBatch" ref="dialogBatch" :label-width="dialogLabelWidth">
                <el-form-item label="一级比例" prop="topScale">
                    <el-input-number v-model="dialogBatch.topScale" :controls="false"
                                     :precision="0" :min="0" :max="1000" :step="1"></el-input-number> %
                </el-form-item>
                <el-form-item label="二级比例" prop="superScale">
                    <el-input-number v-model="dialogBatch.superScale" :controls="false"
                                     :precision="0" :min="0" :max="1000" :step="1"></el-input-number> %
                </el-form-item>
                <el-form-item label="三级比例" prop="goldScale">
                    <el-input-number v-model="dialogBatch.goldScale" :controls="false"
                                     :precision="0" :min="0" :max="1000" :step="1"></el-input-number> %
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBatchVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateBatch">保 存</el-button>
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
                    <el-input v-model.trim="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortNum">
                    <el-input-number v-model="dialog.sortNum" :min="1" :step="1" :precision="0" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="分站价格" prop="sitePrice">
                    <el-input-number v-model="dialog.sitePrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="一级代理价格" prop="topPrice">
                    <el-input-number v-model="dialog.topPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="二级代理价格" prop="superPrice">
                    <el-input-number v-model="dialog.superPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="三级代理价格" prop="goldPrice">
                    <el-input-number v-model="dialog.goldPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="下单提示" prop="orderTip">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入下单提示内容，每行一条！"
                            v-model.trim="dialog.orderTip">
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
    import {axiosGet, axiosPost} from "@/slfaxios";
    import {sortProductSite} from "@/utils";

    export default {
        name: "Product",
        async created() {
            this.tableData = await axiosGet('/site/auth/products');
            this.$options.sockets[this.siteId + 'batchUpdateProductPrice'] = async () => {
                this.tableData = await axiosGet('/site/auth/products');
            };
            this.$options.sockets[this.roleId + 'addProduct'] = (product) =>{
                this.tableData.unshift(product);
                this.tableData.sort(sortProductSite);
            };
            this.$options.sockets[this.siteId + 'updateType'] = (type) => {
                this.tableData.forEach(item => {
                    if (item.productTypeSite.id === type.id) {
                        item.productTypeSite = type;
                    }
                });
                this.tableData.sort(sortProductSite);
            };
            this.$options.sockets[this.siteId + 'updateProduct'] = (product) =>{
                let aim = this.tableData.find(item => {
                    return item.id === product.id;
                });
                aim.productTypeSite = product.productTypeSite;
                aim.name = product.name;
                aim.sortNum = product.sortNum;
                aim.sitePrice = product.sitePrice;
                aim.topPrice = product.topPrice;
                aim.superPrice = product.superPrice;
                aim.goldPrice = product.goldPrice;
                aim.orderTip = product.orderTip;
                aim.onSale = product.onSale;
                aim.minNum = product.minNum;
                aim.speed = product.speed;
                aim.attrs = product.attrs;

                this.tableData.sort(sortProductSite);
            };
        },
        data() {
            return {
                aimProductTypeId: 'allTypeProducts',
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
                    sortNum: 1,
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
                },
                dialogBatchVisible: false,
                dialogBatch: {
                    topScale: 0,
                    superScale: 0,
                    goldScale: 0,
                },
                rulesBatch: {
                    topScale: [
                        { validator: async (rule, value, callback) => {
                                if (value <= 0) {
                                    callback(new Error('请填写一级加价比例！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    superScale: [
                        { validator: async (rule, value, callback) => {
                                if (value <= 0) {
                                    callback(new Error('请填写二级加价比例！'));
                                }else{
                                    let topScale = this.dialogBatch.topScale;
                                    if (value < topScale) {
                                        callback(new Error('二级加价比例不能低于一级加价比例！'));
                                    }else{
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ],
                    goldScale: [
                        { validator: async (rule, value, callback) => {
                                if (value <= 0) {
                                    callback(new Error('请填写三级加价比例！'));
                                } else {
                                    let superScale = this.dialogBatch.superScale;
                                    if (value < superScale) {
                                        callback(new Error('三级加价比例不能低于二级加价比例！'));
                                    }else{
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            sortByDate(a, b) {
                return Date.parse(a.createTime) - Date.parse(b.createTime);
            },
            sortByType(a, b){
                if (a.productTypeSite.name === b.productTypeSite.name) {
                    return 0;
                }else{
                    let numSort = a.productTypeSite.sortNum - b.productTypeSite.sortNum;
                    if (numSort === 0) {
                        return Date.parse(a.productTypeSite.createTime) - Date.parse(b.productTypeSite.createTime);
                    }else{
                        return numSort;
                    }
                }
            },
            async chooseTypeShow(val) {
                this.tableData = await axiosGet(`/site/auth/products/of/${val}`);
            },
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
                    sortNum: 1,
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
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            this.dialog.attrs = this.$refs.fieldTree.getCheckedNodes();
                            await axiosPost('/site/auth/product/add', this.dialog);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
                        if (!this.dialogPlatform.isCommitted) {
                            this.dialogPlatform.isCommitted = true;
                            await axiosPost('/site/auth/product/update/platform', {
                                id: this.dialogPlatform.id,
                                topPrice: this.dialogPlatform.topPrice,
                                superPrice: this.dialogPlatform.superPrice,
                                goldPrice: this.dialogPlatform.goldPrice
                            });
                            this.dialogPlatformVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
                    sortNum: product.sortNum,
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
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let info = this.dialog;
                            let attrs = this.$refs.fieldTree.getCheckedNodes();
                            await axiosPost('/site/auth/product/update', {
                                id: info.id,
                                productTypeId: info.productTypeId,
                                name: info.name,
                                sortNum: info.sortNum,
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
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelDialogBatch() {
                this.dialogBatch = {
                    topScale: 0,
                    superScale: 0,
                    goldScale: 0,
                };
                this.$refs.dialogBatch.resetFields();
            },
            updateBatch() {
                this.$refs.dialogBatch.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialogBatch.isCommitted) {
                            this.dialogBatch.isCommitted = true;
                            let info = this.dialogBatch;
                            let isOk = await axiosPost('/site/auth/product/price/batch/update', {
                                topScale: info.topScale,
                                superScale: info.superScale,
                                goldScale: info.goldScale,
                            });
                            if (isOk) {
                                this.dialogBatchVisible = false;
                            }else{
                                this.dialogBatch.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            batchPriceBack() {
                this.$confirm('此操作将把所有平台商品价格恢复为平台原价！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/site/auth/product/price/batch/back');
                    this.$message.success('所有商品已经恢复平台原价！');
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addProductAllSite';
                });
            },
            canBatchEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'batchEditProductAllSite'
                })
            },
            canBatchBack() {
                return this.$store.state.permissions.some(item => {
                    return item === 'batchBackProductAllSite'
                });
            },
            canOnSale() {
                return this.$store.state.permissions.some(item => {
                    return item === 'onSaleProductAllSite';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editProductAllSite';
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