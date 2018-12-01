import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import {document} from "@/utils";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/'},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '公告'}},
                {path: 'selfInfo', component: compObj.myInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.product, props: true, meta: {title: '订单信息'}},
                {path: 'recharge/records', component: compObj.rechargeRecord},
                {path: 'consume/records', component: compObj.consumeRecord},
                {path: 'profit/records', component: compObj.profitRecord},
                {path: 'withdraw/records', component: compObj.withdrawRecord},
                {path: 'lower/user', component: compObj.lowerUsers},
                {path: 'feedback/records', component: compObj.feedback},
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    // document.title = to.meta.title;
    next();
});

export default router;