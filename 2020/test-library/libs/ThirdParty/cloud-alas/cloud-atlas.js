/*!
 * cloud-atlas-web-sdk v1.7.2-independent-device
 * (c) 2017-2019 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CloudAtlas = factory());
}(this, (function () { 'use strict';

// 打印前打的码
var sLogPrefix = '[CloudAtlas] ';
// 设置sdk存储cookie的键

// 设置存储的devide_id
var KEY_DEVICE_INFO = 'device_id';
// 设置storage
var storage = localStorage;
//     // AppInfoResolver
/**
   * 异常类型
   */
var TYPE_USER_SUBMIT_MSG = 0;
/**
   * 自定义事件的通用参数在MAP中存储的key
   * 事件标签
   */
var KEY_EVENT_LABEL = 'ca_label';

/**
   * 自定义事件的通用参数在MAP中存储的key
   * 整数值
   */
var KEY_EVENT_INT_VALUE = 'ca_int_value';

/**
   * 页面信息存储key
   */
var KEY_LEAVE_PAGE_INFO = 'leave_page_info';

/**
 * 所有可实例化类，均通过function XX(...){}的方式定义，通过var bb = new XX(...)的方式实例化
 * 所有工具类及只含静态调用的类，均通过类名_方法名的方式定义方法，静态成员变量以var的方式定义在CloudAtlas作用域内
 * 如function 类名_方法名(...){...}
 * 判断一个参数是否为对象，统一使用typeof xxx === 'object'，因为constructor会返回具体的类名
 */
// data包
/**
 * 采集的数据
 * @constructor
 */
function CollectedData() {
    this.sessionList = [];
    this.eventList = [];
    this.errorList = [];
    /**
     * 合并两个数据采集对象
     * @param toBeMerged 待合并的数据
     */
    this.merge = function (toBeMerged) {
        if (toBeMerged) {
            // 合并会话信息
            if (toBeMerged.sessionList.length > 0) {
                var len = toBeMerged.sessionList.length;
                for (var i = 0; i < len; i++) {
                    var session = toBeMerged.sessionList[i];
                    if (session && session.id) {
                        var sameSession = findSameSession.apply(this, [session]);
                        if (sameSession === null) {
                            // 没有相同会话，直接加入
                            this.sessionList.push(session);
                        } else {
                            // 有相同会话，去掉旧的
                            if (session.end > sameSession.end) {
                                sameSession.end = session.end;
                            }
                        }
                    }
                }
            }
            // 合并自定义事件
            if (toBeMerged.eventList && toBeMerged.eventList.length > 0) {
                this.eventList = this.eventList.concat(toBeMerged.eventList);
            }
            // 合并异常
            if (toBeMerged.errorList && toBeMerged.errorList.length > 0) {
                this.errorList = this.errorList.concat(toBeMerged.errorList);
            }
        }
    };
    /**
       * 在当前会话列表中查找相同会话
       *
       * @param toBeMatched 待匹配的会话
       * @return 若不为空，则为当前列表中会话id相同的会话
       */
    function findSameSession(toBeMatched) {
        var len = this.sessionList.length;
        for (var i = 0; i < len; i++) {
            var session = this.sessionList[i];
            if (toBeMatched.id === session.id) {
                return session;
            }
        }
        return null;
    }
    /**
       * 是否有有效数据，用于辅助判断是否需要上传
       * @returns {boolean},true-有，false-没有
       */
    this.hasValidData = function () {
        return this.sessionList.length > 0 || this.eventList.length > 0 || this.errorList.length > 0;
    };
}
/**
   * 会话类
   * @param id 会话id
   * @param start 开始时间
   * @param end 结束时间
   * @param userId 用户id
   * @param appVer 应用版本
   * @param ip 用户ip
   * @constructor
   */
function Session(id, start, end, userId, appVer, ip, activityId) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.userId = userId;
    this.appVer = appVer;
    this.ip = ip;
    this.activityId = activityId;
    this.equals = function (session) {
        if (this === session) return true;
        if (session === null || this.constructor !== session.constructor) return false;

        if (this.id !== session.id) return false;
        if (this.start !== session.start) return false;
        if (this.end !== session.end) return false;
        if (this.userId !== session.userId) return false;
        if (this.appVer !== session.appVer) return false;
        if (this.activityId !== session.activityId) return false;
        return this.ip === session.ip;
    };
}
/**
   * 运行环境
   * @param appVer 应用版本
   * @param userId 用户Id
   * @param sessionId 会话id
   * @param ip 用户IP
   * @constructor
   */
function RunningEnv(appVer, userId, sessionId, ip) {
    this.appVer = appVer;
    this.userId = userId;
    this.sessionId = sessionId;
    this.ip = ip;
}
/**
   * 自定义事件
   * @param id 自定义事件ID
   * @param value 自定义事件参数对象
   * @param time 事件发生时间
   * @param userId 用户ID
   * @param appVer 应用版本
   * @constructor
   */
function Event(id, value, time, userId, appVer, activityId, sessionId) {
    this.id = id;
    this.value = value;
    this.time = time;
    this.userId = userId;
    this.appVer = appVer;
    this.activityId = activityId;
    this.sessionId = sessionId;
    this.equals = function (event) {
        if (this === event) return true;
        if (event === null || this.constructor !== event.constructor) return false;
        if (this.id !== event.id) return false;
        if (this.value !== event.value) return false;
        if (this.time !== event.time) return false;
        if (this.userId !== event.userId) return false;
        if (this.activityId !== event.activityId) return false;
        if (this.sessionId !== event.sessionId) return false;
        return this.appVer !== event.appVer;
    };
}
/**
   * 异常
   * @param type 异常类型
   * @param msg 异常信息
   * @param time 发生异常的时间
   * @param appVer 应用版本
   */

