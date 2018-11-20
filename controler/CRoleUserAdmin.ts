import * as debuger from "debug";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";
import {MsgRes} from "../utils";

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
        role.rights = info.rights;
        return await role.save()
    }

    static async update(info: any) {
        let role = new RoleUserAdmin();
        role.name = info.name;
        role.rights = info.rights;
        return await RoleUserAdmin.update(info.id, role);
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