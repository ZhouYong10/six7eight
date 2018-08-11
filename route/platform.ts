import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import * as debuger from "debug";
import {LoginRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import {CRightAdmin} from "../controler/CRightAdmin";
import {CRoleUserAdmin} from "../controler/CRoleUserAdmin";
import {CUserAdmin} from "../controler/CUserAdmin";

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
        const params: any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('platform', async (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    await CUserAdmin.updateLoginTime({id: user.id, time: now()});
                    ctx.body = new LoginRes(true, '登录成功！', user);
                } else {
                    ctx.body = new LoginRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        } else {
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

    /* 平台管理员操作 */
    platformAuth.get('/admins', async (ctx: Context) => {
        ctx.body = await CUserAdmin.allAdmins();
    });

    /* 平台管理员角色操作 */
    platformAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = await CRoleUserAdmin.allRoles();
    });

    platformAuth.post('/role/save', async (ctx: Context) => {
        ctx.body = await CRoleUserAdmin.saveOne(ctx.request.body);
    });

    platformAuth.post('/role/update', async (ctx: Context) => {
        ctx.body = await CRoleUserAdmin.update(ctx.request.body);
    });

    platformAuth.get('/role/remove/:id', async (ctx: Context) => {
        if (await CRoleUserAdmin.delById(ctx.params.id)) {
            ctx.body = {removed: true};
        } else {
            ctx.body = {removed: false, msg: '该角色上有关联的账户，不能删除！'};
        }
    });

    /* 平台管理员权限操作 */
    platformAuth.get('/right/show', async (ctx: Context) => {
        ctx.body = await CRightAdmin.show();
    });

    platformAuth.post('/right/save', async (ctx: Context) => {
        ctx.body = await CRightAdmin.save(ctx.request.body);
    });

    platformAuth.post('/right/update', async (ctx: Context) => {
        ctx.body = await CRightAdmin.update(ctx.request.body);
    });

    platformAuth.get('/right/del/:id', async (ctx: Context) => {
        try {
            await CRightAdmin.del(ctx.params.id);
            ctx.body = true;
        } catch (e) {
            debug(e);
            ctx.body = false;
        }
    });

    router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
}