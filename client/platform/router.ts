import VueRouter from "vue-router";
import {Message} from "element-ui";
import {document, axiosGet} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/home'},
        {path: '/', component: compObj.login, meta: {title: '登录'}},
        {path: '/home', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '首页'}},
                {path: 'admin/info', component: compObj.adminInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.dealProduct, props: true, meta: {title: '订单管理'}},
                {path: 'order/error', component: compObj.orderError},
                {path: 'funds/manage/recharges', component: compObj.recharge},
                {path: 'funds/manage/withdraws', component: compObj.withdraw},
                {path: 'product/field/manage', component: compObj.productFields},
                {path: 'product/type/manage', component: compObj.productTypes},
                {path: 'product/all/manage', component: compObj.productAll},
                {path: 'placard/platform/manage', component: compObj.placardsPlatform},
                {path: 'placard/site/manage', component: compObj.placardsSite},
                {path: 'site/manage', component: compObj.sites},
                {path: 'user/manage', component: compObj.users},
                {path: 'feedback/site/manage', component: compObj.feedbackSite},
                {path: 'feedback/user/manage', component: compObj.feedbackUser},
                {path: 'admin/role/manage', component: compObj.adminsRole},
                {path: 'admin/list/manage', component: compObj.adminsList},
                {path: 'right/platform/manage', component: compObj.right},
                {path: 'right/site/manage', component: compObj.siteRight},
                {path: 'right/user/manage', component: compObj.userRight},
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    // document.title = to.query.t;

    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    } else {
        const res = await axiosGet('/platform/logined');
        if (res.data.successed) {
            next();
        }else {
            Message.error(res.data.msg);
            next('/');
        }
    }
});

export default router;