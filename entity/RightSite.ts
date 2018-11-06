import {Entity, getManager, getRepository, Tree, TreeChildren, TreeParent} from "typeorm";
import {RightBase} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
@Tree('materialized-path')
export class RightSite extends RightBase{
    // 父权限
    @TreeParent()
    parent?: RightSite;

    // 子权限
    @TreeChildren({
        cascade: true
    })
    children?: RightSite[];



    private static p(){
        return getRepository(RightSite);
    }


    async save() {
        return await RightSite.p().save(this);
    }

    static async findByName(username: string){
        return await RightSite.p().findOne({name: username});
    };

    static async findById(id: string){
        return await RightSite.p().findOne(id);
    };

    static async delById(id: string) {
        return await RightSite.p().delete(id);
    }

    static async update(id: string, right: RightSite) {
        return await RightSite.p().update(id, right);
    }



    private static treeP() {
        return getManager().getTreeRepository(RightSite);
    }

    static async findTrees() {
        let rights = await RightSite.treeP().findTrees();
        if (rights[0]) {
            sortRights(rights[0].children);
        }
        return rights;
    }

    static async getAllLeaf() {
        let tree = await RightSite.treeP().findTrees();
        let leaves:Array<RightSite> = [];

        function filterLeaf(tree: Array<RightSite>) {
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
        return await RightSite.treeP().findDescendantsTree(this);
    }

    async findDescendants() {
        return await RightSite.treeP().findDescendants(this);
    }

    async findAncestors() {
        return await RightSite.treeP().findAncestors(this);
    }

    async findAncestorsTree() {
        return await RightSite.treeP().findAncestorsTree(this);
    }
}