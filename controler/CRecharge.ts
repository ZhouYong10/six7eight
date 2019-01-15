import {Recharge, RechargeState, RechargeType, RechargeWay} from "../entity/Recharge";
import {getManager} from "typeorm";
import {User} from "../entity/User";
import {Site} from "../entity/Site";
import {assert, decimal, isInteger, now, today, todayNum} from "../utils";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordType, FundsUpDown} from "../entity/FundsRecordBase";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {UserSite} from "../entity/UserSite";
import {MessageTitle} from "../entity/MessageBase";
import {MessageUser} from "../entity/MessageUser";
import {MessageUserSite} from "../entity/MessageUserSite";


export class CRecharge {

    static async dayRechargeOfUser(userId: string, date: string) {
        return await Recharge.dayRechargeOfUser(userId, date);
    }

    // 根据日期获取充值金额
    static async platRechargeOfDay(date: string) {
        return await Recharge.platRechargeOfDay(date);
    }

    static async getWaitCount() {
        return await Recharge.getWaitCount();
    }

    static async findByIdSite(id: string) {
        return await Recharge.findById(id);
    }

    static async findByIdUser(id: string) {
        return await Recharge.findByIdOnlyRecharge(id);
    }

    static async findByAlipayId(info:any) {
        let recharge = await Recharge.findHandCommited(info.alipayId);
        return !!recharge;
    }

