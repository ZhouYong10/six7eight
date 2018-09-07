import {Site} from "../entity/Site";
import {CUserSite} from "./CUserSite";
import {CRoleUserSite} from "./CRoleUserSite";
import {RightSite} from "../entity/RightSite";

export class CSite {

    static async all() {
        return await Site.getAll();
    }

    static async add(info: any) {
        // 创建站点
        let site = new Site();
        site.name = info.name;
        site.address = info.address;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;

        // 保存站点
        let siteSaved = await site.save();

        // 创建管理员角色
        let roleUserSite = await CRoleUserSite.save({
            site: siteSaved,
            name: '系统管理员',
            rights: [await RightSite.findTrees(), await RightSite.getAllLeaf()]
        });

        // 创建站点管理员
        let userSite = await CUserSite.save({
            site: siteSaved,
            username: 'admin',
            password: '1234',
            phone: '',
            weixin: '',
            qq: '',
            email: '',
            role: roleUserSite
        });

        return siteSaved;
    }
}