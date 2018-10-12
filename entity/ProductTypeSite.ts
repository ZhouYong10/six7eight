import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";
import {Site} from "./Site";
import {ProductSite} from "./ProductSite";

@Entity()
export class ProductTypeSite extends ProductTypeBase{
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

    static async update(id: string, type:ProductTypeSite) {
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