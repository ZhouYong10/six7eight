<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in productMenus">
            <el-submenu
                    v-if="item.onSale && item.children.length > 0"
                    :index="item.id">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item
                        v-for="childItem in item.children"
                        v-if="childItem.onSale"
                        :index="'/product/' + childItem.id"
                        :key="childItem.id">
                    <i class="el-icon-tickets"></i>
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
        </template>
        <template v-for="item in rightMenus">
            <el-submenu :index="item.id" v-if="item.type === 'menuGroup' && item.children.length > 0">
                <template slot="title">
                    <i v-if="item.icon" :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="childItem.path" :key="childItem.id">
                    <i v-if="childItem.icon" :class="childItem.icon"></i>
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" v-else>
                <i v-if="item.icon" :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    import {axiosGet, pageChangeMsg} from "@/utils";
    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            if(this.siteId){
                this.registIoListener();
            }
            if (this.userId) {
                this.registLoginIoListener();
            }
        },
        watch: {
            siteId() {
                this.registIoListener();
            },
            userId(val) {
                if (val) {
                    this.registLoginIoListener()
                }
            }
        },
        methods: {
            registIoListener() {
                // 公告提示
                this.$options.sockets[this.siteId + 'addPlacard'] = (placard) => {
                    this.$message({
                        type: 'warning',
                        duration: 0,
                        showClose: true,
                        dangerouslyUseHTMLString: true,
                        message: '<p style="line-height: 22px; letter-spacing: 1px;">' + placard.content + '</p>'
                    })
                };

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
                        if (data.type === 'product' && data.id === routeId && !data.onSale) {
                            this.$router.push('/');
                            pageChangeMsg('"' + data.name + '" 业务已经下架了！');
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
                                pageChangeMsg('"' + data.name + '" 业务已经下架了！');
                            }
                        }
                    }
                };
            },
            registLoginIoListener() {
                // 修改用户角色信息
                this.$options.sockets[this.roleId + 'changeRights'] = (data) => {
                    this.$store.commit('changeRights', data);
                    this.$router.push('/');
                    pageChangeMsg('您的角色权限变更了！');
                };

                // 修改用户金额
                this.$options.sockets[this.userId + 'changeFunds'] = (funds) => {
                    this.$store.commit('changeUserFunds', funds);
                };

                // 修改用户状态
                this.$options.sockets[this.userId + 'changeState'] = (state) => {
                    if (state === '禁用') {
                        axiosGet('/user/auth/logout').then(() => {
                            axiosGet('/user/init/data').then( (data)=> {
                                this.$store.commit('logout', data);
                                this.$router.push('/');
                                pageChangeMsg('您的账户被封禁了！');
                            });
                        });
                    }else{
                        this.$store.commit('changeUserState', state);
                        if (state === '冻结') {
                            pageChangeMsg('您的账户被冻结了！');
                        } else {
                            pageChangeMsg('您的账户正常启用了！');
                        }
                    }
                };
            }
        },
        computed: {
            userId() {
                return this.$store.state.userId;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            siteId() {
                return this.$store.state.siteId;
            },
            productMenus() {
                return this.$store.state.productMenus;
            },
            rightMenus() {
                return this.$store.state.rightMenus;
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>