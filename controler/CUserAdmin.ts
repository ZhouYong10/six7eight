import {UserAdmin} from "../entity/UserAdmin";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";


export class CUserAdmin {
    static async changePass(info: any) {
        let user = <UserAdmin>await UserAdmin.findById(info.id);
        user.password = info.pass;
        await user.save();
        return;
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

    static async update(info: any) {
        let user = <UserAdmin>await UserAdmin.findById(info.id);
        user.username = info.username;
        user.phone = info.phone;
        user.weixin = info.weixin;
        user.qq = info.qq;
        user.email = info.email;
        if (user.getState !== info.state) {
            user.setState = info.state;
        }
        if (user.role.id !== info.role) {
            user.role = <RoleUserAdmin>await RoleUserAdmin.findById(info.role);
        }
        return await user.save();
    }

    static async delById(id: string) {
        return await UserAdmin.delById(id);
    }
}
