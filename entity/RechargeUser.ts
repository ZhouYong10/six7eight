import {Entity, ManyToOne} from "typeorm";
import {RechargeBase} from "./RechargeBase";
import {User} from "./User";
import {Site} from "./Site";

@Entity()
export class RechargeUser extends RechargeBase{
    // 充值账户
    @ManyToOne(type => User, user => user.recharges)
    user!: User;

    // 所属分站
    @ManyToOne(type => Site, site => site.rechargesUser)
    site!: Site;

}