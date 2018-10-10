import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import * as debuger from "debug";
import {comparePass, MsgRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import {CRightAdmin} from "../controler/CRightAdmin";
import {CRoleUserAdmin} from "../controler/CRoleUserAdmin";
import {CUserAdmin} from "../controler/CUserAdmin";
import {CSite} from "../controler/CSite";
import {CRightSite} from "../controler/CRightSite";
import {CRightUser} from "../controler/CRightUser";
import {CProductTypes} from "../controler/CProductTypes";
import {CProduct} from "../controler/CProduct";

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
                    ctx.body = new MsgRes(true, '', user);
                } else {
                    ctx.body = new MsgRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        } else {
            ctx.body = new MsgRes(false, '验证码错误！');
        }
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/platform/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/platform/auth/*', (ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });


    /* 管理员信息 */
    platformAuth.get('/admin/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findById(ctx.params.id));
    });

    platformAuth.post('/adminInfo/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.updateInfo(ctx.request.body));
    });

    platformAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    platformAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.changePass({
            id: ctx.state.user.id,
            ...ctx.request.body
        }));
    });

    /* 商品类别管理 */
    platformAuth.get('/product/types', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.getAll());
    });

    platformAuth.get('/product/type/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.findByName(ctx.params.name));
    });

    platformAuth.post('/product/type/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.add(ctx.request.body));
    });

    platformAuth.post('/product/type/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.update(ctx.request.body));
    });

    /* 商品管理 */
    platformAuth.get('/products', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.getAll());
    });

    platformAuth.get('/product/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.findByName(ctx.params.name));
    });

    platformAuth.post('/product/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.add(ctx.request.body));
    });

    platformAuth.post('/product/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.update(ctx.request.body));
    });

    /* 站点管理 */
    platformAuth.get('/sites', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.all());
    });

    platformAuth.post('/site/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.add(ctx.request.body));
    });

    /* 平台管理员操作 */
    platformAuth.get('/admins', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.allAdmins());
    });

    platformAuth.get('/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findByUsername(ctx.params.username))
    });

    platformAuth.post('/admin/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.save(ctx.request.body));
    });

    platformAuth.post('/admin/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.update(ctx.request.body));
    });

    platformAuth.get('/admin/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.delById(ctx.params.id));
    });

    /* 平台管理员角色操作 */
    platformAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.allRoles());
    });

    platformAuth.post('/role/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.saveOne(ctx.request.body));
    });

    platformAuth.post('/role/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.update(ctx.request.body));
    });

    platformAuth.get('/role/remove/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.delById(ctx.params.id));
    });

    /* 平台管理员权限操作 */
    platformAuth.get('/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.show());
    });

    platformAuth.post('/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.save(ctx.request.body));
    });

    platformAuth.post('/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.update(ctx.request.body));
    });

    platformAuth.get('/right/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.del(ctx.params.id));
    });

    /* 站点管理员权限操作 */
    platformAuth.get('/site/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.show());
    });

    platformAuth.post('/site/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.save(ctx.request.body));
    });

    platformAuth.post('/site/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.update(ctx.request.body));
    });

    platformAuth.get('/site/right/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.del(ctx.params.id));
    });

    /* 站点用户权限操作 */
    platformAuth.get('/user/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    platformAuth.post('/user/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.save(ctx.request.body));
    });

    platformAuth.post('/user/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.update(ctx.request.body));
    });

    platformAuth.get('/user/right/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.del(ctx.params.id));
    });

    router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
}