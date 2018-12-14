import {UserSite} from "../entity/UserSite";
import {RoleUserSite} from "../entity/RoleUserSite";
import {Site} from "../entity/Site";
import {productToRight, sortRights} from "../utils";
import {getManager} from "typeorm";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {RightSite} from "../entity/RightSite";

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

    static async findById(id: string) {
        return await UserSite.findById(id);
    }

    static async updateContact(info: any) {
        await UserSite.update(info.id, {
            phone: info.phone,
            weixin: info.weixin,
            qq: info.qq,
            email: info.email
        });
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

    static async changeRole(info: any, io: any) {
        await getManager().transaction(async tem => {
            let admin = <UserSite>await UserSite.findById(info.adminId);
            admin.role = <RoleUserSite>await RoleUserSite.findById(info.roleId);
            admin = await admin.save();
            let role = admin.role;
            let site = admin.site;

            let typeProducts = await tem.createQueryBuilder()
                .select('type')
                .from(ProductTypeSite, 'type')
                .innerJoin('type.site', 'site', 'site.id = :id', {id: site.id})
                .leftJoinAndSelect('type.productSites', 'product')
                .orderBy('type.createTime', 'DESC')
                .getMany();
            let productRights = productToRight(typeProducts, []);
            let rights = await tem.getTreeRepository(RightSite).findTrees();
            sortRights(rights);
            let treeRights = role.treeRights(productRights.concat(rights));

            io.emit(admin.id + 'changeUserRole', {menuRights: treeRights, role: role});
        });
    }

    static async changeState(info: any, io: any) {
        let admin = <UserSite>await UserSite.findById(info.id);
        admin.setState = info.state;
        admin = await admin.save();

        io.emit(admin.id + 'changeUserState', admin.getState);
    }

    static async delById(id: string) {
        return await UserSite.delById(id);
    }
}
