import {Entity, ManyToOne, OneToMany} from "typeorm";
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
}