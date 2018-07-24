import {Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import {User} from "./User";

export abstract class ProfitBase {
    // 返利ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 返利记录创建时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: Timestamp;

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

    // 返利账户
    @ManyToOne(type => User, user => user.giveProfits)
    profitUser!: User;

}