import config from '../../$config/index';



export default {
    /**
     * 微信小程序openId登录
     * @type {Object}
     */
    WECHAT_OPENID_LOGIN: {
        proxy: {
            url: `${config.BASE_URL}weiark/wechat/openid/login`,
            method: 'GET'
        }
    },

    /**
     * 用户登陆
     * @type {Object}
     */
    USER_LOGIN: {
        proxy: {
            url: `${config.BASE_URL}weiark/user/login`,
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        },
        format: (data) => data
    },

    /**
     * 获取当前登录用户信息
     * @type {Object}
     */
    USER_LOGIN_SUCCESS: {
        proxy: {
            url: `${config.BASE_URL}weiark/user/login/success`,
            method: 'GET'
        }
    },

    /**
     * 注销登录
     * @type {Object}
     */
    USER_LOGOUT: {
        proxy: {
            url: `${config.BASE_URL}weiark/user/logout`,
            method: 'POST'
        }
    },

    /**
     * 获取用户手机号码
     * @type {Object}
     */
    WECHAT_PHONE_GET: {
        proxy: {
            url: `${config.BASE_URL}weiark/wechat/phone/get`,
            method: 'GET'
        }
    }
};
