
import {RouteConfig} from "vue-router";
import Login from "../../components/platform/login/Login.vue";
import Home from "../../components/platform/Home.vue";

import HelloComponent from "../../components/site-front/Hello.vue";

const routes:Array<RouteConfig> = [
    {path: '/', component: Login},
    {path: '/home', component: Home},
    {path: '/wx', component: HelloComponent},
    {path: '/wb', component: HelloComponent},
    {path: '/video', component: HelloComponent},
    {path: '/live', component: HelloComponent},
    {path: '/recharge', component: HelloComponent},
    {path: '/withdraw', component: HelloComponent},
    {path: '/user', component: HelloComponent},
    {path: '/placard', component: HelloComponent},
    {path: '/feedback', component: HelloComponent},
];

export default routes;