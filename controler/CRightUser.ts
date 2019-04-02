import {RightType} from "../entity/RightBase";
import {RightUser} from "../entity/RightUser";
import {EntityManager, getManager} from "typeorm";
import {RoleUser} from "../entity/RoleUser";

export class CRightUser {

    static async show() {
        return await RightUser.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        return await getManager().transaction(async tem => {
            let right = new RightUser();
            right.setType = type;
            right.name = name;
            right.icon = icon;
            right.path = path;
            right.fingerprint = fingerprint;
            if (parentId) {
                right.parent = <RightUser>await tem.findOne(RightUser, parentId);
                right.pId = right.parent.id;
            }else{
                right.pId = '0';
            }
            if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
                right.children = [];
            }
            await CRightUser.updateRoleUserFingerprint(tem, fingerprint);
            return await tem.save(right);
        });
    }

    private static async updateRoleUserFingerprint(tem: EntityManager, fingerprint: string) {
        let roleUsers = await tem.createQueryBuilder()
            .select('role')
            .from(RoleUser, 'role')
            .getMany();
        for (let i = 0; i < roleUsers.length; i++) {
            let roleUser = roleUsers[i];
            roleUser.rights.push(fingerprint);
            roleUser.editRights.push(fingerprint);
            await tem.save(roleUser);
        }
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await getManager().transaction(async tem => {
            let rightUser = <RightUser>await tem.findOne(RightUser, id);
            rightUser.name = name;
            rightUser.icon = icon;
            rightUser.fingerprint = fingerprint;
            rightUser.path = path;
            await CRightUser.updateRoleUserFingerprint(tem, fingerprint);
            await tem.save(rightUser);
        });
    }

    static async changeRightSort(info: any) {
        let {rightDrag, rightDrop} = info;
        await getManager().transaction(async tem => {
            await tem.update(RightUser, rightDrag.id, {num: rightDrag.num, pId: rightDrag.parentId});
            await tem.createQueryBuilder()
                .relation(RightUser, 'parent')
                .of(rightDrag.id)
                .set(rightDrag.parentId === '0' ? null: rightDrag.parentId);


            await tem.update(RightUser, rightDrop.id, {num: rightDrop.num});
        });
    }
}