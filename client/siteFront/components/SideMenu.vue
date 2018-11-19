<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in typeRights">
            <el-submenu
                    v-if="item.onSale && item.children.length > 0"
                    :index="'/product/' + item.id">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item
                        v-for="childItem in item.children"
                        v-if="childItem.onSale"
                        :index="'/product/' + childItem.id"
                        :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
        </template>
        <template v-for="item in rights">
            <el-submenu :index="'/' + item.id" v-if="item.children && item.children.length > 0">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/' + childItem.id" :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="'/' + item.id" v-else>
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            if(this.siteId){
                this.registIoListener();
            }
        },
        watch: {
            siteId() {
                this.registIoListener();
            }
        },
        methods: {
            registIoListener() {
                // 添加商品类别
                this.$options.sockets[this.siteId + 'type'] = (type) => {
                    this.$store.commit('addTypeToMenu', type);
                };

                // 添加商品
                this.$options.sockets[this.siteId + 'product'] = (data) => {
                    this.$store.commit('addProductToMenu', data);
                };

                // 修改商品类别或商品信息
                this.$options.sockets[this.siteId + 'typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);

                    let routeId = this.$route.params.id;
                    if (routeId) {
                        if (data.type === 'product' && data.id === routeId) {
                            this.$router.push('/');
                            if (data.onSale) {
                                this.$message({
                                    message: '"' + data.name + '" 业务更新了！',
                                    type: 'error',
                                    duration: 10000,
                                    showClose: true
                                });
                            } else {
                                this.$message({
                                    message: '"' + data.name + '" 业务已经下架了！',
                                    type: 'error',
                                    duration: 10000,
                                    showClose: true
                                });
                            }
                        }

                        if (data.type === 'productType' && !data.onSale) {
                            let aimType = null;
                            for(let i = 0; i < this.typeRights.length; i++){
                                let type = this.typeRights[i];
                                for(let j = 0; j < type.children.length; j++){
                                    let product = type.children[j];
                                    if (product.id === routeId) {
                                        aimType = type;
                                        break;
                                    }
                                }
                            }
                            if (aimType.id === data.id) {
                                this.$router.push('/');
                                this.$message({
                                    message: '"' + data.name + '" 业务已经下架了！',
                                    type: 'error',
                                    duration: 10000,
                                    showClose: true
                                });
                            }
                        }
                    }
                };
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            typeRights() {
                return this.$store.state.typeRights;
            },
            rights() {
                return this.$store.state.rights;
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>