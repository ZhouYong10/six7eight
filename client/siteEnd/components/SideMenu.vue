<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in rights">
            <el-submenu :index="'/home/' + item.id" v-if="item.type !=='productType' && item.children.length > 0">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/' + childItem.id" :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>

            <el-submenu :index="'/home/product/' + item.id" v-else-if="item.type ==='productType' && item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/product/' + childItem.id" :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>

            <el-menu-item :index="'/home/' + item.id" v-if="item.type !=='productType' && item.children.length < 1">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    import {parseRightsToRoutes} from "@/utils";
    import compObj from "./";

    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            this.$router.addRoutes([
                {
                    path: '/home', component: compObj.home,
                    children: parseRightsToRoutes(this.rights, compObj, '/home/')
                }
            ]);

            this.registIoListener();
        },
        methods: {
            registIoListener() {
                if (this.role && this.role.type === 'role_site') {
                    // 添加商品类别
                    this.$options.sockets[this.role.id + 'type'] = (type) => {
                        this.$store.commit('addTypeToMenu', type);
                    };

                    // 添加商品
                    this.$options.sockets[this.role.id + 'product'] = (data) => {
                        this.$store.commit('addProductToMenu', data);
                    };
                }

                // 修改商品类别或商品信息
                this.$options.sockets[this.siteId + 'typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);
                };
            }
        },
        computed: {
            siteId() {
                let user = this.$store.state.user;
                if(user){
                    return user.site.id;
                }
            },
            role() {
                let user = this.$store.state.user;
                if(user){
                    return user.role;
                }
            },
            rights() {
                return this.$store.state.rights || [];
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>