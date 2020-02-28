/* eslint-disable */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.deepmerge = factory();
    }
}(this, () => {
    function isMergeableObject(val) {
        const nonNullObject = val && typeof val === 'object';

        return nonNullObject &&
        Object.prototype.toString.call(val) !== '[object RegExp]' &&
        Object.prototype.toString.call(val) !== '[object Date]';
    }

    function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
    }

    function cloneIfNecessary(value, optionsArgument) {
        const clone = optionsArgument && optionsArgument.clone === true;


        return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
    }

    function defaultArrayMerge(target, source, optionsArgument) {
        const destination = target.slice();

        source.forEach((e, i) => {
            if (typeof destination[i] === 'undefined') {
                destination[i] = cloneIfNecessary(e, optionsArgument);
            } else if (isMergeableObject(e)) {
                destination[i] = deepmerge(target[i], e, optionsArgument);
            } else if (target.indexOf(e) === -1) {
                destination.push(cloneIfNecessary(e, optionsArgument));
            }
        });

        return destination;
    }

    function mergeObject(target, source, optionsArgument) {
        const destination = {};

        if (isMergeableObject(target)) {
            Object.keys(target).forEach((key) => {
                destination[key] = cloneIfNecessary(target[key], optionsArgument);
            });
        }
        Object.keys(source).forEach((key) => {
            if (!isMergeableObject(source[key]) || !target[key]) {
                destination[key] = cloneIfNecessary(source[key], optionsArgument);
            } else {
                destination[key] = deepmerge(target[key], source[key], optionsArgument);
            }
        });

        return destination;
    }

    function deepmerge(target, source, optionsArgument) {
        const array = Array.isArray(source);
        const options = optionsArgument || {
            arrayMerge: defaultArrayMerge
        };
        const arrayMerge = options.arrayMerge || defaultArrayMerge;

        if (array) {
            return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument);
        }

        return mergeObject(target, source, optionsArgument);
    }

    deepmerge.all = function deepmergeAll(array, optionsArgument) {
        if (!Array.isArray(array) || array.length < 2) {
            throw new Error('first argument should be an array with at least two elements');
        }

        // we are sure there are at least 2 values, so it is safe to have no initial value
        return array.reduce((prev, next) => deepmerge(prev, next, optionsArgument));
    };

    return deepmerge;
}));
