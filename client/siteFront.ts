import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, {StorageKey} from "@/utils";


Vue.use(ElementUI);

let app = new Vue({
    el: "#app",
    store,
    router,
    computed: {
        getStateInfo():any {
            return this.$store.state.info;
        }
    },
    watch: {
        getStateInfo: {
            handler: function (val) {
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        }
    }
});