
import {RouteConfig} from "vue-router";
import Login from "../../components/platform/login/Login.vue";
import NoPage from "../../components/platform/NoPage.vue";
import Home from "../../components/platform/Home.vue";
import Hello from "../../components/platform/Hello.vue";

const routes:Array<RouteConfig> = [
    {path: '*', component: NoPage},
    {path: '/', component: Login},
    {path: '/home', component: Home, children: [
            {path: 'recharge', component: Hello},
            {path: 'mp/code', component: Hello},
        ]}
];

export default routes;