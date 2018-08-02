import axios, {AxiosRequestConfig} from "axios";
import {devConf} from "../config";
import {Message} from "element-ui";

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

export async function axiosGet(path: string, config?:AxiosRequestConfig) {
    return process.env.NODE_ENV === 'production' ?
        await axios.get(path, config) :
        await axios.get(host(path), {withCredentials: true, ...config});
}

export async function axiosPost(path: string, params: any, config?:AxiosRequestConfig) {
    return process.env.NODE_ENV === 'production' ?
        await axios.post(path, params, config) :
        await axios.post(host(path), params, {withCredentials: true, ...config});
}

