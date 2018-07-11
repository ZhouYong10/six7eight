import {Context} from "koa";
import * as Router from "koa-router";
import {userRoutes} from "./user";


export async function appRoutes(router:Router) {
    router.get('/', async (ctx:Context) => {
        ctx.body = 'Hello Koa with TypeScript, TypeORM!';
    });

    userRoutes(router);
}