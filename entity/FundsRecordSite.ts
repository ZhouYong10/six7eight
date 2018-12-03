import {Entity, ManyToOne} from "typeorm";
import {FundsRecordBase} from "./FundsRecordBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";

@Entity()
export class FundsRecordSite extends FundsRecordBase{

    // 消费记录所属分站
    @ManyToOne(type => Site, site => site.fundsRecords)
    site!: Site;

    // 资金变动所属分站管理员
    @ManyToOne(type => UserSite, userSite => userSite.fundsRecords)
    userSite!: UserSite;


}