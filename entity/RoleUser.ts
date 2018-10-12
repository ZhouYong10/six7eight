import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {User} from "./User";
import {Site} from "./Site";

export enum RoleType {
    Top = 'top',
    Super = 'super',
    Gold = 'gold',
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
    @Column()
    type!: string;

    // 所属分站
    @ManyToOne(type => Site, site => site.rolesUser)
    site?: Site;

    // 角色所属账户
    @OneToMany(type => User, user => user.role)
    users?: User[];


    private static p() {
        return getRepository(RoleUser);
    }

    private static query(name: string) {
        return RoleUser.p().createQueryBuilder(name);
    }

    async save() {
        return await RoleUser.p().save(this);
    }

    static async getAll() {
        return await RoleUser.query('role')
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