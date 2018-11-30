import {getRightType, RightType} from "../entity/RightBase";
import {RightUser} from "../entity/RightUser";
import {RightSite} from "../entity/RightSite";

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
            right.parent = await RightUser.findById(parentId);
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
}