    // 自动充值
    static async yiZhiFuAutoRecharge(info: { alipayId: string, money: number, uid: string }, io: any) {
        return await getManager().transaction(async tem => {
            //通过交易号查找充值记录
            let recharge = <Recharge> await tem.findOne(Recharge,
                {alipayId: info.alipayId},
                {relations: ["site", "user", "userSite"]}
            );
            // 判断充值记录是否存在，如果存在
            if (recharge) {
                // 充值记录存在，判断是自动提交的还是手动提交的
                if (recharge.way === RechargeWay.Hand) {
                    // 手动提交的充值记录
                    //判断是否已经充值
                    if (recharge.state === RechargeState.Wait) {
                        //未充值
                        recharge.intoAccountTime = now();
                        recharge.funds = info.money;
                        recharge.state = RechargeState.Success;
                        //判断是用户充值还是站点充值
                        if (recharge.type === RechargeType.User) {
                            // 用户充值
                            let user = <User>recharge.user;
                            let userOldFunds = user.funds;
                            user.funds = parseFloat(decimal(user.funds).plus(<number>recharge.funds).toFixed(4));
                            recharge.oldFunds = userOldFunds;
                            recharge.newFunds = user.funds;
                            recharge = await tem.save(recharge);
                            user = await tem.save(user);

                            let fundsRecord = new FundsRecordUser();
                            fundsRecord.oldFunds = userOldFunds;
                            fundsRecord.funds = <number>recharge.funds;
                            fundsRecord.newFunds = user.funds;
                            fundsRecord.upOrDown = FundsUpDown.Plus;
                            fundsRecord.type = FundsRecordType.Recharge;
                            fundsRecord.description = '账户充值： ￥ ' + info.money;
                            fundsRecord.user = user;
                            await tem.save(fundsRecord);

                            let message = new MessageUser();
                            message.user = user;
                            message.title = MessageTitle.Recharge;
                            message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                            message.frontUrl = '/recharge/records';
                            message.aimId = recharge.id;
                            await tem.save(message);
                            // 发送消息提示用户
                            io.emit(user.id + 'changeFunds', user.funds);
                            io.emit('platformRechargeDeal', recharge);
                            io.emit('minusBadge', 'rechargesPlatform');
                            io.emit(user.id + 'plusMessageNum');
                        } else if (recharge.type === RechargeType.Site) {
                            // 站点充值
                            let site = <Site>recharge.site;
                            let siteOldFunds = site.funds;
                            site.funds = parseFloat(decimal(<number>recharge.funds).plus(site.funds).toFixed(4));
                            recharge.oldFunds = siteOldFunds;
                            recharge.newFunds = site.funds;
                            recharge = await tem.save(recharge);
                            site = await tem.save(site);

                            let userSite = <UserSite>recharge.userSite;
                            let fundsRecord = new FundsRecordSite();
                            fundsRecord.oldFunds = siteOldFunds;
                            fundsRecord.funds = <number>recharge.funds;
                            fundsRecord.newFunds = site.funds;
                            fundsRecord.upOrDown = FundsUpDown.Plus;
                            fundsRecord.type = FundsRecordType.Recharge;
                            fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                            fundsRecord.site = site;
                            fundsRecord.userSite = <UserSite>userSite;
                            await tem.save(fundsRecord);

                            let message = new MessageUserSite();
                            message.user = userSite;
                            message.title = MessageTitle.Recharge;
                            message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                            message.frontUrl = '/home/recharge/records';
                            message.aimId = recharge.id;
                            await tem.save(message);
                            // 发送消息提示到用户
                            io.emit(site.id + 'changeFunds', site.funds);
                            io.emit('minusBadge', 'rechargesPlatform');
                            io.emit('platformRechargeDeal', recharge);
                            io.emit(userSite.id + 'plusMessageNum');
                        }
                    } else {
                        // 已经充值
                        return;
                    }
                } else {
                    // 自动提交的充值记录
                    return;
                }
            } else {
                let recharge = new Recharge();
                recharge.alipayId = info.alipayId;
                recharge.funds = info.money;
                recharge.way = RechargeWay.Auto;
                //充值记录不存在，获取备注信息
                let userOrSiteName = info.uid;
                //判断是否有备注信息
                if (userOrSiteName) {
                    //有备注信息，判断是站点充值还是用户充值
                    let isSite = userOrSiteName.search('/');
                    if (isSite != -1) {
                        //站点充值，拆分站点名称和管理员名称
                        let names = userOrSiteName.split('/');
                        let siteName = names[0];
                        let adminName = names[1];
                        //通过站点名查找站点，通过管理员名称查询管理员
                        let site = <Site>await tem.findOne(Site, {name: siteName});
                        let userSite = <UserSite>await tem.findOne(UserSite, {username: adminName});
                        //判断站点和管理员是否存在
                        if (site && userSite) {
                            //存在
                            let siteOldFunds = site.funds;
                            site.funds = parseFloat(decimal(site.funds).plus(<number>recharge.funds).toFixed(4));
                            recharge.intoAccountTime = now();
                            recharge.oldFunds = siteOldFunds;
                            recharge.newFunds = site.funds;
                            recharge.state = RechargeState.Success;
                            recharge.type = RechargeType.Site;
                            recharge.userSite = userSite;
                            recharge.site = site;
                            recharge = await tem.save(recharge);
                            site = await tem.save(site);

                            let fundsRecord = new FundsRecordSite();
                            fundsRecord.oldFunds = siteOldFunds;
                            fundsRecord.funds = <number>recharge.funds;
                            fundsRecord.newFunds = site.funds;
                            fundsRecord.upOrDown = FundsUpDown.Plus;
                            fundsRecord.type = FundsRecordType.Recharge;
                            fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                            fundsRecord.site = site;
                            fundsRecord.userSite = <UserSite>userSite;
                            await tem.save(fundsRecord);

                            let message = new MessageUserSite();
                            message.user = userSite;
                            message.title = MessageTitle.Recharge;
                            message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                            message.frontUrl = '/home/recharge/records';
                            message.aimId = recharge.id;
                            await tem.save(message);
                            // 发送消息提示到用户
                            io.emit(site.id + 'changeFunds', site.funds);
                            io.emit(userSite.id + 'plusMessageNum');
                        } else {
                            //不存在（备注有误）
                            await tem.save(recharge);
                        }
                    } else {
                        //用户充值，通过用户名查找账户
                        let user = <User>await tem.createQueryBuilder()
                            .select('user')
                            .from(User, 'user')
                            .where('user.username = :username', {username: userOrSiteName})
                            .leftJoinAndSelect('user.site', 'site')
                            .getOne();
                        //判断账户是否存在
                        if (user) {
                            //账户存在
                            let userOldFunds = user.funds;
                            user.funds = parseFloat(decimal(user.funds).plus(<number>recharge.funds).toFixed(4));
                            recharge.intoAccountTime = now();
                            recharge.oldFunds = userOldFunds;
                            recharge.newFunds = user.funds;
                            recharge.state = RechargeState.Success;
                            recharge.type = RechargeType.User;
                            recharge.user = user;
                            recharge.site = user.site;
                            recharge = await tem.save(recharge);
                            await tem.save(user);

                            let fundsRecord = new FundsRecordUser();
                            fundsRecord.oldFunds = userOldFunds;
                            fundsRecord.funds = <number>recharge.funds;
                            fundsRecord.newFunds = user.funds;
                            fundsRecord.upOrDown = FundsUpDown.Plus;
                            fundsRecord.type = FundsRecordType.Recharge;
                            fundsRecord.description = '账户充值： ￥ ' + recharge.funds;
                            fundsRecord.user = user;
                            await tem.save(fundsRecord);

                            let message = new MessageUser();
                            message.user = user;
                            message.title = MessageTitle.Recharge;
                            message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                            message.frontUrl = '/recharge/records';
                            message.aimId = recharge.id;
                            await tem.save(message);
                            // 发送消息提示用户
                            io.emit(user.id + 'changeFunds', user.funds);
                            io.emit(user.id + 'plusMessageNum');
                        } else {
                            //账户不存在（备注有误）
                            await tem.save(recharge);
                        }
                    }
                } else {
                    //没有备注信息，直接保存一条自动充值记录
                    await tem.save(recharge);
                }
            }
        });
    }

