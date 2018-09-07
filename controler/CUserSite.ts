import {UserSite} from "../entity/UserSite";

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
}
