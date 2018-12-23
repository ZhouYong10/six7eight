<template>
    <ul class="message-body" v-if="data.length > 0">
        <li class="item" v-for="item in data">
            <h1 class="title">{{item.title}}</h1>
            <p class="content">{{item.content}}</p>
            <div class="deal">
                <el-button type="text" @click="remove(item)">忽 略</el-button>
                <el-button type="text" @click="check(item)">查 看</el-button>
            </div>
        </li>
    </ul>
    <p class="message-default" v-else>暂无数据</p>
</template>

<script>
    export default {
        name: "Message",
        props: ['data'],
        methods: {
            remove(item) {
                this.removeItem(item);
                this.$emit('remove', item);
            },
            check(item) {
                this.removeItem(item);
                this.$emit('check', item);
            },
            removeItem(aim) {
                let index = this.data.findIndex(item => {
                    return item.id === aim.id
                });
                this.data.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss">
    .message-body{
        margin: 0;
        padding: 0;
        list-style: none;
        max-height: 360px;
        overflow-y: auto;
        .item{
            border-bottom: 1px solid #ebeef5;
            padding: 0 6px 6px;
            margin-bottom: 6px;
            .title {
                font-size: 16px;
                margin: 0;
            }
            .content{
                margin: 2px 0 6px;
            }
            .deal{
                text-align: right;
                button{
                    padding: 0;
                }
                button:first-child{
                    color: #c0c4cc;
                }
            }
        }
    }
    .message-default {
        text-align: center;
        width: 300px;
    }
</style>