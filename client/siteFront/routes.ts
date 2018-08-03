
import {RouteConfig} from "vue-router";
import HelloComponent from "./components/Hello.vue";

const routes:Array<RouteConfig> = [
    {path: '/', component: HelloComponent},
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