function Error$1(type, msg, time, appVer, activityId) {
    this.type = type;
    this.msg = msg;
    this.time = time;
    this.appVer = appVer;
    this.activityId = activityId;
    this.equals = function (error) {
        if (this === error) return true;
        if (error === null || this.constructor !== error.constructor) return false;
        if (this.type !== error.type) return false;
        if (this.msg !== error.msg) return false;
        if (this.time !== error.time) return false;
        if (this.activityId !== error.activityId) return false;
        return this.appVer !== event.appVer;
    };
}

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise$1(fn) {
  if (!(this instanceof Promise$1))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise$1._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise$1) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise$1._immediateFn(function() {
      if (!self._handled) {
        Promise$1._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise$1.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise$1.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise$1.prototype['finally'] = finallyConstructor;

Promise$1.all = function(arr) {
  return new Promise$1(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise$1.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise$1) {
    return value;
  }

  return new Promise$1(function(resolve) {
    resolve(value);
  });
};

Promise$1.reject = function(value) {
  return new Promise$1(function(resolve, reject) {
    reject(value);
  });
};

Promise$1.race = function(values) {
  return new Promise$1(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise$1._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!('Promise' in globalNS)) {
  globalNS['Promise'] = Promise$1;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = finallyConstructor;
}

// network包
// -----------------------------------------

var sDeviceId = void 0; // 设备Id
sDeviceId = guid();
/**
 * 是否支持localstorage 和是否支持localstorage 存储删除数据
 */
function isLocalStorageSupport() {
    try {
        var isSupport = 'localStorage' in window && window['localStorage'] !== null;
        if (isSupport) {
            // 防止无痕模式下，假装支持localstorage 调用setItem就会报错的情况
            storage.setItem('___testSetItem__', '___testSetItem__');
            storage.removeItem('___testSetItem__');
        }
        return isSupport;
    } catch (error) {
        LogProxy_e('您的浏览器版本不支持localstorage');
        return false;
    }
}
/**
 * Fingerprintjs2生产deviceID
 */
function getDeviceId() {
    return new Promise(function (resolve) {
        resolve(guid());
    });
}
/**
 * 保存设备信息
 * @param info
 */
function LocalStoragePersist_saveDeviceInfo(info) {
    if (isLocalStorageSupport()) {
        storage.setItem(KEY_DEVICE_INFO, info);
    }
}
/**
 * 获取设备信息
 * @returns {string|null}
 */
function LocalStoragePersist_queryDeviceInfo() {
    if (isLocalStorageSupport()) {
        return storage.getItem(KEY_DEVICE_INFO);
    }
    return null;
}
/**
 * 读取收集数据 ---locasStorage
 */
function LocalStoragePersist_queryCollecteData() {
    if (isLocalStorageSupport()) {
        var count = 0;
        var data = new CollectedData();
        var keyArr = [];
        for (var i = 0; i < storage.length; i++) {
            var key = storage.key(i);
            if (/^atlas_data/.test(key)) {
                count++;
                keyArr.push(key);
                var temp = storage.getItem(key);
                if (window.atob) {
                    try {
                        temp = decodeURIComponent(window.atob(temp));
                    } catch (error) {
                        LogProxy_e('解析localstorage失败');
                    }
                }
                var item = temp;
                try {
                    item = JSON.parse(temp);
                } catch (error) {
                    continue;
                }
                switch (key.split('_')[2]) {// 数据类型 0：会话数据 1：事件数据 2：错误数据
                    case '0':
                        data.sessionList.push(item);
                        break;
                    case '1':
                        data.eventList.push(item);
                        break;
                    case '2':
                        data.errorList.push(item);
                        break;
                }
            }
            if (count >= LIMIT_TIMES) {
                count = 0;
                break;
            }
        }
        return {
            data: data,
            keys: keyArr
        };
    }
    return null;
}
/**
 * 保持收集数据 ---locasStorage
 */
function LocalStoragePersist_saveCollectedData() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var data = arguments[1];

    if (!isLocalStorageSupport()) return;
    var key = 'atlas_data_' + type + '_' + guid();
    var temp = JSON.stringify(data);
    if (window.btoa) {
        temp = window.btoa(encodeURIComponent(temp));
    }
    storage.setItem(key, temp);
}
/**
 * 清空收集数据 ---locasStorage
 */
function LocalStoragePersist_clearCollectedData(storageKey) {
    if (!isLocalStorageSupport() || storageKey === undefined || storageKey === null) return;
    for (var i = 0; i < storageKey.length; i++) {
        var key = storageKey[i];
        storage.removeItem(key);
    }
}
/**
 * Object.assign Polyfill
 * @param {*} target
 * @param  {...any} sources
 */
function assign(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    // Object.assign Polyfill
    if (typeof Object.assign !== 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, 'assign', {
            value: function assign(target, varArgs) {
                // .length of function is 2
                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
    return Object.assign.apply(Object, [target].concat(sources));
}

// -----------------------------------------
// utils包
// + v1.6 activity_id概念
// ActivityIdResolver
// AppInfoResolver
var sAppKey = void 0;
var sVersionName = void 0;
var sChannelId = void 0;
/**
 * 保存AppKey与应用版本
 * @param appKey
 * @param appVer 应用版本
 */
function AppInfoResolver_saveInfo(appKey, appVer, channelId) {
    sAppKey = appKey;
    sVersionName = appVer;
    sChannelId = channelId;
}
/**
 * 获取应用版本号
 * @returns {*} 版本号
 */
function AppInfoResolver_getVersionName() {
    return sVersionName;
}
/**
 * 获取AppKey
 * @returns {*} AppKey
 */
function AppInfoResolver_getAppKey() {
    return sAppKey;
}
/**
 * 获取渠道
 * @returns {*} AppKey
 */
function AppInfoResolver_getChannelId() {
    return sChannelId;
}
// guid
/**
 * 生成唯一标识
 * @returns {string}
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
/**
 * 字符串转成二进制
 * @param str
 * @returns {*}
 */
function string2buf(str) {
    var i = void 0;
    var c = void 0;
    var c2 = void 0;
    var buf = void 0;
    var m_pos = void 0;
    var buf_len = 0;
    var str_len = str.length;
    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }
    // allocate buffer
    buf = new Uint8Array(buf_len);
    // convert
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        if (c < 0x80) {
            /* one byte */
            buf[i++] = c;
        } else if (c < 0x800) {
            /* two bytes */
            buf[i++] = 0xC0 | c >>> 6;
            buf[i++] = 0x80 | c & 0x3f;
        } else if (c < 0x10000) {
            /* three bytes */
            buf[i++] = 0xE0 | c >>> 12;
            buf[i++] = 0x80 | c >>> 6 & 0x3f;
            buf[i++] = 0x80 | c & 0x3f;
        } else {
            /* four bytes */
            buf[i++] = 0xf0 | c >>> 18;
            buf[i++] = 0x80 | c >>> 12 & 0x3f;
            buf[i++] = 0x80 | c >>> 6 & 0x3f;
            buf[i++] = 0x80 | c & 0x3f;
        }
    }
    return buf;
}
/**
 * 获取设备id
 * @returns {*}
 */
function DeviceInfoResolver_getDeviceId() {
    return sDeviceId;
}
function DeviceInfoResolver_setDeviceId() {
    return new Promise(function (resolve) {
        if (sDeviceId) {
            resolve(sDeviceId);
        } else {
            resolve(guid());
        }
    });
}
/**
 * 解析设备信息（如果有已保存的设备信息，则取出，否则重新生成）
 */
function DeviceInfoResolver_resolveDeviceInfo() {
    var deviceInfoStr = LocalStoragePersist_queryDeviceInfo() || '{}';
    var deviceInfo = void 0;
    try {
        deviceInfo = JSON.parse(deviceInfoStr);
    } catch (e) {
        LogProxy_e('Resolve deviceInfo failed', e);
    }
    if (deviceInfo && deviceInfo.deviceId) {
        sDeviceId = deviceInfo.deviceId;
        LogProxy_d('Resolve exist deviceId : ' + sDeviceId);
    } else {
        getDeviceId().then(function (deviceId) {
            sDeviceId = deviceId;
            LocalStoragePersist_saveDeviceInfo(JSON.stringify({
                deviceId: sDeviceId
            }));
            LogProxy_d('No exist deviceId, generate one : ' + sDeviceId);
        });
    }
}
// CurrentTimeHelper
/**
 * 获取当前时间毫秒数
 * @returns {number}
 */
function CurrentTimeHelper_currentTimeMillis() {
    var myDate = new Date();
    return myDate.getTime();
}
/**
 * 给时间增加格式化支持
 * @param date 日期对象
 * @returns {*} 格式化后的字符串
 */
function CurrentTimeHelper_formatDate(date) {
    function pad(num) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
    }
    function calculateTimezone(offset) {
        var tzo = -offset;
        var dif = tzo >= 0 ? '+' : '-';
        return dif + pad(offset / 60) + pad(offset % 60);
    }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds()) + calculateTimezone(date.getTimezoneOffset());
}
/**
 * @export
 * @param {*} url:string
 * @param {*} attr: [index: string]: string;
 * @param {*} el: string; link / script
 * @returns
 */
function loadFile(url, elType, attr) {
    var elements = {
        'link': {
            src: 'href',
            defaultAttr: 'rel',
            textType: 'stylesheet'
        },
        'script': {
            src: 'src',
            defaultAttr: 'type',
            textType: 'text/javascript'
        }
    };
    var element = elements[elType];
    return new Promise(function (resolve, reject) {
        var el = document.createElement(elType);
        el.addEventListener('load', function (e) {
            document.body.appendChild(el);
            resolve(e);
        }, false);
        el.addEventListener('error', function (e) {
            document.body.removeChild(el);
            reject(e);
        }, false);
        if (attr) {
            for (var _iterator = Object.keys(attr), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var val = _ref;

                el.setAttribute(val, attr[val]);
            }
        }
        el[element.src] = url;
        el[element.defaultAttr] = element.textType;
        document.head.appendChild(el);
    });
}

// debug包
var sIsDebugMode = false; // 是否为调试模式
// log包
// LogProxy
var sIsLogEnabled = false; // 是否输出日志

var sActivityId = null; //

var sIsImmediately = true; // 是否为立即上传模式
//  设置是否为立即上传模式
function setImmediately(isImmediately) {
    sIsImmediately = isImmediately;
}

// TODO sendtrack方法
var Constant_HOST = 'http://cloud-atlas-collection.oth.web.sdp.101.com/';

// 更新次数上限，达到则触发上传机制
var LIMIT_TIMES = 5;

var autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
/**
 * 更新次数上限，达到则触发上传机制
 * @param limitTime 上传限制次数
 */
function setLimitTime(limitTime) {
    LIMIT_TIMES = limitTime;
}
/**
 *设置是否为调试模式
 * @param isDebugMode true-是，false-否
 */
function DebugHelper_setIsDebugMode(isDebugMode) {
    sIsDebugMode = isDebugMode;
}
/**
 * 设置是否启用日志输出
 * @param isLogEnabled true-启用，false-不启用
 *
 */
function LogProxy_setLogEnabled(isLogEnabled) {
    sIsLogEnabled = isLogEnabled;
}
/**
 * 获取活动ID
 */

/**
 * 创建活动ID
 */
function ActivityIdResolver_createActivityId() {
    sActivityId = guid();
}
function setUploadEnv(env, useHttps) {
    var host = void 0;
    switch (env) {
        case 'PRODUCTION':
            // 生产
            {
                if (useHttps) {
                    host = 'cloud-atlas-collection.sdp.101.com/';
                } else {
                    host = 'cloud-atlas-collection.oth.web.sdp.101.com/';
                }
                break;
            }
        case 'PREPRODUCTION':
            // 预生产
            {
                if (useHttps) {
                    host = 'cloud-atlas-collection.beta.101.com/';
                } else {
                    host = 'cloud-atlas-collection.beta.web.sdp.101.com/';
                }
                break;
            }
        case 'DEVELOPMENT':
            // 开发
            {
                host = 'cloud-atlas-collection.dev.web.nd/';
                break;
            }
        case 'DEBUG':
            // 测试（未使用）
            {
                host = 'cloud-atlas-collection.debug.web.nd/';
                break;
            }
        case 'INTEGRATION':
            // 集成
            {
                host = 'cloud-atlas-collection.pre1.web.nd/';
                break;
            }
        default:
            {
                host = 'cloud-atlas-collection.oth.web.sdp.101.com/';
            }
    }
    if (useHttps) {
        Constant_HOST = 'https://' + host;
    } else {
        Constant_HOST = 'http://' + host;
    }
}
function setAutoTrackEnv(env, useHttps) {
    switch (env) {
        case 'DEVELOPMENT':
            // 开发
            {
                autoURL = 'http://cloud-atlas-server.dev.web.nd/';
                break;
            }
        case 'DEBUG':
            // 测试（未使用）
            {
                autoURL = 'http://cloud-atlas-server.debug.web.nd/';
                break;
            }
        case 'INTEGRATION':
            // 集成
            {
                autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
                break;
            }
        case 'PREPRODUCTION':
            // 预生产
            {
                if (useHttps) {
                    autoURL = 'https://cloud-atlas-server.beta.101.com/';
                } else {
                    autoURL = 'http://cloud-atlas-server.beta.101.com/';
                }
                break;
            }
        case 'PRODUCTION':
            // 生产
            {
                if (useHttps) {
                    autoURL = 'https://cloud-atlas-server.sdp.101.com/';
                } else {
                    autoURL = 'http://cloud-atlas-server.sdp.101.com/';
                }
                // host = '192.168.252.79:8088/'
                break;
            }
        default:
            {
                autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
            }
    }
}
var fileUrl = function () {
    var env = '__ENV';
    var revert = {
        'vendorCss': '',
        'modalJs': '',
        'vendorJs': ''
    };
    var PRODUCT_HOST = 'https://cdncs.101.com/v0.1/static/cloudatlas_cs/websdk';
    switch (env) {
        case 'development':
            revert.vendorCss = 'http://127.0.0.1:8000/lib/vendor.css?t=' + Date.now();
            revert.vendorJs = 'http://127.0.0.1:8000/lib/vendor.js?t=' + Date.now();
            break;
        default:
            // 线上cdn地址
            revert.vendorCss = PRODUCT_HOST + '/v1.7.2/vendor.css';
            revert.vendorJs = PRODUCT_HOST + '/v1.7.2/vendor.js';
    }
    return revert;
}();
function setVisualEnv(env) {
    var visualURL = void 0;
    switch (env) {
        case 'DEVELOPMENT':
            {
                // 开发
                visualURL = ' http://cloud-atlas-server.dev.web.nd/';
                break;
            }
        case 'DEBUG':
            {
                // 测试
                visualURL = 'http://cloud-atlas-server.debug.web.nd/';
                break;
            }
        case 'INTEGRATION':
            {
                // 集成
                visualURL = 'http://cloud-atlas-server.pre1.web.nd/';
                break;
            }
        case 'PREPRODUCTION':
            {
                // 预生产
                visualURL = 'https://cloud-atlas-server.beta.101.com/';
                break;
            }
        case 'PRODUCTION':
            {
                // 生产
                visualURL = 'https://cloud-atlas-server.sdp.101.com/';
                break;
            }
        default:
            {
                visualURL = 'https://cloud-atlas-server.sdp.101.com/';
            }
    }
    return visualURL;
}

var sLogger = window.console || function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function (msg) {};
    return c;
}();
// 日志输出对象，默认为console
/**
   * 输出调试日志
   * @param msg 日志内容
   */
function LogProxy_d(msg) {
    // 兼容IE8
    if (sIsLogEnabled && sLogger.log) {
        sLogger.log(sLogPrefix + msg);
    }
}
/**
 * 输出警告日志
 * @param msg 日志内容
 */
function LogProxy_w(msg) {
    // 兼容IE8
    if (sIsLogEnabled && sLogger.warn) {
        sLogger.warn(sLogPrefix + msg);
    }
}
/**
 * 输出错误日志
 * @param msg 日志内容
 * @param error 异常对象
 */
function LogProxy_e(msg, error) {
    // 兼容IE8
    if (sLogger.error) {
        sLogger.error(sLogPrefix + msg + (error ? '\nerror = ' + error : ''));
    }
}

/**
 * 注册公共事件
 * @param callback 回调函数 popstate事件是url改变的时候，或者hashchange事件
 */
function addHashEvent(callback) {
    var hashEvent = 'onhashchange' in window ? 'hashchange' : 'popstate';
    addEvent(window, hashEvent, callback);
}
/**
 * 注册页面不可见时公共事件
 * @param {*} callback
 */
function addPageViewEvent(callback) {
    var visProp = getHiddenProp();
    if (visProp) {
        var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
        addEvent(document, evtname, callback);
    } else {
        LogProxy_e('浏览器不支持visibilitychange监听事件');
    }
}
// 获取页面隐藏属性
function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'Hidden' in document) {
            return prefixes[i] + 'Hidden';
        }
    }
    // otherwise it's not supported
    return null;
}
// 注册事件。可以能浏览器不识别addEventListener，需要用on来注册两个事件。
function addEvent() {
    function fixEvent(event) {
        if (event) {
            event.preventDefault = fixEvent.preventDefault;
            event.stopPropagation = fixEvent.stopPropagation;
            event._getPath = fixEvent._getPath;
        }
        return event;
    }
    // 元素所在的组成 返回元素事件监听器被触发的一序列的EventTarget对象
    fixEvent._getPath = function () {
        var ev = this;
        var polyfill = function polyfill() {
            try {
                var element = ev.target;
                var pathArr = [element];
                if (element === null || element.parentElement === null) {
                    return [];
                }
                while (element.parentElement !== null) {
                    element = element.parentElement;
                    pathArr.unshift(element);
                }
                return pathArr;
            } catch (err) {
                return [];
            }
        };
        return this.path || this.composedPath && this.composedPath() || polyfill();
    };
    fixEvent.preventDefault = function () {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function () {
        this.cancelBubble = true;
    };
    // 注册事件
    var register_event = function register_event(element, type, handler) {
        if (element && element.addEventListener) {
            element.addEventListener(type, function (e) {
                e._getPath = fixEvent._getPath;
                handler.call(this, e);
            }, false);
        } else {
            var ontype = 'on' + type;
            var old_handler = element[ontype];
            element[ontype] = makeHandler(element, handler, old_handler);
        }
    };
    function makeHandler(element, new_handler, old_handlers) {
        var handler = function handler(event) {
            event = event || fixEvent(window.event);
            if (!event) {
                return undefined;
            }
            event.target = event.srcElement;

            var ret = true;
            var old_result = void 0;
            if (typeof old_handlers === 'function') {
                old_result = old_handlers(event);
            }
            var new_result = new_handler.call(element, event);
            if (old_result === false || new_result === false) {
                ret = false;
            }
            return ret;
        };
        return handler;
    }
    register_event.apply(null, arguments);
}

/**
 * 获取浏览器的属性信息
 * @author RenZhuo
 */

/** ***********  设备信息  *************/
/**
 * 浏览器正在运行操作系统
  */
function getBrowserOS() {
    var result = {};
    result['os_system'] = browserOs();
    return result;
}
/**
 * 浏览器版本
  */
function getBrowserVersion() {
    var result = {};
    var browser = browserBrand();
    result['system_version'] = browser.version;
    return result;
}
/**
 * 浏览器屏幕高度
  */
function getBrowserHeight() {
    var result = {};
    result['screen_height'] = document.documentElement.clientHeight;
    return result;
}
/**
 * 浏览器屏幕宽度
  */
function getBrowserWidtth() {
    var result = {};
    result['screen_width'] = document.documentElement.clientWidth;
    return result;
}
/**
 * 获取浏览器品牌
 */
function getBrowserBrand() {
    var result = {};
    var browser = browserBrand();
    result['brand'] = browser.name;
    return result;
}
/** ***********  设备信息扩展属性  *************/
var BROWSER = 'browser_'; // 浏览器
/**
 * 浏览器代码名称
  */
function getBrowserCodeName() {
    var result = {};
    result[BROWSER + 'codeName'] = navigator.appCodeName;
    return result;
}
/**
 * 获取浏览器内核
 */
function getBrowserCore() {
    var result = {};
    var browser = isBroswer();
    result['kernel'] = browser.name;
    return result;
}
/**
 * 浏览器属性信息
  */
function getBrowserUserAgent() {
    var result = {};
    result[BROWSER + 'userAgent'] = navigator.userAgent;
    return result;
}
/**
 * 屏幕分辨率
  */
function getBrowserResolution() {
    var result = {};
    result[BROWSER + 'resolution'] = window.screen.width + '*' + window.screen.height;
    return result;
}
/**
 * 屏幕尺寸
  */
function getBrowserSize() {
    var result = {};
    var dom = document.createElement('div');
    dom.style.width = '1cm';
    document.body.appendChild(dom);
    var ww = dom.offsetWidth;
    var w = window.screen.width / ww;
    var h = window.screen.height / ww;
    var r = Math.round(Math.sqrt(w * w + h * h) / 2.54);
    result[BROWSER + 'screen_size'] = r;
    document.body.removeChild(dom);
    return result;
}
/**
 * 浏览器支持语言
  */
function getBrowserLanguage() {
    var result = {};
    result[BROWSER + 'language'] = navigator.language;
    return result;
}
/**
 * 浏览器是否启用cookie
  */
function getBrowserCookieEnabled() {
    var result = {};
    result[BROWSER + 'cookieEnabled'] = navigator.cookieEnabled;
    return result;
}
/** ********************          浏览器内核和品牌  ***********************/
/**
 * 检测浏览器内核--返回的是两个key，name：浏览器内核的名称---version：浏览器的版本号
  */
function isBroswer() {
    // 检测浏览器内核--返回的是两个key，name：浏览器内核的名称---version：浏览器的版本号
    var _broswer = {};
    var sUserAgent = navigator.userAgent;
    var isOpera = sUserAgent.indexOf('Opera') > -1;
    if (isOpera) {
        // 首先检测Opera是否进行了伪装
        if (navigator.appName === 'Opera') {
            // 如果没有进行伪装，则直接后去版本号
            _broswer.version = parseFloat(navigator.appVersion);
        } else {
            var reOperaVersion = new RegExp('Opera (\\d+.\\d+)');
            // 使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
            reOperaVersion.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
        }
        _broswer.opera = true;
        _broswer.name = 'opera';
    }
    var isChrome = sUserAgent.indexOf('Chrome') > -1;
    if (isChrome) {
        var reChorme = new RegExp('Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?');
        reChorme.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.chrome = true;
        _broswer.name = 'chrome';
    }
    // 排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
    var isKHTML = (sUserAgent.indexOf('KHTML') > -1 || sUserAgent.indexOf('Konqueror') > -1 || sUserAgent.indexOf('AppleWebKit') > -1) && !isChrome;
    if (isKHTML) {
        // 判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
        var isSafari = sUserAgent.indexOf('AppleWebKit') > -1;
        var isKonq = sUserAgent.indexOf('Konqueror') > -1;
        if (isSafari) {
            var reAppleWebKit = new RegExp('Version/(\\d+(?:\\.\\d*)?)');
            reAppleWebKit.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.safari = true;
            _broswer.name = 'safari';
        } else if (isKonq) {
            var reKong = new RegExp('Konqueror\\/(\\d+(?:\\.\\d+(?:\\.\\d)?)?)');
            reKong.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.konqueror = true;
            _broswer.name = 'konqueror';
        }
    }
    // !isOpera 避免是由Opera伪装成的IE
    var isIE = sUserAgent.indexOf('compatible') > -1 && sUserAgent.indexOf('MSIE') > -1 && !isOpera || sUserAgent.indexOf('Trident') > -1 && sUserAgent.indexOf('rv:11.0') > -1 && !isOpera;
    if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.msie = true;
        // _broswer.name = 'msie'
        _broswer.name = 'Trident';
    }
    // 排除Chrome 及 Konqueror/Safari 的伪装
    var isMoz = sUserAgent.indexOf('Gecko') > -1 && !isChrome && !isKHTML;
    if (isMoz) {
        var reMoz = new RegExp('rv:(\\d+\\.\\d+(?:\\.\\d+)?)');
        reMoz.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.mozilla = true;
        _broswer.name = 'mozilla';
    }
    // Edge浏览器
    var isEdge = sUserAgent.indexOf('Edge') > -1;
    if (isEdge) {
        var _reIE = new RegExp('Edge (\\d+\\.\\d+);');
        _reIE.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.edge = true;
        // _broswer.name = 'msie'
        _broswer.name = 'Edge';
    }
    return _broswer;
}
/**
 * 获取浏览器类型以及版本号
 * 支持国产浏览器:猎豹浏览器、搜狗浏览器、傲游浏览器、360极速浏览器、360安全浏览器、
 * QQ浏览器、百度浏览器等.
 * 支持国外浏览器:IE,Firefox,Chrome,safari,Opera等.
 * 使用方法:
 * 获取浏览器版本:Browser.client.version
 * 获取浏览器名称(外壳):Browser.client.name
 **/
