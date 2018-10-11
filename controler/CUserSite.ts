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

    static async findById(id: string) {
        return await UserSite.findById(id);
    }

    static async updateInfo(info: any) {
        let user = <UserSite>await UserSite.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async changePass(info: any) {
        let user = <UserSite>await UserSite.findById(info.id);
        user.password = info.pass;
        await user.save();
        return await user.save();
    }
}
