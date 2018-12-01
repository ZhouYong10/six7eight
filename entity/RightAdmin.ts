import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
export class RightAdmin extends RightBase {
    // 父权限
    @ManyToOne(type => RightAdmin, rightAdmin => rightAdmin.children, {
        cascade: true
    })
    parent?: RightAdmin;

    // 子权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.parent)
    children?: RightAdmin[];



    private static p(){
        return getRepository(RightAdmin);
    }

    async save() {
        return await RightAdmin.p().save(this);
    }

    static async findByName(username: string){
        return await RightAdmin.p().findOne({name: username});
    };

    static async findById(id: string){
        return await RightAdmin.p().findOne(id);
    };

    static async update(id: string, right: any) {
        return await RightAdmin.p().update(id, right);
    }


    static async findTrees() {
        let rights = await RightAdmin.p().createQueryBuilder('right')
            .where('right.pId = :pId', {pId: '0'})
            .leftJoinAndSelect('right.children', 'menu')
            .leftJoinAndSelect('menu.children', 'menuItem')
            .getMany();
        sortRights(rights);
        return rights;
    }

    static async getAllLeaf() {
        let tree = await RightAdmin.findTrees();
        let leaves:string[] = [];

        function filterLeaf(tree: Array<RightAdmin>) {
            tree.forEach((right) => {
                if (!right.children || right.children.length < 1) {
                    leaves.push(right.id);
                } else {
                    filterLeaf(right.children);
                }
            });
        }

        filterLeaf(tree);
        return leaves;
    }

}