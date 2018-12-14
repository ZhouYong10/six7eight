import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {User} from "./User";
import {Site} from "./Site";
import {assert} from "../utils";

export enum RoleType {
    Top = 'role_top',
    Super = 'role_super',
    Gold = 'role_gold',
}

@Entity()
export class RoleUser extends RoleBase{
    // 角色名称
    @Column({
        type: 'char',
        length: 60
    })
    name!: string;

    // 角色类型
    @Column({
        type: "enum",
        enum: RoleType
    })
    type!: RoleType;

    // 所属分站
    @ManyToOne(type => Site, site => site.rolesUser)
    site!: Site;

    // 角色所属账户
    @OneToMany(type => User, user => user.role)
    users?: User[];

    getUpRoleType() {
        assert(this.type !== RoleType.Top, '你已是最高等级代理，无法再升级');
        return this.type === RoleType.Gold ? RoleType.Super : RoleType.Top;
    }

    greaterThan(role: RoleUser) {
        return (this.type === RoleType.Top && (role.type === RoleType.Super || role.type === RoleType.Gold))
            || (this.type === RoleType.Super && role.type === RoleType.Gold);
    }


    private static p() {
        return getRepository(RoleUser);
    }

    private static query(name: string) {
        return RoleUser.p().createQueryBuilder(name);
    }

    async save() {
        return await RoleUser.p().save(this);
    }

    static async getRoleBySiteIdAndType(siteId: string, type: RoleType) {
        return await RoleUser.query('role')
            .innerJoin('role.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .where('role.type = :type', {type: type})
            .getOne();
    }

    static async getAll(siteId: string) {
        return await RoleUser.query('role')
            .innerJoin('role.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .orderBy('role.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, role:RoleUser) {
        return await RoleUser.p().update(id, role);
    }

    static async findByName(name: string){
        return await RoleUser.p().findOne({name: name});
    };

    static async findById(id: string){
        return await RoleUser.p().findOne(id);
    };

    static async delById(id: string) {
        return await RoleUser.p().delete(id);
    }

    static async findByIdWithRelations(id: string) {
        return await RoleUser.p().findOne(id, {relations: ['users']});
    }
}