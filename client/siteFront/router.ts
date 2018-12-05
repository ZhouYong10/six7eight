import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import {document,axiosGet} from "@/utils";
import {Message} from "element-ui";
import {getMenu, hasPermission, isLogin, logout} from "./store";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/'},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '公告'}},
                {path: 'self/info', component: compObj.myInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.product, props: true, meta: {title: '订单信息'}},
                {path: 'recharge/records', component: compObj.rechargeRecord},
                {path: 'consume/records', component: compObj.fundsRecord},
                {path: 'profit/records', component: compObj.profitRecord},
                {path: 'withdraw/records', component: compObj.withdrawRecord},
                {path: 'user/role/up', component: compObj.roleUp},
                {path: 'lower/user', component: compObj.lowerUsers},
                {path: 'feedback/records', component: compObj.feedback},
            ]
        }
    ]
});

const whitePath = [
    '/',
    '/self/info',
];
router.beforeEach(async (to, from, next) => {
    let path = to.path;
    if (path === '/') {
        document.title = to.meta.title;
        next();
    } else {
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
            if (menu) {
                document.title = menu.name;
                const res = await axiosGet('/user/logined');
                let frontLogin = isLogin();
                let backLogin = res.data.successed;

                if (frontLogin && backLogin) {
                    if (hasPermission(menu.fingerprint)) {
                        next();
                    }else{
                        Message.error('您访问的地址不存在或没有访问权限！');
                        next('/');
                    }
                }
                if (frontLogin && !backLogin) {
                    axiosGet('/user/auth/logout').then(() => {
                        axiosGet('/user/init/data').then( (data:any)=> {
                            logout(data);
                            next();
                        });
                    });
                }
                if (!frontLogin && backLogin) {
                    await axiosGet('/user/auth/logout');
                    next();
                }
                if (!frontLogin && !backLogin) {
                    next();
                }
            }else{
                Message.error('您访问的地址不存在或没有访问权限！');
                next('/');
            }
        }
    }
});

export default router;