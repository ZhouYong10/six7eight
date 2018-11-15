import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";
import {Product} from "./Product";
import {ProductTypeSite} from "./ProductTypeSite";

@Entity()
export class ProductType extends ProductTypeBase{
    // 产品类型名称
    @Column({
        type: "char",
        length: 50,
        unique: true
    })
    name!: string;

    // 关联分站商品类别(由平台商品类别复制出来的分站商品类别)
    @OneToMany(type => ProductTypeSite, productTypeSite => productTypeSite.productType)
    productTypeSites?: ProductTypeSite[];

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

    static async allWithProducts() {
        return await ProductType.query('type')
            .leftJoinAndSelect('type.products', 'products')
            .orderBy('type.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, type:any) {
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