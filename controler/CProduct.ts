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

    private static async editInfo(product: Product, info: any) {
        product.name = info.name;
        product.price = info.price;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.onSale = info.onSale;
        product.attrs = info.attrs;
        product.productType = await CProductTypes.findByName(info.productType.name);

        return await product.save();
    }

    static async add(info: any) {
        return await CProduct.editInfo(new Product(), info);
    }

    static async update(info: any) {
        return await CProduct.editInfo(<Product>await Product.findById(info.id), info);
    }

    static async delById(id: string) {
        console.log(id, '============');
        return await Product.delById(id);
    }
}
