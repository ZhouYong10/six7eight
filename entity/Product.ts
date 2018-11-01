import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {ProductBase} from "./ProductBase";
import {ProductType} from "./ProductType";
import {ProductSite} from "./ProductSite";

@Entity()
export class Product extends ProductBase{
    // 产品分站价格
    @Column({
        type: "decimal",
        precision: 6,
        scale: 4
    })
    sitePrice!: number;

    // 关联分站商品（由平台商品复制出来的分站商品）
    @OneToMany(type => ProductSite, productSite => productSite.product)
    productSites?: ProductSite[];

    // 商品所属类别
    @ManyToOne(type => ProductType, productType => productType.products)
    productType?: ProductType;



    private static p() {
        return getRepository(Product);
    }

    async save() {
        return await Product.p().save(this);
    }

    private static query(name: string) {
        return Product.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await Product.query('product')
            .leftJoinAndSelect('product.productType', 'type')
            .orderBy('product.productType', 'DESC')
            .addOrderBy('product.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, product:any) {
        return await Product.p().update(id, product);
    }

    static async delById(id: string) {
        return await Product.p().delete(id);
    }

    static async findByName(name: string){
        return await Product.p().findOne({name: name});
    };

    static async findById(id: string){
        return await Product.p().findOne(id);
    };
}