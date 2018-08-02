import axios, {AxiosRequestConfig} from "axios";
import {devConf} from "../config";
import {Loading, Message} from "element-ui";

export enum StorageKey{
    platform = 'platform-info',
    site = 'site-info',
    user = 'user-info'
}



let loadingInstance:any;
axios.interceptors.request.use(
    config => {
        loadingInstance = Loading.service({
            lock: true,
            text: '玩命加载 ...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'});

        return config;
    },
    error => {
        loadingInstance.close();
        Message.error('加载超时！');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    data => {
        loadingInstance.close();
        return data;
    },
    error => {
        loadingInstance.close();
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

