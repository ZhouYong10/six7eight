import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ProductSite} from "../entity/ProductSite";


export class CProductTypeSite {
    static async getAll(siteId: string) {
        return await ProductTypeSite.getAll(siteId);
    }

    static async getAllWithProducts(siteId: string) {
        return await ProductTypeSite.getAllWithProducts(siteId);
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await ProductTypeSite.update(id, {onSale: !onSale});
    }

    static async findByName(name: string) {
        return await ProductTypeSite.findByName(name);
    }

    static async findById(id: string) {
        return await ProductTypeSite.findById(id);
    }

    private static async editInfo(type: ProductTypeSite, info: any) {
        type.name = info.name;
        type.onSale = info.onSale;

        return await type.save();
    }

    static async add(info: any) {
        return await CProductTypeSite.editInfo(new ProductTypeSite(), info);
    }

    static async update(info: any) {
        return await CProductTypeSite.editInfo(<ProductTypeSite>await ProductTypeSite.findById(info.id), info);
    }

    static async delById(id: string) {
        let type = <ProductTypeSite>await ProductTypeSite.findByIdWithProducts(id);
        let products = <Array<ProductSite>>type.productSites;
        products.forEach(async (product) => {
            await ProductSite.delById(product.id);
        });
        await ProductTypeSite.delById(id);
    }
}
