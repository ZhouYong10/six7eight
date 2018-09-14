import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class ProductTypeBase {
    // 产品类型ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 产品类型名称
    @Column({
        type: 'char',
        length: 50,
        unique: true
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

    // 该类产品是否上架
    @Column()
    onSale!:boolean ;

}