import {Entity, ManyToOne} from "typeorm";
import {ConsumeBase} from "./ConsumeBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";

@Entity()
export class ConsumeSite extends ConsumeBase{

    // 消费记录所属分站
    @ManyToOne(type => Site, site => site.consumes)
    site!: Site;

    // 资金变动所属分站管理员
    @ManyToOne(type => UserSite, userSite => userSite.consumes)
    userSite!: UserSite;


}