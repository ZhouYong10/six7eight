import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";
import {LoginRes} from "../utils";

const debug = debuger('six7eight:route_platform');

export async function platformRoute(router: Router) {
    router.get('/platform', async (ctx: Context) => {
        await ctx.render('platform');
    });

    router.get('/platform/security/code', async (ctx: Context) => {
        let captcha = svgCaptcha.create({
            width: 106,
            height: 40,
            fontSize: 50
        });
        ctx.session!.captcha = captcha.text.toLowerCase();
        debug('text = : ' + JSON.stringify(ctx.session));
        ctx.body = captcha.data;
    });

    router.post('/platform/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        debug(JSON.stringify(ctx.session));
        debug(params);
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('local', (err, user, info, status) => {
                debug('err: ' + err);
                debug('user: ' + JSON.stringify(user));
                debug('info: ' + JSON.stringify(info));
                debug('status: ' + status);
                if (user) {
                    ctx.body = new LoginRes(true);
                    return ctx.login(user)
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

    router.get('/platform/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated()) {
            ctx.body = new LoginRes(true);
        } else {
            ctx.body = new LoginRes(false, '请登录后操作！');
        }
    });

    router.get('/platform/home', async (ctx: Context) => {
        await ctx.render('platform');
    });
}