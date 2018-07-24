import {Entity, ManyToOne} from "typeorm";
import {ProductBase} from "./ProductBase";
import {Site} from "./Site";

@Entity()
export class ProductSite extends ProductBase{
    // 产品所属分站
    @ManyToOne(type => Site, site => site.products)
    site!: Site;

}