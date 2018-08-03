
import {RouteConfig} from "vue-router";
import Login from "../../components/platform/login/Login.vue";
import NoPage from "../../components/commons/NoPage.vue";
import Index from "../../components/platform/Index.vue";
import Home from "../../components/platform/Home.vue";
import Hello from "../../components/platform/Hello.vue";
import AdminInfo from "../../components/platform/AdminInfo.vue";
import OrderError from "../../components/platform/OrderError.vue";
import Recharge from "../../components/platform/Recharge.vue";
import Withdraw from "../../components/platform/Withdraw.vue";
import ProductsTypes from "../../components/platform/ProudctsTypes.vue";
import ProductsAll from "../../components/platform/ProudctsAll.vue";
import PlacardsPlatform from "../../components/platform/PlacardsPlatform.vue";
import PlacardsSite from "../../components/platform/PlacardsSite.vue";
import Sites from "../../components/platform/Sites.vue";
import FeedbackSite from "../../components/platform/FeedbackSite.vue";
import FeedbackUser from "../../components/platform/FeedbackUser.vue";
import PlatformAdmins from "../../components/platform/PlatformAdmins.vue";

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
            {path: 'platform/admins', component: PlatformAdmins},
        ]}
];

export default routes;