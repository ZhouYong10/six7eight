import VueRouter from "vue-router";
import {Message} from "element-ui";
import {window} from "@/window";
import Vue from "vue";
import compObj from "./components";
import {getMenu, hasPermission, isLogin} from "./store";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/home'},
        {path: '/', component: compObj.login, meta: {title: '登录'}},
        {path: '/home', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '首页'}},
                {path: 'platform/funds/record', component: compObj.fundsRecord, meta: {title: '平台返利'}},
                {path: 'admin/info', component: compObj.adminInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.dealProduct, props: true},
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
                {path: 'info/platform/manage', component: compObj.platformInfo},
                {path: 'right/platform/manage', component: compObj.right},
                {path: 'right/site/manage', component: compObj.siteRight},
                {path: 'right/user/manage', component: compObj.userRight},
            ]
        }
    ]
});

const whitePath = [
    '/home',
    '/home/admin/info',
    '/home/platform/funds/record'
];

router.beforeEach(async (to, from, next) => {
    let path = to.path;
    if (path === '/') {
        window.document.title = to.meta.title;
        next();
    } else {
        if (isLogin()) {
            if (whitePath.some(item => item === path)) {
                window.document.title = to.meta.title;
                next();
            }else{
                let menu;
                let productId = to.params.id;
                if (productId) {
                    menu = getMenu(productId, true);
                }else{
                    menu = getMenu(path, false);
                }
                if (menu && hasPermission(menu.fingerprint)) {
                    window.document.title = menu.name;
                    next();
                }else{
                    Message.error('您访问的地址不存在或没有访问权限！');
                    next('/home');
                }
            }
        }else{
            Message.error('请登录后操作！');
            next('/');
        }
    }
});

export default router;