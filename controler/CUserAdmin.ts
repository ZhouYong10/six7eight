import {UserAdmin} from "../entity/UserAdmin";
import {RoleUserAdmin, RoleUserAdminType} from "../entity/RoleUserAdmin";
import {ProductType} from "../entity/ProductType";
import {getManager} from "typeorm";
import {RightAdmin} from "../entity/RightAdmin";
import {productToRight, sortRights} from "../utils";


export class CUserAdmin {
    static async changePass(info: any) {
        let user = <UserAdmin>info.user;
        user.password = info.pass;
        return await user.save();
    }

    static async updateInfo(info: any) {
        let user = <UserAdmin>await UserAdmin.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async findById(id: string) {
        return await UserAdmin.findById(id);
    }

    static async allAdmins() {
        return await UserAdmin.getAll();
    }

    static async updateLoginTime(info: {id:string, time:string}) {
        let admin = new UserAdmin();
        admin.lastLoginTime = info.time;
        return await UserAdmin.update(info.id, admin);
    }

    static async findByUsername(username: string) {
        return await UserAdmin.findByName(username);
    }

    static async save(info: any) {
        let user = new UserAdmin();
        user.username = info.username;
        user.password = info.password;
        user.role = <RoleUserAdmin>await RoleUserAdmin.findById(info.role);
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        return await user.save();
    }

    static async changeRole(info: any, io: any) {
        await getManager().transaction(async tem => {
            let admin = <UserAdmin>await UserAdmin.findById(info.adminId);
            admin.role = <RoleUserAdmin>await RoleUserAdmin.findById(info.roleId);
            admin = await admin.save();
            let role = admin.role;

            let typeProducts = await tem.createQueryBuilder()
                .select('type')
                .from(ProductType, 'type')
                .leftJoinAndSelect('type.products', 'product')
                .orderBy('type.createTime', 'DESC')
                .getMany();
            let productRights = productToRight(typeProducts, []);
            let rights = await tem.getTreeRepository(RightAdmin).findTrees();
            sortRights(rights);
            let treeRights = role.treeRights(productRights.concat(rights));

            io.emit(admin.id + 'changeUserRole', {menuRights: treeRights, role: role});
        });
    }

    static async changeState(info: any, io: any) {
        let admin = <UserAdmin>await UserAdmin.findById(info.id);
        admin.setState = info.state;
        admin = await admin.save();

        io.emit(admin.id + 'changeUserState', admin.getState);
    }

    static async delById(id: string) {
        return await UserAdmin.delById(id);
    }
}
