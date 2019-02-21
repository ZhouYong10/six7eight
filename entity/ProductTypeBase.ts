import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";
import {ProductRightItem} from "./ProductBase";

export enum WitchType{
    Platform = 'type_platform',
    Site = 'type_site'
}

export abstract class ProductTypeBase {
    // 产品类型ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 产品类型名称
    @Column({
        type: "char",
        length: 50
    })
    name!: string;

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

    // 创建账户名
    @Column()
    createUser!: string;

    // 该类产品是否上架
    @Column()
    onSale!:boolean ;

    // 该类产品排序权重（数值越大排序越靠后）
    @Column()
    sortNum:number = 1;


    menuRightItem(): TypeRightItem {
        return {
            id: this.id,
            name: this.name,
            onSale: this.onSale,
            sortNum: this.sortNum,
            type: 'productType',
            fingerprint: this.id,
            waitCount: 0,
            children: []
        }
    }

}

export interface TypeRightItem {
    id: string,
    name: string,
    onSale: boolean,
    sortNum: number,
    type: string,
    fingerprint: string,
    waitCount: number,
    children: Array<ProductRightItem>
}