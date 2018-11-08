import {Column, Entity, getRepository, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {ProductBase} from "./ProductBase";
import {Site} from "./Site";
import {ProductTypeSite} from "./ProductTypeSite";
import {Product} from "./Product";
import {WitchType} from "./ProductTypeBase";
import {OrderUser} from "./OrderUser";
import {ProductField} from "./ProductField";

@Entity()
export class ProductSite extends ProductBase{
    @Column({
        type: "enum",
        enum: WitchType
    })
    type: WitchType = WitchType.Site;

    // 商品字段
    @ManyToMany(type => ProductField, productField => productField.productsSite)
    fields?: ProductField[];

    // 关联平台商品（用于区分是平台商品还是分站自建商品）
    @ManyToOne(type => Product, product => product.productSites)
    product?: Product;

    // 产品所属分站
    @ManyToOne(type => Site, site => site.products)
    site!: Site;

    // 产品所属类别
    @ManyToOne(type => ProductTypeSite, productTypeSite => productTypeSite.productSites)
    productTypeSite?: ProductTypeSite;

    // 产品所有订单
    @OneToMany(type => OrderUser, orderUser => orderUser.product)
    orders?: OrderUser[];




    private static p() {
        return getRepository(ProductSite);
    }

    async save() {
        return await ProductSite.p().save(this);
    }

    private static query(name: string) {
        return ProductSite.p().createQueryBuilder(name);
    }

    static async getAll(siteId: string) {
        return await ProductSite.query('product')
            .innerJoin('product.site', 'site', 'site.id = :id', {id: siteId})
            .leftJoinAndSelect('product.productTypeSite', 'type')
            .orderBy('type.name', 'DESC')
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