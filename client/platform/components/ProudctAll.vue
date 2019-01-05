<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>
        <el-select v-model="aimProductTypeId" size="small"
                   @change="chooseTypeShow"
                   @visible-change="loadProductType">
            <el-option key="0"
                       label="全部"
                       value="allTypeProducts"></el-option>
            <el-option v-for="type in productTypes"
                       :key="type.id"
                       :label="type.name"
                       :value="type.id"></el-option>
        </el-select>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="创建日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="productType.name"
                    label="类别"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="createUser"
                    label="创建账户"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="上/下架"
                    min-width="80">
                <template slot-scope="scope">
                    <div v-if="scope.row.productType.onSale">
                        <el-switch v-if="canOnSale" v-model="scope.row.onSale"
                                   @change="setOnSale(scope.row)">
                        </el-switch>
                        <span v-else>{{scope.row.onSale ? '已上架' : '已下架'}}</span>
                    </div>
                    <span v-else>已下架</span>
                </template>
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
                    prop="price"
                    label="成本价格"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="sitePrice"
                    label="分站价格"
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
                    <el-button v-if="canEdit"
                               type="primary" size="small"
                               @click="edit(scope.row)">编 辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加商品" :visible.sync="dialogVisible" top="6vh" width="30%" @open="loadField" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="类别" prop="productTypeId">
                    <el-select v-model="dialog.productTypeId" placeholder="请选择商品类别" @visible-change="loadProductType">
                        <el-option v-for="type in productTypes"
                                   :key="type.id"
                                   :label="type.name"
                                   :value="type.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" placeholder="请输入商品名称！"></el-input>
                </el-form-item>
                <el-form-item label="成本价格" prop="price">
                    <el-input-number v-model="dialog.price" :controls="false" :precision="4" :min="0"></el-input-number>
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
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑商品" :visible.sync="dialogEditVisible" top="6vh" width="30%" @closed="cancelDialogEdit">
            <el-form :model="dialogEdit" :rules="rulesEdit" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialogEdit.name" placeholder="请输入商品名称！"></el-input>
                </el-form-item>
                <el-form-item label="成本价格" prop="price">
                    <el-input-number v-model="dialogEdit.price" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="分站价格" prop="sitePrice">
                    <el-input-number v-model="dialogEdit.sitePrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="顶级代理价格" prop="topPrice">
                    <el-input-number v-model="dialogEdit.topPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="超级代理价格" prop="superPrice">
                    <el-input-number v-model="dialogEdit.superPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="金牌代理价格" prop="goldPrice">
                    <el-input-number v-model="dialogEdit.goldPrice" :controls="false" :precision="4" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="下单提示" prop="orderTip">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入下单提示内容，每行一条！"
                            v-model.trim="dialogEdit.orderTip">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" prop="onSale">
                    <el-switch
                            v-model="dialogEdit.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="最少下单数量" prop="minNum">
                    <el-input-number v-model="dialogEdit.minNum" :min="1" :step="10" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="订单执行速度" prop="speed">
                    <el-input-number v-model="dialogEdit.speed" :min="1" :step="10" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="商品属性">
                    <div style="color: red;">拖拽商品属性排序，该顺序对应用户下单表单生成顺序!</div>
                    <el-tree
                            ref="fieldTreeEdit"
                            :data="fields"
                            node-key="id"
                            :props="props"
                            show-checkbox
                            draggable
                            :allow-drop="allowDrop"
                            @node-drop="nodeDropEdit">
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">保 存</el-button>
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
            this.$options.sockets[this.roleId + 'addProduct'] = (product) => {
                this.tableData.unshift(product);
            };
        },
        sockets: {
            updateType(type) {
                this.tableData.forEach(item => {
                    if (item.productTypeSite.id === type.id) {
                        item.productTypeSite = type;
                    }
                });
            },
            updateProduct(product) {
                let aim = this.tableData.find(item => {
                    return item.id === product.id;
                });

                aim.name = product.name;
                aim.price = product.price;
                aim.sitePrice = product.sitePrice;
                aim.topPrice = product.topPrice;
                aim.superPrice = product.superPrice;
                aim.goldPrice = product.goldPrice;
                aim.orderTip = product.orderTip;
                aim.onSale = product.onSale;
                aim.minNum = product.minNum;
                aim.speed = product.speed;
                aim.attrs = product.attrs;
            }
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
                dialog: {
                    productTypeId: '',
                    name: '',
                    price: 0,
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
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' }
                    ],
                    sitePrice: [
                        { required: true, message: '请填写商品分站价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let price = this.dialog.price;
                                if (value < price) {
                                    callback(new Error('分站价格不能低于成本价格！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let sitePrice = this.dialog.sitePrice;
                                if (value < sitePrice) {
                                    callback(new Error('顶级代理价格不能低于分站价格！'));
                                } else {
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
                                } else {
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
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    orderTip: [
                        {required: true, message: '请输入下单提示内容，每行一条！', trigger: 'blur'}
                    ],
                },
                dialogEditVisible: false,
                dialogEdit: {
                    name: '',
                    price: 0,
                    sitePrice: 0,
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0,
                    orderTip: 0,
                    onSale: true,
                    minNum: 500,
                    speed: 10
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
                        { required: true, message: '请填写商品成本价格！', trigger: 'blur' }
                    ],
                    sitePrice: [
                        { required: true, message: '请填写商品分站价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let price = this.dialogEdit.price;
                                if (value < price) {
                                    callback(new Error('分站价格不能低于成本价格！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    topPrice: [
                        { required: true, message: '请填写商品顶级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let sitePrice = this.dialogEdit.sitePrice;
                                if (value < sitePrice) {
                                    callback(new Error('顶级代理价格不能低于分站价格！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    superPrice: [
                        { required: true, message: '请填写商品超级代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let topPrice = this.dialogEdit.topPrice;
                                if (value < topPrice) {
                                    callback(new Error('超级代理价格不能低于顶级代理价格！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    goldPrice: [
                        { required: true, message: '请填写商品金牌代理价格！', trigger: 'blur' },
                        { validator: async (rule, value, callback) => {
                                let superPrice = this.dialogEdit.superPrice;
                                if (value < superPrice) {
                                    callback(new Error('金牌代理价格不能低于超级代理价格！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    orderTip: [
                        {required: true, message: '请输入下单提示内容，每行一条！', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            async chooseTypeShow(val) {
                this.tableData = await axiosGet(`/platform/auth/products/of/${val}`);
            },
            tableRowClassName({row}) {
                return (row.productType.onSale && row.onSale) ? 'for-sale' : 'not-sale';
            },
            async loadProductType() {
                if (this.productTypes.length < 1) {
                    this.productTypes = await axiosGet('/platform/auth/product/types');
                }
            },
            async loadField() {
                if (this.fields.length < 1) {
                    this.fields = await axiosGet('/platform/auth/product/fields');
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
            nodeDropEdit(node) {
                if (node.checked) {
                    this.$refs.fieldTreeEdit.setChecked(node.data, true);
                }
            },
            setOnSale(product) {
                axiosPost('/platform/auth/product/set/onsale', {id: product.id, onSale: product.onSale});
            },
            cancelDialog() {
                this.dialog = {
                    productTypeId: '',
                    name: '',
                    price: 0,
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
            cancelDialogEdit() {
                this.dialogEdit = {
                    name: '',
                    price: 0,
                    sitePrice: 0,
                    topPrice: 0,
                    superPrice: 0,
                    goldPrice: 0,
                    orderTip: 0,
                    onSale: true,
                    minNum: 500,
                    speed: 10
                };
                this.$refs.fieldTreeEdit.setCheckedNodes([]);
                this.$refs.dialogEdit.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            this.dialog.attrs = this.$refs.fieldTree.getCheckedNodes();
                            await axiosPost('/platform/auth/product/add', this.dialog);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            async edit(product) {
                await this.loadField();
                this.dialogEdit = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    sitePrice: product.sitePrice,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    orderTip: product.orderTip,
                    onSale: product.onSale,
                    minNum: product.minNum,
                    speed: product.speed,
                    product: product
                };
                if (!this.$refs.fieldTreeEdit) {
                    setTimeout(() => {
                        this.$refs.fieldTreeEdit.setCheckedNodes(product.attrs);
                    }, 100);
                } else {
                    this.$refs.fieldTreeEdit.setCheckedNodes(product.attrs);
                }
                this.dialogEditVisible = true;
            },
            update() {
                this.$refs.dialogEdit.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialogEdit.isCommitted) {
                            this.dialogEdit.isCommitted = true;
                            let info = this.dialogEdit;
                            let attrs = this.$refs.fieldTreeEdit.getCheckedNodes();
                            await axiosPost('/platform/auth/product/update', {
                                id: info.id,
                                name: info.name,
                                price: info.price,
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
                            this.dialogEditVisible = false;
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
            roleId() {
                return this.$store.state.roleId;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addProductPlatform';
                });
            },
            canOnSale() {
                return this.$store.state.permissions.some(item => {
                    return item === 'onSaleProductPlatform';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editProductPlatform';
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