
import {RouteConfig} from "vue-router";
import Login from "../../components/site-end/login/Login.vue";
import NoPage from "../../components/commons/NoPage.vue";
import Index from "../../components/site-end/Index.vue";
import Home from "../../components/site-end/Home.vue";
import Hello from "../../components/site-end/Hello.vue";

const routes:Array<RouteConfig> = [
    {path: '*', component: NoPage},
    {path: '/', component: Login},
    {path: '/home', component: Home, children: [
            {path: '', component: Index},
            {path: 'recharge', component: Hello},
            {path: 'mp/code', component: Hello},
        ]}
];

export default routes;