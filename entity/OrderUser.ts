import {Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ConsumeUser} from "./ConsumeUser";
import {ProfitUser} from "./ProfitUser";
import {ProfitSite} from "./ProfitSite";

@Entity()
export class OrderUser {
    // 订单ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 订单创建时间
    @Column({
        type: 'timestamp',
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: number;

    // 订单处理时间
    @Column('timestamp')
    dealTime?: number;

    // 订单完成时间
    @Column('timestamp')
    completeTime?: number;

    // 订单价格
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    price!: number;

    // 订单数量
    @Column()
    num!: number;

    // 订单总价
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    totalPrice!: number;

    // 订单返利

    // 订单执行进度

    // 订单状态




    // 订单消费记录
    @OneToOne(type => ConsumeUser, consumeUser => consumeUser.order)
    @JoinColumn()
    consume!: ConsumeUser;

    // 订单所属分站

    // 订单所属账户

    // 订单所属产品

    // 订单返利给账户记录
    @OneToMany(type => ProfitUser, profitUser => profitUser.order)
    profitsUser?: ProfitUser[];

    // 订单返利给分站的记录
    @OneToOne(type => ProfitSite, profitSite => profitSite.order)
    @JoinColumn()
    profitSite!: ProfitSite;


}