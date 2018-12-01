import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
export class RightUser extends RightBase{
    // 父权限
    @ManyToOne(type => RightUser, rightUser => rightUser.children, {
        cascade: true
    })
    parent?: RightUser;

    // 子权限
    @OneToMany(type => RightUser, rightUser => rightUser.parent)
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

    static async update(id: string, right: any) {
        return await RightUser.p().update(id, right);
    }


    static async findTrees() {
        let rights = await RightUser.p().createQueryBuilder('right')
            .where('right.pId = :pId', {pId: '0'})
            .leftJoinAndSelect('right.children', 'menu')
            .leftJoinAndSelect('menu.children', 'menuItem')
            .getMany();
        sortRights(rights);
        return rights;
    }

    static async getAllLeaf() {
        let tree = await RightUser.findTrees();
        let leaves:string[] = [];

        function filterLeaf(tree: Array<RightUser>) {
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