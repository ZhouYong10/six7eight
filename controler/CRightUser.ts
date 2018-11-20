import {getRightType, RightType} from "../entity/RightBase";
import {RightUser} from "../entity/RightUser";

export class CRightUser {

    static async show() {
        return await RightUser.findTrees();
    }

    static async save(info: any) {
        let right = new RightUser();
        right.type = <RightType>getRightType(info.type);
        right.icon = info.icon;
        right.name = info.name;
        right.componentName = info.componentName;

        let parent = await RightUser.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        let rightSaved = await right.save();
        rightSaved.children = [];
        return rightSaved;
    }

    static async update(info: any) {
        await RightUser.update(info.id, {
            name: info.name,
            type: <RightType>getRightType(info.type),
            icon: info.icon,
            componentName: info.componentName
        });
    }
}