function browserBrand() {
    var document = window.document;
    var navigator = window.navigator;
    var agent = navigator.userAgent.toLowerCase();
    // IE8+支持.返回浏览器渲染当前文档所用的模式
    // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
    // IE10:10(兼容模式7||8||9)
    var IEMode = document.documentMode;
    // chrome
    var chrome = window.chrome || false;
    var System = {
        // user-agent
        agent: agent,
        // 是否为Edge
        isEdge: /edge/.test(agent),
        // 是否为IE
        isIE: /msie/.test(agent) || /trident/.test(agent) && /rv:11.0/.test(agent),
        // Gecko内核
        isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
        // webkit内核
        isWebkit: agent.indexOf('webkit') > 0,
        // 是否为标准模式
        isStrict: document.compatMode === 'CSS1Compat',
        // 是否支持subtitle
        supportSubTitle: function supportSubTitle() {
            return 'track' in document.createElement('track');
        },
        // 是否支持scoped
        supportScope: function supportScope() {
            return 'scoped' in document.createElement('style');
        },
        // 获取IE的版本号
        ieVersion: function ieVersion() {
            try {
                return agent.match(/msie ([\d.]+)/)[1] || agent.match(/rv: ([\d.]+)/)[1] || 0;
            } catch (e) {
                LogProxy_d('error');
                return IEMode;
            }
        },
        edgeVersion: function edgeVersion() {
            try {
                return agent.match(/edge\/([\d.]+)/)[1] || 0;
            } catch (e) {
                LogProxy_d('error');
                return IEMode;
            }
        },
        // Opera版本号
        operaVersion: function operaVersion() {
            try {
                if (window.opera) {
                    return agent.match(/opera.([\d.]+)/)[1];
                } else if (agent.indexOf('opr') > 0) {
                    return agent.match(/opr\/([\d.]+)/)[1];
                }
            } catch (e) {
                LogProxy_d('error');
                return 0;
            }
        },
        // 描述:version过滤.如31.0.252.152 只保留31.0
        versionFilter: function versionFilter() {
            if (arguments.length === 1 && typeof arguments[0] === 'string') {
                var version = arguments[0];
                var start = version.indexOf('.');
                if (start > 0) {
                    var end = version.indexOf('.', start + 1);
                    if (end !== -1) {
                        return version.substr(0, end);
                    }
                }
                return version;
            } else if (arguments.length === 1) {
                return arguments[0];
            }
            return 0;
        }
    };
    try {
        // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
        System.type = System.isEdge ? 'Edge' : System.isIE ? 'IE' : window.opera || agent.indexOf('opr') > 0 ? 'Opera' : agent.indexOf('chrome') > 0 ? 'Chrome'
        // safari也提供了专门的判定方式
        : window.openDatabase ? 'Safari' : agent.indexOf('firefox') > 0 ? 'Firefox' : 'unkonw';
        // 版本号
        System.version = System.type === 'Edge' ? System.edgeVersion() : System.type === 'IE' ? System.ieVersion() : System.type === 'Firefox' ? agent.match(/firefox\/([\d.]+)/)[1] : System.type === 'Chrome' ? agent.match(/chrome\/([\d.]+)/)[1] : System.type === 'Opera' ? System.operaVersion() : System.type === 'Safari' ? agent.match(/version\/([\d.]+)/)[1] : '0';
        // 浏览器外壳
        System.shell = function () {
            // 遨游浏览器
            if (agent.indexOf('maxthon') > 0) {
                System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                return '傲游浏览器';
            }
            // QQ浏览器
            if (agent.indexOf('qqbrowser') > 0) {
                System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                return 'QQ浏览器';
            }
            // 搜狗浏览器
            if (agent.indexOf('se 2.x') > 0) {
                return '搜狗浏览器';
            }
            // Chrome:也可以使用window.chrome && window.chrome.webstore判断
            if (chrome && System.type !== 'Opera') {
                var external = window.external;
                var clientInfo = window.clientInformation;
                // 客户端语言:zh-cn,zh.360下面会返回undefined
                var clientLanguage = clientInfo.languages;
                // 猎豹浏览器:或者agent.indexOf('lbbrowser')>0
                if (external && 'LiebaoGetVersion' in external) {
                    return '猎豹浏览器';
                }
                // 百度浏览器
                if (agent.indexOf('bidubrowser') > 0) {
                    System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] || agent.match(/chrome\/([\d.]+)/)[1];
                    return '百度浏览器';
                }
                // 360极速浏览器和360安全浏览器
                if (System.supportSubTitle() && typeof clientLanguage === 'undefined') {
                    // object.key()返回一个数组.包含可枚举属性和方法名称
                    var storeKeyLen = Object.keys(chrome.webstore).length;
                    return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                }
                return 'Chrome';
            }
            return System.type;
        };
        // 浏览器名称(如果是壳浏览器,则返回壳名称)
        System.name = System.shell();
        // 对版本号进行过滤过处理
        // System.version = System.versionFilter(System.version)
    } catch (e) {
        LogProxy_d('error');
    }
    return System;
}
/**
 * 获取操作系统
 */
function browserOs() {
    var userAgent = navigator.userAgent;
    var isWin = navigator.platform == 'Win32' || navigator.platform == 'Win64' || navigator.platform == 'Windows';
    var isMac = navigator.platform == 'Mac68K' || navigator.platform == 'MacPPC' || navigator.platform == 'Macintosh' || navigator.platform == 'MacIntel';
    if (isMac) return 'Mac';
    var isUnix = navigator.platform == 'X11' && !isWin && !isMac;
    if (isUnix) return 'Unix';
    var isLinux = String(navigator.platform).indexOf('Linux') > -1;
    var bIsAndroid = userAgent.toLowerCase().match(/android/i) == 'android';
    if (isLinux) {
        if (bIsAndroid) return 'Android';
        return 'Linux';
    }
    if (isWin) {
        var isWin2K = userAgent.indexOf('Windows NT 5.0') > -1 || userAgent.indexOf('Windows 2000') > -1;
        if (isWin2K) return 'Win2000';
        var isWinXP = userAgent.indexOf('Windows NT 5.1') > -1 || userAgent.indexOf('Windows XP') > -1;
        if (isWinXP) return 'WinXP';
        var isWin2003 = userAgent.indexOf('Windows NT 5.2') > -1 || userAgent.indexOf('Windows 2003') > -1;
        if (isWin2003) return 'Win2003';
        var isWinVista = userAgent.indexOf('Windows NT 6.0') > -1 || userAgent.indexOf('Windows Vista') > -1;
        if (isWinVista) return 'WinVista';
        var isWin7 = userAgent.indexOf('Windows NT 6.1') > -1 || userAgent.indexOf('Windows 7') > -1;
        if (isWin7) return 'Win7';
        var isWin8 = userAgent.indexOf('Windows NT 6.2') > -1 || userAgent.indexOf('Windows 8') > -1;
        if (isWin8) return 'Win8';
        var isWin81 = userAgent.indexOf('Windows NT 6.3') > -1 || userAgent.indexOf('Windows 8.1') > -1;
        if (isWin81) return 'Win8.1';
        var isWin10 = userAgent.indexOf('Windows NT 6.4') > -1 || userAgent.indexOf('Windows NT 10.0') > -1 || userAgent.indexOf('Windows 10') > -1;
        if (isWin10) return 'Win10';
        return 'other';
    }
}

/**
 * 获取浏览器属性
 * @author RenZhuo
 */

/**
 * 获取通用属性
 */
