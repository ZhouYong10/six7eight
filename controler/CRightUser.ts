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
        let right = new RightUser();
        right.name = info.name;
        right.type = <RightType>getRightType(info.type);
        right.icon = info.icon;
        right.componentName = info.componentName;
        await RightUser.update(info.id, right);
    }

    static async del(id: string) {
        let right = <RightUser>await RightUser.findById(id);
        let descendantsTree = await right.findDescendantsTree();
        await CRightUser.delTree(descendantsTree);
    }

    private static async delTree(tree: RightUser) {
        if (tree.children && tree.children.length > 0) {
            for(let i = 0; i < tree.children.length; i++){
                await CRightUser.delTree(tree.children[i]);
            }
        }
        await RightUser.delById(tree.id);
    }
}