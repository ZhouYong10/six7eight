
import VueRouter from "vue-router";
import {Message} from "element-ui";
import {axiosGet} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.noPage},
    ]
});

router.addRoutes([
    {
        path: '/', component: compObj.home,
        children: [
            {path: '', component: compObj.index},
            {path: 'self/info', component: compObj.myInfo},
            {path: 'recharge/add', component: compObj.recharge},
            {path: 'recharge/record', component: compObj.rechargeRecord},
            {path: 'consume/record', component: compObj.consumeRecord},
            {path: 'profit/record', component: compObj.profitRecord},
            {path: 'withdraw/record', component: compObj.withdrawRecord},
            {path: 'lower/users', component: compObj.lowerUsers},
            {path: 'feedback', component: compObj.feedback},
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