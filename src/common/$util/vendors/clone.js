/* eslint-disable */
const clone = (function () {
    let nativeMap;

    try {
        nativeMap = Map;
    } catch (_) {
        // maybe a reference error because no `Map`. Give it a dummy value that no
        // value will ever be an instanceof.
        nativeMap = function () {};
    }

    let nativeSet;

    try {
        nativeSet = Set;
    } catch (_) {
        nativeSet = function () {};
    }

    let nativePromise;

    try {
        nativePromise = Promise || function () {};
    } catch (_) {
        nativePromise = function () {};
    }

    /**
     * Clones (copies) an Object using deep copying.
     *
     * This function supports circular references by default, but if you are certain
     * there are no circular references in your object, you can save some CPU time
     * by calling clone(obj, false).
     *
     * Caution: if `circular` is false and `parent` contains circular references,
     * your program may enter an infinite loop and crash.
     *
     * @param `parent` - the object to be cloned
     * @param `circular` - set to true if the object to be cloned may contain
     *    circular references. (optional - true by default)
     * @param `depth` - set to a number if the object is only to be cloned to
     *    a particular depth. (optional - defaults to Infinity)
     * @param `prototype` - sets the prototype to be used when cloning an object.
     *    (optional - defaults to parent prototype).
     * @param `includeNonEnumerable` - set to true if the non-enumerable properties
     *    should be cloned as well. Non-enumerable properties on the prototype
     *    chain will be ignored. (optional - false by default)
     */
    function clone(parent, circular, depth, prototype, includeNonEnumerable) {
        if (typeof circular === 'object') {
            depth = circular.depth;
            prototype = circular.prototype;
            includeNonEnumerable = circular.includeNonEnumerable;
            circular = circular.circular;
        }

        // maintain two arrays for circular references, where corresponding parents
        // and children have the same index
        const allParents = [];
        const allChildren = [];

        const useBuffer = typeof Buffer !== 'undefined';

        if (typeof circular === 'undefined') {
            circular = true;
        }

        if (typeof depth === 'undefined') {
            depth = Infinity;
        }

        // recurse this function so we don't reset allParents and allChildren
        function _clone(parent, depth) {
            // cloning null always returns null
            if (parent === null) {
                return null;
            }

            if (depth === 0) {
                return parent;
            }

            let child;
            let proto;

            if (typeof parent !== 'object') {
                return parent;
            }

            if (parent instanceof nativeMap) {
                child = new nativeMap();
            } else if (parent instanceof nativeSet) {
                child = new nativeSet();
            } else if (parent instanceof nativePromise) {
                child = new nativePromise(((resolve, reject) => {
                    parent.then((value) => {
                        resolve(_clone(value, depth - 1));
                    }, (err) => {
                        reject(_clone(err, depth - 1));
                    });
                }));
            } else if (clone.__isArray(parent)) {
                child = [];
            } else if (clone.__isRegExp(parent)) {
                child = new RegExp(parent.source, __getRegExpFlags(parent));
                if (parent.lastIndex) {
                    child.lastIndex = parent.lastIndex;
                }
            } else if (clone.__isDate(parent)) {
                child = new Date(parent.getTime());
            } else if (useBuffer && Buffer.isBuffer(parent)) {
                child = new Buffer(parent.length);
                parent.copy(child);

                return child;
            } else if (parent instanceof Error) {
                child = Object.create(parent);
            } else if (typeof prototype === 'undefined') {
                proto = Object.getPrototypeOf(parent);
                child = Object.create(proto);
            } else {
                child = Object.create(prototype);
                proto = prototype;
            }

            if (circular) {
                const index = allParents.indexOf(parent);

                if (index != -1) {
                    return allChildren[index];
                }
                allParents.push(parent);
                allChildren.push(child);
            }

            if (parent instanceof nativeMap) {
                const keyIterator = parent.keys();

                while (true) {
                    var next = keyIterator.next();

                    if (next.done) {
                        break;
                    }
                    const keyChild = _clone(next.value, depth - 1);
                    const valueChild = _clone(parent.get(next.value), depth - 1);

                    child.set(keyChild, valueChild);
                }
            }
            if (parent instanceof nativeSet) {
                const iterator = parent.keys();

                while (true) {
                    var next = iterator.next();

                    if (next.done) {
                        break;
                    }
                    const entryChild = _clone(next.value, depth - 1);

                    child.add(entryChild);
                }
            }

            for (var i in parent) {
                var attrs;

                if (proto) {
                    attrs = Object.getOwnPropertyDescriptor(proto, i);
                }

                if (attrs && attrs.set == null) {
                    continue;
                }
                child[i] = _clone(parent[i], depth - 1);
            }

            if (Object.getOwnPropertySymbols) {
                const symbols = Object.getOwnPropertySymbols(parent);

                for (var i = 0; i < symbols.length; i++) {
                    // Don't need to worry about cloning a symbol because it is a primitive,
                    // like a number or string.
                    const symbol = symbols[i];
                    var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);

                    if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
                        continue;
                    }
                    child[symbol] = _clone(parent[symbol], depth - 1);
                    if (!descriptor.enumerable) {
                        Object.defineProperty(child, symbol, {
                            enumerable: false
                        });
                    }
                }
            }

            if (includeNonEnumerable) {
                const allPropertyNames = Object.getOwnPropertyNames(parent);

                for (var i = 0; i < allPropertyNames.length; i++) {
                    const propertyName = allPropertyNames[i];
                    var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);

                    if (descriptor && descriptor.enumerable) {
                        continue;
                    }
                    child[propertyName] = _clone(parent[propertyName], depth - 1);
                    Object.defineProperty(child, propertyName, {
                        enumerable: false
                    });
                }
            }

            return child;
        }

        return _clone(parent, depth);
    }

    /**
     * Simple flat clone using prototype, accepts only objects, usefull for property
     * override on FLAT configuration object (no nested props).
     *
     * USE WITH CAUTION! This may not behave as you wish if you do not know how this
     * works.
     */
    clone.clonePrototype = function clonePrototype(parent) {
        if (parent === null) {
            return null;
        }

        const c = function () {};

        c.prototype = parent;

        return new c();
    };

    // private utility functions

    function __objToStr(o) {
        return Object.prototype.toString.call(o);
    }
    clone.__objToStr = __objToStr;

    function __isDate(o) {
        return typeof o === 'object' && __objToStr(o) === '[object Date]';
    }
    clone.__isDate = __isDate;

    function __isArray(o) {
        return typeof o === 'object' && __objToStr(o) === '[object Array]';
    }
    clone.__isArray = __isArray;

    function __isRegExp(o) {
        return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
    }
    clone.__isRegExp = __isRegExp;

    function __getRegExpFlags(re) {
        let flags = '';

        if (re.global) {
            flags += 'g';
        }
        if (re.ignoreCase) {
            flags += 'i';
        }
        if (re.multiline) {
            flags += 'm';
        }

        return flags;
    }
    clone.__getRegExpFlags = __getRegExpFlags;

    return clone;
}());

if (typeof module === 'object' && module.exports) {
    module.exports = clone;
}
