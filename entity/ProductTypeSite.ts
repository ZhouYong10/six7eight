import {Entity, ManyToOne} from "typeorm";
import {ProductTypeBase} from "./ProductTypeBase";
import {Site} from "./Site";

@Entity()
export class ProductTypeSite extends ProductTypeBase{
    // 所属分站
    @ManyToOne(type => Site, site => site.productTypesSite)
    site?: Site;
}