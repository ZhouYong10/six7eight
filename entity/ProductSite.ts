import {Entity, getRepository, ManyToOne} from "typeorm";
import {ProductBase} from "./ProductBase";
import {Site} from "./Site";
import {ProductTypeSite} from "./ProductTypeSite";

@Entity()
export class ProductSite extends ProductBase{
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

    static async update(id: string, product:ProductSite) {
        return await ProductSite.p().update(id, product);
    }

    static async delById(id: string) {
        return await ProductSite.p().delete(id);
    }

    static async findByName(name: string){
        return await ProductSite.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductSite.p().findOne(id);
    };
}