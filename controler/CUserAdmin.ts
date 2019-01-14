import {UserAdmin} from "../entity/UserAdmin";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";
import {ProductType} from "../entity/ProductType";
import {getManager} from "typeorm";
import {RightAdmin} from "../entity/RightAdmin";
import {assert, productToRight, sortRights} from "../utils";


export class CUserAdmin {
    static async changePass(info: any) {
        let user = <UserAdmin>info.user;
        user.password = info.pass;
        return await user.save();
    }

    static async updateContact(info: any) {
        await UserAdmin.update(info.id, {
            phone: info.phone,
            weixin: info.weixin,
            qq: info.qq,
            email: info.email
        });
    }

    static async findById(id: string) {
        return await UserAdmin.findById(id);
    }

    static async allAdmins() {
        return await UserAdmin.getAll();
    }

    static async findByUsername(username: string) {
        let user = await UserAdmin.findByName(username);
        return !!user;
    }

    static async save(info: any) {
        assert(info.username.search('/') == -1, '管理员账户名中不能包含特殊字符“/”');
        assert(info.username, '请输入管理员账户名');
        assert(info.password, '请输入管理员密码');
        assert(info.state, '请选择管理员账户状态');
        assert(info.role, '请选择管理员角色');
        let user = new UserAdmin();
        user.username = info.username;
        user.password = info.password;
        user.setState = info.state;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        user.role = <RoleUserAdmin>await RoleUserAdmin.findById(info.role);
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
