import {Entity, ManyToOne} from "typeorm";
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

}