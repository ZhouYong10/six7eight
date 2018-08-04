import VueRouter from "vue-router";
import {Message} from "element-ui";
import {axiosGet} from "@/utils";
import Vue from "vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: () => import(/* webpackChunkName: "404" */ "@/components/NoPage.vue")},
        {path: '/', component: () => import("./components/login/Login.vue")},
        {path: '/home', component: () => import("./components/Home.vue"),
            children: [
                {path: '', component: () => import("./components/Index.vue")},
                {path: 'admin/info', component: () => import("./components/AdminInfo.vue")},
                {path: 'order/err', component: () => import("./components/OrderError.vue")},
                {path: 'funds/recharge', component: () => import("./components/Recharge.vue")},
                {path: 'funds/withdraw', component: () => import("./components/Withdraw.vue")},
                {path: 'products/types', component: () => import("./components/ProudctTypes.vue")},
                {path: 'products/all', component: () => import("./components/ProudctAll.vue")},
                {path: 'placards/platform', component: () => import("./components/PlacardsPlatform.vue")},
                {path: 'placards/site', component: () => import("./components/PlacardsSite.vue")},
                {path: 'sites', component: () => import("./components/Sites.vue")},
                {path: 'feedback/site', component: () => import("./components/FeedbackSite.vue")},
                {path: 'feedback/user', component: () => import("./components/FeedbackUser.vue")},
                {path: 'admins/role', component: () => import("./components/AdminsRole.vue")},
                {path: 'admins/list', component: () => import("./components/AdminsList.vue")},
            ]}
    ]
});

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