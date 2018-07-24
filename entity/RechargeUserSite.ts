import {Entity, ManyToOne} from "typeorm";
import {RechargeBase} from "./RechargeBase";
import {UserSite} from "./UserSite";
import {Site} from "./Site";

@Entity()
export class RechargeUserSite extends RechargeBase{
    // 充值账户
    @ManyToOne(type => UserSite, userSite => userSite.recharges)
    user!: UserSite;

    // 充值所属分站
    @ManyToOne(type => Site, site => site.rechargesUserSite)
    site!: Site;

}