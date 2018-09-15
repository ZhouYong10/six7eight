import {Entity, ManyToOne} from "typeorm";
import {ProductBase} from "./ProductBase";
import {ProductType} from "./ProductType";

@Entity()
export class Product extends ProductBase{
    // 商品所属类别
    @ManyToOne(type => ProductType, productType => productType.products)
    productType?: ProductType;
}