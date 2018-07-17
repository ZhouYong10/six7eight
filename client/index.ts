import Vue from "vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/main.css";
import SideMenu from "./components/SideMenu.vue";
import routes from "./route";


Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({
    routes
});

let app = new Vue({
    router,
    components: {
        SideMenu
    }
}).$mount('#app');