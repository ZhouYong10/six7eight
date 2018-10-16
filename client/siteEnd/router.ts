
import VueRouter from "vue-router";
import {Message} from "element-ui";
import {axiosGet} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.noPage},
        {path: '/', component: compObj.login}
    ]
});

router.addRoutes([
    {
        path: '/home', component: compObj.home,
        children: [
            {path: '', component: compObj.index},
            {path: 'admin/info', component: compObj.adminInfo},
            {path: 'recharge/add', component: compObj.recharge},
            {path: 'recharge/record', component: compObj.rechargeRecord},
            {path: 'consume/record', component: compObj.consumeRecord},
            {path: 'profit/record', component: compObj.profitRecord},
            {path: 'withdraw/record', component: compObj.withdrawRecord},
            {path: 'product/type', component: compObj.productType},
            {path: 'product/all', component: compObj.product},
            {path: 'admin/role', component: compObj.adminRole},
            {path: 'admins', component: compObj.admins},
            {path: 'users/role', component: compObj.usersRole},
            {path: 'users', component: compObj.users},
            {path: 'placard', component: compObj.placard},
            {path: 'feedback', component: compObj.feedback},
            {path: 'user/feedback', component: compObj.userFeedback},
            {path: 'site/settings', component: compObj.settings},
        ]
    }
]);

router.beforeEach(async (to, from, next) => {
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