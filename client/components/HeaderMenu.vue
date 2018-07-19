<template>
    <el-row type="flex" class="header-menu" justify="space-between">
        <el-col :span="5">
            <div class="menu-btn">
                <i class="el-icon-menu" title="菜单"></i>
            </div>
            <div class="home">
                <router-link to="/">678网络营销平台</router-link>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="user-funds">
                <span>余额：<span>13123.0000</span>￥</span>
                &nbsp;&nbsp;&nbsp;
                <span>冻结：<span>23.0123</span>￥</span>
            </div>
        </el-col>
        <el-col :span="12">
            <el-row type="flex" class="drop-down" justify="space-around">
                <el-col :sm="9" :lg="12">
                    <div class="user-role">
                        账户名：等级
                    </div>
                </el-col>
                <el-col :sm="5" :lg="3">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :sm="5" :lg="3">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :sm="5" :lg="3">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "HeaderMenu",
        componentName: "HeaderMenu",
        methods: {
            handleCommand(command) {
                this.$message('click on item ' + command);
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
            text-align:center;
        }
        .drop-down{
            text-align: center;
            .user-role{
                text-align: right;
            }
        }
        .el-dropdown-link {
            display: inline-block;
            cursor: pointer;
            color: white;
        }
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        min-height: 36px;
    }




</style>