import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserSite} from "./UserSite";
import {Site} from "./Site";

@Entity()
export class RoleUserSite extends RoleBase{
    // 角色名称
    @Column({
        type: 'char',
        length: 60
    })
    name!: string;

    // 角色账户
    @OneToMany(type => UserSite, userSite => userSite.role)
    users?: UserSite[];

    // 所属分站
    @ManyToOne(type => Site, site => site.rolesUserSite)
    site?: Site;

    private static p() {
        return getRepository(RoleUserSite);
    }

    async save() {
        return await RoleUserSite.p().save(this);
    }
}