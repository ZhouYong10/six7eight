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

    // 产品分站价格
    @Column({
        type: "decimal",
        precision: 6,
        scale: 4
    })
    sitePrice!: number;

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

    // 产品下单提示信息
    @Column({
        type: 'varchar',
        length: 1000
    })
    orderTip!: string;

    // 该类产品是否上架
    @Column()
    onSale!:boolean ;

    // 产品最少下单数量
    @Column()
    minNum!: number;

    // 产品每分钟执行速度
    @Column()
    speed!: number;

    // 产品属性
    @Column('simple-json')
    attrs: Array<any> = [];


    menuRightItem(): ProductRightItem {
        return {
            id: this.id,
            name: this.name,
            onSale: this.onSale,
            fingerprint: this.id,
            type: 'product',
            num: 0
        }
    }

}

export interface ProductRightItem {
    id: string,
    name: string,
    onSale: boolean,
    fingerprint: string,
    type: string,
    num: number
}