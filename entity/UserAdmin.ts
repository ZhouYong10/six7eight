import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {UserBase, UserType} from "./UserBase";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {PlacardUserSite} from "./PlacardUserSite";
import {RoleUserAdmin} from "./RoleUserAdmin";
import {User} from "./User";

@Entity()
export class UserAdmin extends UserBase{
    // 账户类型
    @Column({
        type: "enum",
        enum: UserType,
        readonly: true
    })
    readonly type: UserType = UserType.Platform;

    // 账户角色
    @ManyToOne(type => RoleUserAdmin, roleUserAdmin => roleUserAdmin.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    role!: RoleUserAdmin;

    // 账户处理的分站管理员反馈
    @OneToMany(type => FeedbackUserSite, feedbackUserSite => feedbackUserSite.dealUser)
    dealFeedbacks?: FeedbackUserSite[];

    // 账户发布的公告
    @OneToMany(type => PlacardUserSite, placardUserSite => placardUserSite.user)
    placards?: PlacardUserSite;


    private static p() {
        return getRepository(UserAdmin);
    }

    private static query(name: string) {
        return UserAdmin.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await UserAdmin.query('admin')
            .leftJoinAndSelect('admin.role', 'role')
            .orderBy('admin.registerTime', 'DESC')
            .getMany();
    }

    async save() {
        return await UserAdmin.p().save(this);
    }

    static findByName = async (username: string) => {
        return await UserAdmin.p().findOne({username: username});
    };

    static findById = async (id: string) => {
        return await UserAdmin.p().findOne(id);
    };
}