function getGeneralAttribute() {
    var result = {};
    assign(result, getBrowserOS(), getBrowserVersion(), getBrowserBrand(), getBrowserHeight(), getBrowserWidtth());
    return result;
}

/**
 * 获取扩展属性
 */
function getExtProperties() {
    var result = {};
    assign(result, getBrowserCodeName(), getBrowserCore(), getBrowserResolution(), getBrowserSize(), getBrowserLanguage(), getBrowserUserAgent(), getBrowserCookieEnabled());
    return result;
}

// LegacyConvertor
var BUSINESS_TYPE = 'bussiness_type';
var PROPERTIES = 'properties';
var USER_ID = 'user_id';
var DEVICE_ID = 'device_id';
var CREATE_TIME = 'create_time';
var SESSION_IP = 'session_ip';
var FUNCTION_ID = 'function_id';
var APP_VER = 'app_ver';
var LOGIN = 'login';
var GZIP_VALID_ORIGIN = 'cloud-atlas-web-sdk';
// 压缩对象
var sGzipFun = null;
/**
 * 比较两个二进制数组
 * @param buf1
 * @param buf2
 * @returns {boolean}
 * @constructor
 */
function LegacyConvertor_CompareBufArray(buf1, buf2) {
    var len1 = buf1.length;
    var len2 = buf2.length;
    if (len1 !== len2) {
        return false;
    }
    for (var i = 0; i < len1; i++) {
        if (buf1[i] !== buf2[i]) {
            return false;
        }
    }
    return true;
}
function LegacyConvertor_initGzipFun(gzipFun) {
    // 如果不支持Uint8Array 则不需要压缩
    if (window.Uint8Array) {
        var gzipValid = new Uint8Array([31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 75, 206, 201, 47, 77, 209, 77, 44, 201, 73, 44, 214, 45, 79, 77, 210, 45, 78, 201, 6, 0, 249, 255, 225, 61, 19, 0, 0, 0]);
        if (gzipFun) {
            var buf = string2buf(GZIP_VALID_ORIGIN);
            var res = gzipFun(buf);
            if (LegacyConvertor_CompareBufArray(gzipValid, res)) {
                sGzipFun = gzipFun;
            } else {
                throw 'Invalid gzip function';
            }
        } else {
            LogProxy_d('Not to use gzip compress');
        }
    } else {
        LogProxy_d('Browser does not support the Unit8Array , will not to use gzip compress');
    }
}
/**
 * 是否进行压缩
 */
function LegacyConvertor_isCompress() {
    if (sGzipFun) {
        return true;
    }
    return false;
}
function LegacyConvertor_convert4IE8(body) {
    var data = {};
    data['body'] = JSON.parse(body); // body
    var head = {};
    head['Content-type'] = 'application/json';
    data['head'] = head;
    return JSON.stringify(data);
}
function LegacyConvertor_gzipCompress(rawBody) {
    var rawLen = rawBody.length;
    var bufBody = string2buf(rawBody);
    var buf = sGzipFun(bufBody);
    var bufLen = buf.length;
    LogProxy_d('origin: ' + rawLen + '，after compress：' + bufLen);
    return buf;
}
function LegacyConvertor_convert(collectedData) {
    // const activityId = ActivityIdResolver_getActivityId();
    var deviceId = DeviceInfoResolver_getDeviceId();
    var data = [];
    var result = { data: data };
    // 会话数据
    var len = collectedData.sessionList.length;
    for (var i = 0; i < len; i++) {
        var session = collectedData.sessionList[i];
        // 会话开始
        var loginData = {};
        loginData[BUSINESS_TYPE] = LOGIN;
        var prop = {};
        prop[FUNCTION_ID] = 21;
        prop[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date(session.start));
        if (session.userId) {
            prop[USER_ID] = session.userId;
        }
        prop[APP_VER] = session.appVer;
        prop[DEVICE_ID] = deviceId;
        prop['session_id'] = session.id;
        if (session.ip) {
            prop[SESSION_IP] = session.ip;
        }
        loginData[PROPERTIES] = prop;
        data.push(loginData);

        // 会话结束
        if (session.end > 0) {
            var logoutData = {};
            logoutData[BUSINESS_TYPE] = LOGIN;
            prop = {};
            prop[FUNCTION_ID] = 22;
            prop[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date(session.end));
            if (session.userId) {
                prop[USER_ID] = session.userId;
            }
            prop[APP_VER] = session.appVer;
            prop['session_id'] = session.id;
            prop[DEVICE_ID] = deviceId;
            logoutData[PROPERTIES] = prop;
            data.push(logoutData);
        }
    }
    len = collectedData.eventList.length;
    for (var _i = 0; _i < len; _i++) {
        var event = collectedData.eventList[_i];
        var eventData = {};
        // 事件类型
        eventData[BUSINESS_TYPE] = 'custom_event_log';
        var _prop = {};
        _prop['event_tag'] = event.id;
        _prop['event_time'] = CurrentTimeHelper_formatDate(new Date(event.time));
        _prop[USER_ID] = event.userId;
        _prop[DEVICE_ID] = deviceId;
        _prop['session_id'] = event.sessionId;
        if (event.appVer) {
            _prop['app_ver'] = event.appVer;
        }
        if (event.value) {
            if (event.value[KEY_EVENT_LABEL]) {
                _prop['event_label'] = event.value[KEY_EVENT_LABEL];
                delete event.value[KEY_EVENT_LABEL];
            }
            if (event.value[KEY_EVENT_INT_VALUE]) {
                _prop['event_value'] = event.value[KEY_EVENT_INT_VALUE];
                delete event.value[KEY_EVENT_INT_VALUE];
            }
            var hasProp = false;
            for (var propValue in event.value) {
                // 判断event.value对象是否为空，相较于Object.keys[9+] 能兼容更低版本的ie 6+
                hasProp = true;
                break;
            }
            if (hasProp) {
                eventData['ext_properties'] = event.value;
            }
        }
        eventData[PROPERTIES] = _prop;
        data.push(eventData);
    }
    len = collectedData.errorList.length;
    for (var _i2 = 0; _i2 < len; _i2++) {
        var error = collectedData.errorList[_i2];
        var _eventData = {};
        _eventData[BUSINESS_TYPE] = 'exception_log';
        var _prop2 = {};
        _prop2['ex_type'] = error.type;
        _prop2['ex_time'] = CurrentTimeHelper_formatDate(new Date(error.time));
        _prop2['ex_msg'] = error.msg;
        // prop[ACTIVITY_ID] = error.activityId;
        if (error.appVer) {
            _prop2['app_ver'] = error.appVer;
        }
        _eventData[PROPERTIES] = _prop2;
        data.push(_eventData);
    }
    // 渠道信息
    var sessionLen = collectedData.sessionList.length;
    if (sessionLen > 0) {
        var deviceData = {};
        deviceData[BUSINESS_TYPE] = 'device';
        var deviceProp = getGeneralAttribute();
        deviceProp['channel_id'] = AppInfoResolver_getChannelId();
        deviceProp[DEVICE_ID] = deviceId;
        deviceProp[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date());
        deviceData[PROPERTIES] = deviceProp;
        deviceData['ext_properties'] = getExtProperties();
        data.push(deviceData);
    }
    if (data.length === 0) {
        return null;
    }
    return JSON.stringify(result);
}

/**
  * 发送异步Post请求，使用方式如下
  * @param url 服务端Url
  * @param data Post数据
  * @param callback 回调（object，可选，需要带onFail(msg)与onSuccess()两个方法）
  * @param isAsync 是否异步上传，可选，默认为异步上传
  */
function UploadUtils_postAsyncRequest(url, data, callback, isAsync) {
    originAjax('post', url, data, callback, isAsync);
}
function UploadUtils_getAsyncRequest(url, data, callback, isAsync) {
    originAjax('get', url, data, callback, isAsync);
}
function UploadUtils_ie8OnError(sCallBack) {
    if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
        sCallBack.onFail('Unknown error');
    }
}
function UploadUtils_ie8OnTimeout(sCallBack) {
    if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
        sCallBack.onFail('Time out');
    }
}
function getAutoTrack(url, callback, isAsync) {
    originAjax('get', url, '', callback, isAsync);
}
function originAjax(methods, url, data, callback, isAsync) {
    var sXmlHttp = null;
    var sCallBack = callback;
    if (window.XMLHttpRequest) {
        // Mozilla 浏览器（将XMLHttpRequest对象作为本地浏览器对象来创建）
        sXmlHttp = new XMLHttpRequest();
        if (!('withCredentials' in sXmlHttp) && window.XDomainRequest) {
            // IE8 IE9
            if (window.location.protocol !== 'http:') {
                LogProxy_d('sdk just support http protocol');
                return false;
            }
            sXmlHttp = new XDomainRequest();
        }
    } else if (window.ActiveXObject) {
        // IE浏览器（将XMLHttpRequest对象作为ActiveX对象来创建）
        try {
            sXmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                sXmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
    }
    if (sXmlHttp == null) {
        LogProxy_e('Can not create XMLHttpRequest object');
        return false;
    }
    if (isAsync === undefined || isAsync === null || isAsync.constructor !== Boolean) {
        isAsync = true;
    }
    if (methods === 'post') {
        if (window.XDomainRequest && sXmlHttp.constructor === XDomainRequest) {
            // IE8
            data = LegacyConvertor_convert4IE8(data);
            sXmlHttp.onerror = function () {
                UploadUtils_ie8OnError(sCallBack);
            };
            sXmlHttp.ontimeout = function () {
                UploadUtils_ie8OnTimeout(sCallBack);
            };
            sXmlHttp.onload = function () {
                if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                    LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                }
                if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                    sCallBack.onSuccess();
                }
            };
            sXmlHttp.open(methods, url);
        } else {
            sXmlHttp.open(methods, url, isAsync);
            if (LegacyConvertor_isCompress()) {
                data = LegacyConvertor_gzipCompress(data);
                sXmlHttp.setRequestHeader('Content-Type', 'application/gzip;');
            } else {
                sXmlHttp.setRequestHeader('Content-Type', 'application/json;');
            }
            sXmlHttp.onreadystatechange = function () {
                // sXmlHttp.readyState
                // 0 － （未初始化）还没有调用send()方法
                // 1 － （载入）已调用send()方法，正在发送请求
                // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                // 3 － （交互）正在解析响应内容
                // 4 － （完成）响应内容解析完成，可以在客户端调用了
                if (sXmlHttp.readyState == 4) {
                    if (sXmlHttp.status == 200) {
                        if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                            LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                        }
                        if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                            sCallBack.onSuccess();
                        }
                    } else {
                        if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
                            sCallBack.onFail(sXmlHttp.responseText);
                        }
                    }
                } else {
                    LogProxy_d('Upload processed, status = ' + sXmlHttp.readyState);
                }
            };
        }
        sXmlHttp.send(data);
    } else {
        if (window.XDomainRequest && sXmlHttp.constructor === XDomainRequest) {
            // IE8
            sXmlHttp.onerror = function () {
                UploadUtils_ie8OnError(sCallBack);
            };
            sXmlHttp.ontimeout = function () {
                UploadUtils_ie8OnTimeout(sCallBack);
            };
            sXmlHttp.onload = function () {
                if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                    LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                }
                if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                    sCallBack.onSuccess(sXmlHttp.responseText);
                }
            };
            sXmlHttp.open(methods, url);
        } else {
            sXmlHttp.open(methods, url, isAsync);
            sXmlHttp.onreadystatechange = function () {
                // sXmlHttp.readyState
                // 0 － （未初始化）还没有调用send()方法
                // 1 － （载入）已调用send()方法，正在发送请求
                // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                // 3 － （交互）正在解析响应内容
                // 4 － （完成）响应内容解析完成，可以在客户端调用了
                if (sXmlHttp.readyState == 4) {
                    if (sXmlHttp.status == 200) {
                        if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                            LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                        }
                        if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                            sCallBack.onSuccess(sXmlHttp.responseText);
                        }
                    } else {
                        if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
                            sCallBack.onFail(sXmlHttp.responseText);
                        }
                    }
                } else {
                    LogProxy_d('Upload processed, status = ' + sXmlHttp.readyState);
                }
            };
        }
        sXmlHttp.send(null);
    }
}

/**
     * 获取元素信息
     * @param {*object} obj 元素对象
     */
