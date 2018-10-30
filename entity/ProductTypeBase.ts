import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export enum WitchType{
    Platform = 'type_platform',
    Site = 'type_site'
}

export abstract class ProductTypeBase {
    // 产品类型ID
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

    // 该类产品是否上架
    @Column()
    onSale!:boolean ;

}