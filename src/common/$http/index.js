import util from '../$util/index';
import configs from './configs/index';


// 封装wx request api 结合promise使用
const request = (configName, requestParams = {}) => {
    const config = configs[configName];

    if (!util.isObject(config)) {
        throw new Error('[request] invalid api config');
    }
    const proxy = config.proxy;

    // 微信小程序带cookie的request请求
    if (!proxy.header) {
        proxy.header = {};
    }
    proxy.header = {
        ...proxy.header,
        Cookie: wx.getStorageSync('cookie')
    };
    proxy.data = requestParams;

    return new Promise((resolve, reject) => {
        proxy.success = (res) => {
            // 成功
            if (res.header['Set-Cookie']) {
                wx.setStorageSync('cookie', res.header['Set-Cookie']);
            }

            // 格式化接口响应
            if (typeof config.format === 'function') {
                res.data = config.format(res.data);
            }

            if (res.data.code === 0) {
                // 请求成功码
                if (config.session) {
                    wx.setStorageSync('cookieKey', res.header['Set-Cookie']); // 保存Cookie到Storage
                }

                const originalData = res.data.data;


                resolve(originalData);
            } else {
                // 请求失败
                reject(res.data.data);
            }
        };

        proxy.fail = (err) => {
            // 失败
            wx.showToast({
                title: '网络错误！',
                icon: 'none',
                duration: 2000
            });
            reject(err);
        };

        wx.request(proxy);
    });
};

// 其他接口异步 wxPromisify(wx.getUserInfo)(params)
const wxPromisify = (fn) => (obj = {}) => new Promise((resolve, reject) => {
    obj.success = (res) => {
        // 成功
        resolve(res);
    };
    obj.fail = (res) => {
        // 失败
        reject(res);
    };
    fn(obj);
});

export default {
    request,
    wxPromisify
};