function getEleInfo(obj) {
    if (!obj.target) {
        return false;
    }
    var target = obj.target;
    var tagName = target.tagName.toLowerCase();
    var props = {};
    props.element_id = target.getAttribute('id');
    props.element_name = target.getAttribute('name');
    props.element_class_name = typeof target.className === 'string' ? target.className : '';
    props.element_type = tagName;
    props.element_target_url = target.getAttribute('href');
    // 获取内容
    var textContent = '';
    if (target.textContent) {
        textContent = trim(target.textContent);
    } else if (target.innerText) {
        textContent = trim(target.innerText);
    }
    if (textContent) {
        textContent = textContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ').substring(0, 255);
    }
    props.element_content = textContent || '';

    // 针对inut默认只采集button和submit非名感的词汇。可以自定义（银联提）
    if (tagName === 'input') {
        if (target.type === 'button' || target.type === 'submit') {
            props.element_content = target.value || '';
        }
    }
    props = stripEmptyProperties(props);
    props.url = location.href;
    props.url_path = location.pathname;
    props.title = document.title;
    return props;
}
// 去掉对象中undefined和null
function stripEmptyProperties(p) {
    var ret = {};
    for (var k in p) {
        if (p[k] != null) {
            ret[k] = p[k];
        }
    }
    return ret;
}
/**
     *
     * @param {*} el 元素
     * @param {*} arr dom选择器数组
     */
function getDomSelector(el, arr) {
    if (!el || !el.parentNode || !el.parentNode.children) {
        return false;
    }
    arr = arr && arr.join ? arr : [];
    var name = el.nodeName.toLowerCase();
    if (!el || name === 'body' || el.nodeType != 1) {
        arr.unshift('body');
        return arr.join(' > ');
    }
    arr.unshift(selector(el));
    if (el.id) return arr.join(' > ');
    return getDomSelector(el.parentNode, arr);
}
// dom在兄弟标签中的下标。
function getDomIndex(el) {
    var indexof = [].indexOf;
    if (!el.parentNode) return -1;
    var list = el.parentNode.children;
    if (!list) return -1;
    var len = list.length;
    if (indexof) return indexof.call(list, el);
    for (var i = 0; i < len; ++i) {
        if (el == list[i]) return i;
    }
    return -1;
}
// 选择器
function selector(el) {
    // var classname = _.trim(el.className.baseVal ? el.className.baseVal : el.className);
    var i = el.parentNode && el.parentNode.nodeType == 9 ? -1 : getDomIndex(el);
    if (el.id) {
        return '#' + el.id;
    }
    return el.tagName.toLowerCase() + ( // + (classname ? classname.replace(/^| +/g, '.') : '')
    ~i ? ':nth-child(' + (i + 1) + ')' : '');
}
// 去空格
function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

function event$1(options) {
    if (options === undefined || options === null || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        LogProxy_e('Invalid params for onEvent, type = ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)) + ', value = ' + options);
        return;
    }
    var eventId = options.eventId;
    if (eventId === undefined || eventId === null || eventId.constructor !== String) {
        LogProxy_e('Invalid params for onEvent, eventId type = ' + (typeof eventId === 'undefined' ? 'undefined' : _typeof(eventId)) + ', value = ' + eventId);
        return;
    }
    var label = options.label;
    if (label !== undefined && label !== null && label.constructor !== String) {
        LogProxy_e('Invalid params for onEvent, label type = ' + (typeof label === 'undefined' ? 'undefined' : _typeof(label)) + ', value = ' + label);
        return;
    }
    var info = options.info;
    if (info !== undefined && info !== null) {
        if ((typeof info === 'undefined' ? 'undefined' : _typeof(info)) !== 'object') {
            LogProxy_e('Invalid params for onEvent, info type = ' + (typeof info === 'undefined' ? 'undefined' : _typeof(info)) + ', value = ' + info);
            return;
        }
        // info中只支持字符串
        for (var prop in info) {
            if (info[prop] === undefined || info[prop] === null || info[prop].constructor !== String) {
                LogProxy_e('Invalid params for onEvent, type of info.' + prop + ' = ' + _typeof(info[prop]) + ', value = ' + info[prop]);
                return;
            }
        }
    }
    var value = options.value;
    if (value !== undefined && value !== null) {
        if (value.constructor !== Number) {
            LogProxy_e('Invalid params for onEvent, value type = ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ', value = ' + value);
            return;
        }
        // 是否为整数
        if (parseInt(value) !== value) {
            LogProxy_e('Invalid params for onEvent, value is not int : ' + value);
            return;
        }
    }
    if (!CloudAtlasImpl_isSessionExist()) {
        CloudAtlasImpl_onOpen();
    }
    if (options.callback) {
        options.callback();
        delete options.callback();
    }
    CloudAtlasImpl_onEvent(options);
}

function trackLink(obj, event_prop) {
    obj = obj || {};
    var link = null;
    if (obj.ele) {
        link = obj.ele;
    }
    if (obj.event) {
        if (obj.target) {
            link = obj.target;
        } else {
            link = obj.event.target;
        }
    }
    event_prop = event_prop || {};
    if (!link || (typeof link === 'undefined' ? 'undefined' : _typeof(link)) !== 'object') {
        return false;
    }
    // 如果是非当前页面会跳转的链接，直接track
    if (!link.href || /^javascript/.test(link.href) || link.target || link.download || link.onclick) {
        sendTrack(event_prop);
        return false;
    }
    function linkFunc(e) {
        e.stopPropagation();
        e.preventDefault(); // 阻止默认跳转
        var hasCalled = false;
        function track_a_click() {
            if (!hasCalled) {
                hasCalled = true;
                location.href = link.href; // 把 A 链接的点击跳转,改成 location 的方式跳转
            }
        }
        setTimeout(track_a_click, 1000); // 如果没有回调成功，设置超时回调
        // TODO 发送数据
        sendTrack(event_prop, track_a_click); // 把跳转操作加在callback里
    }
    if (obj.event) {
        linkFunc(obj.event);
    }
    if (obj.ele) {
        addEvent(obj.ele, 'click', function (e) {
            linkFunc(e);
        });
    }
}
// 触发页面点击事件。获取这个标签的信息。
function start(ev, target, tagName) {
    var selector = getDomSelector(target);
    var prop = getEleInfo({ target: target });
    //  先不采集，置空
    //   prop.element_selector = selector ? selector : '';
    // prop.element_selector = '';
    if (tagName === 'a') {
        // TODO
        trackLink({ event: ev, target: target }, prop);
    } else {
        // TODO 如何发送。
        sendTrack(prop);
    }
}
function sendTrack(prop, callback) {
    if (callback) {
        event$1({ eventId: 'AutoPageview', info: prop, callback: callback });
    } else {
        event$1({ eventId: 'AutoPageview', info: prop });
    }
}

// -----------------------------------------
// CollectedDataPersister
var sCurrentEnv = null;
var sCurrentData = null;
var sDataPending = null;

var sUpdateTimes = 0; // 更新次数, 当前localStorage存在多少条数据
var storageKey = []; // localstorage的key值数组
var failedNumber = 0; // 上传失败次数
var uploadData = void 0; // 上传数据

function CollectedDataPersister_init() {
    // TODO (后续考虑)从持久化中初始化
    sCurrentEnv = new RunningEnv();
    // 退出页面时持久化登出信息
    var temp = window.onbeforeunload;
    window.onbeforeunload = function () {
        if (sCurrentData.sessionList && sCurrentData.sessionList.length > 0) {
            var currentTime = CurrentTimeHelper_currentTimeMillis();
            // 获取session列表中最后一条的会话数据
            var last = sCurrentData.sessionList[sCurrentData.sessionList.length - 1];
            last.end = currentTime;
            LocalStoragePersist_saveCollectedData(0, last);
        }
        if (temp) {
            return temp();
        }
    };
}
function CollectedDataPersister_setUploadData(data, type) {
    sDataPending = null;
    sDataPending = new CollectedData();
    sDataPending[type].push(data);
}
function CollectedDataPersister_setDataPengdData(data) {
    sDataPending = data;
}

/**
   * 获取正在采集中的数据
   *
   * @return 数据对象
   */
function CollectedDataPersister_getCurrentData() {
    if (sCurrentData == null) {
        sCurrentData = new CollectedData();
    }
    return sCurrentData;
}

/**
   * 获取当前运行环境
   * @returns {*}当前运行环境对象，不会为空
   */
function CollectedDataPersister_getCurrentEnv() {
    return sCurrentEnv;
}

/**
 * 清空发送中数据（在发送成功后调用）
 */
function CollectedDataPersister_clearSendingData() {
    LocalStoragePersist_clearCollectedData(storageKey);
    storageKey = null;
}

/**
 * 通知更新
 */
function CollectedDataPersister_notifyUpdate() {
    sUpdateTimes++;
    if (sUpdateTimes >= LIMIT_TIMES) {
        CollectedDataUploader_triggerDataUpload();
        sUpdateTimes = 0;
    }
}

// CollectedDataUploader
var sWaitingForResult = false; // 是否正在等待发送结果
var CollectedDataUploader_sendCallback = {
    onSuccess: function onSuccess() {
        if (sIsLogEnabled) {
            LogProxy_d('Upload success');
        }
        if (!sIsImmediately && isLocalStorageSupport()) {
            CollectedDataPersister_clearSendingData();
            sWaitingForResult = false;
            failedNumber = 0;
            CollectedDataPersister_traversalStorage();
        }
    },
    onFail: function onFail(msg) {
        LogProxy_w('Upload failed, reason = ' + (msg || 'unknown reason'));
        if (!sIsImmediately && isLocalStorageSupport()) {
            failedNumber++;
            sWaitingForResult = false;
            if (failedNumber >= 3) {
                CollectedDataPersister_clearSendingData();
                failedNumber = 0;
                CollectedDataPersister_traversalStorage();
            }
            CollectedDataUploader_triggerDataUpload();
        }
    }
};

// 遍历localStroage 判断当前的埋点数据是否存在会话数据或大于限制的条数，存在该情况触发上传数据
function CollectedDataPersister_traversalStorage() {
    var StorageData = {
        count: 0,
        isExistSession: false
    };
    if (isLocalStorageSupport()) {
        for (var i = 0; i < storage.length; i++) {
            var key = storage.key(i);
            if (/^atlas_data/.test(key)) {
                StorageData.count++;
            }
            if (/^atlas_data_0/.test(key)) {
                StorageData.isExistSession = true;
            }
        }
        if (StorageData.count >= LIMIT_TIMES || StorageData.isExistSession) {
            CollectedDataUploader_sendPendingData();
        } else if (!StorageData.isExistSession && StorageData.count <= LIMIT_TIMES) {
            sUpdateTimes = StorageData.count;
        }
    }
}

/**
 * 将待发送数据进行转换并触发发送
 * @param isAsync 是否异步上传，可选，默认为异步上传
 */
function CollectedDataUploader_sendPendingData(isAsync) {
    var dataToSend = void 0;
    if (sIsImmediately || !isLocalStorageSupport()) {
        // 立即上传
        dataToSend = sDataPending;
    } else {
        if (failedNumber === 0) {
            // 失败次数为0
            var storageData = LocalStoragePersist_queryCollecteData();
            storageKey = storageData.keys;
            uploadData = storageData.data;
            dataToSend = storageData.data;
        } else {
            // 上传失败
            dataToSend = uploadData;
        }
    }
    if (dataToSend !== null && dataToSend.hasValidData()) {
        sWaitingForResult = true; // 有数据可发送，则置为等待结果返回。
        var dataStr = LegacyConvertor_convert(dataToSend);
        if (dataStr !== null) {
            if (sIsLogEnabled) {
                LogProxy_d('Upload = ' + dataStr);
            }
            UploadUtils_postAsyncRequest(Constant_HOST + 'v0.1/' + AppInfoResolver_getAppKey() + '/action/collect', dataStr, CollectedDataUploader_sendCallback, isAsync);
        } else {
            CollectedDataUploader_sendCallback.onSuccess();
        }
    }
}

/**
 * 触发待发送数据上传
 * @param isAsync 是否异步上传，可选，默认为异步上传
 */
function CollectedDataUploader_triggerDataUpload(isAsync) {
    // 检测当前队列及执行状态，若不在等待返回，则直接执行
    if (!sWaitingForResult) {
        CollectedDataUploader_sendPendingData(isAsync);
    }
}
/**
 * 立即上传数据
 * @param isAsync 是否异步上传，可选，默认为异步上传
 */
function CollectedDataUploader_uploadImmediately() {
    CollectedDataUploader_sendPendingData();
}

//   全埋点，由于回调
function addAutoTrack() {
    addEvent(document, 'click', function (e) {
        var ev = e || window.event;
        if (!ev) {
            return false;
        }
        var target = ev.target || ev.srcElement;
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
            return false;
        }
        if (typeof target.tagName !== 'string') {
            return false;
        }
        var tagName = target.tagName.toLowerCase();
        if (tagName.toLowerCase() === 'body' || tagName.toLowerCase() === 'html') {
            return false;
        }
        if (!target || !target.parentNode || !target.parentNode.children) {
            return false;
        }
        var parent_ele = target.parentNode.tagName.toLowerCase();
        if (parent_ele === 'a' || parent_ele === 'button' || parent_ele === 'input') {
            start(ev, target.parentNode, target.parentNode.tagName.toLowerCase());
        } else if (tagName === 'a' || tagName === 'button' || tagName === 'input') {
            start(ev, target, tagName);
        }
    });
}
var autoTrack_sendCallback = {
    onSuccess: function onSuccess(data) {
        LogProxy_d('Upload success');
        data = JSON.parse(data);
        if (data.available) {
            addAutoTrack();
        }
    },
    onFail: function onFail(msg) {
        LogProxy_w('Upload failed, reason = ' + (msg || 'unknown reason'));
    }
};

var sHasInit = false; // 是否已初始化
function CloudAtlasImpl_init(appKey, appVer, gzipFun) {
    CloudAtlasImpl_initChannel(appKey, appVer, 'default', gzipFun);
}
function CloudAtlasImpl_initChannel(appKey, appVer, channelId, gzipFun) {
    try {
        if (sHasInit) {
            LogProxy_w('Init too many times');
        } else {
            DeviceInfoResolver_resolveDeviceInfo(); // 解析设备ID
            ActivityIdResolver_createActivityId(); // 创建活动ID
            AppInfoResolver_saveInfo(appKey, appVer, channelId); // 保存appKey，app版本和渠道ID
            CollectedDataPersister_init();
            LegacyConvertor_initGzipFun(gzipFun); // 压缩
            sHasInit = true;
        }
    } catch (e) {
        LogProxy_e('Failed to init', e);
        if (sIsDebugMode) {
            throw e;
        }
    }
}
function CloudAtlasImpl_onOpen() {
    try {
        if (sHasInit) {
            DeviceInfoResolver_setDeviceId().then(function (result) {
                var currentTime = CurrentTimeHelper_currentTimeMillis();
                CloudAtlasImpl_createNewSessionIfNeededByTime(currentTime);
            });
        } else {
            LogProxy_e('Not allowed to open session before init');
        }
    } catch (e) {
        LogProxy_e('Failed to open session', e);
        if (sIsDebugMode) {
            throw e;
        }
    }
}
function CloudAtlasImpl_isSessionExist() {
    var current = CollectedDataPersister_getCurrentData();
    if (current.sessionList && current.sessionList.length > 0) {
        return true;
    }
    return false;
}
function CloudAtlasImpl_onClose() {
    try {
        if (sHasInit) {
            DeviceInfoResolver_setDeviceId().then(function (result) {
                LogProxy_d('Close the page');
                var current = CollectedDataPersister_getCurrentData();
                if (current.sessionList && current.sessionList.length > 0) {
                    var currentTime = CurrentTimeHelper_currentTimeMillis();
                    var last = current.sessionList[current.sessionList.length - 1];
                    last.end = currentTime;
                    if (sIsImmediately || !isLocalStorageSupport()) {
                        CollectedDataPersister_setUploadData(last, 'sessionList');
                        CollectedDataUploader_sendPendingData();
                    } else {
                        LocalStoragePersist_saveCollectedData(0, last);
                        CollectedDataUploader_uploadImmediately();
                    }
                } else {
                    // 异常调用，没有会话存在
                    LogProxy_w('No session when page close');
                }
            });
        } else {
            LogProxy_e('Not allowed to close session before init');
        }
    } catch (e) {
        LogProxy_e('Failed to close session', e);
        if (sIsDebugMode) {
            throw e;
        }
    }
}
/**
 * 根据会话结束时间判断是否需要创建新的会话，如果需要，创建并触发发送
 * @param currentTime 当前系统时间（单位：毫秒）
 */
function CloudAtlasImpl_createNewSessionIfNeededByTime(currentTime) {
    var current = CollectedDataPersister_getCurrentData();
    var runningEnv = CollectedDataPersister_getCurrentEnv();
    // 对于Web端，没有后台前台切换的说法，只要是调用onOpen，都是一个新会话
    CloudAtlasImpl_createNewSession(currentTime, current, runningEnv, true);
}
/**
 *创建新会话
 * @param currentTime 当前时间
 * @param currentData 当前数据
 * @param runningEnv  当前运行环境
 * @param byTime      true-由于会话时间超时导致的，false-由于切换用户导致的
 */
function CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, byTime) {
    // 创建新会话前，要保证版本与用户id是最新的！
    var appVer = AppInfoResolver_getVersionName();
    runningEnv.appVer = appVer;
    var userId = runningEnv.userId;

    var newSessionId = guid();
    var ip = runningEnv.ip;
    if (!byTime) {
        // 切换用户
        // 创建新会话前先结束当前会话
        if (runningEnv.sessionId && currentData.sessionList.length > 0) {
            var currentSession = null;
            var len = currentData.sessionList.length;
            for (var i = 0; i < len; i++) {
                var session = currentData.sessionList[i];
                if (session.id === runningEnv.sessionId) {
                    currentSession = session;
                    break;
                }
            }
            if (currentSession != null) {
                currentSession.end = currentTime;
                if (sIsImmediately || !isLocalStorageSupport()) {
                    CollectedDataPersister_setUploadData(currentSession, 'sessionList');
                    CollectedDataUploader_sendPendingData();
                } else {
                    LocalStoragePersist_saveCollectedData(0, currentSession);
                }
            } else {
                LogProxy_e('No current session object found for sessionId ' + runningEnv.sessionId);
            }
        }
        // 更新activity
        ActivityIdResolver_createActivityId();
    }
    // 将当前启动信息加入到会话列表，以便立即能上传活跃数据
    var tempSession = new Session(newSessionId, currentTime, 0, userId, appVer, ip, sActivityId);
    currentData.sessionList.push(tempSession);
    // 将会话数据存入localstorage中
    if (sIsImmediately || !isLocalStorageSupport()) {
        CollectedDataPersister_setUploadData(currentData.sessionList[currentData.sessionList.length - 1], 'sessionList');
        CollectedDataUploader_sendPendingData();
    } else {
        LocalStoragePersist_saveCollectedData(0, currentData.sessionList[currentData.sessionList.length - 1]);
        // 触发立即发送
        CollectedDataUploader_uploadImmediately();
    }
    // 更新运行环境
    runningEnv.sessionId = newSessionId;
    var localData = LocalStoragePersist_queryCollecteData();
    if (sIsImmediately && localData && localData.data && localData.data.hasValidData()) {
        CollectedDataPersister_setDataPengdData(localData.data);
        CollectedDataUploader_sendPendingData();
        LocalStoragePersist_clearCollectedData(localData.keys);
    }
}
function CloudAtlasImpl_onProfileSignIn(userId) {
    try {
        if (sHasInit) {
            DeviceInfoResolver_setDeviceId().then(function (result) {
                var currentTime = CurrentTimeHelper_currentTimeMillis();
                var runningEnv = CollectedDataPersister_getCurrentEnv();
                var oldUserId = runningEnv.userId;
                if (oldUserId === userId) {
                    // 相同用户，没有登出，不重复记录
                    LogProxy_w('Same user, no need to login again');
                    return;
                }
                // 前一个用户退出
                if (oldUserId) {
                    CloudAtlasImpl_onProfileSignOff();
                }
                // 更新当前环境
                runningEnv.userId = userId;
                // 创建新会话
                var currentData = CollectedDataPersister_getCurrentData();
                CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, false);
            });
        } else {
            LogProxy_e('Not allowed to sign in before init');
        }
    } catch (e) {
        LogProxy_e('Failed to sign in', e);
        if (sIsDebugMode) {
            throw e;
        }
    }
}
function CloudAtlasImpl_onProfileSignOff() {
    try {
        if (sHasInit) {
            DeviceInfoResolver_setDeviceId().then(function (result) {
                var runningEnv = CollectedDataPersister_getCurrentEnv();
                var oldUserId = runningEnv.userId;
                // 前一个用户退出
                if (oldUserId) {
                    // 更新当前环境
                    runningEnv.userId = null;
                    var currentTime = CurrentTimeHelper_currentTimeMillis();
                    // 创建新会话
                    var currentData = CollectedDataPersister_getCurrentData();
                    CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, false);
                } else {
                    LogProxy_w('No user is login now, no need to logout, maybe something wrong with app');
                }
            });
        } else {
            LogProxy_e('Not allowed to sign off before init');
        }
    } catch (e) {
        LogProxy_e('Failed to sign off', e);
        if (sIsDebugMode) {
            throw e;
        }
    }
}
function CloudAtlasImpl_onEvent(options) {
    DeviceInfoResolver_setDeviceId().then(function (result) {
        var eventId = options.eventId;
        var value = {};
        if (options.info) {
            for (var prop in options.info) {
                value[prop] = options.info[prop];
            }
        }
        if (options.label) {
            value[KEY_EVENT_LABEL] = options.label;
        }
        if (options.value) {
            value[KEY_EVENT_INT_VALUE] = options.value;
        }
        var time = CurrentTimeHelper_currentTimeMillis();
        var runningEnv = CollectedDataPersister_getCurrentEnv();
        var userId = runningEnv.userId,
            appVer = runningEnv.appVer,
            sessionId = runningEnv.sessionId;

        var event = new Event(eventId, value, time, userId, appVer, sActivityId, sessionId);
        if (sIsImmediately || !isLocalStorageSupport()) {
            CollectedDataPersister_setUploadData(event, 'eventList');
            CollectedDataUploader_sendPendingData();
        } else {
            LocalStoragePersist_saveCollectedData(1, event);
            // 通知更新了数据
            CollectedDataPersister_notifyUpdate();
        }
    });
}
function CloudAtlasImpl_reportError(message) {
    DeviceInfoResolver_setDeviceId().then(function (result) {
        var time = CurrentTimeHelper_currentTimeMillis();
        var runningEnv = CollectedDataPersister_getCurrentEnv();
        var appVer = runningEnv.appVer;

        var error = new Error$1(TYPE_USER_SUBMIT_MSG, message, time, appVer, sActivityId);
        if (sIsImmediately || !isLocalStorageSupport()) {
            CollectedDataPersister_setUploadData(error, 'errorList');
            CollectedDataUploader_sendPendingData();
        } else {
            LocalStoragePersist_saveCollectedData(1, error);
            CollectedDataPersister_notifyUpdate();
        }
    });
}

