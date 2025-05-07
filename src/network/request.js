import axios from 'axios'
import $store from '@/store/index'

const baseURL = "http://localhost:3000";
// const baseURL="http://59.110.124.156:3000";
// const baseURL="http://123.56.175.108:3000"

let ajaxTimer = 0;
export function request(config) {
    console.log($store.getters.getResource);
    if ($store.getters.getResource == "migu") {
        if (config.params != null) {
            config.params.resource = "migu";
        }
    }

    $store.commit('showLoading');
    const install = axios.create({
        baseURL,
        timeOut: 60000
    });
    install.interceptors.request.use(data => {
        ajaxTimer++;
        return data;
    }, err => {
        $store.commit('hiddenLoading');
        return err
    });
    install.interceptors.response.use(data => {
        ajaxTimer--;
        $store.commit('hiddenLoading');
        return data;
    }, err => {
        $store.commit('hiddenLoading');
        // throw err;
        console.log("这里出错咯：", err);
        if(err && err.response && err.response.status == 502){
            console.log("接口超时：" + err.request.responseURL);
            return request(config);
        }
        return err;
    });
    return install(config);
}