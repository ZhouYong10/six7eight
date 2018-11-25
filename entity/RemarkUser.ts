import {
    Entity,
    Column,
    ManyToOne,
    getRepository,
    PrimaryGeneratedColumn, CreateDateColumn
} from "typeorm";
import {myDateFromat} from "../utils";
import {User} from "./User";
import {UserSite} from "./UserSite";
import {UserAdmin} from "./UserAdmin";

export enum RemarkWich {
    Platform = 'remark_platform',
    Site = 'remark_site'
}

@Entity()
export class RemarkUser{
    // 备注ID
    @PrimaryGeneratedColumn("uuid")
    readonly id!: string;

    // 创建时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!:string;

    // 备注内容
    @Column({
        type: "varchar",
        length: 300,
    })
    content!: string;

    // 备注类型（用于区分是平台备注还是分站备注）
    @Column({
        type: "enum",
        enum: RemarkWich,
        readonly: true
    })
    type!: RemarkWich;

    // 备注所属用户
    @ManyToOne(type => User, user => user.remarks)
    user!: User;

    // 分站添加备注的管理员账户
    @ManyToOne(type => UserSite, userSite => userSite.remarksUser)
    userSite?: UserSite;

    // 平台添加备注的管理员账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.remarksUser)
    userAdmin?: UserAdmin;




    private static p() {
        return getRepository(RemarkUser);
    }

    private static query(name: string) {
        return RemarkUser.p().createQueryBuilder(name);
    }

    async save() {
        return await RemarkUser.p().save(this);
    }

}


