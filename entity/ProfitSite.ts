import {Column, Entity, ManyToOne, OneToOne} from "typeorm";
import {ProfitBase} from "./ProfitBase";
import {OrderUser} from "./OrderUser";
import {Site} from "./Site";

@Entity()
export class ProfitSite extends ProfitBase{
    // 被返利分站名
    @Column({
        type: 'char',
        length: 50
    })
    siteName!: string;

    // 返利前，分站的返利金额为
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    siteOldProfit!: number;

    // 返利后，分站的返利金额为
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    siteNewProfit!: number;

    // 返利订单
    @OneToOne(type => OrderUser, orderUser => orderUser.profitSite)
    order!: OrderUser;

    // 被返利分站
    @ManyToOne(type => Site, site => site.profits)
    site!: Site;

}