import {Entity, ManyToOne} from "typeorm";
import {ConsumeBase} from "./ConsumeBase";
import {UserSite} from "./UserSite";

@Entity()
export class ConsumeUserSite extends ConsumeBase{

    // 消费账户
    @ManyToOne(type => UserSite, userSite => userSite.consumes)
    user!: UserSite;

    //

}