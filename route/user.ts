import * as Router from "koa-router";
import {Context} from "koa";
import * as debuger from "debug";

const debug = debuger('six7eight:route-user');
import {CUser} from "../controler/CUser";


export async function userRoutes(router: Router){
    router.get('/users', async (ctx: Context) => {
        let cUser = new CUser({name: "张三1122", password: "123456"})

        var savedUser = await cUser.saveUser();
        debug(savedUser);
        ctx.body = savedUser;
    });
}