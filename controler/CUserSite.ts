import {UserSite} from "../entity/UserSite";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {Site} from "../entity/Site";

export class CUserSite {
    static async save(info: any, site: Site) {
        let user = new UserSite();
        user.site = site;
        user.username = info.username;
        user.password = info.password;
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.role = <RoleUserSite>await RoleUserSite.findById(info.role);
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
        let user = <UserSite>info.user;
        user.password = info.pass;
        return await user.save();
    }

    static async allAdmins(siteId:string) {
        return await UserSite.getAll(siteId);
    }

    static async findByUsername(username: string) {
        return await UserSite.findByName(username);
    }

    static async update(info: any) {
        let user = <UserSite>await UserSite.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        if (user.getState !== info.state) {
            user.setState = info.state;
        }
        if (user.role.type !== RoleUserSiteType.Site && user.role.id !== info.role) {
            user.role = <RoleUserSite>await RoleUserSite.findById(info.role);
        }
        return await user.save();
    }

    static async delById(id: string) {
        return await UserSite.delById(id);
    }
}
