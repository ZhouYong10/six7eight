<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="6">
            <div class="menu-btn" @click="">
                <i class="el-icon-menu" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/home">678网络营销平台</router-link>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="user-funds">
                <span>余额：<span>13123.0000</span>￥</span>
                &nbsp;&nbsp;&nbsp;
                <span>冻结：<span>23.0123</span>￥</span>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="user-role" @click="changeName()">
                {{user.username}} ( {{user.role.name}} )
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "header-menu",
        componentName: "header-menu",
        methods: {
            handleCommand(command) {
                this.$message('click on item ' + command);
            }
        },
        computed: {
            user() {
                return this.$store.state.info.user;
            }
        },
        methods: {
            changeName() {
                this.$store.commit('changeUser', {
                    username: 'hello',
                    type: 'this is a new user',
                    role: {name: '新的用户'},
                    age: 123
                });
            }
        }
    }
</script>

<style lang="scss">
    .header-menu {
        margin: 0;
        height: inherit;
        background: #1C2326;
        border-radius: 2px;
        .el-col{
            line-height: 50px;
            color: white;
        }
        .menu-btn{
            display: inline-block;
            width: 50px;
            text-align: center;
            cursor: pointer;
            border-right: 2px solid #3E4447;
            i{
                font-size: 30px;
                vertical-align: middle;
            }
        }
        .home{
            display: inline-block;
            padding-left: 5px;
            a{
                color: white;
                text-decoration: none;
                line-height: 50px;
            }
        }
        .user-funds{
            text-align: center;
        }
        .user-role{
            text-align: right;
            padding-right: 20px;
        }
    }

</style>