// url 解析
var js_url = function () {
    function _t() {
        return new RegExp(/(.*?)\.?([^\.]*?)\.(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|net\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
    }

    function _d(s) {
        return _.decodeURIComponent(s.replace(/\+/g, ' '));
    }

    function _i(arg, str) {
        var sptr = arg.charAt(0),
            split = str.split(sptr);

        if (sptr === arg) {
            return split;
        }

        arg = parseInt(arg.substring(1), 10);

        return split[arg < 0 ? split.length + arg : arg - 1];
    }

    function _f(arg, str) {
        var sptr = arg.charAt(0),
            split = str.split('&'),
            field = [],
            params = {},
            tmp = [],
            arg2 = arg.substring(1);

        for (var i = 0, ii = split.length; i < ii; i++) {
            field = split[i].match(/(.*?)=(.*)/);

            // TODO: regex should be able to handle this.
            if (!field) {
                field = [split[i], split[i], ''];
            }

            if (field[1].replace(/\s/g, '') !== '') {
                field[2] = _d(field[2] || '');

                // If we have a match just return it right away.
                if (arg2 === field[1]) {
                    return field[2];
                }

                // Check for array pattern.
                tmp = field[1].match(/(.*)\[([0-9]+)\]/);

                if (tmp) {
                    params[tmp[1]] = params[tmp[1]] || [];

                    params[tmp[1]][tmp[2]] = field[2];
                } else {
                    params[field[1]] = field[2];
                }
            }
        }

        if (sptr === arg) {
            return params;
        }

        return params[arg2];
    }

    return function (arg, url) {
        var _l = {},
            tmp = void 0;

        if (arg === 'tld?') {
            return _t();
        }

        url = url || window.location.toString();

        if (!arg) {
            return url;
        }

        arg = arg.toString();

        if (tmp = url.match(/^mailto:([^\/].+)/)) {
            _l.protocol = 'mailto';
            _l.email = tmp[1];
        } else {
            // Ignore Hashbangs.
            if (tmp = url.match(/(.*?)\/#\!(.*)/)) {
                url = tmp[1] + tmp[2];
            }

            // Hash.
            if (tmp = url.match(/(.*?)#(.*)/)) {
                _l.hash = tmp[2];
                url = tmp[1];
            }

            // Return hash parts.
            if (_l.hash && arg.match(/^#/)) {
                return _f(arg, _l.hash);
            }

            // Query
            if (tmp = url.match(/(.*?)\?(.*)/)) {
                _l.query = tmp[2];
                url = tmp[1];
            }

            // Return query parts.
            if (_l.query && arg.match(/^\?/)) {
                return _f(arg, _l.query);
            }

            // Protocol.
            if (tmp = url.match(/(.*?)\:?\/\/(.*)/)) {
                _l.protocol = tmp[1].toLowerCase();
                url = tmp[2];
            }

            // Path.
            if (tmp = url.match(/(.*?)(\/.*)/)) {
                _l.path = tmp[2];
                url = tmp[1];
            }

            // Clean up path.
            _l.path = (_l.path || '').replace(/^([^\/])/, '/$1').replace(/\/$/, '');

            // Return path parts.
            if (arg.match(/^[\-0-9]+$/)) {
                arg = arg.replace(/^([^\/])/, '/$1');
            }
            if (arg.match(/^\//)) {
                return _i(arg, _l.path.substring(1));
            }

            // File.
            tmp = _i('/-1', _l.path.substring(1));

            if (tmp && (tmp = tmp.match(/(.*?)\.(.*)/))) {
                _l.file = tmp[0];
                _l.filename = tmp[1];
                _l.fileext = tmp[2];
            }

            // Port.
            if (tmp = url.match(/(.*)\:([0-9]+)$/)) {
                _l.port = tmp[2];
                url = tmp[1];
            }

            // Auth.
            if (tmp = url.match(/(.*?)@(.*)/)) {
                _l.auth = tmp[1];
                url = tmp[2];
            }

            // User and pass.
            if (_l.auth) {
                tmp = _l.auth.match(/(.*)\:(.*)/);

                _l.user = tmp ? tmp[1] : _l.auth;
                _l.pass = tmp ? tmp[2] : undefined;
            }

            // Hostname.
            _l.hostname = url.toLowerCase();

            // Return hostname parts.
            if (arg.charAt(0) === '.') {
                return _i(arg, _l.hostname);
            }

            // Domain, tld and sub domain.
            if (_t()) {
                tmp = _l.hostname.match(_t());

                if (tmp) {
                    _l.tld = tmp[3];
                    _l.domain = tmp[2] ? tmp[2] + '.' + tmp[3] : undefined;
                    _l.sub = tmp[1] || undefined;
                }
            }

            // Set port and protocol defaults if not set.
            _l.port = _l.port || (_l.protocol === 'https' ? '443' : '80');
            _l.protocol = _l.protocol || (_l.port === '443' ? 'https' : 'http');
        }

        // Return arg.
        if (arg in _l) {
            return _l[arg];
        }

        // Return everything.
        if (arg === '{}') {
            return _l;
        }

        // Default to undefined for no match.
        return '';
    };
}();

// referrer字符串截取
var MAX_REFERRER_STRING_LENGTH = 200;
// 返回载入当前文档的文档的 URL，来源
function getReferrer(referrer) {
    var referrer = referrer || document.referrer;
    if (typeof referrer !== 'string') {
        return '取值异常_referrer异常_' + String(referrer);
    }
    if (referrer.indexOf('https://www.baidu.com/') === 0) {
        referrer = referrer.split('?')[0];
    }
    referrer = referrer.slice(0, MAX_REFERRER_STRING_LENGTH);
    return typeof referrer === 'string' ? referrer : '';
}
// 获取页面信息。
function getPageInfo() {
    var referrer = getReferrer();
    var title = document.title;
    var referrer_host = referrer ? js_url(referrer, 'hostname') : referrer;
    var url = location.href;
    var url_path = location.pathname;
    var pageProp = {
        referrer: referrer,
        referrer_host: referrer_host,
        title: title,
        url: url,
        url_path: url_path
    };
    event$1({ eventId: 'ca_pageview_enter', info: { referrer: referrer, referrer_host: referrer_host, title: title, url: url, url_path: url_path } });
    sessionStorage.setItem(KEY_LEAVE_PAGE_INFO, JSON.stringify(pageProp));
}
// 获取离开页面信息
function getLeavrPageInfo() {
    var strPageInfo = sessionStorage.getItem(KEY_LEAVE_PAGE_INFO);
    if (strPageInfo) {
        var pageInfo = JSON.parse(strPageInfo);
        if (pageInfo.url !== location.href) {
            event$1({ eventId: 'ca_pageview_leave', info: pageInfo });
        }
    }
}
function sendPageInfo(eventName) {
    if (eventName === 'ca_pageview_enter') {
        getPageInfo();
    } else if (eventName === 'ca_pageview_leave') {
        getLeavrPageInfo();
    }
}

var CloudAtlasVisual = function () {
    function CloudAtlasVisual(options) {
        classCallCheck(this, CloudAtlasVisual);

        this.has_load_sdk = false;
        this.visualSearchName = '?ca_show_visual';
        // 设置加载cdn上js和css状态
        this.loadVendorCss = false;
        this.loadVendorJs = false;
        // 判断app_key
        if (options.appKey === undefined || options.appKey === null || options.appKey.constructor !== String) {
            LogProxy_e('Invalid appKey, type = ' + _typeof(options.appKey) + ', value = ' + options.appKey);
            return;
        }
        // 设置当前变量
        this.app_key = options.appKey;
        this.env = options.env || 'INTEGRATION';
        // 设置请求URL
        this.HOST = setVisualEnv(options.env);
        this.init(options);
    }

    CloudAtlasVisual.prototype.init = function init() {
        this.isShowVisual();
    };
    /**
     * 判断是否支持localstorage和sessionStorage
     */


    CloudAtlasVisual.prototype.browserIsSupport = function browserIsSupport() {
        if (_typeof(window.localStorage) === 'object' && window.localStorage.setItem && _typeof(window.sessionStorage) === 'object' && window.sessionStorage.setItem) {
            return true;
        }
        return false;
    };
    /**
     * 展示错误
     * @param {*} obj
     */


    CloudAtlasVisual.prototype.showErrorTip = function showErrorTip(obj) {
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
            return false;
        }
        var errorTip = document.createElement('div');
        var myText = document.createTextNode(obj.tip);
        errorTip.appendChild(myText);
        errorTip.style.cssText = 'background:#e55b41;border:none;border-radius:8px;color:#fff;font-size:18px;left:50%;margin-left:-300px;padding:15px;position: fixed;text-align: center;top: 0;width:600px;z-index:9999;';
        document.body.appendChild(errorTip);
        setTimeout(function () {
            obj.func && obj.func();
            errorTip.parentNode.removeChild(errorTip);
        }, obj.time);
    };
    /**
     * 判断展示哪种状态
     */


    CloudAtlasVisual.prototype.isShowVisual = function isShowVisual() {
        var url = location.href;
        var me = this;
        function isSupportBrowser() {
            if (!me.browserIsSupport()) {
                LogProxy_e('对不起，可视化埋点暂不支持你当前的浏览器，请升级至ie10以上，推荐使用chrome，firefox，safari等浏览器');
                /* me.showErrorTip({
                    tip: '对不起，可视化埋点暂不支持你当前的浏览器，请升级至ie10以上，推荐使用chrome，firefox，safari等浏览器',
                    time: 10000
                }); */
                return false;
            }
            return true;
        }
        var reg = /ca_show_visual$/;
        if (reg.test(url) && url.split('ca_show_visual').length === 2) {
            if (!isSupportBrowser()) {
                return false;
            }
            me.enterVisibleMode();
        } else {
            this.enterNormalMode();
        }
    };
    /**
     * 进入可视化状态
     */


    CloudAtlasVisual.prototype.enterVisibleMode = function enterVisibleMode() {
        this.has_load_sdk = true; // 标志是visual模式
        var visual_status = this.app_key + ':/' + this.env + ':/';
        storage.setItem('visual_status', visual_status + this.has_load_sdk);
        var me = this;
        this.currentUrl = location.href.split('?')[0].replace('ca_show_visual', '');
        var data = {
            'app_key': this.app_key,
            'page_identify': this.app_key + this.currentUrl,
            'page_uri': this.currentUrl,
            'page_title': document.title
        };
        var url = this.HOST + 'v0.1/tracking/web/tracking_page';
        UploadUtils_postAsyncRequest(url, JSON.stringify(data), {
            onSuccess: function onSuccess(data) {
                me.loadFiles();
            },
            onFail: function onFail(message) {
                try {
                    var error = JSON.parse(message);
                    LogProxy_e(error.message);
                    // me.showErrorTip(error.message);
                } catch (e) {
                    LogProxy_e('进入可视化埋点失败');
                    /*  me.showErrorTip({
                        tip: '进入可视化埋点失败',
                        time: 1000
                    }); */
                }
            }
        });
    };

    CloudAtlasVisual.prototype.loadFiles = function loadFiles() {
        var loadVendorCss = this.loadVendorCss,
            loadVendorJs = this.loadVendorJs;
        var vendorCss = fileUrl.vendorCss,
            vendorJs = fileUrl.vendorJs;

        if (!loadVendorCss) {
            loadFile(vendorCss, 'link').then(function (loadVendorCss) {
                if (!loadVendorCss) {
                    LogProxy_e('vendor.css加载失败');
                    /* me.showErrorTip({
                        tip: 'vendor.css加载失败',
                        time: 10000
                    }); */
                }
            });
        }
        if (!loadVendorJs) {
            loadFile(vendorJs, 'script').then(function (loadVendorJs) {
                if (!loadVendorJs) {
                    LogProxy_e('vendor.js加载失败');
                    /* me.showErrorTip({
                        tip: 'vendor.js加载失败',
                        time: 10000
                    }); */
                }
            });
        }
    };
    /**
     * 进入正常模式
     */


    CloudAtlasVisual.prototype.enterNormalMode = function enterNormalMode() {
        // 标志是正常模式
        this.has_load_sdk = false;
        var visual_status = this.app_key + ':/' + this.env + ':/';
        storage.setItem('visual_status', visual_status + this.has_load_sdk);
        this.getDeployData();
    };
    /**
     * 获取已部署埋点数据
     */


    CloudAtlasVisual.prototype.getDeployData = function getDeployData() {
        var me = this;
        var appKey = storage.getItem('visual_status').split(':/')[0];
        var HOST = storage.getItem('visual_status').split(':/')[1];
        var url = setVisualEnv(HOST) + ('v0.1/tracking/web/tracking_event/event_list?app_key=' + encodeURIComponent(appKey) + '&is_deployed=true');
        UploadUtils_getAsyncRequest(url, null, {
            onSuccess: function onSuccess(JSONdata) {
                var data = JSON.parse(JSONdata);
                if (data && data.content && data.content.length) {
                    me.listenEvents(data.content);
                }
            },
            onFail: function onFail(message) {
                try {
                    var error = JSON.parse(message);
                    LogProxy_e(error.message);
                    // me.showErrorTip(error.message);
                } catch (e) {
                    LogProxy_e('获取已部署埋点数据失败');
                    /* me.showErrorTip({
                        tip: '获取已部署埋点数据失败',
                        time: 1000
                    }); */
                }
            }
        });
    };
    /**
     * 普通模式下，监听事件,给已埋点元素绑定监听事件
     * @param {*} data 服务端返回埋点列表数据
     */


    CloudAtlasVisual.prototype.listenEvents = function listenEvents(data) {
        var me = this;
        document.addEventListener('click', function (e) {
            var nodeName = e.target.tagName;
            if (nodeName === 'BODY' || nodeName === 'HTML') {
                return false;
            }
            var eventDefine = new EventDefine();
            var selector = eventDefine.toAllSelector(e.target);
            var gloablePageData = data.filter(function (t) {
                return t.type;
            });
            var currentPageData = data.filter(function (t) {
                return t.edit_url === location.href.split('?')[0].replace('ca_show_visual', '') && !t.type;
            });
            var isGloableTrack = gloablePageData.some(function (item) {
                var isTrack = me.trackPoint(item, selector);
                return isTrack;
            });
            if (!isGloableTrack) {
                currentPageData.some(function (item) {
                    var isTrack = me.trackPoint(item, selector);
                    return isTrack;
                });
            }
        }, true);
    };
    /**
     * 触发埋点上传
     * @param {*} data
     * @param {*} selector
     */


    CloudAtlasVisual.prototype.trackPoint = function trackPoint(data, selector) {
        var text = selector.selfAttr ? selector.selfAttr.text ? selector.selfAttr.text : '' : '';
        if (data.dom_value === selector.nthEle && data.control_name === text) {
            var options = {
                eventId: data.event_name
            };
            if (data.event_label) {
                options.label = data.event_label;
            }
            event$1(options);
            return true;
        }
        return false;
    };

    return CloudAtlasVisual;
}();

var EventDefine = function () {
    function EventDefine() {
        classCallCheck(this, EventDefine);
    }

    EventDefine.prototype.getSelfAttr = function getSelfAttr(target) {
        var selector = {};
        var text = target.textContent;
        if (text) {
            selector.text = text;
        }
        return selector;
    };

    EventDefine.prototype.toSelector = function toSelector(target) {
        var isValidAttr = function isValidAttr(attr) {
            return (/^[\w-]+$/g.test(attr)
            );
        };
        var classes = void 0;
        var finalSelector = void 0;
        var produceSelector = void 0;
        var selector = void 0;
        var _ref = void 0;
        var tag = target.tagName.toLowerCase();
        var id = target.getAttribute('id');
        _ref = target.className;
        if (_ref != null) {
            _ref = ' ' + target.className + ' ';
            _ref = _ref.replace(/^\s+/, '').replace(/\s+$/, '');
            if (_ref === '') {
                classes = [];
            } else {
                classes = _ref.split(' ');
            }
        } else {
            classes = [];
        }
        selector = tag;
        if (id) {
            selector += '#' + id;
        }
        produceSelector = function produceSelector(classes) {
            var newClasses = classes.filter(function (cls) {
                return cls !== '';
            });
            if (newClasses.length) {
                return '' + selector + '.' + newClasses.join('.');
            }
            return selector;
        };
        try {
            finalSelector = produceSelector(classes);
        } catch (_error) {
            classes = classes.filter(isValidAttr);
            finalSelector = produceSelector(classes);
        }
        return finalSelector;
    };

    EventDefine.prototype.toAllSelector = function toAllSelector(target, outDocuemnt) {
        outDocuemnt = outDocuemnt || document;
        var parent = void 0,
            newSelSize = void 0,
            newSelector = void 0,
            selSize = void 0,
            selector = void 0;
        selector = this.toSelector(target, outDocuemnt);
        parent = target.parentNode;
        selSize = outDocuemnt.querySelectorAll(selector).length;
        while (parent.tagName !== 'BODY' && selSize !== 1) {
            newSelector = '' + this.toSelector(parent) + ' ' + selector;
            newSelSize = outDocuemnt.querySelectorAll(newSelector).length;
            if (newSelSize < selSize) {
                selSize = newSelSize;
            }
            selector = newSelector;
            parent = parent.parentNode;
        }
        var nthEle = selector;
        var selfAttr = this.getSelfAttr(target);

        return {
            nthEle: nthEle,
            selfAttr: selfAttr
        };
    };

    return EventDefine;
}();

// 对外暴露的接口，只做参数校验，直接调内部实现

var CloudAtlas = function () {
    function CloudAtlas(options) {
        classCallCheck(this, CloudAtlas);

        if (navigator.appName === 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) < 9) {
            LogProxy_e('您的浏览器版本过低，不支持web-sdk,请下载IE9+浏览器！');
            return;
        }
        this.init(options);
    }
    /**
     * 初始化
     * @param options 初始化参数对象
     *  appKey 应用标识码（String，必选）
     *  appVer 应用版本号（String，必选）
     *  channelId 渠道ID （String, 可选，默认值为default）
     *  isLog 是否开启日志打印 （Boolean， 可选，默认值为false）
     *  env 上传环境设置（String, 必选，默认为INTEGRATION 集成环境）
     *  isHttps 是否上传接口协议为https (Boolean, 可甜，默认为false)
     *  isDebugMode 是否为调试模式（Boolean，可选，默认值为false）
     *  isVTrack 是否开启可视化埋点 （Boolean, 可选，默认值为false）
     *  limitNumber 限制上传条数 （Number, 可选，默认值为5）
     *  isImmediately 是否开启立即上传 （Boolean， 可选， 默认为false）
     */


    CloudAtlas.prototype.init = function init(options) {
        try {
            if (options === undefined || options === null || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
                LogProxy_e('Invalid params for init, type = ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)) + ', value = ' + options);
                return;
            }
            var appKey = options.appKey,
                limitNumber = options.limitNumber,
                isVTrack = options.isVTrack;
            var appVer = options.appVer,
                channelId = options.channelId,
                isDebugMode = options.isDebugMode,
                env = options.env,
                isLog = options.isLog,
                isHttps = options.isHttps,
                isImmediately = options.isImmediately;

            if (appKey === undefined || appKey === null || appKey.constructor !== String) {
                LogProxy_e('Invalid appKey, type = ' + (typeof appKey === 'undefined' ? 'undefined' : _typeof(appKey)) + ', value = ' + appKey);
                return;
            }
            if (appVer === undefined || appVer === null || appVer.constructor !== String) {
                LogProxy_e('Invalid appVer, type = ' + (typeof appVer === 'undefined' ? 'undefined' : _typeof(appVer)) + ', value = ' + appVer);
                return;
            }
            if (appVer.length > 255) {
                appVer = appVer.substring(0, 255);
            }
            var temp = appVer.replace(/[^a-zA-Z0-9\u4E00-\u9FA5._-]/g, '');
            if (temp !== appVer) {
                LogProxy_w('版本号仅支持中文，英文字母、数字、中划线（-）、下划线（_）和点号（.），其他符号将会自动被过滤');
            }
            appVer = temp;
            if (limitNumber !== undefined && limitNumber !== null && limitNumber.constructor === Number) {
                if (limitNumber < 1) {
                    LogProxy_w('限制条数最小条数为1条，默认为5条');
                } else if (limitNumber > 100) {
                    LogProxy_w('限制条数最大不能超过100条，超过设置为100条');
                    setLimitTime(100);
                } else {
                    setLimitTime(Math.round(limitNumber)); // 默认限制条数四舍五入取整
                }
            }
            if (channelId !== undefined && channelId !== null) {
                if (channelId.constructor !== String) {
                    LogProxy_e('Invalid channelId, type = ' + (typeof channelId === 'undefined' ? 'undefined' : _typeof(channelId)) + ', value = ' + channelId);
                } else {
                    if (channelId.length > 201) {
                        channelId = channelId.substring(0, 201);
                    }
                    var tempchannelId = channelId.replace(/[^a-zA-Z0-9\u4E00-\u9FA5._-]/g, '');
                    if (tempchannelId !== channelId) {
                        LogProxy_w('渠道仅支持中文，英文字母、数字、中划线（-）、下划线（_）和点号（.），其他符号将会自动被过滤');
                    }
                    channelId = tempchannelId;
                }
            }
            if (isDebugMode !== undefined && isDebugMode !== null && isDebugMode.constructor !== Boolean) {
                LogProxy_e('Invalid isDebugMode, type = ' + (typeof isDebugMode === 'undefined' ? 'undefined' : _typeof(isDebugMode)) + ', value = ' + isDebugMode);
                return;
            }
            var gzipFun = undefined;
            env = env || 'INTEGRATION';
            if (env.constructor !== String) {
                LogProxy_e('Invalid env, type = ' + _typeof(options.env) + ', value = ' + options.env);
                return;
            }
            if (isLog !== undefined && isLog !== null && isLog.constructor !== Boolean) {
                LogProxy_e('Invalid isLog, type = ' + (typeof isLog === 'undefined' ? 'undefined' : _typeof(isLog)) + ', value = ' + isLog);
                return;
            }
            if (isHttps !== undefined && isHttps !== null && isHttps.constructor !== Boolean) {
                LogProxy_e('Invalid isLog, type = ' + (typeof isHttps === 'undefined' ? 'undefined' : _typeof(isHttps)) + ', value = ' + isHttps);
                return;
            }
            if (isImmediately !== undefined && isImmediately !== null && isImmediately.constructor !== Boolean) {
                LogProxy_e('Invalid isLog, type = ' + (typeof isImmediately === 'undefined' ? 'undefined' : _typeof(isImmediately)) + ', value = ' + isImmediately);
                return;
            }
            isImmediately = isImmediately !== false;
            isLog = isLog || false;
            isHttps = isHttps || false;
            LogProxy_setLogEnabled(isLog); // 设置是否开启日志打印
            this.setEnv(env, isHttps); // 是指上传接口协议是否为https
            setImmediately(isImmediately);
            isDebugMode = isDebugMode || false; // 为undefined与null附上默认值
            if (isDebugMode) {
                DebugHelper_setIsDebugMode(isDebugMode);
            }
            // 可视化埋点
            if (isVTrack && isLocalStorageSupport()) {
                var visualData = {
                    appKey: options.appKey,
                    env: options.env
                };
                this.CloudAtlasVisual = new CloudAtlasVisual(visualData);
            }
            // 目前全埋点有云图后台控制打开 设置全埋点， 获取服务端请求，该应用是否开启全埋点
            getAutoTrack(autoURL + 'v0.1/config/tracking/' + appKey, autoTrack_sendCallback, true);
            if (channelId === undefined || channelId === null || channelId.constructor !== String || channelId === '') {
                CloudAtlasImpl_init(appKey, appVer, gzipFun);
            } else {
                CloudAtlasImpl_initChannel(appKey, appVer, channelId, gzipFun);
            }
            // 增加监听的方法： 进入页面，离开页面，页面可见性事件
            addHashEvent(this.leavePage);
            addHashEvent(this.sendPage);
            addPageViewEvent(this.visibilityState);
            this.sendPage(); // 初始化调用进入页面方法
        } catch (error) {
            LogProxy_e(error);
        }
    };
    /**
     * 浏览器可见性事件 v1.7.0新增 ie10以上可用
     */


    CloudAtlas.prototype.visibilityState = function visibilityState() {
        var visibilityState = void 0;
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        if ('visibilityState' in document) {
            visibilityState = 'visibilityState';
        }
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] + 'VisibilityState' in document) {
                visibilityState = prefixes[i] + 'VisibilityState';
                break;
            }
        }
        if (document[visibilityState] === 'hidden') {
            var sCurrentData = CollectedDataPersister_getCurrentData();
            if (sCurrentData.sessionList && sCurrentData.sessionList.length > 0) {
                var currentTime = CurrentTimeHelper_currentTimeMillis();
                var last = sCurrentData.sessionList[sCurrentData.sessionList.length - 1];
                last.end = currentTime;
                if (sIsImmediately || !isLocalStorageSupport()) {
                    CollectedDataPersister_setUploadData(last, 'sessionList');
                    CollectedDataUploader_sendPendingData();
                } else {
                    LocalStoragePersist_saveCollectedData(0, last);
                }
            }
        }
        if (document[visibilityState] === 'visible') {
            CloudAtlasImpl_onOpen();
        }
    };
    /**
     * 应用打开，辅助标识会话开始，
     */


    CloudAtlas.onOpen = function onOpen() {
        CloudAtlasImpl_onOpen();
    };
    /**
     * 应用关闭，辅助标识会话结束
     */


    CloudAtlas.onClose = function onClose() {
        CloudAtlasImpl_onClose();
    };
    /**
     * 用户登录
     * @param userId 用户id（数字类型的String，必选）
     */


    CloudAtlas.onProfileSignIn = function onProfileSignIn(userId) {
        if (userId === undefined || userId === null || userId.constructor !== String || !/^[0-9]*$/.test(userId)) {
            LogProxy_e('Invalid params for onProfileSignIn, type = ' + (typeof userId === 'undefined' ? 'undefined' : _typeof(userId)) + ', value = ' + userId);
            return;
        }
        CloudAtlasImpl_onProfileSignIn(userId);
    };
    /**
     * 用户退出
     */


    CloudAtlas.onProfileSignOff = function onProfileSignOff() {
        CloudAtlasImpl_onProfileSignOff();
    };
    /**
     * 自定义事件
     * 使用方式：onEvent({eventId: xxx, label: xxx})或onEvent({eventId: xxx, info: {a:aa,b:bb}, value: 20})
     * eventId 事件Id（String，必选）
     * label 事件属性（String，可选）
     * info 事件属性集（Object，不支持嵌套，value为String，可选）
     * value 特殊属性值（int，可选）
     * @param options 事件对象（Object，必选），支持eventId、label、info、value等属性
     */


    CloudAtlas.onEvent = function onEvent(options) {
        event$1(options);
    };

    CloudAtlas.prototype.onEvent = function onEvent(options) {
        /*
        * // TODO 之前宝光采用静态方法，导致实例化的对象无法调用event事件
        */
        event$1(options);
    };
    /**
     * 应用错误日志主动上报
     * @param message 错误消息内容（String，必选）
     */


    CloudAtlas.reportError = function reportError(message) {
        if (message === undefined || message === null || message.constructor !== String) {
            LogProxy_e('Invalid params for reportError, type = ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)) + ', value = ' + message);
            return;
        }
        if (!CloudAtlasImpl_isSessionExist()) {
            CloudAtlasImpl_onOpen();
        }
        CloudAtlasImpl_reportError(message);
    };
    // 设置环境


    CloudAtlas.prototype.setEnv = function setEnv(env, useHttps) {
        setUploadEnv(env, useHttps);
        setAutoTrackEnv(env, useHttps);
    };

    CloudAtlas.prototype.sendPage = function sendPage() {
        sendPageInfo('ca_pageview_enter');
    };

    CloudAtlas.prototype.leavePage = function leavePage() {
        sendPageInfo('ca_pageview_leave');
    };
    /**
     * 立即上传当前数据。
     */


    CloudAtlas.freshUpdata = function freshUpdata() {
        CollectedDataUploader_uploadImmediately();
    };

    return CloudAtlas;
}();

return CloudAtlas;

})));
