import * as Router from "koa-router";
import {Context} from "koa";

export async function siteRoute(router: Router) {
    router.get('/site/admin', async (ctx: Context) => {
        await ctx.render('siteEndLogin');
    });
}