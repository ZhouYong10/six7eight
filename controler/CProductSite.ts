import {ProductSite} from "../entity/ProductSite";
import {CProductTypeSite} from "./CProductTypeSite";
import {Site} from "../entity/Site";


export class CProductSite {
    static async getAll(siteId: string) {
        return await ProductSite.getAll(siteId);
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await ProductSite.update(id, {onSale: onSale});
    }

    static async findById(id: string) {
        return await ProductSite.findById(id);
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await ProductSite.findByNameAndTypeId(typeId, name);
    }

    static async getPrototypeById(id: string) {
        return await ProductSite.getPrototypeById(id);
    }

    private static async editInfo(product: ProductSite, info: any) {
        product.name = info.name;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.onSale = info.onSale;
        product.attrs = info.attrs;
        product.productTypeSite = await CProductTypeSite.findById(info.productTypeId);
    }

    static async add(info: any, site:Site) {
        let product = new ProductSite();
        await CProductSite.editInfo(product, info);
        product.site = site;
        return await product.save();
    }

    static async update(info: any) {
        let product = <ProductSite>await ProductSite.findById(info.id);
        await CProductSite.editInfo(product, info);
        return await product.save();
    }

    static async updatePlatform(info: any) {
        let product = <ProductSite>await ProductSite.findById(info.id);
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;

        return await product.save();
    }

    static async delById(id: string) {
        return await ProductSite.delById(id);
    }
}
