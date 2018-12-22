import * as debuger from "debug";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";
import {getMyProducts, platformGetMenuWaitCount, productToRight, sortRights} from "../utils";
import {getManager} from "typeorm";
import {ProductType} from "../entity/ProductType";
import {RightAdmin} from "../entity/RightAdmin";
import {CProductTypes} from "./CProductTypes";

const debug = (info: any, msg?: string) => {
    const debug = debuger('six7eight:CRoleUserAdmin_saveOne ');
    debug(JSON.stringify(info) + '  ' + msg);
};

export class CRoleUserAdmin {

    static async typeUserRoles() {
        return await RoleUserAdmin.typeUserRoles();
    }

    static async allRoles() {
        return await RoleUserAdmin.getAll();
    }

    static async findByName(name: string) {
        return await RoleUserAdmin.findByName(name);
    }

    static async saveOne(info:any){
        let role = new RoleUserAdmin();
        role.name = info.name;
        role.editRights = info.editRights;
        role.rights = info.rights;
        let productMenus = await CProductTypes.productsRight();
        let {productTypes, products} = getMyProducts(role.treeRights(productMenus));
        role.productTypes = productTypes;
        role.products = products;
        return await role.save()
    }

    static async update(info: any, io: any) {
        await getManager().transaction(async tem => {
            let role = <RoleUserAdmin> await tem.createQueryBuilder()
                .select('role')
                .from(RoleUserAdmin, 'role')
                .where('role.id = :id', {id: info.id})
                .getOne();
            role.name = info.name;
            role.editRights = info.editRights;
            role.rights = info.rights;

            let typeProducts = await tem.createQueryBuilder()
                .select('type')
                .from(ProductType, 'type')
                .leftJoinAndSelect('type.products', 'product')
                .orderBy('type.createTime', 'DESC')
                .getMany();
            let productRights = productToRight(typeProducts, []);
            let rights = await tem.createQueryBuilder()
                .select('right')
                .from(RightAdmin, 'right')
                .where('right.pId = :pId', {pId: '0'})
                .leftJoinAndSelect('right.children', 'menu')
                .leftJoinAndSelect('menu.children', 'menuItem')
                .getMany();
            sortRights(rights);
            let treeRights = role.treeRights(productRights.concat(rights));
            let {productTypes, products} = getMyProducts(treeRights);
            role.productTypes = productTypes;
            role.products = products;
            await platformGetMenuWaitCount(treeRights, role.products);
            io.emit(role.id + 'changeRights', {menuRights: treeRights, rights: role.rights, roleName: role.name});
            await tem.save(role);
        });
    }

    static async delById(id: string) {
        let role = <RoleUserAdmin>await RoleUserAdmin.findByIdWithRelations(id);
        if (role.users && role.users.length > 0) {
            throw(new Error('该角色上有关联的账户，不能删除！'));
        }else{
            await RoleUserAdmin.delById(id);
        }
    }
}