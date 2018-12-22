import {Column, Entity, getRepository, OneToMany} from "typeorm";
import {RoleBase} from "./RoleBase";
import {UserAdmin} from "./UserAdmin";

export enum RoleUserAdminType {
    Developer = 'role_developer',
    User = 'role_user'
}

@Entity()
export class RoleUserAdmin extends RoleBase{
    // 角色类型
    @Column({
        type: "enum",
        enum: RoleUserAdminType,
        readonly: true
    })
    type: RoleUserAdminType = RoleUserAdminType.User;

    // 角色名称
    @Column({
        type: 'char',
        length: 60,
        unique: true
    })
    name!: string;

    // 管理的所有商品类别
    @Column('simple-array')
    productTypes!: string[];

    // 管理的所有商品
    @Column('simple-array')
    products!: string[];

    // 角色账户
    @OneToMany(type => UserAdmin, userAdmin => userAdmin.role)
    users?: UserAdmin[];

    addProductTypeToRights(typeId: string){
        super.addProductTypeToRights(typeId);
        this.productTypes.push(typeId);
    }

    addProductToRights(typeId: string, productId: string){
        super.addProductToRights(typeId, productId);
        this.products.push(productId);
    }


    private static p() {
        return getRepository(RoleUserAdmin);
    }

    private static query(name: string) {
        return RoleUserAdmin.p().createQueryBuilder(name);
    }

    async save() {
        return await RoleUserAdmin.p().save(this);
    }

    static async typeUserRoles() {
        return await RoleUserAdmin.query('role')
            .where('role.type = :type', {type: RoleUserAdminType.User})
            .orderBy('role.createTime', 'DESC')
            .getMany();
    }

    static async getAll() {
        return await RoleUserAdmin.query('role')
            .orderBy('role.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, role:RoleUserAdmin) {
        return await RoleUserAdmin.p().update(id, role);
    }

    static async findByName(name: string){
        return await RoleUserAdmin.p().findOne({name: name});
    };

    static async findById(id: string){
        return await RoleUserAdmin.p().findOne(id);
    };

    static async delById(id: string) {
        return await RoleUserAdmin.p().delete(id);
    }

    static async findByIdWithRelations(id: string) {
        return await RoleUserAdmin.p().findOne(id, {relations: ['users']});
    }
}