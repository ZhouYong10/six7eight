import * as Router from "koa-router";
import {Context} from "koa";
import {Strateges} from "../auth";

export async function siteRoute(router: Router) {
    router.use((ctx: Context, next) => {
        console.log('这是拦截 site admin 所有路由的拦截器=====================');
        (global as any).strategy = Strateges.Local;
        next();
    });

    router.get('/site/admin', async (ctx: Context) => {
        await ctx.render('siteEndLogin');
    });
}