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
                    prop="minNum"
                    label="最少下单量"
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
                    min-width="140">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.onSale"
                               @change="setOnSale(scope.row)">
                    </el-switch>
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

        <el-dialog title="添加商品" :visible.sync="dialogVisible" top="6vh" width="36%" @open="loadField" @closed="cancelDialog">
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
                    <el-input-number v-model="dialog.minNum" :min="100" :step="100" controls-position="right"></el-input-number>
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
                    <el-input-number v-model="dialogEdit.minNum" :min="100" :step="100" controls-position="right"></el-input-number>
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
                fields: [],
                props: {
                    label: 'name',
                    disabled: (data) => {
                        return !data.onSale;
                    }},
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
                    minNum: 500
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
                    minNum: 500
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
                return type === 'inner' ? false : true;
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
                    price: '',
                    sitePrice: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    minNum: 500
                };
                this.$refs.fieldTree.setCheckedNodes([]);
                this.$refs.dialog.resetFields();
            },
            cancelDialogEdit() {
                this.dialogEdit = {
                    name: '',
                    price: '',
                    sitePrice: '',
                    topPrice: '',
                    superPrice: '',
                    goldPrice: '',
                    onSale: true,
                    minNum: 500
                };
                this.$refs.fieldTreeEdit.setCheckedNodes([]);
                this.$refs.dialogEdit.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let type = await axiosPost('/platform/auth/product/add', {
                            ...this.dialog,
                            attrs: this.$refs.fieldTree.getCheckedNodes()
                        });
                        this.tableData.unshift(type);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
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
                    minNum: product.minNum,
                    product: product
                };
                this.loadField();
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
                        let info = this.dialogEdit;
                        await axiosPost('/platform/auth/product/update', {
                            id: info.id,
                            name: info.name,
                            price: info.price,
                            sitePrice: info.sitePrice,
                            topPrice: info.topPrice,
                            superPrice: info.superPrice,
                            goldPrice: info.goldPrice,
                            onSale: info.onSale,
                            minNum: info.minNum
                        });
                        let oldProduct = this.dialogEdit.product;
                        oldProduct.name = info.name;
                        oldProduct.price = info.price;
                        oldProduct.sitePrice = info.sitePrice;
                        oldProduct.topPrice = info.topPrice;
                        oldProduct.superPrice = info.superPrice;
                        oldProduct.goldPrice = info.goldPrice;
                        oldProduct.onSale = info.onSale;
                        oldProduct.minNum = info.minNum;
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