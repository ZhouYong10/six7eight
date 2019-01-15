import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {UserAdmin} from "../entity/UserAdmin";
import {getManager} from "typeorm";
import {OrderUser} from "../entity/OrderUser";
import {assert, now} from "../utils";
import {UserSite} from "../entity/UserSite";
import {WitchType} from "../entity/ProductTypeBase";
import {COrderUser} from "./COrderUser";
import {MessageUser} from "../entity/MessageUser";
import {MessageTitle} from "../entity/MessageBase";

export class CErrorOrderUser {

    static async platformAll(productIds: Array<string>, page:any) {
        return await ErrorOrderUser.platformAll(productIds, page);
    }

    static async getWaitCount(productIds: Array<string>) {
        return await ErrorOrderUser.getWaitCount(productIds);
    }

    static async getSiteWaitCount(productIds: Array<string>) {
        return await ErrorOrderUser.getSiteWaitCount(productIds);
    }

    static async siteAll(productIds: Array<string>, page:any) {
        return await ErrorOrderUser.siteAll(productIds, page);
    }

    static async dealError(info: any, user: UserAdmin | UserSite, io: any) {
        let {id, dealContent} = info;
        await getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: id})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('order.user', 'user')
                .getOne();
            assert(!error.isDeal, '该条报错已经处理了');
            let order = <OrderUser>error.order;
            order.newErrorDeal = true;
            order = await tem.save(order);

            error.isDeal = true;
            error.dealContent = dealContent;
            error.dealTime = now();
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusOrderErrorBadge", {fingerprint: 'orderErrorPlatform', productId: error.productId});
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.siteId + "minusOrderErrorBadge", {fingerprint: 'orderErrorSite', productId: error.productId});
                io.emit(error.siteId + "dealOrderError", error);
            }
            await tem.save(error);
            // 将已处理报错订单状态发送到用户页面
            io.emit(order.productSiteId + "hasErrorDeal", order);

            let message = new MessageUser();
            message.user = order.user;
            message.title = MessageTitle.OrderError;
            message.content = `${order.name} -- ${error.dealContent}`;
            message.frontUrl = `/product/${order.productSiteId}`;
            message.aimId = order.id;
            await tem.save(message);
            // 发送消息提示到用户
            io.emit(order.user.id + 'plusMessageNum');
        });
    }

    static async dealErrorOrderRefund(info: any, user: UserAdmin | UserSite, io: any) {
        await getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: info.errorId})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('order.user', 'user')
                .getOne();
            assert(!error.isDeal, '该条报错已经处理了');
            let order = <OrderUser>error.order;
            order.newErrorDeal = true;
            await tem.save(order);

            error.isDeal = true;
            error.dealContent = info.refundMsg;
            error.dealTime = now();
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusOrderErrorBadge", {fingerprint: 'orderErrorPlatform', productId: error.productId});
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.siteId + "minusOrderErrorBadge", {fingerprint: 'orderErrorSite', productId: error.productId});
                io.emit(error.siteId + "dealOrderError", error);
            }
            await tem.save(error);
            // 将已处理报错订单状态发送到用户页面
            io.emit(order.productSiteId + "hasErrorDeal", order);
        });
        await COrderUser.backout({
            id: info.orderId,
            executeNum: info.executeNum,
            refundMsg: info.refundMsg
        }, io);
    }

    static async dealErrorOrderAccount(info: any, user: UserAdmin | UserSite, io: any) {
        await getManager().transaction(async tem => {
            let error = <ErrorOrderUser>await tem.createQueryBuilder()
                .select('error')
                .from(ErrorOrderUser, 'error')
                .where('error.id = :id', {id: info.errorId})
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('order.user', 'user')
                .getOne();
            assert(!error.isDeal, '该条报错已经处理了');
            let order = <OrderUser>error.order;
            order.newErrorDeal = true;
            await tem.save(order);

            error.isDeal = true;
            error.dealContent = info.dealContent;
            error.dealTime = now();
            await tem.save(error);
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusOrderErrorBadge", {fingerprint: 'orderErrorPlatform', productId: error.productId});
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.siteId + "minusOrderErrorBadge", {fingerprint: 'orderErrorSite', productId: error.productId});
                io.emit(error.siteId + "dealOrderError", error);
            }
            // 将已处理报错订单状态发送到用户页面
            io.emit(order.productSiteId + "hasErrorDeal", order);

            let message = new MessageUser();
            message.user = order.user;
            message.title = MessageTitle.OrderError;
            message.content = `${order.name} -- ${error.dealContent}`;
            message.frontUrl = `/product/${order.productSiteId}`;
            message.aimId = order.id;
            await tem.save(message);
            // 发送消息提示到用户
            io.emit(order.user.id + 'plusMessageNum');
        });
        await COrderUser.handleAccount(info.orderId, io);
    }
}
