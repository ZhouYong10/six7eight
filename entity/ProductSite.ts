import {Column, Entity, getRepository, ManyToOne} from "typeorm";
import {ProductBase} from "./ProductBase";
import {Site} from "./Site";
import {ProductTypeSite} from "./ProductTypeSite";
import {Product} from "./Product";
import {WitchType} from "./ProductTypeBase";

@Entity()
export class ProductSite extends ProductBase{
    @Column({
        type: "enum",
        enum: WitchType
    })
    type: WitchType = WitchType.Site;

    // 关联平台商品（用于区分是平台商品还是分站自建商品）
    @ManyToOne(type => Product, product => product.productSites)
    product?: Product;

    // 产品所属分站
    @ManyToOne(type => Site, site => site.products)
    site!: Site;

    // 产品所属类别
    @ManyToOne(type => ProductTypeSite, productTypeSite => productTypeSite.productSites)
    productTypeSite?: ProductTypeSite;




    private static p() {
        return getRepository(ProductSite);
    }

    async save() {
        return await ProductSite.p().save(this);
    }

    private static query(name: string) {
        return ProductSite.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await ProductSite.query('product')
            .leftJoinAndSelect('product.productTypeSite', 'type')
            .orderBy('product.productTypeSite', 'DESC')
            .addOrderBy('product.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, product:any) {
        return await ProductSite.p().update(id, product);
    }

    static async delById(id: string) {
        return await ProductSite.p().delete(id);
    }

    static async findByNameAndTypeId(typeId: string, name: string){
        return await ProductSite.query('product')
            .innerJoin('product.productTypeSite', 'productTypeSite', 'productTypeSite.id = :typeId', {typeId: typeId})
            .where('product.name = :name', {name: name})
            .getOne();
    };

    static async getPrototypeById(id: string) {
        let result = <ProductSite>await ProductSite.query('product')
            .where('product.id = :id', {id: id})
            .innerJoinAndSelect('product.product', 'prototype')
            .getOne();
        return result.product;
    }

    static async findById(id: string){
        return await ProductSite.p().findOne(id);
    };
}