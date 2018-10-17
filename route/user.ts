import * as Router from "koa-router";
import {Context} from "koa";
import * as passport from "passport";
import * as debuger from "debug";
import {UserType} from "../entity/UserBase";
import {comparePass, MsgRes, now} from "../utils";
import {CUser} from "../controler/CUser";
import {CSite} from "../controler/CSite";
import {CFeedbackUser} from "../controler/CFeedbackUser";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router){

    /* 登录入口 */
    router.post('/user/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('user', async (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    ctx.session!.user = user;
                    await CUser.updateLoginTime({id: user.id, time: now()});
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

    /* 退出登录 */
    userAuth.get('/logout', (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 账户信息 */
    userAuth.get('/user/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findById(ctx.params.id));
    });

    userAuth.post('/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateInfo(ctx.request.body));
    });

    userAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    userAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changePass({
            id: ctx.session!.user.id,
            ...ctx.request.body
        }));
    });

    /* 用户问题反馈 */
    userAuth.get('/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.userGetAll(ctx.session!.user.id, ctx.session!.user.site.id));
    });

    userAuth.post('/feedback/add', async (ctx: Context) => {
        let info:any = ctx.request.body;
        info.user = await CUser.findById(ctx.session!.user.id);
        info.site = await CSite.findById(ctx.session!.user.site.id);
        ctx.body = new MsgRes(true, '', await CFeedbackUser.add(info));
    });

    userAuth.post('/feedback/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.update(ctx.request.body));
    });

    userAuth.get('/feedback/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.delById(ctx.params.id));
    });


    router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
}