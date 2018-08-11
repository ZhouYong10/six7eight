import {RightAdmin} from "../entity/RightAdmin";
import {getRightType, RightType} from "../entity/RightBase";
import {MsgRes} from "../utils";

export class CRightAdmin {

    static async show() {
        try{
            return new MsgRes(true, '', await RightAdmin.findTrees());
        }catch (e) {
            return new MsgRes(false, e.message);
        }
    }

    static async save(info: any) {
        try{
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
            return new MsgRes(true, '', rightSaved);
        }catch (e) {
            return new MsgRes(false, e.message);
        }
    }

    static async update(info: any) {
        try{
            let right = new RightAdmin();
            right.name = info.name;
            right.type = <RightType>getRightType(info.type);
            right.icon = info.icon;
            right.componentName = info.componentName;
            await RightAdmin.update(info.id, right);
            return new MsgRes(true);
        }catch (e) {
            return new MsgRes(false, e.message);
        }
    }

    static async del(id: string) {
        try{
            let right = <RightAdmin>await RightAdmin.findById(id);
            let descendantsTree = await right.findDescendantsTree();
            await CRightAdmin.delTree(descendantsTree);
            return new MsgRes(true);
        }catch (e) {
            return new MsgRes(false, e.message);
        }
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