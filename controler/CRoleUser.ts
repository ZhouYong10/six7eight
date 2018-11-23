import {RoleUser} from "../entity/RoleUser";
import {getManager} from "typeorm";
import {RightUser} from "../entity/RightUser";
import {sortRights} from "../utils";

export class CRoleUser {

    static async findById(id: string) {
        return await RoleUser.findById(id);
    }

    static async save(info: any) {
        let role = new RoleUser();
        role.name = info.name;
        role.type = info.type;
        role.rights = info.rights;
        role.site = info.site;
        return await role.save();
    }

    static async allRoles(siteId: string) {
        return await RoleUser.getAll(siteId);
    }

    static async update(info: any, io: any) {
        await getManager().transaction(async tem => {
            let role = <RoleUser> await tem.createQueryBuilder()
                .select('role')
                .from(RoleUser, 'role')
                .where('role.id = :id', {id: info.id})
                .getOne();
            role.name = info.name;
            role.rights = info.rights;

            let rights = await tem.getTreeRepository(RightUser).findTrees();
            sortRights(rights);
            let treeRights = role.treeRights(rights);
            io.emit(role.id + 'changeRights', {menuRights: treeRights, rights: role.rights, roleName: role.name});
            await tem.save(role);
        });
    }

}