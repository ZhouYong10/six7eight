import * as Router from "koa-router";
import {Context} from "koa";
import {comparePass, MsgRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import * as passport from "passport";
import {CUserSite} from "../controler/CUserSite";

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

    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}