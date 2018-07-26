import {Column, Entity, ManyToOne} from "typeorm";
import {OrderUser} from "./OrderUser";
import {User} from "./User";
import {ProfitBase} from "./ProfitBase";

@Entity()
export class ProfitUser extends ProfitBase{
    // 被返利账户名
    @Column({
        type: 'char',
        length: 100
    })
    profitToUsername!: string;

    // 返利前，被返利账户的返利金额为
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    userOldProfit!: number;

    // 返利后，被返利账户的返利金额为
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    userNewProfit!: number;

    // 返利订单
    @ManyToOne(type => OrderUser, orderUser => orderUser.profitsUser)
    order!: OrderUser;

    // 返利账户
    @ManyToOne(type => User, user => user.giveProfitsUser)
    profitUser!: User;

    // 被返利账户
    @ManyToOne(type => User, user => user.getProfits)
    profitToUser!: User;
}