import {
    storeBindingsBehavior
} from 'mobx-miniprogram-bindings';
import miniprogramComputed from 'miniprogram-computed';
import $https from '../../$https/index';
import {
    store
} from '../../$store/index';



Component({
    behaviors: [miniprogramComputed, storeBindingsBehavior],

    storeBindings: {
        store,
        fields: ['$num1', '$num2', '$sum1And2'],
        actions: ['$updateNum']
    },

    data: {
        num3: 1,
        num4: 2
    },

    computed: {
        num3And4(data) {
            return data.num3 + data.num4;
        }
    },

    watch: {
        sum() {
            console.log('sum 变化了');
        }
    },

    methods: {
        async onLoad() {
            // 页面创建时执行
            const response = await $https.wxPromisify(wx.login)();

            await $https.request('WECHAT_OPENID_LOGIN', {
                code: response.code
            });

            this.updateChart();
        },

        // 更新 store 数值
        updateStoreValue() {
            this.$updateNum();
        },

        // 更新 data 数值
        updateDataValue() {
            this.setData({
                num3: this.data.num3 * 2,
                num4: this.data.num4 * 2
            });
        },

        goModule1PageIndex() {
            wx.redirectTo({
                url: '/src/module1/pages/index/index'
            });
        }
    }
});
