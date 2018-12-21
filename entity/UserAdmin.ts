import {Column, Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {UserBase, UserType} from "./UserBase";
import {FeedbackUserSite} from "./FeedbackUserSite";
import {PlacardUserSite} from "./PlacardUserSite";
import {RoleUserAdmin} from "./RoleUserAdmin";
import {RemarkUser} from "./RemarkUser";
import {ErrorOrderUser} from "./ErrorOrderUser";
import {FeedbackUser} from "./FeedbackUser";

@Entity()
export class UserAdmin extends UserBase {
    // 账户类型
    @Column({
        type: "enum",
        enum: UserType,
        readonly: true
    })
    readonly type: UserType = UserType.Platform;

    // 账户管理的所有商品类别
    @Column('simple-array')
    myProductTypes!: string[];

    // 账户管理的所有商品
    @Column('simple-array')
    myProducts!: string[];

    // 账户角色
    @ManyToOne(type => RoleUserAdmin, roleUserAdmin => roleUserAdmin.users, {
        eager: true,
        onDelete: 'SET NULL'
    })
    role!: RoleUserAdmin;

    // 账户处理的分站管理员反馈
    @OneToMany(type => FeedbackUserSite, feedbackUserSite => feedbackUserSite.dealUser)
    dealFeedbacks?: FeedbackUserSite[];

    // 账户处理的分站用户反馈
    @OneToMany(type => FeedbackUser, feedbackUser => feedbackUser.dealUserAdmin)
    dealUserFeedbacks?: FeedbackUserSite[];

    // 账户发布的公告
    @OneToMany(type => PlacardUserSite, placardUserSite => placardUserSite.user)
    placards?: PlacardUserSite;

    // 账户创建的前端用户备注
    @OneToMany(type => RemarkUser, remarkUser => remarkUser.userAdmin)
    remarksUser?: RemarkUser[];

    // 账户处理的订单报错信息
    @OneToMany(type => ErrorOrderUser, errorOrderUser => errorOrderUser.userAdmin)
    errorsOrderUser?: ErrorOrderUser[];


    private static p() {
        return getRepository(UserAdmin);
    }

    async save() {
        return await UserAdmin.p().save(this);
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

    static async update(id: string, admin: any) {
        return await UserAdmin.p().update(id, admin);
    }

    static async delById(id: string) {
        return await UserAdmin.p().delete(id);
    }

    static async findByName(username: string) {
        return await UserAdmin.p().findOne({username: username});
    };

    static async findById(id: string) {
        return await UserAdmin.p().findOne(id);
    };
}