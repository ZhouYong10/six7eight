import {Entity, ManyToOne} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";

@Entity()
export class PlacardUser extends PlacardBase{
    // 公告所属分站
    @ManyToOne(type => Site, site => site.placards)
    site!: Site;

    // 发布公告的账户
    @ManyToOne(type => UserSite, userSite => userSite.placards)
    user!: UserSite;

}