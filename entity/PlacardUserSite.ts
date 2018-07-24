import {Entity, ManyToOne} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class PlacardUserSite extends PlacardBase{
    // 发布公告的账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.placards)
    user!: UserAdmin;

}