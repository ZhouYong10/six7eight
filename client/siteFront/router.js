import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', component: compObj.noPage },
    ]
});
router.addRoutes([
    {
        path: '/', component: compObj.home,
        children: [
            { path: '', component: compObj.index },
            { path: 'self/info', component: compObj.myInfo },
            { path: 'recharge/add', component: compObj.recharge },
            { path: 'recharge/record', component: compObj.rechargeRecord },
            { path: 'consume/record', component: compObj.consumeRecord },
            { path: 'profit/record', component: compObj.profitRecord },
            { path: 'withdraw/add', component: compObj.withdraw },
            { path: 'withdraw/record', component: compObj.withdrawRecord },
            { path: 'lower/users', component: compObj.lowerUsers },
            { path: 'feedback', component: compObj.feedback },
        ]
    }
]);
export default router;
//# sourceMappingURL=router.js.map