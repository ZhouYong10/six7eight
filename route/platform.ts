import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";
import {LoginRes} from "../utils";

const debug = debuger('six7eight:route_platform');

export async function platformRoute(router: Router) {
    /* 登录页面 */
    router.get('/platform', async (ctx: Context) => {
        await ctx.render('platform');
    });

    /* 验证码 */
    router.get('/platform/security/code', async (ctx: Context) => {
        let captcha = svgCaptcha.create({
            width: 106,
            height: 40,
            fontSize: 50
        });
        ctx.session!.captcha = captcha.text.toLowerCase();
        ctx.body = captcha.data;
    });

    /* 登录入口 */
    router.post('/platform/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('local', (err, user, info, status) => {
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

    /* 判断是否登录 */
    router.get('/platform/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated()) {
            ctx.body = new LoginRes(true);
        } else {
            ctx.body = new LoginRes(false, '请登录后操作！');
        }
    });

}