import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/main.css";
import SideMenu from "./components/SideMenu.vue";
import MainContent from "./components/MainContent.vue";
import HeaderMenu from "./components/HeaderMenu.vue"
import routes from "./route";


Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);

const router = new VueRouter({
    routes
});

let app = new Vue({
    router,
    el: "#app",
    components: {
        SideMenu,
        MainContent,
        HeaderMenu
    }
});