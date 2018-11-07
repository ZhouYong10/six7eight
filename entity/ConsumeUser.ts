
import {ConsumeBase} from "./ConsumeBase";
import {Entity, ManyToOne, OneToOne} from "typeorm";
import {User} from "./User";
import {OrderUser} from "./OrderUser";

@Entity()
export class ConsumeUser extends ConsumeBase{
    // 所属账户
    @ManyToOne(type => User, user => user.consumes)
    user!: User;

    // 所属订单
    @ManyToOne(type => OrderUser, orderUser => orderUser.consumes)
    order!: OrderUser;



}
