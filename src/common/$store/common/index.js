// 此写法 暂不支持 mobx computed
import {
    action
} from 'mobx-miniprogram';



export default {
    // states
    $num1: 1,
    $num2: 2,
    $sum1And2: 3,

    // actions
    $updateNum: action(function () {
        this.$num1 *= 2;
        this.$num2 *= 2;
        this.$sum1And2 = this.$num1 + this.$num2;
    })
};
