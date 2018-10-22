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

    static async saveLower(info: any) {
        let user = new User();
        user.username = info.username;
        user.password = info.password;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.parent = info.parent;
        user.role = info.role;
        user.site = info.site;
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
        let user = <User>info.user;
        user.password = info.pass;
        return await user.save();
    }

    static async all() {
        return await User.all();
    }

    static async siteAll(siteId: string) {
        return await User.siteAll(siteId);
    }

    static async lowerUserAll(userId: string, siteId: string) {
        return await User.getAllLowerUser(userId, siteId);
    }

    static async findByNameAndSiteId(username: string, siteId: string) {
        return await User.usernameisExist(username, siteId);
    }

    static async platformUpdate(info: any) {
        let user = <User>await User.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        if (user.getState !== info.state) {
            user.setState = info.state;
        }
        return await user.save();
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

    static async updateLower(info: any) {
        let user = <User>await User.findById(info.id);
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async delById(id: string) {
        return await User.delById(id);
    }
}
