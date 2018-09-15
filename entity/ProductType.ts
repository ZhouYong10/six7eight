import {Entity, getRepository, OneToMany} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";
import {Product} from "./Product";

@Entity()
export class ProductType extends ProductTypeBase{
    // 类别下的所有商品
    @OneToMany(type => Product, product => product.productType)
    products?: Product[];


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