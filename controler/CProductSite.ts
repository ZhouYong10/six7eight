import {ProductSite} from "../entity/ProductSite";
import {CProductTypeSite} from "./CProductTypeSite";


export class CProductSite {
    static async getAll() {
        return await ProductSite.getAll();
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await ProductSite.update(id, {onSale: !onSale});
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await ProductSite.findByNameAndTypeId(typeId, name);
    }

    static async getPrototypeById(id: string) {
        return await ProductSite.getPrototypeById(id);
    }

    private static async editInfo(product: ProductSite, info: any) {
        product.name = info.name;
        product.price = info.price;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.onSale = info.onSale;
        product.attrs = info.attrs;
        product.productTypeSite = await CProductTypeSite.findByName(info.productTypeSite.name);

        return await product.save();
    }

    static async add(info: any) {
        return await CProductSite.editInfo(new ProductSite(), info);
    }

    static async update(info: any) {
        return await CProductSite.editInfo(<ProductSite>await ProductSite.findById(info.id), info);
    }

    static async delById(id: string) {
        return await ProductSite.delById(id);
    }
}
