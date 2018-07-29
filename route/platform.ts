import * as Router from "koa-router";
import {Context} from "koa";

export async function platformRoute(router: Router) {
    router.get('/platform/admin', async (ctx: Context) => {
        await ctx.render('platformLogin');
    });

    router.post('/platform/admin', async (ctx: Context) => {

    });
}