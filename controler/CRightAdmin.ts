import {RightAdmin} from "../entity/RightAdmin";
import {getRightType, RightType} from "../entity/RightBase";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.findTrees();
    }

    static async save(info: any) {
        let right = new RightAdmin();
        right.type = <RightType>getRightType(info.type);
        right.icon = info.icon;
        right.name = info.name;
        right.componentName = info.componentName;

        let parent = await RightAdmin.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        let rightSaved = await right.save();
        rightSaved.children = [];
        return rightSaved;
    }

    static async update(info: any) {
        await RightAdmin.update(info.id, {
            name: info.name,
            type: <RightType>getRightType(info.type),
            icon: info.icon,
            componentName: info.componentName
        });
    }

    static async del(id: string) {
        let right = <RightAdmin>await RightAdmin.findById(id);
        let descendantsTree = await right.findDescendantsTree();
        await CRightAdmin.delTree(descendantsTree);
    }

    private static async delTree(tree: RightAdmin) {
        if (tree.children && tree.children.length > 0) {
            for(let i = 0; i < tree.children.length; i++){
                await CRightAdmin.delTree(tree.children[i]);
            }
        }
        await RightAdmin.delById(tree.id);
    }
}