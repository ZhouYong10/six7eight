import {Site} from "../entity/Site";
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

export class CSite {

    static async all() {
        return await Site.getAll();
    }

    static async findById(id:string) {
        return await Site.findById(id);
    }

    static async findByName(name: string) {
        return await Site.findByName(name);
    }

    static async findByAddress(address: string) {
        return await Site.findByAddress(address);
    }

    static async add(info: any) {
        let site = new Site();
        site.name = info.name;
        site.address = info.address;
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
                        productSite.price = product.price;
                        productSite.sitePrice = product.sitePrice;
                        productSite.topPrice = product.topPrice;
                        productSite.superPrice = product.superPrice;
                        productSite.goldPrice = product.goldPrice;
                        productSite.orderTip = product.orderTip;
                        productSite.onSale = product.onSale;
                        productSite.minNum = product.minNum;
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
            admin.role = roleAdmin;
            admin.site = site;
            await tem.save(admin);

            // 创建分站用户角色
            let roleRights = await RightUser.getAllPermissions();
            let roleGold = new RoleUser();
            roleGold.name = '金牌代理';
            roleGold.type = RoleType.Gold;
            roleGold.editRights = roleRights;
            roleGold.rights = roleRights;
            roleGold.site = site;
            await tem.save(roleGold);

            let roleSuper = new RoleUser();
            roleSuper.name = '超级代理';
            roleSuper.type = RoleType.Super;
            roleSuper.editRights = roleRights;
            roleSuper.rights = roleRights;
            roleSuper.site = site;
            await tem.save(roleSuper);

            let roleTop = new RoleUser();
            roleTop.name = '顶级代理';
            roleTop.type = RoleType.Top;
            roleTop.editRights = roleRights;
            roleTop.rights = roleRights;
            roleTop.site = site;
            await tem.save(roleTop);
        });

        return site;
    }

    static async update(info: any, io: any) {
        let site = <Site>await Site.findById(info.id);
        site.name = info.name;
        site.address = info.address;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;
        site = await site.save();
        // 发送更新到页面
        io.emit(site.id + 'updateSiteName', site.name);
    }

    static async updateInfo(info: any) {
        let site = <Site>await Site.findById(info.id);
        site.name = info.name;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;
        site.seoKey = info.seoKey;
        site.description = info.description;

        return await site.save();
    }
}