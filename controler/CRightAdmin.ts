import {RightAdmin} from "../entity/RightAdmin";
import {getRightType, RightType} from "../entity/RightBase";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        let right = new RightAdmin();
        right.setType = type;
        right.name = name;
        right.icon = icon;
        right.path = path;
        right.fingerprint = fingerprint;

        if (parentId) {
            right.parent = await RightAdmin.findById(parentId);
        }
        if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
            right.children = [];
        }
        return await right.save();
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await RightAdmin.update(id, {
            name: name,
            icon: icon,
            fingerprint: fingerprint,
            path: path
        });
    }
}