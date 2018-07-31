import * as Router from "koa-router";
import {Context} from "koa";
import passport = require("koa-passport");
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";

const debug = debuger('six7eight:route_platform');

export async function platformRoute(router: Router) {
    router.get('/platform/admin', async (ctx: Context) => {
        await ctx.render('platform');
    });

    router.get('/platform', async (ctx: Context) => {
        let captcha = svgCaptcha.create({
            width: 106,
            height: 40,
            fontSize: 50
        });
        ctx.session!.captcha = captcha.text.toLowerCase();
        debug('text = : ' + ctx.session!.captcha);
        ctx.body = captcha.data;
    });

    router.post('/platform/admin', async (ctx: Context) => {
        debug(JSON.stringify(ctx));
        return passport.authenticate('local', (err: any, user: any, info: any, status: any) => {
            debug('err: ' + err);
            debug('user: ' + JSON.stringify(user));
            debug('info: ' + JSON.stringify(info));
            debug('status: ' + status);
            if (user === false) {
                ctx.body = {success: false};
                ctx.throw(401);
            } else {
                ctx.body = {success: true};
                return ctx.login(user)
            }
        })(ctx, () => {
            return new Promise((resolve, reject) => {
                debug('这是干什么的？？？？？');
                resolve();
            });
        });
    });

    router.get('/platform/home', async (ctx: Context) => {
        await ctx.render('platform');
    });
}