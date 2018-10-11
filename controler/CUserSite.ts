import {UserSite} from "../entity/UserSite";
import {UserAdmin} from "../entity/UserAdmin";

export class CUserSite {
    static async save(info: any) {
        let user = new UserSite();
        user.site = info.site;
        user.username = info.username;
        user.password = info.password;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.role = info.role;
        return await user.save();
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let user = new UserSite();
        user.lastLoginTime = info.time;
        return await UserSite.update(info.id, user);
    }
}
