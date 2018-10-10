import {ProductType} from "../entity/ProductType";


export class CProductTypes {
    static async getAll() {
        return await ProductType.getAll();
    }

    static async findByName(name: string) {
        return await ProductType.findByName(name);
    }

    private static async editInfo(type: ProductType, info: any) {
        type.name = info.name;
        type.onSale = info.onSale;

        return await type.save();
    }

    static async add(info: any) {
        return await CProductTypes.editInfo(new ProductType(), info);
    }

    static async update(info: any) {
        return await CProductTypes.editInfo(<ProductType>await ProductType.findById(info.id), info);
    }

    static async delById(id: string) {
        return await ProductType.delById(id);
    }
}
