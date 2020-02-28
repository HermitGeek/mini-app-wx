// 此写法 暂不支持 mobx computed

import {
    observable
} from 'mobx-miniprogram';
import common from './common/index';

const store = observable({
    ...common
});

export {
    store
};
