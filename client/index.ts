import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import VueAxios = require("vue-axios");
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/main.css";
import SideMenu from "./components/SideMenu.vue";
import MainContent from "./components/MainContent.vue";
import HeaderMenu from "./components/HeaderMenu.vue"
import routes from "./route";


Vue.use(VueRouter);
Vue.use(VueAxios, axios);
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