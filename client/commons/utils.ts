import axios, {AxiosRequestConfig} from "axios";
import * as pako from "pako";
import {devConf} from "../../config";
import {Message} from "element-ui";
import window from "@/window";

export enum StorageKey{
    platform = 'platform-info',
    site = 'site-info',
    user = 'user-info'
}

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Message.warning('访问超时！');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    res => {
        let url = res.config.url;
        if (url && url.search(/\/logined$/) != -1) {
            return res;
        }else {
            if (res.data.successed) {
                return res.data.data;
            }else{
                Message({
                    message: res.data.msg,
                    type: 'error',
                    duration: 5000,
                    showClose: true
                });
                return ;
            }
        }
    },
    error => {
        Message.error('未知错误，请联系系统管理员！');
        return Promise.reject(error);
    }
);

export function zip(info: any) {
    return pako.deflate(JSON.stringify(info), {to: "string"})
}

export function unzip(info: string) {
    return JSON.parse(pako.inflate(info, {to: "string"}))
}

export function pageChangeMsg(msg: string) {
    Message({
        message: msg,
        type: 'error',
        duration: 10000,
        showClose: true
    });
}

export function host(path = '') {
    const host = devConf.serveHost + ':' + devConf.servePort;
    return host + path;
}

function isProduction(path: string, config?: AxiosRequestConfig) {
    let servePath = path;
    let axiosConf = config;

    if (process.env.NODE_ENV !== 'production') {
        servePath = host(path);
        axiosConf = {withCredentials: true, ...config};
    }

    return {servePath, axiosConf};
}

export async function axiosGet(path: string, config?:AxiosRequestConfig) {
    let {servePath, axiosConf} = isProduction(path, config);
    return await axios.get(servePath, axiosConf);
}

export async function axiosPost(path: string, params: any, config?:AxiosRequestConfig) {
    let {servePath, axiosConf} = isProduction(path, config);
    return await axios.post(servePath, params, axiosConf);
}

export function addTypeToMenu(menus: Array<any>, type: any) {
    menus.unshift(type);
}

export function typeOrProductUpdate(menus: Array<any>, item: any) {
    for(let i = 0; i < menus.length; i++){
        let typeMenu = menus[i];
        if(typeMenu.id === item.id){
            typeMenu.name = item.name;
            typeMenu.onSale = item.onSale;
            return ;
        }else if (typeMenu.children && typeMenu.children.length > 0) {
            typeOrProductUpdate(typeMenu.children, item);
        }
    }
}

export function addProductToMenu(menus: Array<any>, typeId: string, product: any) {
    for(let i = 0; i < menus.length; i++){
        let item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            return;
        }
    }
}

export function findMenu(menus:Array<any>, path: string, isId: boolean):any {
    for (let i = 0; i < menus.length; i++){
        let item = menus[i];
        if ((!isId && item.path === path) || (isId && item.id === path)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            let menu = findMenu(item.children, path, isId);
            if (menu) {
                return menu;
            }
        }
    }
}

export function getProductUserPrice(product: any, userRoleType = 'role_gold') {
    let price;
    switch (userRoleType) {
        case 'role_top':
            price = product.topPrice;
            break;
        case 'role_super':
            price = product.superPrice;
            break;
        default:
            price = product.goldPrice;
    }
    return price;
}

export function deepClone(obj:any) {
    return JSON.parse(JSON.stringify(obj));
}

export function changeMenuWaitCount(menus: Array<any>, aim: string, cb:(itemA:any, itemB:any) => any) {
    for(let i = 0; i < menus.length; i++){
        let menu = menus[i];
        if (menu.fingerprint === aim) {
            cb(menu, null);
        }
        if (menu.type !== 'menu') {
            let menuItems = menu.children;
            for(let i = 0; i < menuItems.length; i++){
                let menuItem = menuItems[i];
                if (menuItem.fingerprint === aim) {
                    cb(menuItem, menu);
                }
            }
        }
    }
}

export function countOrderProgress(order:any) {
    let progress = 0;
    if (order.status === 'order_execute' || order.status === 'order_refund') {
        let seconds = Math.round((Date.now() - Date.parse(order.dealTime)) / (1000 * 60));
        let executeNum = order.executeNum = seconds * order.speed;
        progress = executeNum >= order.num ? 100 : parseFloat((executeNum / order.num * 100).toFixed(2));
    }
    if (order.status === 'order_finish') {
        progress = parseFloat((order.executeNum / order.num * 100).toFixed(2));
    }
    if (progress >= 100 && order.status !== 'order_finish') {
        order.executeNum = order.num;
    }
    return progress;
}

export const document = window.document;

const Storage = {
    length() {
        return window.sessionStorage.length;
    },
    key(index: number) {
        return window.sessionStorage.key(index);
    },
    getItem(key: string) {
        let info = window.sessionStorage.getItem(key)
        return info ? unzip(info): info;
    },
    setItem(key: string, value: any) {
        window.sessionStorage.setItem(key, zip(value));
    },
    removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    }
};

export default Storage;

