<template>
    <el-menu background-color="#f3f3f3" router :default-active="$route.path" unique-opened @select="menuActive">
        <template v-for="item in menus">
            <el-submenu :index="item.id" v-if="item.type ==='menuGroup' && item.children.length > 0">
                <template slot="title">
                    <i v-if="item.icon" :class="item.icon"
                       :style="item.fingerprint === 'fundsManageSite' ? 'color: red;' : ''"></i>
                    <span slot="title">{{item.name}}</span>
                    <el-badge :value="item.waitCount" :hidden="item.waitCount < 1" />
                </template>
                <el-menu-item v-for="childItem in item.children" :index="childItem.path" :key="childItem.id">
                    <i v-if="childItem.icon" :class="childItem.icon"
                       :style="childItem.fingerprint === 'rechargeSite' ? 'color: red;' : ''"></i>
                    <span :style="childItem.fingerprint === 'rechargeSite' ? 'color: red;' : ''">{{childItem.name}}</span>
                    <el-badge :value="childItem.waitCount" :hidden="childItem.waitCount < 1" />
                </el-menu-item>
            </el-submenu>

            <el-submenu :index="item.id" v-else-if="item.type ==='productType' && item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span slot="title">{{item.name}}</span>
                    <el-badge :value="item.waitCount" :hidden="item.waitCount < 1" />
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/product/' + childItem.id" :key="childItem.id">
                    <i class="el-icon-tickets"></i>
                    {{childItem.name}}
                    <el-badge :value="childItem.waitCount" :hidden="childItem.waitCount < 1" />
                </el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.path" v-if="item.type ==='menu'">
                <span slot="title">
                    <i v-if="item.icon" :class="item.icon"
                       :style="item.fingerprint === 'rechargeSite' ? 'color: red;' : ''"></i>
                    <span :style="item.fingerprint === 'rechargeSite' ? 'color: red;' : ''">{{item.name}}</span>
                    <el-badge :value="item.waitCount" :hidden="item.waitCount < 1" />
                </span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    import {closeSideMenu} from "@/utils";
    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            this.registerIoListener();
        },
        methods: {
            menuActive() {
                closeSideMenu();
            },
            registerIoListener() {
                // 添加商品类别
                this.$options.sockets[this.roleId + 'type'] = (type) => {
                    this.$store.commit('addTypeToMenu', type);
                };

                // 添加商品
                this.$options.sockets[this.roleId + 'product'] = (data) => {
                    this.$store.commit('addProductToMenu', data);
                };

                // 修改商品类别或商品信息
                this.$options.sockets[this.siteId + 'typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);
                };

                // 修改待处理订单提示个数
                this.$options.sockets[this.siteId + 'plusBadge'] = (aim) => {
                    this.$store.commit('plusBadge', aim);
                };
                this.$options.sockets[this.siteId + 'plusOrderErrorBadge'] = (data) => {
                    this.$store.commit('plusOrderErrorBadge', data);
                };

                this.$options.sockets[this.siteId + 'minusBadge'] = (aim) => {
                    this.$store.commit('minusBadge', aim);
                };
                this.$options.sockets[this.siteId + 'minusOrderErrorBadge'] = (aim) => {
                    this.$store.commit('minusOrderErrorBadge', aim);
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

</style>