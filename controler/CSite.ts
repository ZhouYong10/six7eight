import {Site} from "../entity/Site";
import {CUserSite} from "./CUserSite";
import {CRoleUserSite} from "./CRoleUserSite";
import {RightSite} from "../entity/RightSite";
import {Product} from "../entity/Product";
import {CProduct} from "./CProduct";
import {CProductTypes} from "./CProductTypes";
import {CRoleUser} from "./CRoleUser";
import {RoleType} from "../entity/RoleUser";
import {RightUser} from "../entity/RightUser";

export class CSite {

    static async all() {
        return await Site.getAll();
    }

    private static async editInfo(site: Site, info: any) {
        site.name = info.name;
        site.address = info.address;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;

        return await site.save();
    }

    static async add(info: any) {
        // 创建并保存站点
        let siteSaved = await CSite.editInfo(new Site(), info);

        // 创建分站用户角色
        await CRoleUser.save({
            name: '顶级代理',
            type: RoleType.Top,
            rights: [await RightUser.findTrees(), await RightUser.getAllLeaf()],
            site: siteSaved
        });

        await CRoleUser.save({
            name: '超级代理',
            type: RoleType.Super,
            rights: [await RightUser.findTrees(), await RightUser.getAllLeaf()],
            site: siteSaved
        });

        await CRoleUser.save({
            name: '金牌代理',
            type: RoleType.Gold,
            rights: [await RightUser.findTrees(), await RightUser.getAllLeaf()],
            site: siteSaved
        });

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

    static async update(info: any) {
        return await CSite.editInfo(<Site>await Site.findById(info.id), info);
    }
}