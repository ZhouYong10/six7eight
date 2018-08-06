import {Entity, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
export class RightUser extends RightBase{
    // 父权限
    @ManyToOne(type => RightUser, rightUser => rightUser.children)
    parent?: RightUser;

    // 子权限
    @OneToMany(type => RightUser, rightUser => rightUser.parent)
    children?: RightUser[];

}