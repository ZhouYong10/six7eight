import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";

export abstract class ConsumeBase{
    // 消费记录ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 消费时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: number;

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
    funds: number = 0;

    // 账户消费后金额
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    })
    userNewFunds!: number;

    // 消费描述
    @Column({
        type: 'varchar',
        length: 200
    })
    description!: string;

    // 消费类型
    @Column({
        type: 'char',
        length: 60
    })
    type!: string;
}
