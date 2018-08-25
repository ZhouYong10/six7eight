import {Site} from "../entity/Site";
import {CUserSite} from "./CUserSite";
import {CRoleUserSite} from "./CRoleUserSite";

export class CSite {

    static async add(info: any) {
        console.log(info, '==============');
        // 创建站点
        let site = new Site();


        // 创建管理员角色
        let roleUserSite = await CRoleUserSite.save({});

        // 创建站点管理员
        let userSite = await CUserSite.save({});

        // 关联管理员角色
        userSite.role = roleUserSite;

        // 关联站点和站点管理员
        site.usersSite = [userSite];

        // 保存站点
        return await site.save();
    }
}