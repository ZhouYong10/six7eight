import {Entity, Column, ManyToMany, JoinTable} from "typeorm";
import {UserBase} from "./UserBase";
import {UserSiteRole} from "./UserSiteRole";

@Entity()
export class UserSite extends UserBase{
    // 站点管理员角色
    role!: UserSiteRole



    // constructor(id: number, name: string, password: string) {
    //     super();
    //     this.id = id
    //     this.name = name
    //     this.password = password;
    // }
}