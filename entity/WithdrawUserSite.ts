import {Entity, ManyToOne} from "typeorm";
import {WithdrawBase} from "./WithdrawBase";
import {UserSite} from "./UserSite";
import {Site} from "./Site";

@Entity()
export class WithdrawUserSite extends WithdrawBase{
    // 提现账户
    @ManyToOne(type => UserSite, userSite => userSite.withdraws)
    user!: UserSite;

    // 所属分站
    @ManyToOne(type => Site, site => site.withdrawsUserSite)
    site!: Site;

}