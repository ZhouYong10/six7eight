import {ProductType} from "../entity/ProductType";
import {getManager} from "typeorm";
import {Site} from "../entity/Site";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {types} from "util";
import {WitchType} from "../entity/ProductTypeBase";


export class CProductTypes {
    static async getAll() {
        return await ProductType.getAll();
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await ProductType.update(id, {onSale: !onSale});
    }

    static async findByName(name: string) {
        return await ProductType.findByName(name);
    }

    private static async editInfo(type: ProductType, info: any) {
        type.name = info.name;
        type.onSale = info.onSale;

        return await type.save();
    }

    static async add(info: any) {
        let type = new ProductType();
        type.name = info.name;
        type.onSale = info.onSale;
        await getManager().transaction(async tem => {
            type = await type.save();
            let sites = await Site.all();
            if (sites.length > 0) {
                for(let i = 0; i < sites.length; i++){
                    let site = sites[i];
                    let typeSite = new ProductTypeSite();
                    typeSite.type = WitchType.Platform;
                    typeSite.name = type.name;
                    typeSite.onSale = type.onSale;
                    typeSite.productType = type;
                    typeSite.site = site;
                    typeSite = await typeSite.save();
                }
            }
        });
        return type;
    }

    static async update(info: any) {
        return await CProductTypes.editInfo(<ProductType>await ProductType.findById(info.id), info);
    }

    static async delById(id: string) {
        return await ProductType.delById(id);
    }
}
