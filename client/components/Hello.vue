<template>
    <div>
        <div class="greeting">Hello-Vue-This-is something new&&&&& {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
        <el-button type="primary">主要按钮</el-button>
    </div>

</template>

<script lang="ts">
    import Vue from "vue";
    export default Vue.extend({
        props: ['name', 'initialEnthusiasm'],
        data() {
            return {
                enthusiasm: this.initialEnthusiasm,
            }
        },
        methods: {
            increment() { this.enthusiasm++; },
            decrement() {
                if (this.enthusiasm > 1) {
                    this.enthusiasm--;
                }
            },
        },
        computed: {
            exclamationMarks(): string {
                return Array(this.enthusiasm + 1).join('!');
            }
        }
    });
</script>

<style lang="scss">
    .greeting {
        font-size: 20px;
        color: blue;
    }
</style>