import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {UserBase} from "./UserBase";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {PlacardUserSite} from "./PlacardUserSite";
import {RoleUserAdmin} from "./RoleUserAdmin";
import {User} from "./User";

@Entity()
export class UserAdmin extends UserBase{
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

    static findByName = async (username: string) => {
        return await getRepository(UserAdmin).findOne({username: username});
    };

    static findById = async (id: string) => {
        return await getRepository(UserAdmin).findOne(id);
    };
}