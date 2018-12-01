
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
                {path: '/home/order/error/manage', component: compObj.orderError},
                {path: '/home/recharge/records', component: compObj.rechargeRecord},
                {path: '/home/consume/records', component: compObj.consumeRecord},
                {path: '/home/profit/records', component: compObj.profitRecord},
                {path: '/home/withdraw/records', component: compObj.withdrawRecord},
                {path: '/home/product/type/manage', component: compObj.productType},
                {path: '/home/product/all/manage', component: compObj.product},
                {path: '/home/admin/role/manage', component: compObj.adminRole},
                {path: '/home/admin/list/manage', component: compObj.admins},
                {path: '/home/user/role/manage', component: compObj.usersRole},
                {path: '/home/user/list/manage', component: compObj.users},
                {path: '/home/feedback/mine/manage', component: compObj.feedback},
                {path: '/home/feedback/user/manage', component: compObj.userFeedback},
                {path: '/home/placard/manage', component: compObj.placard},
                {path: '/home/site/settings', component: compObj.settings},
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    // document.title = to.meta.title;

    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    } else {
        const res = await axiosGet('/site/logined');
        if (res.data.successed) {
            next();
        }else {
            Message.error(res.data.msg);
            next('/');
        }
    }
});

export default router;