import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {ProductTypeBase, WitchType} from "./ProductTypeBase";
import {Site} from "./Site";
import {ProductSite} from "./ProductSite";
import {ProductType} from "./ProductType";

@Entity()
export class ProductTypeSite extends ProductTypeBase{
    @Column({
        type: "enum",
        enum: WitchType
    })
    type: WitchType = WitchType.Site;

    // 产品类型名称
    @Column({
        type: "char",
        length: 50
    })
    name!: string;

    // 关联平台商品类别(用于区分分站商品类别和分站类别)
    @ManyToOne(type => ProductType, productType => productType.productTypeSites)
    productType?: ProductType;

    // 所属分站
    @ManyToOne(type => Site, site => site.productTypesSite)
    site?: Site;

    // 类别下的所有商品
    @OneToMany(type => ProductSite, productSite => productSite.productTypeSite)
    productSites?: ProductSite[];




    private static p() {
        return getRepository(ProductTypeSite);
    }

    async save() {
        return await ProductTypeSite.p().save(this);
    }

    private static query(name: string) {
        return ProductTypeSite.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await ProductTypeSite.query('type')
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
}