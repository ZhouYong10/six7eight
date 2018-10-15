import * as Router from "koa-router";
import {Context} from "koa";
import {comparePass, MsgRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import * as passport from "passport";
import {CUserSite} from "../controler/CUserSite";
import {CRoleUserSite} from "../controler/CRoleUserSite";
import {CRightSite} from "../controler/CRightSite";
import {CProductTypeSite} from "../controler/CProductTypeSite";
import {CProductSite} from "../controler/CProductSite";
import {CRoleUser} from "../controler/CRoleUser";
import {CRightUser} from "../controler/CRightUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {CSite} from "../controler/CSite";

const siteAuth = new Router();

export async function siteRoute(router: Router) {

    router.get('/site/admin', async (ctx: Context) => {
        await ctx.render('siteEndLogin');
    });


    /* 登录入口 */
    router.post('/site/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('site', async (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    await CUserSite.updateLoginTime({id: user.id, time: now()});
                    ctx.body = new MsgRes(true, '登录成功！', user);
                } else {
                    ctx.body = new MsgRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        }else {
            ctx.body = new MsgRes(false, '验证码错误！');
        }
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/site/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/site/auth/*',(ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 管理员信息 */
    siteAuth.get('/admin/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findById(ctx.params.id));
    });

    siteAuth.post('/adminInfo/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.updateInfo(ctx.request.body));
    });

    siteAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    siteAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.changePass({
            id: ctx.state.user.id,
            ...ctx.request.body
        }));
    });

    /* 商品类别管理 */
    siteAuth.get('/product/types', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.getAll());
    });

    siteAuth.get('/product/type/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.findByName(ctx.params.name));
    });

    siteAuth.post('/product/type/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.add(ctx.request.body));
    });

    siteAuth.post('/product/type/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.update(ctx.request.body));
    });

    /* 商品管理 */
    siteAuth.get('/products', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.getAll());
    });

    siteAuth.get('/product/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.findByName(ctx.params.name));
    });

    siteAuth.post('/product/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.add(ctx.request.body));
    });

    siteAuth.post('/product/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.update(ctx.request.body));
    });

    siteAuth.get('/product/remove/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.delById(ctx.params.id));
    });

    /* 平台管理员角色操作 */
    siteAuth.get('/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.show());
    });

    siteAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.allRoles());
    });

    siteAuth.post('/role/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.saveOne(ctx.request.body));
    });

    siteAuth.post('/role/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.update(ctx.request.body));
    });

    siteAuth.get('/role/remove/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.delById(ctx.params.id));
    });

    /* 平台管理员操作 */
    siteAuth.get('/admins', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.allAdmins());
    });

    siteAuth.get('/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findByUsername(ctx.params.username))
    });

    siteAuth.post('/admin/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.save(ctx.request.body));
    });

    siteAuth.post('/admin/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.update(ctx.request.body));
    });

    siteAuth.get('/admin/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.delById(ctx.params.id));
    });

    /* 平台用户角色操作 */
    siteAuth.get('/user/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    siteAuth.get('/user/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.allRoles());
    });

    siteAuth.post('/user/role/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.update(ctx.request.body));
    });

    /* 平台公告管理 */
    siteAuth.get('/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.getAll());
    });

    siteAuth.post('/placard/add', async (ctx: Context) => {
        let info:any = ctx.request.body;
        info.user = await CUserSite.findById(ctx.state.user.id);;
        info.site = await CSite.findById(ctx.state.site.id);;
        ctx.body = new MsgRes(true, '', await CPlacardUser.add(info));
    });

    siteAuth.post('/placard/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.update(ctx.request.body));
    });

    siteAuth.get('/placard/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.delById(ctx.params.id));
    });

    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}