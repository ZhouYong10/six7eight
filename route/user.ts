import * as Router from "koa-router";
import {Context} from "koa";
import * as debuger from "debug";
import {CUser} from "../controler/CUser";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router){
    router.get('/users', async (ctx: Context) => {
        let cUser = new CUser({name: "张三1122", password: "123456"})

        var savedUser = await cUser.saveUser();
        debug(savedUser);
        ctx.body = savedUser;
    });

    router.use('/user/auth/*', (ctx: Context, next) => {
        debug('这是拦截 site user 所有路由的拦截器=====================');
        next();
    });

    userAuth.get('/', async (ctx: Context) => {

    });

    router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
}