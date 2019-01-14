import {Site, SiteState} from "../entity/Site";
import {RightSite} from "../entity/RightSite";
import {RoleType, RoleUser} from "../entity/RoleUser";
import {RightUser} from "../entity/RightUser";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {UserSite} from "../entity/UserSite";
import {ProductType} from "../entity/ProductType";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ProductSite} from "../entity/ProductSite";
import {WitchType} from "../entity/ProductTypeBase";
import {assert} from "../utils";

export class CSite {

    // 获取分站信息，用于统计分站数据
    static async statisticsSites() {
        return await Site.statisticsSites();
    }

    static async allSites() {
        return await Site.getAllSites();
    }

    static async all(page:any) {
        return await Site.getAll(page);
    }

    static async findById(id:string) {
        return await Site.findById(id);
    }

    static async findByName(name: string) {
        let site = await Site.findByName(name);
        return !!site;
    }

    static async findByAddress(address: string) {
        return await Site.findByAddress(address);
    }

    static async add(info: any) {
        assert(info.name.search('/') == -1, '站点名中不能包含特殊字符“/”');
        assert(info.username.search('/') == -1, '管理员账户名中不能包含特殊字符“/”');
        let site = new Site();
        site.name = info.name;
        site.address = info.address;
        site.remark = info.remark;
        site.goldUpPrice = 100;
        site.superUpPrice = 200;
        site.upperRatio = 0.5;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;
        await getManager().transaction(async tem => {
            // 创建站点
            site = await tem.save(site);

            // 创建分站管理员角色
            let adminRights = await RightSite.getAllPermissions();
            let roleAdmin = new RoleUserSite();
            roleAdmin.type = RoleUserSiteType.Site;
            roleAdmin.name = '系统管理员';
            roleAdmin.editRights = adminRights;
            roleAdmin.rights = adminRights;
            roleAdmin.site = site;
            roleAdmin.productTypes = [];
            roleAdmin.products = [];

            // 创建分站商品类别和类别下商品
            let productTypes = await tem.createQueryBuilder()
                .select('productType')
                .from(ProductType, 'productType')
                .leftJoinAndSelect('productType.products', 'products')
                .getMany();

            for(let i = 0; i < productTypes.length; i++){
                let productType = productTypes[i];
                let products = productType.products;
                let productTypeSite = new ProductTypeSite();
                productTypeSite.type = WitchType.Platform;
                productTypeSite.name = productType.name;
                productTypeSite.createUser = productType.createUser;
                productTypeSite.onSale = productType.onSale;
                productTypeSite.productType = productType;
                productTypeSite.site = site;
                productTypeSite = await tem.save(productTypeSite);

                roleAdmin.addProductTypeToRights(productTypeSite.id);

                if (products && products.length > 0) {
                    for(let j = 0; j < products.length; j++){
                        let product = products[j];
                        let productSite = new ProductSite();
                        productSite.type = WitchType.Platform;
                        productSite.name = product.name;
                        productSite.createUser = product.createUser;
                        productSite.price = product.price;
                        productSite.sitePrice = product.sitePrice;
                        productSite.topPrice = product.topPrice;
                        productSite.superPrice = product.superPrice;
                        productSite.goldPrice = product.goldPrice;
                        productSite.orderTip = product.orderTip;
                        productSite.onSale = product.onSale;
                        productSite.minNum = product.minNum;
                        productSite.speed = product.speed;
                        productSite.attrs = product.attrs;
                        productSite.product = product;
                        productSite.site = site;
                        productSite.productTypeSite = productTypeSite;
                        productSite = await tem.save(productSite);

                        roleAdmin.addProductToRights(productTypeSite.id, productSite.id);
                    }
                }
            }

            roleAdmin = await tem.save(roleAdmin);

            // 创建分站管理员
            let admin = new UserSite();
            admin.username = info.username;
            admin.password = '1234';
            admin.site = site;
            admin.role = roleAdmin;
            await tem.save(admin);

            // 创建分站用户角色
            let roleRights = await RightUser.getAllPermissions();
            let roleGold = new RoleUser();
            roleGold.name = '三级代理';
            roleGold.type = RoleType.Gold;
            roleGold.editRights = roleRights;
            roleGold.rights = roleRights;
            roleGold.site = site;
            await tem.save(roleGold);

            let roleSuper = new RoleUser();
            roleSuper.name = '二级代理';
            roleSuper.type = RoleType.Super;
            roleSuper.editRights = roleRights;
            roleSuper.rights = roleRights;
            roleSuper.site = site;
            await tem.save(roleSuper);

            let roleTop = new RoleUser();
            roleTop.name = '一级代理';
            roleTop.type = RoleType.Top;
            roleTop.editRights = roleRights;
            roleTop.rights = roleRights;
            roleTop.site = site;
            await tem.save(roleTop);
        });

        return site;
    }

    static async changeState(info: any, io: any) {
        let site = <Site>await Site.findById(info.id);
        site.setState = info.state;
        site = await site.save();

        if (site.getState === SiteState.Ban) {
            io.emit(site.id + 'siteIsBan');
        }
        // 更新平台分站管理页面的状态
        io.emit('mgSiteChangeState', {id: site.id, state: site.getState});
    }

    static async update(info: any, io: any) {
        assert(info.name.search('/') == -1, '站点名中不能包含特殊字符“/”');
        let site = <Site>await Site.findById(info.id);
        site.name = info.name;
        site.address = info.address;
        site.remark = info.remark;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;
        site = await site.save();
        // 发送更新到页面
        io.emit(site.id + 'updateSiteName', site.name);
        return true;
    }

    static async updateInfo(info: any, io:any) {
        let site = <Site>await Site.findById(info.id);
        if (info.name !== site.name) {
            // 更新分站名称
            io.emit(site.id + 'updateSiteName', info.name);
        }
        if (info.canRegister !== site.canRegister) {
            // 更新分站是否开放注册
            io.emit(site.id + 'changeCanSiteRegister', info.canRegister);
        }
        site.name = info.name;
        site.canRegister = info.canRegister;
        site.goldUpPrice = info.goldUpPrice;
        site.superUpPrice = info.superUpPrice;
        site.upperRatio = info.upperRatio;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;
        site.seoKey = info.seoKey;
        site.description = info.description;
        await site.save();
    }
}