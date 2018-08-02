import * as Router from "koa-router";
import {Context} from "koa";
import {LoginRes} from "../utils";
import {UserType} from "../entity/UserBase";

const siteAuth = new Router();

export async function siteRoute(router: Router) {

    router.get('/site/admin', async (ctx: Context) => {
        await ctx.render('siteEndLogin');
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