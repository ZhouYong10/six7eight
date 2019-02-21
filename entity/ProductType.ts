import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";
import {Product} from "./Product";
import {ProductTypeSite} from "./ProductTypeSite";
import {OrderUser} from "./OrderUser";

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

    // 类别下的所有订单
    @OneToMany(type => OrderUser, orderUser => orderUser.productType)
    orders?: OrderUser[];

    private static p() {
        return getRepository(ProductType);
    }

    async save() {
        return await ProductType.p().save(this);
    }

    private static query(name: string) {
        return ProductType.p().createQueryBuilder(name);
    }

    static async getAll(productTypeIds: Array<string>) {
        if (productTypeIds.length < 1) {
            productTypeIds = [''];
        }
        return await ProductType.query('type')
            .whereInIds(productTypeIds)
            .orderBy('type.sortNum', 'ASC')
            .addOrderBy('type.createTime', 'ASC')
            .getMany();
    }

    static async allWithProducts() {
        return await ProductType.query('type')
            .leftJoinAndSelect('type.products', 'products')
            .orderBy('type.sortNum', 'ASC')
            .addOrderBy('type.createTime', 'ASC')
            .getMany();
    }

    static async update(id: string, type:any) {
        return await ProductType.p().update(id, type);
    }

    static async findByName(name: string){
        return await ProductType.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductType.p().findOne(id);
    };
}