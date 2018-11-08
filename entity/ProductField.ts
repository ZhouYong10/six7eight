import {
    Column,
    CreateDateColumn,
    Entity,
    getRepository,
    ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {ProductSite} from "./ProductSite";
import {myDateFromat} from "../utils";
import {Product} from "./Product";

@Entity()
export class ProductField{
    // 字段ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 创建时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!:string;

    // 字段名称
    @Column({
        unique: true
    })
    name!: string;

    // 字段类型
    @Column({
        unique: true
    })
    type!: string;

    // 字段是否上架
    @Column()
    onSale!:boolean ;

    // 字段所属平台商品
    @ManyToMany(type => Product, product => product.fields)
    products?: Product[];

    // 字段所属分站商品
    @ManyToMany(type => ProductSite, productSite => productSite.fields)
    productsSite?: ProductSite[];



    private static p() {
        return getRepository(ProductField);
    }

    async save() {
        return await ProductField.p().save(this);
    }

    private static query(name: string) {
        return ProductField.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await ProductField.query('field')
            .orderBy('field.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, type:any) {
        return await ProductField.p().update(id, type);
    }

    static async delById(id: string) {
        return await ProductField.p().delete(id);
    }

    static async findByName(name: string){
        return await ProductField.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductField.p().findOne(id);
    };
}