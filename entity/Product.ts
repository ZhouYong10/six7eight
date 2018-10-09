import {Entity, getRepository, ManyToOne} from "typeorm";
import {ProductBase} from "./ProductBase";
import {ProductType} from "./ProductType";

@Entity()
export class Product extends ProductBase{
    // 商品所属类别
    @ManyToOne(type => ProductType, productType => productType.products)
    productType?: ProductType;

    private static p() {
        return getRepository(Product);
    }

    async save() {
        return await Product.p().save(this);
    }

    private static query(name: string) {
        return Product.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await Product.query('product')
            .leftJoinAndSelect('product.productType', 'type')
            .orderBy('product.productType', 'DESC')
            .addOrderBy('product.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, type:Product) {
        return await Product.p().update(id, type);
    }

    static async delById(id: string) {
        return await Product.p().delete(id);
    }

    static async findByName(name: string){
        return await Product.p().findOne({name: name});
    };

    static async findById(id: string){
        return await Product.p().findOne(id);
    };
}