    // 用户手动充值
    static async addOrRecharge(info: any, io: any) {
        let {alipayId, type, way, user, userSite, site} = info;
        assert(alipayId.length == 32 && isInteger(alipayId), '请输入32位数字支付宝充值交易号');
        assert(parseInt(alipayId.substr(0, 8)) - todayNum() >= 0, '该交易号已经过期');
        assert(!await Recharge.findHandCommited(alipayId), '该交易号已提交，请勿重复提交');
        let recharge = <Recharge>await Recharge.findAutoCommited(alipayId);
        // 如果自动抓取的未充值记录已经存在，则充值
        if (recharge) {
            // 给用户充值
            if (type === RechargeType.User) {
                await getManager().transaction(async tem => {
                    let userOldFunds = user.funds;
                    user.funds = parseFloat(decimal(user.funds).plus(<number>recharge.funds).toFixed(4));

                    recharge.intoAccountTime = now();
                    recharge.oldFunds = userOldFunds;
                    recharge.newFunds = user.funds;
                    recharge.state = RechargeState.Success;
                    recharge.type = RechargeType.User;
                    recharge.user = user;
                    recharge.site = site;
                    recharge = await tem.save(recharge);
                    user = await tem.save(user);

                    let fundsRecord = new FundsRecordUser();
                    fundsRecord.oldFunds = userOldFunds;
                    fundsRecord.funds = <number>recharge.funds;
                    fundsRecord.newFunds = user.funds;
                    fundsRecord.upOrDown = FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordType.Recharge;
                    fundsRecord.description = '账户充值： ￥ ' + recharge.funds;
                    fundsRecord.user = user;
                    await tem.save(fundsRecord);

                    let message = new MessageUser();
                    message.user = user;
                    message.title = MessageTitle.Recharge;
                    message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                    message.frontUrl = '/recharge/records';
                    message.aimId = recharge.id;
                    await tem.save(message);
                    // 发送消息提示用户
                    io.emit(user.id + 'changeFunds', user.funds);
                    io.emit(user.id + 'plusMessageNum');
                });
            } else if (type === RechargeType.Site) {
                // 给站点充值
                await getManager().transaction(async tem => {
                    let siteOldFunds = site.funds;
                    site.funds = parseFloat(decimal(site.funds).plus(<number>recharge.funds).toFixed(4));

                    recharge.intoAccountTime = now();
                    recharge.oldFunds = siteOldFunds;
                    recharge.newFunds = site.funds;
                    recharge.state = RechargeState.Success;
                    recharge.type = RechargeType.Site;
                    recharge.userSite = userSite;
                    recharge.site = site;
                    recharge = await tem.save(recharge);
                    site = await tem.save(site);

                    let fundsRecord = new FundsRecordSite();
                    fundsRecord.oldFunds = siteOldFunds;
                    fundsRecord.funds = <number>recharge.funds;
                    fundsRecord.newFunds = site.funds;
                    fundsRecord.upOrDown = FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordType.Recharge;
                    fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                    fundsRecord.site = site;
                    fundsRecord.userSite = <UserSite>userSite;
                    await tem.save(fundsRecord);

                    let message = new MessageUserSite();
                    message.user = userSite;
                    message.title = MessageTitle.Recharge;
                    message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                    message.frontUrl = '/home/recharge/records';
                    message.aimId = recharge.id;
                    await tem.save(message);
                    // 发送消息提示到用户
                    io.emit(site.id + 'changeFunds', site.funds);
                    io.emit(userSite.id + 'plusMessageNum');
                });
            }
        } else {
            // 如果自动抓取的未充值记录不存在，则保存一条手动未充值记录
            recharge = new Recharge();
            recharge.alipayId = alipayId;
            recharge.type = type;
            recharge.way = way;
            recharge.user = user;
            recharge.userSite = userSite;
            recharge.site = site;
            recharge = await recharge.save();
            io.emit('plusBadge', 'rechargesPlatform');
        }
        // 将充值记录发送到平台充值记录
        io.emit('platformRechargeAdd', recharge);
        return recharge;
    }

