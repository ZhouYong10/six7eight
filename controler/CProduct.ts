import {UserAdmin} from "../entity/UserAdmin";
import {Product} from "../entity/Product";
import {CProductTypes} from "./CProductTypes";


export class CProduct {
    static async getAll() {
        return await Product.getAll();
    }

    static async findByName(name: string) {
        return await Product.findByName(name);
    }

    static async add(info: any) {
        console.log(info, '=================');
        let product = new Product();
        product.name = info.name;
        product.price = info.price;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.onSale = info.onSale;
        product.attrs = info.attrs;
        product.productType = await CProductTypes.findByName(info.type);

        return await product.save();
    }

    static async update(info: any) {
        let type = <Product>await Product.findById(info.id);
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
