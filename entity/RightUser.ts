import {Entity, Tree, TreeChildren, TreeParent} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
@Tree('closure-table')
export class RightUser extends RightBase{
    // 父权限
    @TreeParent()
    parent?: RightUser;

    // 子权限
    @TreeChildren()
    children?: RightUser[];

}