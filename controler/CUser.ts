import {User} from "../entity/User";
import {RoleUser} from "../entity/RoleUser";

export class CUser {
    static async save(info: any) {
        let user = new User();
        user.site = info.site;
        user.username = info.username;
        user.password = info.password;
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.role = info.role;
        return await user.save();
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let user = new User();
        user.lastLoginTime = info.time;
        return await User.update(info.id, user);
    }

    static async findById(id: string) {
        return await User.findById(id);
    }

    static async updateInfo(info: any) {
        let user = <User>await User.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async changePass(info: any) {
        let user = <User>await User.findById(info.id);
        user.password = info.pass;
        await user.save();
        return await user.save();
    }

    static async all(siteId: string) {
        return await User.getAll(siteId);
    }

    static async findByNameAndSiteId(username: string, siteId: string) {
        return await User.findByNameAndSiteId(username, siteId);
    }

    static async update(info: any) {
        let user = <User>await User.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        if (user.getState !== info.state) {
            user.setState = info.state;
        }
        if (user.role.id !== info.role) {
            user.role = <RoleUser>await RoleUser.findById(info.role);
        }
        return await user.save();
    }

    static async delById(id: string) {
        return await User.delById(id);
    }
}
