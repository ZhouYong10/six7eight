import {Entity, getRepository} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";

@Entity()
export class ProductType extends ProductTypeBase{


    private static p() {
        return getRepository(ProductType);
    }

    async save() {
        return await ProductType.p().save(this);
    }

    private static query(name: string) {
        return ProductType.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await ProductType.query('type')
            .orderBy('type.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, type:ProductType) {
        return await ProductType.p().update(id, type);
    }

    static async delById(id: string) {
        return await ProductType.p().delete(id);
    }

    static async findByName(name: string){
        return await ProductType.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductType.p().findOne(id);
    };
}