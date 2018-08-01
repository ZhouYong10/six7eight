import Vue from "vue";
import Vuex, {mapState} from "vuex";
import VueRouter from "vue-router";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "./assets/commons/main.css";
import routes from "./route/platform";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

const store = new Vuex.Store({
    state: {

    },
    mutations: {

    }
});

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    console.log(to.path, '--------------------');
    console.log(to.matched, ' matched --------------------');
    // if (to.meta.requireAuth) {
    //
    // }else{
    //     next();
    // }
    next();
});

let app = new Vue({
    store,
    router,
    el: "#app"
});