import axios, {AxiosRequestConfig} from "axios";
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
        Message.error('加载超时！');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    data => {
        return data;
    },
    error => {
        Message.error('加载失败！');
        return Promise.reject(error);
    }
);

function host(path: string) {
    const host = 'http://' + devConf.serveIp + ':' + devConf.servePort;
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

const Storage = {
    length() {
        return window.sessionStorage.length;
    },
    key(index: number) {
        return window.sessionStorage.key(index);
    },
    getItem(key: string) {
        return JSON.parse(window.sessionStorage.getItem(key));
    },
    setItem(key: string, value: any) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    }
};

export default Storage;

