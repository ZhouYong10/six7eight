
import VueRouter from "vue-router";
import {Message} from "element-ui";
import {document, axiosGet} from "@/utils";
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
                {path: 'admin/info', component: compObj.adminInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.dealProduct, props: true},
                {path: 'order/error/manage', component: compObj.orderError},
                {path: 'recharge/records', component: compObj.rechargeRecord},
                {path: 'consume/records', component: compObj.consumeRecord},
                {path: 'profit/records', component: compObj.profitRecord},
                {path: 'withdraw/records', component: compObj.withdrawRecord},
                {path: 'product/type/manage', component: compObj.productType},
                {path: 'product/all/manage', component: compObj.product},
                {path: 'admin/role/manage', component: compObj.adminRole},
                {path: 'admin/list/manage', component: compObj.admins},
                {path: 'user/role/manage', component: compObj.usersRole},
                {path: 'user/list/manage', component: compObj.users},
                {path: 'feedback/mine/manage', component: compObj.feedback},
                {path: 'feedback/user/manage', component: compObj.userFeedback},
                {path: 'placard/manage', component: compObj.placard},
                {path: 'site/settings', component: compObj.settings},
            ]
        }
    ]
});


const whitePath = [
    '/home',
    '/home/admin/info',
];
router.beforeEach(async (to, from, next) => {
    let path = to.path;
    if (path === '/') {
        document.title = to.meta.title;
        next();
    } else {
        if (isLogin()) {
            const res = await axiosGet('/site/logined');
            if (res.data.successed) {
                if (whitePath.some(item => item === path)) {
                    document.title = to.meta.title;
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
                        document.title = menu.name;
                        next();
                    }else{
                        Message.error('您访问的地址不存在或没有访问权限！');
                        next('/home');
                    }
                }
            }else {
                Message.error(res.data.msg);
                next('/');
            }
        }else{
            Message.error('请登录后操作！');
            next('/');
        }
    }
});

export default router;