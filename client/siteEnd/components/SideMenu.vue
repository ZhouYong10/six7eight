<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in menus">
            <el-submenu :index="item.id" v-if="item.type ==='menuGroup' && item.children.length > 0">
                <template slot="title">
                    <i v-if="item.icon" :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="childItem.path" :key="childItem.id">
                    <i v-if="childItem.icon" :class="childItem.icon"></i>
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>

            <el-submenu :index="item.id" v-else-if="item.type ==='productType' && item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span slot="title">{{item.name}}</span>
                    <el-badge :value="item.num" :hidden="item.num < 1" />
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/product/' + childItem.id" :key="childItem.id">
                    <i class="el-icon-tickets"></i>
                    {{childItem.name}}
                    <el-badge :value="childItem.num" :hidden="childItem.num < 1" />
                </el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.path" v-if="item.type ==='menu'">
                <i v-if="item.icon" :class="item.icon"></i>
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
            this.registerIoListener();
        },
        methods: {
            registerIoListener() {
                if (this.roleType === 'role_site') {
                    // 添加商品类别
                    this.$options.sockets[this.roleId + 'type'] = (type) => {
                        this.$store.commit('addTypeToMenu', type);
                    };

                    // 添加商品
                    this.$options.sockets[this.roleId + 'product'] = (data) => {
                        this.$store.commit('addProductToMenu', data);
                    };
                }

                // 修改商品类别或商品信息
                this.$options.sockets[this.siteId + 'typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);
                };

                // 修改待处理订单提示个数
                this.$options.sockets[this.siteId + 'plusBadge'] = (aim) => {
                    this.$store.commit('plusBadge', aim);
                };

                this.$options.sockets[this.siteId + 'minusBadge'] = (aim) => {
                    this.$store.commit('minusBadge', aim);
                };
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            roleType() {
                return this.$store.state.roleType;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            menus() {
                return this.$store.state.menus;
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>