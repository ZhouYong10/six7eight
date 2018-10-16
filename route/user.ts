import * as Router from "koa-router";
import {Context} from "koa";
import * as debuger from "debug";
import {UserType} from "../entity/UserBase";
import {MsgRes} from "../utils";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router){


    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/user/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.session!.user && ctx.session!.user.type === UserType.User) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/user/auth/*',(ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.session!.user && ctx.session!.user.type === UserType.User) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    userAuth.get('/', async (ctx: Context) => {

    });

    router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
}