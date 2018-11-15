import {getRightType, RightType} from "../entity/RightBase";
import {RightSite} from "../entity/RightSite";

export class CRightSite {

    static async show() {
        return await RightSite.findTrees();
    }

    static async save(info: any) {
        let right = new RightSite();
        right.type = <RightType>getRightType(info.type);
        right.icon = info.icon;
        right.name = info.name;
        right.componentName = info.componentName;

        let parent = await RightSite.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        let rightSaved = await right.save();
        rightSaved.children = [];
        return rightSaved;
    }

    static async update(info: any) {
        await RightSite.update(info.id, {
            name: info.name,
            type: <RightType>getRightType(info.type),
            icon: info.icon,
            componentName: info.componentName
        });
    }

    static async del(id: string) {
        let right = <RightSite>await RightSite.findById(id);
        let descendantsTree = await right.findDescendantsTree();
        await CRightSite.delTree(descendantsTree);
    }

    private static async delTree(tree: RightSite) {
        if (tree.children && tree.children.length > 0) {
            for(let i = 0; i < tree.children.length; i++){
                await CRightSite.delTree(tree.children[i]);
            }
        }
        await RightSite.delById(tree.id);
    }
}