import {getRightType, RightType} from "../entity/RightBase";
import {RightUser} from "../entity/RightUser";
import {RightSite} from "../entity/RightSite";
import {getManager} from "typeorm";

export class CRightUser {

    static async show() {
        return await RightUser.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        let right = new RightUser();
        right.setType = type;
        right.name = name;
        right.icon = icon;
        right.path = path;
        right.fingerprint = fingerprint;

        if (parentId) {
            right.parent = <RightUser>await RightUser.findById(parentId);
            right.pId = right.parent.id;
        }else{
            right.pId = '0';
        }
        if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
            right.children = [];
        }
        return await right.save();
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await RightUser.update(id, {
            name: name,
            icon: icon,
            fingerprint: fingerprint,
            path: path
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