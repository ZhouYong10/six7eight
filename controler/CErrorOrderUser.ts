import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {UserAdmin} from "../entity/UserAdmin";
import {getManager} from "typeorm";
import {OrderStatus, OrderUser} from "../entity/OrderUser";
import {now} from "../utils";
import {ProductSite} from "../entity/ProductSite";
import {UserSite} from "../entity/UserSite";
import {WitchType} from "../entity/ProductTypeBase";
import {Site} from "../entity/Site";
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
                .leftJoinAndSelect('error.site', 'site')
                .leftJoinAndSelect('order.productSite', 'product')
                .getOne();
            let order = <OrderUser>error.order;
            let product = <ProductSite>order.productSite;
            order.newErrorDeal = true;
            order = await tem.save(order);

            error.isDeal = true;
            error.dealContent = dealContent;
            error.dealTime = now();
            await tem.save(error);
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusOrderErrorBadge", {fingerprint: 'orderErrorPlatform', productId: error.productId});
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.site.id + "minusOrderErrorBadge", {fingerprint: 'orderErrorSite', productId: error.productId});
                io.emit(error.site.id + "dealOrderError", error);
            }
            // 将已处理报错订单状态发送到用户页面
            io.emit(product.id + "hasErrorDeal", order);

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
                .leftJoinAndSelect('error.site', 'site')
                .leftJoinAndSelect('order.productSite', 'product')
                .getOne();
            let site = <Site>error.site;
            let order = <OrderUser>error.order;
            let product = <ProductSite>order.productSite;

            order.newErrorDeal = true;
            await tem.save(order);
            // 将已处理报错订单状态发送到用户页面
            io.emit(product.id + "hasErrorDeal", order);

            error.isDeal = true;
            error.dealContent = info.refundMsg;
            error.dealTime = now();
            await tem.save(error);
            if (error.type === WitchType.Platform) {
                error.userAdmin = <UserAdmin>user;
                io.emit("minusOrderErrorBadge", {fingerprint: 'orderErrorPlatform', productId: error.productId});
                io.emit("dealOrderError", error);
            }else {
                error.userSite = <UserSite>user;
                io.emit(error.site.id + "minusOrderErrorBadge", {fingerprint: 'orderErrorSite', productId: error.productId});
                io.emit(site.id + "dealOrderError", error);
            }

            let message = new MessageUser();
            message.user = order.user;
            message.title = MessageTitle.OrderRefund;
            message.content = `${order.name} -- ${error.dealContent}`;
            message.frontUrl = `/product/${order.productSiteId}`;
            message.aimId = order.id;
            await tem.save(message);
            // 发送消息提示到用户
            io.emit(order.user.id + 'plusMessageNum');
        });
        await COrderUser.refund({
            id: info.orderId,
            executeNum: info.executeNum,
            refundMsg: info.refundMsg
        }, io);
    }

}
