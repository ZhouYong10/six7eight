import {Entity, getManager, getRepository, Tree, TreeChildren, TreeParent} from "typeorm";
import {getRightType, RightBase, RightType} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
@Tree('materialized-path')
export class RightUser extends RightBase{
    // 父权限
    @TreeParent()
    parent?: RightUser;

    // 子权限
    @TreeChildren({
        cascade: true
    })
    children?: RightUser[];



    private static p(){
        return getRepository(RightUser);
    }


    async save() {
        return await RightUser.p().save(this);
    }

    static async findByName(username: string){
        return await RightUser.p().findOne({name: username});
    };

    static async findById(id: string){
        return await RightUser.p().findOne(id);
    };

    static async delById(id: string) {
        return await RightUser.p().delete(id);
    }

    static async update(id: string, right: {
        name: string,
        type: RightType,
        icon: string,
        componentName: string
    }) {
        return await RightUser.p().update(id, right);
    }



    private static treeP() {
        return getManager().getTreeRepository(RightUser);
    }

    static async findTrees() {
        let rights = await RightUser.treeP().findTrees();
        if (rights[0]) {
            sortRights(rights[0].children);
        }
        return rights;
    }

    static async getAllLeaf() {
        let tree = await RightUser.treeP().findTrees();
        let leaves:Array<RightUser> = [];

        function filterLeaf(tree: Array<RightUser>) {
            tree.forEach((right) => {
                if (!right.children || right.children.length < 1) {
                    leaves.push(right);
                } else {
                    filterLeaf(right.children);
                }
            });
        }

        filterLeaf(tree);
        return leaves;
    }



    async findDescendantsTree() {
        return await RightUser.treeP().findDescendantsTree(this);
    }

    async findDescendants() {
        return await RightUser.treeP().findDescendants(this);
    }

    async findAncestors() {
        return await RightUser.treeP().findAncestors(this);
    }

    async findAncestorsTree() {
        return await RightUser.treeP().findAncestorsTree(this);
    }

}