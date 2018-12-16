import {OrderStatus, OrderUser} from "../entity/OrderUser";
import {EntityManager, getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {assert, decimal, now} from "../utils";
import {ErrorOrderUser} from "../entity/ErrorOrderUser";
import {WitchType} from "../entity/ProductTypeBase";
import {Product} from "../entity/Product";
import {ProductType} from "../entity/ProductType";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {Platform} from "../entity/Platform";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {FundsRecordPlatform} from "../entity/FundsRecordPlatform";


export class COrderUser {
    static async getWaitAndBackoutCount(productId: string) {
        return await OrderUser.getWaitAndBackoutCount(productId);
    }

    static async getSiteWaitAndBackoutCount(productId: string) {
        return await OrderUser.getSiteWaitAndBackoutCount(productId);
    }

    static async findUserOrdersByProductId(productId: string, userId: string) {
        return await OrderUser.findUserOrdersByProductId(productId, userId);
    }

    static async findPlatformOrdersByProductId(productId: string, page:any) {
        return await OrderUser.findPlatformOrdersByProductId(productId, page);
    }

    static async findSiteOrdersByProductId(productId: string, siteId: string, page:any) {
        return await OrderUser.findSiteOrdersByProductId(productId, siteId, page);
    }

    private static async countOrderProfits(tem: EntityManager, site: Site, user: User, product: ProductSite, num: number, profits: Array<any>) {
        let userNow = <User>await tem.createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('user.id = :id', {id: user.id})
            .innerJoinAndSelect('user.parent', 'parent')
            .leftJoinAndSelect('parent.role', 'parentRole')
            .getOne();
        if (userNow) {
            let parent = <User>userNow.parent;
            if (parent.role.greaterThan(user.role)) {
                let profitPrice = decimal(product.getPriceByUserRole(user.role)).minus(product.getPriceByUserRole(parent.role));
                profits.push({
                    type: 'user',
                    id: parent.id,
                    name: parent.username,
                    profit: parseFloat(decimal(profitPrice).times(num).toFixed(4))
                });
            }
            await COrderUser.countOrderProfits(tem, site, parent, product, num, profits);
        } else {
            if (product.type === WitchType.Platform) {
                let profitPriceSite = decimal(product.getPriceByUserRole(user.role)).minus(product.sitePrice);
                profits.push({
                    type: 'site',
                    id: site.id,
                    name: site.name,
                    profit: parseFloat(decimal(profitPriceSite).times(num).toFixed(4))
                });
                let profitPricePlatform = decimal(product.sitePrice).minus(<number>product.price);
                profits.push({
                    type: 'platform',
                    id: null,
                    name: '平台',
                    profit: parseFloat(decimal(profitPricePlatform).times(num).toFixed(4))
                });
            }else{
                let profitPriceSite = decimal(product.getPriceByUserRole(user.role)).minus(product.sitePrice);
                profits.push({
                    type: 'site',
                    id: site.id,
                    name: site.name,
                    profit: parseFloat(decimal(profitPriceSite).times(num).toFixed(4))
                });
            }
        }
    }

    static async add(info: any, user:User, io: any) {
        let order = new OrderUser();
        await getManager().transaction(async tem => {
            let productSite = <ProductSite> await tem.createQueryBuilder()
                .select('productSite')
                .from(ProductSite, 'productSite')
                .where('productSite.id = :id', {id: info.productId})
                .leftJoinAndSelect('productSite.product', 'product')
                .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
                .leftJoinAndSelect('productTypeSite.productType', 'productType')
                .getOne();
            let productTypeSite = <ProductTypeSite>productSite.productTypeSite;
            let product = <Product>productSite.product;
            let productType = <ProductType>productSite.productTypeSite.productType;

            order.name = productTypeSite.name + ' / ' + productSite.name;
            order.type = productSite.type;
            order.speed = productSite.speed;
            order.num = info.num;
            order.price = productSite.getPriceByUserRole(user.role);
            order.totalPrice = parseFloat(decimal(order.price).times(order.num).toFixed(4));
            assert(user.funds >= order.totalPrice, '账户余额不足，请充值！');
            order.fields = {};
            for(let i = 0; i < productSite.attrs.length; i++){
                let item = productSite.attrs[i];
                order.fields[item.type] = {name: item.name, value: info[item.type]};
            }
            await COrderUser.countOrderProfits(tem, user.site, user, productSite, order.num, order.profits = []);
            if (order.type === WitchType.Platform) {
                order.basePrice = parseFloat(decimal(productSite.price).times(order.num).toFixed(4));
            }else{
                order.basePrice = parseFloat(decimal(productSite.sitePrice).times(order.num).toFixed(4));
            }
            order.user = user;
            order.site = user.site;
            order.productSite = productSite;
            order.productTypeSite = productTypeSite;
            order.productType = productType;
            order.product = product;
            order = await tem.save(order);

            let userOldFunds = user.funds;
            user.funds = parseFloat(decimal(userOldFunds).minus(order.totalPrice).toFixed(4));
            user.freezeFunds = parseFloat(decimal(user.freezeFunds).plus(order.totalPrice).toFixed(4));
            await tem.save(user);

            let consume = new FundsRecordUser();
            consume.oldFunds = userOldFunds;
            consume.funds = order.totalPrice;
            consume.newFunds = user.funds;
            consume.upOrDown = FundsUpDown.Minus;
            consume.type = FundsRecordType.Order;
            consume.description = order.name + ', 单价: ￥' + order.price + ', 下单数量: ' + order.num;
            consume.user = user;
            await tem.save(consume);

            // io发送订单到后台订单管理页面
            if (order.type === WitchType.Site) {
                io.emit(user.site.id + 'plusBadge', productSite.id);
                io.emit(user.site.id + 'addOrder', {productId: productSite.id, order: order});
            } else {
                io.emit('plusBadge', product.id);
                io.emit('addOrder', {productId: product.id, order: order});
            }
        });
        return order;
    }

    private static async getOrderInfo(tem: EntityManager, orderId: string) {
        return await tem.createQueryBuilder()
            .select('order')
            .from(OrderUser, 'order')
            .where('order.id = :id', {id: orderId})
            .leftJoinAndSelect('order.site', 'site')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.product', 'product')
            .leftJoinAndSelect('order.productSite', 'productSite')
            .getOne();
    }

    // 管理员执行订单并结算返利
    static async execute(info: any, io: any) {
        await getManager().transaction(async tem => {
            let order = <OrderUser>await COrderUser.getOrderInfo(tem, info.id);
            assert(order.status === OrderStatus.Wait, '当前订单' + order.status + ', 不可执行');
            order.status = OrderStatus.Execute;
            order.startNum = info.startNum;
            order.dealTime = now();
            let site = <Site>order.site;
            let user = <User>order.user;
            let product = <Product>order.product;
            let productSite = <ProductSite>order.productSite;

            for(let i = 0; i < order.profits.length; i++){
                let aim = order.profits[i];
                switch (aim.type) {
                    case 'user':
                        let user = <User>await tem.findOne(User, aim.id);
                        let userOldFunds = user.funds;
                        user.funds = parseFloat(decimal(userOldFunds).plus(aim.profit).toFixed(4));
                        await tem.save(user);
                        let userFundsRecord = new FundsRecordUser();
                        userFundsRecord.oldFunds = userOldFunds;
                        userFundsRecord.funds = aim.profit;
                        userFundsRecord.newFunds = user.funds;
                        userFundsRecord.upOrDown = FundsUpDown.Plus;
                        userFundsRecord.type = FundsRecordType.Profit;
                        userFundsRecord.profitUsername = order.user.username;
                        userFundsRecord.description = '下级: ' + userFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + userFundsRecord.funds;
                        userFundsRecord.user = user;
                        await tem.save(userFundsRecord);
                        // 修改用户账户金额
                        io.emit(user.id + 'changeFunds', user.funds);
                        break;
                    case 'site':
                        let siteProfitFunds = aim.profit;
                        if (order.type === WitchType.Site) {
                            siteProfitFunds = parseFloat(decimal(siteProfitFunds).plus(order.basePrice).toFixed(4));
                        }
                        let site = <Site>await tem.findOne(Site, aim.id);
                        let siteOldFunds = site.funds;
                        site.funds = parseFloat(decimal(siteOldFunds).plus(siteProfitFunds).toFixed(4));
                        await tem.save(site);
                        let siteFundsRecord = new FundsRecordSite();
                        siteFundsRecord.oldFunds = siteOldFunds;
                        siteFundsRecord.funds = siteProfitFunds;
                        siteFundsRecord.newFunds = site.funds;
                        siteFundsRecord.upOrDown = FundsUpDown.Plus;
                        siteFundsRecord.type = FundsRecordType.Profit;
                        siteFundsRecord.profitUsername = order.user.username;
                        siteFundsRecord.description = '用户: ' + siteFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + siteFundsRecord.funds;
                        if (order.type === WitchType.Site) {
                            siteFundsRecord.baseFunds = order.basePrice;
                        }
                        siteFundsRecord.site = site;
                        await tem.save(siteFundsRecord);
                        // 修改站点账户金额
                        io.emit(site.id + 'changeFunds', site.funds);
                        break;
                    case 'platform':
                        let platform = <Platform>await tem.findOne(Platform);
                        let platformOldFunds = platform.allProfit;
                        platform.allProfit = parseFloat(decimal(platformOldFunds).plus(aim.profit).toFixed(4));
                        platform.baseFunds = parseFloat(decimal(platform.baseFunds).plus(order.basePrice).toFixed(4));
                        await tem.save(platform);
                        let pFundsRecord = new FundsRecordPlatform();
                        pFundsRecord.oldFunds = platformOldFunds;
                        pFundsRecord.funds = aim.profit;
                        pFundsRecord.newFunds = platform.allProfit;
                        pFundsRecord.upOrDown = FundsUpDown.Plus;
                        pFundsRecord.type = FundsRecordType.Profit;
                        pFundsRecord.profitUsername = order.user.username;
                        pFundsRecord.description = '用户: ' + pFundsRecord.profitUsername + ', 订单: ' + order.name +
                            ' , 返利: ￥' + pFundsRecord.funds;
                        pFundsRecord.baseFunds = order.basePrice;
                        await tem.save(pFundsRecord);
                        // 修改平台金额
                        io.emit('platformChangeFunds', {baseFunds: platform.baseFunds, profit: platform.allProfit});
                        break;
                }
            }
            user.freezeFunds = parseFloat(decimal(user.freezeFunds).minus(order.totalPrice).toFixed(4));
            await tem.save(user);
            await tem.save(order);

            io.emit(user.id + 'changeFreezeFunds', user.freezeFunds);
            if (order.type === WitchType.Platform) {
                io.emit('minusBadge', product.id);
                io.emit('executeOrder', {productId: product.id, order: order})
            }else{
                io.emit(site.id + 'minusBadge', productSite.id);
                io.emit(site.id + 'executeOrder', {productId: productSite.id, order: order})
            }
            io.emit(productSite.id + 'executeOrder', order)
        });
    }

    // 管理员撤销订单并退款
    static async refund(info: any, io: any) {
        await getManager().transaction(async tem => {
            // 查询出订单信息
            let order = <OrderUser>await COrderUser.getOrderInfo(tem, info.id);
            assert(order.status !== OrderStatus.Refunded, '订单已经撤销了，不能再次撤销');
            assert(info.executeNum <= order.num, '订单执行数量不能大于下单数量');
            order.executeNum = info.executeNum;
            order.refundMsg = info.refundMsg;
            order.finishTime = now();
            let site = <Site>order.site;
            let user = <User>order.user;
            let product = <Product>order.product;
            let productSite = <ProductSite>order.productSite;

            // 如果订单未执行（即未结算）
            if (order.status === OrderStatus.Wait) {
                order.executeNum = 0;
                order.profits = [];
                order.basePrice = 0;
                let userOldFunds = user.funds;
                user.funds = parseFloat(decimal(userOldFunds).plus(order.totalPrice).toFixed(4));
                user.freezeFunds = parseFloat(decimal(user.freezeFunds).minus(order.totalPrice).toFixed(4));
                await tem.save(user);

                let userFundsRecord = new FundsRecordUser();
                userFundsRecord.oldFunds = userOldFunds;
                userFundsRecord.funds = order.totalPrice;
                userFundsRecord.newFunds = user.funds;
                userFundsRecord.upOrDown = FundsUpDown.Plus;
                userFundsRecord.type = FundsRecordType.Order;
                userFundsRecord.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                    ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                userFundsRecord.user = user;
                await tem.save(userFundsRecord);
                // 只有订单未处理时，才减少待处理信息提示
                if (order.type === WitchType.Platform) {
                    io.emit('minusBadge', product.id);
                }else{
                    io.emit(site.id + 'minusBadge', productSite.id);
                }
            }else{
                // 如果订单已结算
                // 订单退款比例
                let refundRatio = parseFloat(decimal(order.num - order.executeNum).div(order.num).toFixed(4));
                // 退款成本
                let refundBasePrice = parseFloat(decimal(order.basePrice).times(refundRatio).toFixed(4));
                // 余下的结算成本
                order.basePrice = parseFloat(decimal(order.basePrice).minus(refundBasePrice).toFixed(4));
                for(let i = 0; i < order.profits.length; i++){
                    let aim = order.profits[i];
                    // 退款返利
                    let refundProfitFunds = parseFloat(decimal(aim.profit).times(refundRatio).toFixed(4));
                    // 余下的结算返利
                    aim.profit = parseFloat(decimal(aim.profit).minus(refundProfitFunds).toFixed(4));
                    switch (aim.type) {
                        case 'user':
                            let user = <User>await tem.findOne(User, aim.id);
                            let userOldFunds = user.funds;
                            user.funds = parseFloat(decimal(userOldFunds).minus(refundProfitFunds).toFixed(4));
                            await tem.save(user);
                            let userFundsRecord = new FundsRecordUser();
                            userFundsRecord.oldFunds = userOldFunds;
                            userFundsRecord.funds = refundProfitFunds;
                            userFundsRecord.newFunds = user.funds;
                            userFundsRecord.upOrDown = FundsUpDown.Minus;
                            userFundsRecord.type = FundsRecordType.Profit;
                            userFundsRecord.profitUsername = order.user.username;
                            userFundsRecord.description = '下级: ' + userFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' 撤销, 退款: ￥' + userFundsRecord.funds;
                            userFundsRecord.user = user;
                            await tem.save(userFundsRecord);
                            // 修改用户账户金额
                            io.emit(user.id + 'changeFunds', user.funds);
                            break;
                        case 'site':
                            if (order.type === WitchType.Site) {
                                refundProfitFunds = parseFloat(decimal(refundProfitFunds).plus(refundBasePrice).toFixed(4));
                            }
                            let site = <Site>await tem.findOne(Site, aim.id);
                            let siteOldFunds = site.funds;
                            site.funds = parseFloat(decimal(siteOldFunds).minus(refundProfitFunds).toFixed(4));
                            await tem.save(site);
                            let siteFundsRecord = new FundsRecordSite();
                            siteFundsRecord.oldFunds = siteOldFunds;
                            siteFundsRecord.funds = refundProfitFunds;
                            siteFundsRecord.newFunds = site.funds;
                            siteFundsRecord.upOrDown = FundsUpDown.Minus;
                            siteFundsRecord.type = FundsRecordType.Profit;
                            siteFundsRecord.profitUsername = order.user.username;
                            siteFundsRecord.description = '用户: ' + siteFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' 撤销, 退款: ￥' + siteFundsRecord.funds;
                            if (order.type === WitchType.Site) {
                                siteFundsRecord.baseFunds = refundBasePrice;
                            }
                            siteFundsRecord.site = site;
                            await tem.save(siteFundsRecord);
                            // 修改站点账户金额
                            io.emit(site.id + 'changeFunds', site.funds);
                            break;
                        case 'platform':
                            let platform = <Platform>await tem.findOne(Platform);
                            let platformOldFunds = platform.allProfit;
                            platform.allProfit = parseFloat(decimal(platformOldFunds).minus(refundProfitFunds).toFixed(4));
                            platform.baseFunds = parseFloat(decimal(platform.baseFunds).minus(refundBasePrice).toFixed(4));
                            await tem.save(platform);
                            let pFundsRecord = new FundsRecordPlatform();
                            pFundsRecord.oldFunds = platformOldFunds;
                            pFundsRecord.funds = refundProfitFunds;
                            pFundsRecord.newFunds = platform.allProfit;
                            pFundsRecord.upOrDown = FundsUpDown.Minus;
                            pFundsRecord.type = FundsRecordType.Profit;
                            pFundsRecord.profitUsername = order.user.username;
                            pFundsRecord.description = '用户: ' + pFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' 撤销, 退款: ￥' + pFundsRecord.funds;
                            pFundsRecord.baseFunds = refundBasePrice;
                            await tem.save(pFundsRecord);
                            // 修改平台金额
                            io.emit('platformChangeFunds', {baseFunds: platform.baseFunds, profit: platform.allProfit});
                            break;
                    }
                }

                let userRefundPrice = parseFloat(decimal(order.totalPrice).times(refundRatio).toFixed(4));
                let userOldFunds = user.funds;
                user.funds = parseFloat(decimal(userOldFunds).plus(userRefundPrice).toFixed(4));
                await tem.save(user);

                let userFundsRecord = new FundsRecordUser();
                userFundsRecord.oldFunds = userOldFunds;
                userFundsRecord.funds = userRefundPrice;
                userFundsRecord.newFunds = user.funds;
                userFundsRecord.upOrDown = FundsUpDown.Plus;
                userFundsRecord.type = FundsRecordType.Order;
                userFundsRecord.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                    ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                userFundsRecord.user = user;
                await tem.save(userFundsRecord);
            }
            order.status = OrderStatus.Refunded;
            await tem.save(order);

            // 修改订单所属用户账户金额
            io.emit(user.id + 'changeFundsAndFreezeFunds', {funds: user.funds, freezeFunds: user.freezeFunds});
            if (order.type === WitchType.Platform) {
                io.emit('refundOrder', {productId: product.id, order: order})
            }else{
                io.emit(site.id + 'refundOrder', {productId: productSite.id, order: order})
            }
            // 修改用户订单信息
            io.emit(productSite.id + 'refundOrder', order)
        });
    }

    // 用户申请撤单
    static async applyRefund(info: any, io: any) {
        return await getManager().transaction(async tem => {
            let order = <OrderUser>await COrderUser.getOrderInfo(tem, info.id);
            assert((order.status === OrderStatus.Wait || order.status === OrderStatus.Execute),
                '当前订单状态为: ' + order.status + ' ，不能申请撤销');
            let site = <Site>order.site;
            let user = <User>order.user;
            let product = <Product>order.product;
            let productSite = <ProductSite>order.productSite;

            if (order.status === OrderStatus.Wait) {
                order.executeNum = 0;
                order.status = OrderStatus.Refunded;
                order.refundMsg = '未开始执行，用户撤销。';
                order.finishTime = now();
                order.profits = [];
                order.basePrice = 0;
                await tem.save(order);
                let userOldFunds = user.funds;
                user.funds = parseFloat(decimal(userOldFunds).plus(order.totalPrice).toFixed(4));
                user.freezeFunds = parseFloat(decimal(user.freezeFunds).minus(order.totalPrice).toFixed(4));
                user = await tem.save(user);

                let consume = new FundsRecordUser();
                consume.oldFunds = userOldFunds;
                consume.funds = order.totalPrice;
                consume.newFunds = user.funds;
                consume.upOrDown = FundsUpDown.Plus;
                consume.type = FundsRecordType.Order;
                consume.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                    ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                consume.user = user;
                await tem.save(consume);

                // io发送订单到后台订单管理页面
                if (order.type === WitchType.Site) {
                    io.emit(site.id + 'minusBadge', productSite.id);
                    io.emit(site.id + 'refundOrder', {productId: productSite.id, order: order});
                } else {
                    io.emit('minusBadge', product.id);
                    io.emit('refundOrder', {productId: product.id, order: order});
                }
                return order;
            } else {
                order.status = OrderStatus.Refund;
                order = await tem.save(order);

                let error = new ErrorOrderUser();
                error.type = order.type;
                error.content = '用户申请撤销订单';
                error.order = order;
                error.site = site;
                error = await tem.save(error);

                // 发送订单报错到后台页面
                if (error.type === WitchType.Site) {
                    io.emit(site.id + 'plusBadge', 'orderErrorSite');
                    io.emit(site.id + 'addOrderError', error);
                } else {
                    io.emit('plusBadge', 'orderErrorPlatform');
                    io.emit('addOrderError', error);
                }
                return order;
            }
        });
    }

    static async addError(info: any, io: any) {
        let {orderId, content} = info;
        let order = <OrderUser>await OrderUser.findByIdWithSite(orderId);
        let error = new ErrorOrderUser();
        error.type = order.type;
        error.content = content;
        error.order = order;
        error.site = order.site;
        error = await error.save();

        // 发送订单报错到后台页面
        if (error.type === WitchType.Site) {
            io.emit(error.site.id + 'plusBadge', 'orderErrorSite');
            io.emit(error.site.id + 'addOrderError', error);
        } else {
            io.emit('plusBadge', 'orderErrorPlatform');
            io.emit('addOrderError', error);
        }
    }

    static async getErrors(orderId: string) {
        return await ErrorOrderUser.allByOrderId(orderId);
    }

    static async seeErrors(orderId: string) {
        await OrderUser.update(orderId, {newErrorDeal: false});
    }
}
