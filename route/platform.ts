import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import * as debuger from "debug";
import {LoginRes} from "../utils";
import {UserType} from "../entity/UserBase";
import {CRightAdmin} from "../controler/CRightAdmin";

const debug = (info: any, msg?: string) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();

export async function platformRoute(router: Router) {

    /* 登录页面 */
    router.get('/platform', async (ctx: Context) => {
        await ctx.render('platform');
    });

    /* 登录入口 */
    router.post('/platform/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('platform', (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    ctx.body = new LoginRes(true, '登录成功！', user);
                } else {
                    ctx.body = new LoginRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        }else {
            ctx.body = new LoginRes(false, '验证码错误！');
        }
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/platform/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            ctx.body = new LoginRes(true);
        } else {
            ctx.body = new LoginRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/platform/auth/*', (ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            return next();
        } else {
            ctx.body = new LoginRes(false, '请登录后操作！');
        }
    });

    platformAuth.get('/right/show', async (ctx: Context) => {
        let rights = await CRightAdmin.show();
        debug(rights);
        ctx.body = rights;
    });

    platformAuth.post('/right/save', async (ctx: Context) => {
        ctx.body = await CRightAdmin.save(ctx.request.body);
    });

    platformAuth.get('/right/show/:id', async (ctx: Context) => {
        ctx.body = await CRightAdmin.getChild(ctx.params.id);
    });

    platformAuth.get('/right/del/:id', async (ctx: Context) => {
        await CRightAdmin.del(ctx.params.id);
        ctx.body = true;
    });

    router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
}