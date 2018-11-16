import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserSite} from "./UserSite";
import {Site} from "./Site";

export enum RoleUserSiteType {
    Site = 'role_site',
    User = 'role_user'
}

@Entity()
export class RoleUserSite extends RoleBase{
    // 角色类型
    @Column({
        type: "enum",
        enum: RoleUserSiteType,
        readonly: true
    })
    type: RoleUserSiteType = RoleUserSiteType.User;

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

    private static query(name: string) {
        return RoleUserSite.p().createQueryBuilder(name);
    }

    async save() {
        return await RoleUserSite.p().save(this);
    }

    static async getAll(siteId:string) {
        return await RoleUserSite.query('role')
            .innerJoin('role.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .orderBy('role.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, role:RoleUserSite) {
        return await RoleUserSite.p().update(id, role);
    }

    static async findByName(name: string){
        return await RoleUserSite.p().findOne({name: name});
    };

    static async findById(id: string){
        return await RoleUserSite.p().findOne(id);
    };

    static async delById(id: string) {
        return await RoleUserSite.p().delete(id);
    }

    static async findByIdWithRelations(id: string) {
        return await RoleUserSite.p().findOne(id, {relations: ['users']});
    }
}