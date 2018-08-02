import * as Router from "koa-router";
import {Context} from "koa";

const siteAuth = new Router();

export async function siteRoute(router: Router) {

    router.get('/site/admin', async (ctx: Context) => {
        await ctx.render('siteEndLogin');
    });



    router.use('/site/auth/*',(ctx: Context, next) => {
        console.log('这是拦截 site admin 所有路由的拦截器=====================');
        next();
    });

    siteAuth.get('/', async (ctx: Context) => {

    });

    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}