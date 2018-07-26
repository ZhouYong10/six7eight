import {Context} from "koa";

export function authenticated(todo:(ctx: Context, next?: any) => any){
    return async (ctx: Context, next?: any) => {
        if (ctx.isAuthenticated()) {
            await todo(ctx, next);
        }else{
            ctx.body = '您还没有登录，请登录后在操作！！';
        }
    }
}