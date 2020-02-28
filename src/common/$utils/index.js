import merge from './vendors/merge.js';
import clone from './vendors/clone.js';

// 深度合并
const deepMerge = (oldObj, newObj, genre = 'override') => {
    const arrayMerge = (destArr, srcArr) => {
        switch (genre) {
            case 'concat':
                return destArr.concat(srcArr);
            default:
                return srcArr;
        }
    };

    return merge(oldObj, newObj, {
        arrayMerge
    });
};

// 深度克隆
const deepClone = (originData) => clone(originData);


// 是否是 对象
const isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;

// 是否是 空对象
const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;


/**
 * 获取 对象/数组 中的值
 *
 * @param {Object} obj                    对象 或 数组
 * @param {String} keys                   字符串 或 数组；键值关联关系，可以是 'a.b.c'，也可以是 ['a', 'b', 'c']
 * @param {result} defaultValue           取不到值时定义的返回值，默认为 undefined
 * @returns {Array}                       取出的值
 * */
const getObjectValue = (obj, keys, defaultValue = undefined) => {
    if (!obj) {
        return defaultValue;
    }

    const keyArr = typeof keys === 'string' ? keys.split('.') : keys;


    if (keyArr.length === 1 && obj[keyArr[0]] !== undefined) {
        return obj[keyArr[0]];
    }


    if (obj[keyArr[0]] && keyArr.length > 1) {
        return getObjectValue(obj[keyArr[0]], keyArr.slice(1), defaultValue);
    }

    return defaultValue;
};

/**
 * 将数字 转成 千分位分割的字符串
 *
 * @param {Number} value 数字
 * @returns {String} 转换后的值
 * */
const _formatNumberToSeparator = (value) => {
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    const result = String(Math.abs(value)).replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => s1.replace(re, '$&,') + s2);

    return `${value < 0 ? '-' : ''}${result}`;
};

/**
 * 数字 保留n位小数的字符串（千分位分割）
 *
 * @param {Number} value 数字
 * @param {Number} n     保留n位小数（默认值 2）
 * @returns {String} 转换后的值
 * */
const formatNumberToFixed = (value, n = 2) => {
    if (typeof value !== 'number') {
        return '- -';
    }

    return _formatNumberToSeparator(Number(value.toFixed(n)));
};


/**
* 数字 转成 不带单位的数字（与 formatNumberUnit 配合使用）
*
* @param {Number} value     数字
* @param {Boolean} English   单位是否是英文
* @param {Number} n         数字保留几位小数
* @returns {String} 转换后的值
* */
const formatNumberValue = (value, English = false, n = 2) => {
    if (typeof value !== 'number') {
        return '- -';
    }

    const valueString = String(value);
    const length = valueString.indexOf('.') > -1 ? valueString.indexOf('.') : valueString
        .length;
    const dicts = {
        1: formatNumberToFixed(value, n),
        2: formatNumberToFixed(value, n),
        3: formatNumberToFixed(value, n),
        4: formatNumberToFixed(value, n),
        5: formatNumberToFixed(value / 10000, n),
        6: formatNumberToFixed(value / 10000, n),
        7: formatNumberToFixed(value / 10000, n),
        8: formatNumberToFixed(value / 10000, n),
        9: English ? formatNumberToFixed(value / 10000, n) : formatNumberToFixed(value / 100000000, n),
        10: English ? formatNumberToFixed(value / 10000, n) : formatNumberToFixed(value / 100000000, n),
        11: English ? formatNumberToFixed(value / 10000, n) : formatNumberToFixed(value / 100000000, n)
    };

    return dicts[length];
};

/**
* 数字 转成 单位（与 formatNumberValue 配合使用）
*
* @param {Number} value        数字
* @param {Boolean} English   单位是否是英文
* @returns {String} 单位
* */
const formatNumberUnit = (value, English = false) => {
    if (typeof value !== 'number') {
        return '';
    }

    const valueString = String(value);
    const length = valueString.indexOf('.') > -1 ? valueString.indexOf('.') : valueString
        .length;
    const dicts = {
        1: '',
        2: '',
        3: '',
        4: English ? '' : '',
        5: English ? 'W' : '万',
        6: English ? 'W' : '万',
        7: English ? 'W' : '万',
        8: English ? 'W' : '万',
        9: English ? 'W' : '亿',
        10: English ? 'W' : '亿',
        11: English ? 'W' : '亿'
    };

    return dicts[length];
};

/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format   格式
 * @return {String}          格式化过后的时间
 */
const formatDate = (source, format) => {
    const o = {
        'M+': source.getMonth() + 1, // 月份
        'd+': source.getDate(), // 日
        'H+': source.getHours(), // 小时
        'm+': source.getMinutes(), // 分
        's+': source.getSeconds(), // 秒
        'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
        'f+': source.getMilliseconds() // 毫秒
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (`${source.getFullYear()}`).substr(4 - RegExp.$1
            .length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[
                k]}`)
                .substr((`${o[k]}`).length)));
        }
    }

    return format;
};

export default {
    deepClone, // 深度克隆
    deepMerge, // 深度合并

    isObject, // 是否是 对象
    isEmptyObject, // 是否是 空对象

    formatDate, // 格式化时间

    getObjectValue, // 获取 对象/数组 中的值
    formatNumberToFixed, // 数字 保留n位小数的字符串（千分位分割）
    formatNumberValue, // 数字 转成 不带单位的数字（与 formatNumberUnit 配合使用）
    formatNumberUnit // 数字 转成 单位（与 formatNumberValue 配合使用）
};

