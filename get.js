'use strict';
/* **
 * @description A minimalist port of `lodash.get`
 * without the dependency of `lodash.get` & `lodash.memoize`
 */

const EVENT_TYPES = {
    DATA_MISSING: 'dataMissing',
    TYPE_MISMATCH: 'typeMismatch'
};
let logger;

/**
 * Checks if an object is truly empty
 * Using Object.enrties().length breaks for older browsers on older
 * versions of iOS.
 * @param {Object} obj
 * @returns {Boolean}
 */
function isEmpty(obj) {
    if (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}

/**
 * Retrieve Object Types
 * @param {*} val
 * @returns {*} type
 */
function getType(val) {
    let type;
    if (Array.isArray(val)) {
        type = 'array';
    } else if (val === null) {
        type = 'null';
    } else {
        type = typeof val;
    }
    return type;
}

/**
 * Normalizes the path String sent, to array types
 * @param {String} path
 * @returns {String}
 */
function normalize(path) {
    if (typeof path === 'string') {
        path = path.split('.').join(',').replace(/\[\d\]/g, (match) => {
            match = match.replace(/[\[\]']+/g, '');
            match = `,${match}`;
            return match;
        }).split(',');
    }
    return path;
}

/**
 * Log the event
 * @param path - a string representation of the lookup
 * @param eventType - event type from EVENT_TYPES enum
 * @param defaultValue - default when data is absent, also used to check type
 * @param logType - logger method to use
 */
function log(eventType, path, defaultValue, logType) {
    if (logger[logType]) {
        logger[logType]('event: %s, path: %s, default: %s', eventType, path, defaultValue);
    }
}

/**
 * Claws through Nested Data
 * @param {Object} obj
 * @param {Array} path
 * @returns {*}
 */
function claw(obj, path) {
    return path.reduce((acc, currVal) => (acc && typeof acc[currVal] !== 'undefined') ? acc[currVal] : undefined, obj);
}

/**
 * Access Nested Data safely
 * @param {Object} obj
 * @param {String} path
 * @param {*} defaultVal
 * @param {String} logType - WARN | INFO | DEBUG | ERROR | LOG
 * @returns {*} result
 */
function access(obj, path, defaultVal, logType = 'warn') {
    let eventType;
    path = normalize(path);
    let result = claw(obj, path);
    const typeofResult = getType(result);
    let typeofDefaultValue = getType(defaultVal);

    if (typeofDefaultValue === 'undefined') {
        defaultVal = '';
        typeofDefaultValue = 'string';
    } else if (typeofDefaultValue === 'object' && isEmpty(defaultVal)) {
        defaultVal = {
            __isEmpty: true
        };
    }
    if (typeofResult !== 'undefined') {
        if (typeofResult !== typeofDefaultValue) {
            eventType = EVENT_TYPES.TYPE_MISMATCH;
            result = defaultVal;
        }
    } else {
        eventType = EVENT_TYPES.DATA_MISSING;
        result = defaultVal;
    }
    if (logger && logType && eventType) {
        log(eventType, path, defaultVal, logType);
    }
    return result;
}

/**
 * Checks if an object has a specific path
 * Does not return a value
 * @param {Object} obj
 * @param {String} path
 * @returns {Boolean} result
 */
function has(obj, path) {
    path = normalize(path);
    let result = claw(obj, path);
    const typeofResult = getType(result);
    result = !(typeofResult === 'undefined' || typeofResult === 'null');
    return result;
}

/**
 * Exported Function to claw through nested data safely
 * Just returns the value without logging
 * @param {Object} obj
 * @param {String} path
 * @param {*} defaultVal - if nothing provided, defaulst to ''
 * @returns {*} result
 */
function get(obj, path, defaultVal) {
    return access(obj, path, defaultVal);
}

/**
 * Exported Function to claw through nested data safely
 * Logs the value & returns it
 * @param {Object} obj
 * @param {String} path
 * @param {*} defaultVal - if nothing provided, defaulst to ''
 * @param {String} logType - WARN | INFO | DEBUG | ERROR | LOG
 * @returns {*} result
 */
function need(obj, path, defaultVal, logType) {
    return access(obj, path, defaultVal, logType);
}

/**
 * Set logger to be used for all future usage
 * @param object l - the logger with a warn function
 */
function setLogger(l) {
    logger = l;
}

module.exports = {
    has,
    get,
    need,
    setLogger
};

module.exports.privates = {
    EVENT_TYPES: EVENT_TYPES
};
