import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {ProductTypeBase, WitchType} from "./ProductTypeBase";
import {Site} from "./Site";
import {ProductSite} from "./ProductSite";
import {ProductType} from "./ProductType";
import {OrderUser} from "./OrderUser";

@Entity()
export class ProductTypeSite extends ProductTypeBase{
    @Column({
        type: "enum",
        enum: WitchType
    })
    type: WitchType = WitchType.Site;

    // 关联平台商品类别(用于区分分站商品类别和分站类别)
    @ManyToOne(type => ProductType, productType => productType.productTypeSites)
    productType?: ProductType;

    // 所属分站
    @ManyToOne(type => Site, site => site.productTypesSite)
    site?: Site;

    // 类别下的所有商品
    @OneToMany(type => ProductSite, productSite => productSite.productTypeSite)
    productSites?: ProductSite[];

    // 类别下的所有订单
    @OneToMany(type => OrderUser, orderUser => orderUser.productType)
    orders?: OrderUser[];



    private static p() {
        return getRepository(ProductTypeSite);
    }

    async save() {
        return await ProductTypeSite.p().save(this);
    }

    private static query(name: string) {
        return ProductTypeSite.p().createQueryBuilder(name);
    }

    static async getAll(siteId: string) {
        return await ProductTypeSite.query('type')
            .innerJoin('type.site', 'site', 'site.id = :id', {id: siteId})
            .orderBy('type.createTime', 'DESC')
            .getMany();
    }

    static async getAllWithProducts(siteId: string) {
        return await ProductTypeSite.query('type')
            .innerJoin('type.site', 'site', 'site.id = :id', {id: siteId})
            .innerJoinAndSelect('type.productSites', 'product')
            .orderBy('type.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, type:any) {
        return await ProductTypeSite.p().update(id, type);
    }

    static async delById(id: string) {
        return await ProductTypeSite.p().delete(id);
    }

    static async findByName(name: string){
        return await ProductTypeSite.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductTypeSite.p().findOne(id);
    };

    static async findByIdWithProducts(id: string) {
        return await ProductTypeSite.query('type')
            .where('type.id = :id', {id: id})
            .innerJoinAndSelect('type.productSites', 'productSites')
            .getOne();
    }
}