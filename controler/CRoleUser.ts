import {RoleUser} from "../entity/RoleUser";
import {getManager} from "typeorm";
import {RightUser} from "../entity/RightUser";
import {sortRights} from "../utils";

export class CRoleUser {

    static async findById(id: string) {
        return await RoleUser.findById(id);
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
            role.editRights = info.editRights;
            role.rights = info.rights;

            let rights = await tem.createQueryBuilder()
                .select('right')
                .from(RightUser, 'right')
                .where('right.pId = :pId', {pId: '0'})
                .leftJoinAndSelect('right.children', 'menu')
                .leftJoinAndSelect('menu.children', 'menuItem')
                .getMany();
            sortRights(rights);
            let treeRights = role.treeRights(rights);
            io.emit(role.id + 'changeRights', {menuRights: treeRights, rights: role.rights, roleName: role.name});
            await tem.save(role);
        });
    }

}