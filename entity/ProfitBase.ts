import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class ProfitBase {
    // 返利ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 返利记录创建时间
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

    // 返利账户名
    @Column({
        type: 'char',
        length: 100
    })
    profitUsername!: string;

    // 返利金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    funds!: number;

    // 返利描述
    @Column({
        type: 'varchar',
        length: 400
    })
    description!: string;


}