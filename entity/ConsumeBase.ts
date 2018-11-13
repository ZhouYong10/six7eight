import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export enum ConsumeType {
    Plus = 'plus_consume',
    Minus = 'minus_consume'
}

export abstract class ConsumeBase{
    // 消费记录ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 消费时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!: string;

    // 消费前账户金额
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    })
    userOldFunds!: number;

    // 消费金额
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    })
    funds!: number;

    // 账户消费后金额
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    })
    userNewFunds!: number;

    // 消费状态（增加余额/减少余额）
    @Column({
        type: "enum",
        enum: ConsumeType
    })
    state: ConsumeType = ConsumeType.Minus;

    // 消费类型
    @Column({
        type: 'char',
        length: 60
    })
    type!: string;

    // 消费描述
    @Column({
        type: 'varchar',
        length: 200
    })
    description!: string;

}
