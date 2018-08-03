
import {RouteConfig} from "vue-router";
import Login from "./components/login/Login.vue";
import NoPage from "@/components/NoPage.vue";
import Index from "./components/Index.vue";
import Home from "./components/Home.vue";
import Hello from "./components/Hello.vue";

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