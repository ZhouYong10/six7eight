
import {RouteConfig} from "vue-router";
import Login from "./components/login/Login.vue";
import NoPage from "@/components/NoPage.vue";
import Index from "./components/Index.vue";
import Home from "./components/Home.vue";
import Hello from "./components/Hello.vue";
import AdminInfo from "./components/AdminInfo.vue";
import OrderError from "./components/OrderError.vue";
import Recharge from "./components/Recharge.vue";
import Withdraw from "./components/Withdraw.vue";
import ProductsTypes from "./components/ProudctsTypes.vue";
import ProductsAll from "./components/ProudctsAll.vue";
import PlacardsPlatform from "./components/PlacardsPlatform.vue";
import PlacardsSite from "./components/PlacardsSite.vue";
import Sites from "./components/Sites.vue";
import FeedbackSite from "./components/FeedbackSite.vue";
import FeedbackUser from "./components/FeedbackUser.vue";
import AdminsRole from "./components/AdminsRole.vue";
import AdminsList from "./components/AdminsList.vue";



const routes:Array<RouteConfig> = [
    {path: '*', component: NoPage},
    {path: '/', component: Login},
    {path: '/home', component: Home, children: [
            {path: '', component: Index},
            {path: 'admin/info', component: AdminInfo},
            {path: 'order/err', component: OrderError},
            {path: 'funds/recharge', component: Recharge},
            {path: 'funds/withdraw', component: Withdraw},
            {path: 'products/types', component: ProductsTypes},
            {path: 'products/all', component: ProductsAll},
            {path: 'placards/platform', component: PlacardsPlatform},
            {path: 'placards/site', component: PlacardsSite},
            {path: 'sites', component: Sites},
            {path: 'feedback/site', component: FeedbackSite},
            {path: 'feedback/user', component: FeedbackUser},
            {path: 'admins/role', component: AdminsRole},
            {path: 'admins/list', component: AdminsList},
        ]}
];

export default routes;