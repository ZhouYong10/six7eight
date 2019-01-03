import {Column, Entity, getRepository, In, ManyToOne, OneToMany} from "typeorm";
import {ProductBase} from "./ProductBase";
import {ProductType} from "./ProductType";
import {ProductSite} from "./ProductSite";
import {OrderUser} from "./OrderUser";

@Entity()
export class Product extends ProductBase{
    // 产品平台成本价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    price!: number;

    // 关联分站商品（由平台商品复制出来的分站商品）
    @OneToMany(type => ProductSite, productSite => productSite.product)
    productSites?: ProductSite[];

    // 商品所属类别
    @ManyToOne(type => ProductType, productType => productType.products)
    productType!: ProductType;

    @Column({nullable: true})
    productTypeId?: string;

    // 产品所有订单
    @OneToMany(type => OrderUser, orderUser => orderUser.product)
    orders?: OrderUser[];


    private static p() {
        return getRepository(Product);
    }

    async save() {
        return await Product.p().save(this);
    }

    private static query(name: string) {
        return Product.p().createQueryBuilder(name);
    }

    static async getAll(productIds: Array<string>) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return await Product.query('product')
            .whereInIds(productIds)
            .leftJoinAndSelect('product.productType', 'type')
            .orderBy('product.productType', 'DESC')
            .addOrderBy('product.createTime', 'DESC')
            .getMany();
    }

    static async getByTypeId(productIds: Array<string>, typeId: string) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return await Product.query('product')
            .where('product.id IN (:productIds)', {productIds: productIds})
            .andWhere('product.productTypeId = :typeId', {typeId: typeId})
            .leftJoinAndSelect('product.productType', 'type')
            .orderBy('product.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, product:any) {
        return await Product.p().update(id, product);
    }

    static async findByNameAndTypeId(typeId: string, name: string){
        return await Product.query('product')
            .innerJoin('product.productType', 'productType', 'productType.id = :typeId', {typeId: typeId})
            .where('product.name = :name', {name: name})
            .getOne();
    }

    static async findByName(name: string){
        return await Product.p().findOne({name: name});
    };

    static async findById(id: string){
        return await Product.p().findOne(id);
    };
}