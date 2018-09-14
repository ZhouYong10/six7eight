import {UserAdmin} from "../entity/UserAdmin";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";
import {ProductType} from "../entity/ProductType";


export class CProductTypes {
    static async getAll() {
        return await ProductType.getAll();
    }

    static async findByName(name: string) {
        return await ProductType.findByName(name);
    }

    static async add(info: any) {
        let type = new ProductType();
        type.name = info.name;
        type.onSale = info.onSale;
        return await type.save();
    }

    static async update(info: any) {
        let type = <ProductType>await ProductType.findById(info.id);
        type.name = info.name;
        type.onSale = info.onSale;
        return await type.save();
    }


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



    static async updateLoginTime(info: {id:string, time:string}) {
        let admin = new UserAdmin();
        admin.lastLoginTime = info.time;
        return await UserAdmin.update(info.id, admin);
    }







    static async delById(id: string) {
        return await UserAdmin.delById(id);
    }
}
