import * as Router from "koa-router";
import {Context} from "koa";
import {LoginRes} from "../utils";
import {UserType} from "../entity/UserBase";
import * as passport from "passport";

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
            return passport.authenticate('site', (err, user, info, status) => {
                console.log(JSON.stringify(user), '----------------------------');
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
    router.get('/site/logined', async (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            ctx.body = new LoginRes(true);
        } else {
            ctx.body = new LoginRes(false, '请登录后操作！');
        }
    });

    router.use('/site/auth/*',(ctx: Context, next) => {
        console.log('这是拦截 site admin 所有路由的拦截器=====================');
        next();
    });

    siteAuth.get('/', async (ctx: Context) => {

    });

    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}