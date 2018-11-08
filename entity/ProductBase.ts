import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class ProductBase {
    // 产品ID
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

    // 产品名称
    @Column({
        type: 'char',
        length: 50
    })
    name!: string;

    // 产品顶级代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    topPrice!: number;

    // 产品超级代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    superPrice!: number;

    // 产品金牌代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    goldPrice!: number;

    // 该类产品是否上架
    @Column()
    onSale!:boolean ;

    // 产品属性
    @Column('simple-json')
    attrs: Array<any> = [];

}