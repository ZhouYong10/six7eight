import * as Router from "koa-router";
import {Context} from "koa";
import * as debuger from "debug";

const debug = debuger('six7eight:route-user');
import {userSave} from "../controler/cUser";


export async function userRoutes(router: Router){
    router.get('/users', async (ctx: Context) => {
        var savedUser = await userSave({id: 12, name: "张三 和莉莉丝", password: "123456"});
        debug(savedUser);
        ctx.body = JSON.stringify(savedUser);
    });
}