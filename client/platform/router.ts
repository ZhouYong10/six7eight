import VueRouter from "vue-router";
import {Message} from "element-ui";
import {axiosGet} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: () => import("@/components/NoPage.vue")},
        {path: '/', component: () => import("./components/login/Login.vue")}
    ]
});

router.addRoutes([
    {
        path: '/home', component: compObj.home,
        children: [
            {path: '', component: compObj.index},
            {path: 'admin/info', component: compObj.adminInfo},
            {path: 'order/err', component: compObj.orderError},
            {path: 'funds/recharge', component: compObj.recharge},
            {path: 'funds/withdraw', component: compObj.withdraw},
            {path: 'products/types', component: compObj.productTypes},
            {path: 'products/all', component: compObj.productAll},
            {path: 'placards/platform', component: compObj.placardsPlatform},
            {path: 'placards/site', component: compObj.placardsSite},
            {path: 'sites', component: compObj.sites},
            {path: 'feedback/site', component: compObj.feedbackSite},
            {path: 'feedback/user', component: compObj.feedbackUser},
            {path: 'admins/role', component: compObj.adminsRole},
            {path: 'admins/list', component: compObj.adminsList},
        ]
    }
]);

router.beforeEach(async (to, from, next) => {
    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    } else {
        const res = await axiosGet('/platform/logined');
        if (res.data.isLogin) {
            next();
        }else {
            Message.error(res.data.msg);
            next('/');
        }
    }
});

export default router;