import {Site} from "../entity/Site";
import {RightSite} from "../entity/RightSite";
import {RoleType, RoleUser} from "../entity/RoleUser";
import {RightUser} from "../entity/RightUser";
import {getManager} from "typeorm";
import {RoleUserSite} from "../entity/RoleUserSite";
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

    private static async editInfo(site: Site, info: any) {
        site.name = info.name;
        site.address = info.address;
        site.phone = info.phone;
        site.weixin = info.weixin;
        site.qq = info.qq;
        site.email = info.email;

        return await site.save();
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

            // 创建分站用户角色
            let roleRights = [await RightUser.findTrees(), await RightUser.getAllLeaf()];
            let roleGold = new RoleUser();
            roleGold.name = '金牌代理';
            roleGold.type = RoleType.Gold;
            roleGold.rights = roleRights;
            roleGold.site = site;
            await tem.save(roleGold);

            let roleSuper = new RoleUser();
            roleSuper.name = '超级代理';
            roleSuper.type = RoleType.Super;
            roleSuper.rights = roleRights;
            roleSuper.site = site;
            await tem.save(roleSuper);

            let roleTop = new RoleUser();
            roleTop.name = '顶级代理';
            roleTop.type = RoleType.Top;
            roleTop.rights = roleRights;
            roleTop.site = site;
            await tem.save(roleTop);

            // 创建分站管理员角色
            let roleAdmin = new RoleUserSite();
            roleAdmin.name = '系统管理员';
            roleAdmin.rights = [await RightSite.findTrees(), await RightSite.getAllLeaf()];
            roleAdmin.site = site;
            roleAdmin = await tem.save(roleAdmin);

            // 创建分站管理员
            let admin = new UserSite();
            admin.username = info.username;
            admin.password = '1234';
            admin.role = roleAdmin;
            admin.site = site;
            await tem.save(admin);

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

                if (products) {
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
                        productSite.onSale = product.onSale;
                        productSite.minNum = product.minNum;
                        productSite.attrs = product.attrs;
                        productSite.product = product;
                        productSite.site = site;
                        productSite.productTypeSite = productTypeSite;
                        await tem.save(productSite);
                    }
                }
            }
        });

        return site;
    }

    static async update(info: any) {
        return await CSite.editInfo(<Site>await Site.findById(info.id), info);
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