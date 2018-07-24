import {Entity, ManyToOne} from "typeorm";
import {WithdrawBase} from "./WithdrawBase";
import {User} from "./User";
import {Site} from "./Site";

@Entity()
export class WithdrawUser extends WithdrawBase{
    // 提现账户
    @ManyToOne(type => User, user => user.withdraws)
    user!: User;

    // 提现分站
    @ManyToOne(type => Site, site => site.withdrawsUser)
    site!: Site;
}