    // 平台手动处理充值
    static async handRecharge(info: any, io: any) {
        let {id, funds} = info;
        let recharge = <Recharge>await Recharge.findById(id);
        assert(recharge.state === RechargeState.Wait, '当前充值已经处理了');
        let type = recharge.type;

        // 给用户充值
        if (type === RechargeType.User) {
            await getManager().transaction(async tem => {
                let user = <User>recharge.user;
                let userNewFunds:number = parseFloat(decimal(funds).plus(user.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = user.funds;
                recharge.newFunds = userNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);

                await tem.update(User, user.id, {funds: userNewFunds});

                let fundsRecord = new FundsRecordUser();
                fundsRecord.oldFunds = user.funds;
                fundsRecord.funds = funds;
                fundsRecord.newFunds = userNewFunds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Recharge;
                fundsRecord.description = '账户充值： ￥ ' + funds;
                fundsRecord.user = user;
                await tem.save(fundsRecord);

                io.emit(user.id + 'changeFunds', userNewFunds);
                io.emit('platformRechargeDeal', recharge);
                io.emit('minusBadge', 'rechargesPlatform');

                let message = new MessageUser();
                message.user = user;
                message.title = MessageTitle.Recharge;
                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                message.frontUrl = '/recharge/records';
                message.aimId = recharge.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(user.id + 'plusMessageNum');
            });
        }else if (type === RechargeType.Site) {
            // 给站点充值
            return await getManager().transaction(async tem => {
                let site = <Site>recharge.site;
                let siteNewFunds: number = parseFloat(decimal(funds).plus(site.funds).toFixed(4));
                recharge.intoAccountTime = now();
                recharge.funds = funds;
                recharge.oldFunds = site.funds;
                recharge.newFunds = siteNewFunds;
                recharge.state = RechargeState.Success;
                recharge = await tem.save(recharge);

                await tem.update(Site, site.id, {funds: siteNewFunds});

                let userSite = <UserSite>recharge.userSite;
                let fundsRecord = new FundsRecordSite();
                fundsRecord.oldFunds = site.funds;
                fundsRecord.funds = funds;
                fundsRecord.newFunds = siteNewFunds;
                fundsRecord.upOrDown = FundsUpDown.Plus;
                fundsRecord.type = FundsRecordType.Recharge;
                fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + funds;
                fundsRecord.site = site;
                fundsRecord.userSite = <UserSite>recharge.userSite;
                await tem.save(fundsRecord);

                io.emit(site.id + 'changeFunds', siteNewFunds);
                io.emit('minusBadge', 'rechargesPlatform');
                io.emit('platformRechargeDeal', recharge);

                let message = new MessageUserSite();
                message.user = userSite;
                message.title = MessageTitle.Recharge;
                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                message.frontUrl = '/home/recharge/records';
                message.aimId = recharge.id;
                await tem.save(message);
                // 发送消息提示到用户
                io.emit(userSite.id + 'plusMessageNum');
            });
        }
    }

    static async handRechargeFail(info: any, io:any) {
        let {id, failMsg} = info;
        let recharge = <Recharge>await Recharge.findById(id);
        assert(recharge.state === RechargeState.Wait, '当前充值已经处理了');
        recharge.intoAccountTime = now();
        recharge.failMsg = failMsg;
        recharge.state = RechargeState.Fail;
        recharge = await recharge.save();
        io.emit('minusBadge', 'rechargesPlatform');
        io.emit('platformRechargeFail', recharge);

        if (recharge.type === RechargeType.User) {
            let message = new MessageUser();
            message.user = <User>recharge.user;
            message.title = MessageTitle.RechargeError;
            message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
            message.frontUrl = '/recharge/records';
            message.aimId = recharge.id;
            await message.save();
            // 发送消息提示到用户
            io.emit(recharge.user!.id + 'plusMessageNum');
        }else{
            let message = new MessageUserSite();
            message.user = <UserSite>recharge.userSite;
            message.title = MessageTitle.RechargeError;
            message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
            message.frontUrl = '/home/recharge/records';
            message.aimId = recharge.id;
            await message.save();
            // 发送消息提示到用户
            io.emit(recharge.userSite!.id + 'plusMessageNum');
        }
    }

    static async all(page: any) {
        return await Recharge.all(page);
    }

    static async userAll(userId:string, page:any) {
        return await Recharge.userAllRecords(userId, page)
    }

    static async siteAll(siteId:string, page:any) {
        return await Recharge.siteAllRecords(siteId, page)
    }

}