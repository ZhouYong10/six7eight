import {ProductTypeSite} from "../entity/ProductTypeSite";


export class CProductTypeSite {
    static async getAll() {
        return await ProductTypeSite.getAll();
    }

    static async findByName(name: string) {
        return await ProductTypeSite.findByName(name);
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
        return await ProductTypeSite.delById(id);
    }
}