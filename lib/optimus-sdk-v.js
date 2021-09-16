(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("optimus-sdk-v", [], factory);
	else if(typeof exports === 'object')
		exports["optimus-sdk-v"] = factory();
	else
		root["optimus-sdk-v"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/dsbridge/index.js":
/*!****************************************!*\
  !*** ./node_modules/dsbridge/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var bridge = {
    default:this,// for typescript
    call: function (method, args, cb) {
        var ret = '';
        if (typeof args == 'function') {
            cb = args;
            args = {};
        }
        var arg={data:args===undefined?null:args}
        if (typeof cb == 'function') {
            var cbName = 'dscb' + window.dscb++;
            window[cbName] = cb;
            arg['_dscbstub'] = cbName;
        }
        arg = JSON.stringify(arg)

        //if in webview that dsBridge provided, call!
        if(window._dsbridge){
           ret=  _dsbridge.call(method, arg)
        }else if(window._dswk||navigator.userAgent.indexOf("_dsbridge")!=-1){
           ret = prompt("_dsbridge=" + method, arg);
        }

       return  JSON.parse(ret||'{}').data
    },
    register: function (name, fun, asyn) {
        var q = asyn ? window._dsaf : window._dsf
        if (!window._dsInit) {
            window._dsInit = true;
            //notify native that js apis register successfully on next event loop
            setTimeout(function () {
                bridge.call("_dsb.dsinit");
            }, 0)
        }
        if (typeof fun == "object") {
            q._obs[name] = fun;
        } else {
            q[name] = fun
        }
    },
    registerAsyn: function (name, fun) {
        this.register(name, fun, true);
    },
    hasNativeMethod: function (name, type) {
        return this.call("_dsb.hasNativeMethod", {name: name, type:type||"all"});
    },
    disableJavascriptDialogBlock: function (disable) {
        this.call("_dsb.disableJavascriptDialogBlock", {
            disable: disable !== false
        })
    }
};

!function () {
    if (window._dsf) return;
    var ob = {
        _dsf: {
            _obs: {}
        },
        _dsaf: {
            _obs: {}
        },
        dscb: 0,
        dsBridge: bridge,
        close: function () {
            bridge.call("_dsb.closePage")
        },
        _handleMessageFromNative: function (info) {
            var arg = JSON.parse(info.data);
            var ret = {
                id: info.callbackId,
                complete: true
            }
            var f = this._dsf[info.method];
            var af = this._dsaf[info.method]
            var callSyn = function (f, ob) {
                ret.data = f.apply(ob, arg)
                bridge.call("_dsb.returnValue", ret)
            }
            var callAsyn = function (f, ob) {
                arg.push(function (data, complete) {
                    ret.data = data;
                    ret.complete = complete!==false;
                    bridge.call("_dsb.returnValue", ret)
                })
                f.apply(ob, arg)
            }
            if (f) {
                callSyn(f, this._dsf);
            } else if (af) {
                callAsyn(af, this._dsaf);
            } else {
                //with namespace
                var name = info.method.split('.');
                if (name.length<2) return;
                var method=name.pop();
                var namespace=name.join('.')
                var obs = this._dsf._obs;
                var ob = obs[namespace] || {};
                var m = ob[method];
                if (m && typeof m == "function") {
                    callSyn(m, ob);
                    return;
                }
                obs = this._dsaf._obs;
                ob = obs[namespace] || {};
                m = ob[method];
                if (m && typeof m == "function") {
                    callAsyn(m, ob);
                    return;
                }
            }
        }
    }
    for (var attr in ob) {
        window[attr] = ob[attr]
    }
    bridge.register("_hasJavascriptMethod", function (method, tag) {
         var name = method.split('.')
         if(name.length<2) {
           return !!(_dsf[name]||_dsaf[name])
         }else{
           // with namespace
           var method=name.pop()
           var namespace=name.join('.')
           var ob=_dsf._obs[namespace]||_dsaf._obs[namespace]
           return ob&&!!ob[method]
         }
    })
}();

module.exports = bridge;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dsbridge = _interopRequireDefault(__webpack_require__(/*! dsbridge */ "./node_modules/dsbridge/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var invokeDsBridge = function invokeDsBridge(name) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!_dsbridge.default) {
    window.alert('no supported, 请在车主惠APP内使用');
  } else {
    return new Promise(function (resolve, reject) {
      _dsbridge.default.call(name, params, function (res) {
        if (res) {
          res = JSON.parse(res);
          res.code = +res.code;
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
};

var Optimus = {
  /**
   * 分享
   * @param params
   * @return {undefined}
   */
  share: function share(params) {
    return invokeDsBridge('share', params);
  },

  /**
   * 关闭webview
   * @param params
   * @return {undefined}
   */
  close: function close(params) {
    return invokeDsBridge('close', params);
  },

  /**
   * 拨打电话
   * @param params
   * @return {undefined}
   */
  telephone: function telephone(params) {
    return invokeDsBridge('telephone', params);
  },

  /**
   * 唤起原生登录
   * @param params
   * @return {undefined}
   */
  login: function login(params) {
    return invokeDsBridge('login', params);
  },

  /**
   * 唤起地图导航
   * @param params
   * @return {undefined}
   */
  mapNavi: function mapNavi(params) {
    return invokeDsBridge('mapNavi', params);
  },

  /**
   * 支付成功调用 通知原生
   * @param params
   * @return {undefined}
   */
  paySuccess: function paySuccess(params) {
    return invokeDsBridge('paySuccess', params);
  },

  /**
   * 获取app版本信息
   * @param params
   * @return {undefined}
   */
  getAppVersion: function getAppVersion(params) {
    return invokeDsBridge('getAppVersion', params);
  },

  /**
   * 打开原生页面或新的webview 可控制原生头显示类型
   * @param params
   * @return {undefined}
   */
  newAction: function newAction(params) {
    return invokeDsBridge('newAction', params);
  },

  /**
   * 校验相册权限
   * @param params
   * @return {undefined}
   */
  isHaveCameraPermission: function isHaveCameraPermission(params) {
    return invokeDsBridge('isHaveCameraPermission', params);
  },
  wxNativePay: function wxNativePay(params) {
    return invokeDsBridge('wxNativePay', params);
  },

  /**
   * 获取高德定位信息
   * @param params
   * @return {any}
   */
  getAMapLoc: function getAMapLoc(params) {
    return invokeDsBridge('getAMapLoc', params);
  },

  /**
   * 获取头部信息 状态栏高度、是否使用了原生头
   * @param params
   * @return {Promise<any>}
   */
  getWebHeadInfo: function getWebHeadInfo(params) {
    return invokeDsBridge('getWebHeadInfo', params);
  },

  /**
   * 混合开发特殊事件 ps: 首页礼包交互
   * @param params
   * @return {Promise<any>}
   */
  hybridEvent: function hybridEvent(params) {
    return invokeDsBridge('hybridEvent', params);
  },

  /**
   * 同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  confirmAgreement: function confirmAgreement(params) {
    return invokeDsBridge('confirmAgreement', params);
  },

  /**
   * 不同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  disagreeAgreement: function disagreeAgreement(params) {
    return invokeDsBridge('disagreeAgreement', params);
  },

  /**
   * 退出app
   * @param params
   * @return {Promise<any>}
   */
  exitApp: function exitApp(params) {
    return invokeDsBridge('exitApp', params);
  },

  /**
   * 关闭弹层webview
   * @param params
   * @return {Promise<any>}
   */
  closePopWebView: function closePopWebView(params) {
    return invokeDsBridge('closePopWebView', params);
  },

  /**
   * 滑块校验
   * @param params
   * @return {Promise<any>}
   */
  sliderAuth: function sliderAuth(params) {
    return invokeDsBridge('sliderAuth', params);
  },

  /**
   * 系统设置
   * @return {Promise<any>}
   */
  gotoAppSystemSetting: function gotoAppSystemSetting() {
    return invokeDsBridge('gotoAppSystemSetting');
  },

  /**
   * 获取通知权限
   * @return {Promise<any>}
   */
  getNotificationPermission: function getNotificationPermission() {
    return invokeDsBridge('getNotificationPermission');
  },

  /**
   * 唤起小程序
   * v>=2.6.3
   * @return {Promise<any>}
   */
  evokeWxMiniProgram: function evokeWxMiniProgram(params) {
    return invokeDsBridge('evokeWxMiniProgram', params);
  },

  /**
   * 快速充值
   * v>=2.7.0
   * @return {Promise<any>}
   */
  getPhoneRechargeParamAct: function getPhoneRechargeParamAct(params) {
    return invokeDsBridge('getPhoneRechargeParamAct', params);
  },

  /**
   * 唤起 扫描二维码
   * 商家app v>1.0.0
   * @param {
   * tip: "xxxx", 提示文字: 一行，注意字数
   * flashType: "0", 闪光灯类型:  0.关闭(默认)    1.Auto自动  2.Manual手动(出现按钮)
   * canLibrary: "0",  是否可以从相册选择:  0.不可以(默认)   1.可以相册选择
   * isShowSearchResult: "0",  是否原生调用 二维码结果 接口并跳转结果:   0: 直接返回扫描结果(默认)  1:调用后端接口，并跳转到相应的界面
   * }
   * @return {Promise<any>}
   */
  evokeQRCodeScan: function evokeQRCodeScan(params) {
    return invokeDsBridge('evokeQRCodeScan', params);
  },

  /**
   * 唤起 相机/相册权限
   * 商家app v>1.0.0
   * @param {
   * path: "可选, 当前路径",
   * type: 0  0.相机  1.相册  2.相机+相册  必选
   * }
   * @return {Promise<any>}
   */
  evokeCameraAndLibrary: function evokeCameraAndLibrary(params) {
    return invokeDsBridge('evokeCameraAndLibrary', params);
  },

  /**
   * 从app本地缓存取数据
   * 商家app v>1.0.0
   * @param {
   * key: "缓存的关键字",
   * isAsync: "0", 0.同步缓存(默认) 1. 异步缓存
   * }
   * @return {Promise<any>}
   */
  getObjectFromLocalCache: function getObjectFromLocalCache(params) {
    return invokeDsBridge('getObjectFromLocalCache', params);
  },

  /**
   * 缓存数据到app本地
   * 商家app v>1.0.0
   * @param {
   * data: "要缓存的数据", 数组、字符串、字典
   * key: "缓存的关键字",
   * isAsync: "0", 0.同步缓存(默认)  1. 异步缓存
   * isUserCache: "0",  0.基础缓存  1.用户缓存   用户缓存会在退出登录后清理，基础缓存不会
   * }
   * @return {Promise<any>}
   */
  saveObjectTolocalCache: function saveObjectTolocalCache(params) {
    return invokeDsBridge('saveObjectTolocalCache', params);
  },

  /**
   * 新增监听
   * 商家app v>1.0.0
   * @param {
   * action: "监听名key"
   * }
   * @return {Promise<any>}
   */
  addNativeListener: function addNativeListener(params) {
    return invokeDsBridge('addNativeListener', params);
  },

  /**
   * 移除监听
   * 商家app v>1.0.0
   * @param {
    * action: "监听名key"
    * }
    * @return {Promise<any>}
    */
  removeNativeListener: function removeNativeListener(params) {
    return invokeDsBridge('removeNativeListener', params);
  },

  /**
   * 给监听key发送数据
   * 可以在addNativeListener的回调中监听到传值
   * 商家app v>1.0.0
   * @param {
   * action: "监听名key",
   * value: "监听到的值 value"
   * }
   * @return {Promise<any>}
   */
  sendMessageNativeToListener: function sendMessageNativeToListener(params) {
    return invokeDsBridge('sendMessageNativeToListener', params);
  },

  /**
   * 保存图片到本地相册
   * 商家app v>1.0.1
   * @param {
   * type: '1', 1. 传图片url(默认)   2.传图片流
   * image: '',  图片的内容，不可为空，否则会返回错误
   * fileName: '', 图片文件夹名字(默认空)， 为空的时候，不会新建一个图片文件夹
   * isToast: '1', 1. App提示保存成功(默认)  0.App不提示
   * }
   * @return {Promise<any>}
   */
  saveImageToLibrary: function saveImageToLibrary(params) {
    return invokeDsBridge('saveImageToLibrary', params);
  },

  /**
   * 下载/保存文件到本地磁盘
   * 商家app v>1.0.1
   * @param {
   * type: '1', 1. 下载的url(默认)    2.文件流
   * downloadUrl: '', 文件url， type = 1 时必填，否则会返回错误
   * fileData: '', 文件流， type = 2 时必填
   * fileName: '', 文件名字，type=1选填 为空的时候，会使用接口的名字, type=2必填
   * fileType: '', 文件类型，选填  如果fileName用文件类型，这个参数不生效
   * }
   * @return {Promise<any>}
   */
  downloadFilesToDisk: function downloadFilesToDisk(params) {
    return invokeDsBridge('downloadFilesToDisk', params);
  }
};

var install = function install(Vue, options) {
  if (install.installed) return;
  Vue.prototype.$op = Optimus;
};
/* 支持使用标签的方式引入 */


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var _default = {
  install: install
};
exports.default = _default;
module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29wdGltdXMtc2RrLXYvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGstdi8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnZva2VEc0JyaWRnZSIsIm5hbWUiLCJwYXJhbXMiLCJ3aW5kb3ciLCJhbGVydCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2FsbCIsInJlcyIsIkpTT04iLCJwYXJzZSIsImNvZGUiLCJPcHRpbXVzIiwic2hhcmUiLCJjbG9zZSIsInRlbGVwaG9uZSIsImxvZ2luIiwibWFwTmF2aSIsInBheVN1Y2Nlc3MiLCJnZXRBcHBWZXJzaW9uIiwibmV3QWN0aW9uIiwiaXNIYXZlQ2FtZXJhUGVybWlzc2lvbiIsInd4TmF0aXZlUGF5IiwiZ2V0QU1hcExvYyIsImdldFdlYkhlYWRJbmZvIiwiaHlicmlkRXZlbnQiLCJjb25maXJtQWdyZWVtZW50IiwiZGlzYWdyZWVBZ3JlZW1lbnQiLCJleGl0QXBwIiwiY2xvc2VQb3BXZWJWaWV3Iiwic2xpZGVyQXV0aCIsImdvdG9BcHBTeXN0ZW1TZXR0aW5nIiwiZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbiIsImV2b2tlV3hNaW5pUHJvZ3JhbSIsImdldFBob25lUmVjaGFyZ2VQYXJhbUFjdCIsImV2b2tlUVJDb2RlU2NhbiIsImV2b2tlQ2FtZXJhQW5kTGlicmFyeSIsImdldE9iamVjdEZyb21Mb2NhbENhY2hlIiwic2F2ZU9iamVjdFRvbG9jYWxDYWNoZSIsImFkZE5hdGl2ZUxpc3RlbmVyIiwicmVtb3ZlTmF0aXZlTGlzdGVuZXIiLCJzZW5kTWVzc2FnZU5hdGl2ZVRvTGlzdGVuZXIiLCJzYXZlSW1hZ2VUb0xpYnJhcnkiLCJkb3dubG9hZEZpbGVzVG9EaXNrIiwiaW5zdGFsbCIsIlZ1ZSIsIm9wdGlvbnMiLCJpbnN0YWxsZWQiLCJwcm90b3R5cGUiLCIkb3AiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsa0NBQWtDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FB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TyxDQUFDMUMsTUFBTSxDQUFDMkMsR0FBUixDQUFQO0FBQ0Q7O2VBRWM7QUFDYkQsU0FBTyxFQUFQQTtBQURhLEMiLCJmaWxlIjoib3B0aW11cy1zZGstdi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwib3B0aW11cy1zZGstdlwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJvcHRpbXVzLXNkay12XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm9wdGltdXMtc2RrLXZcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJ2YXIgYnJpZGdlID0ge1xuICAgIGRlZmF1bHQ6dGhpcywvLyBmb3IgdHlwZXNjcmlwdFxuICAgIGNhbGw6IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MsIGNiKSB7XG4gICAgICAgIHZhciByZXQgPSAnJztcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNiID0gYXJncztcbiAgICAgICAgICAgIGFyZ3MgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJnPXtkYXRhOmFyZ3M9PT11bmRlZmluZWQ/bnVsbDphcmdzfVxuICAgICAgICBpZiAodHlwZW9mIGNiID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBjYk5hbWUgPSAnZHNjYicgKyB3aW5kb3cuZHNjYisrO1xuICAgICAgICAgICAgd2luZG93W2NiTmFtZV0gPSBjYjtcbiAgICAgICAgICAgIGFyZ1snX2RzY2JzdHViJ10gPSBjYk5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnKVxuXG4gICAgICAgIC8vaWYgaW4gd2VidmlldyB0aGF0IGRzQnJpZGdlIHByb3ZpZGVkLCBjYWxsIVxuICAgICAgICBpZih3aW5kb3cuX2RzYnJpZGdlKXtcbiAgICAgICAgICAgcmV0PSAgX2RzYnJpZGdlLmNhbGwobWV0aG9kLCBhcmcpXG4gICAgICAgIH1lbHNlIGlmKHdpbmRvdy5fZHN3a3x8bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiX2RzYnJpZGdlXCIpIT0tMSl7XG4gICAgICAgICAgIHJldCA9IHByb21wdChcIl9kc2JyaWRnZT1cIiArIG1ldGhvZCwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgcmV0dXJuICBKU09OLnBhcnNlKHJldHx8J3t9JykuZGF0YVxuICAgIH0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChuYW1lLCBmdW4sIGFzeW4pIHtcbiAgICAgICAgdmFyIHEgPSBhc3luID8gd2luZG93Ll9kc2FmIDogd2luZG93Ll9kc2ZcbiAgICAgICAgaWYgKCF3aW5kb3cuX2RzSW5pdCkge1xuICAgICAgICAgICAgd2luZG93Ll9kc0luaXQgPSB0cnVlO1xuICAgICAgICAgICAgLy9ub3RpZnkgbmF0aXZlIHRoYXQganMgYXBpcyByZWdpc3RlciBzdWNjZXNzZnVsbHkgb24gbmV4dCBldmVudCBsb29wXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IuZHNpbml0XCIpO1xuICAgICAgICAgICAgfSwgMClcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZ1biA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBxLl9vYnNbbmFtZV0gPSBmdW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxW25hbWVdID0gZnVuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZ2lzdGVyQXN5bjogZnVuY3Rpb24gKG5hbWUsIGZ1bikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKG5hbWUsIGZ1biwgdHJ1ZSk7XG4gICAgfSxcbiAgICBoYXNOYXRpdmVNZXRob2Q6IGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoXCJfZHNiLmhhc05hdGl2ZU1ldGhvZFwiLCB7bmFtZTogbmFtZSwgdHlwZTp0eXBlfHxcImFsbFwifSk7XG4gICAgfSxcbiAgICBkaXNhYmxlSmF2YXNjcmlwdERpYWxvZ0Jsb2NrOiBmdW5jdGlvbiAoZGlzYWJsZSkge1xuICAgICAgICB0aGlzLmNhbGwoXCJfZHNiLmRpc2FibGVKYXZhc2NyaXB0RGlhbG9nQmxvY2tcIiwge1xuICAgICAgICAgICAgZGlzYWJsZTogZGlzYWJsZSAhPT0gZmFsc2VcbiAgICAgICAgfSlcbiAgICB9XG59O1xuXG4hZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cuX2RzZikgcmV0dXJuO1xuICAgIHZhciBvYiA9IHtcbiAgICAgICAgX2RzZjoge1xuICAgICAgICAgICAgX29iczoge31cbiAgICAgICAgfSxcbiAgICAgICAgX2RzYWY6IHtcbiAgICAgICAgICAgIF9vYnM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGRzY2I6IDAsXG4gICAgICAgIGRzQnJpZGdlOiBicmlkZ2UsXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IuY2xvc2VQYWdlXCIpXG4gICAgICAgIH0sXG4gICAgICAgIF9oYW5kbGVNZXNzYWdlRnJvbU5hdGl2ZTogZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBKU09OLnBhcnNlKGluZm8uZGF0YSk7XG4gICAgICAgICAgICB2YXIgcmV0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiBpbmZvLmNhbGxiYWNrSWQsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmID0gdGhpcy5fZHNmW2luZm8ubWV0aG9kXTtcbiAgICAgICAgICAgIHZhciBhZiA9IHRoaXMuX2RzYWZbaW5mby5tZXRob2RdXG4gICAgICAgICAgICB2YXIgY2FsbFN5biA9IGZ1bmN0aW9uIChmLCBvYikge1xuICAgICAgICAgICAgICAgIHJldC5kYXRhID0gZi5hcHBseShvYiwgYXJnKVxuICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5yZXR1cm5WYWx1ZVwiLCByZXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2FsbEFzeW4gPSBmdW5jdGlvbiAoZiwgb2IpIHtcbiAgICAgICAgICAgICAgICBhcmcucHVzaChmdW5jdGlvbiAoZGF0YSwgY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0LmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICByZXQuY29tcGxldGUgPSBjb21wbGV0ZSE9PWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IucmV0dXJuVmFsdWVcIiwgcmV0KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgZi5hcHBseShvYiwgYXJnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICBjYWxsU3luKGYsIHRoaXMuX2RzZik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFmKSB7XG4gICAgICAgICAgICAgICAgY2FsbEFzeW4oYWYsIHRoaXMuX2RzYWYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3dpdGggbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBpbmZvLm1ldGhvZC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aDwyKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZD1uYW1lLnBvcCgpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lc3BhY2U9bmFtZS5qb2luKCcuJylcbiAgICAgICAgICAgICAgICB2YXIgb2JzID0gdGhpcy5fZHNmLl9vYnM7XG4gICAgICAgICAgICAgICAgdmFyIG9iID0gb2JzW25hbWVzcGFjZV0gfHwge307XG4gICAgICAgICAgICAgICAgdmFyIG0gPSBvYlttZXRob2RdO1xuICAgICAgICAgICAgICAgIGlmIChtICYmIHR5cGVvZiBtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsU3luKG0sIG9iKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYnMgPSB0aGlzLl9kc2FmLl9vYnM7XG4gICAgICAgICAgICAgICAgb2IgPSBvYnNbbmFtZXNwYWNlXSB8fCB7fTtcbiAgICAgICAgICAgICAgICBtID0gb2JbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICBpZiAobSAmJiB0eXBlb2YgbSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbEFzeW4obSwgb2IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGF0dHIgaW4gb2IpIHtcbiAgICAgICAgd2luZG93W2F0dHJdID0gb2JbYXR0cl1cbiAgICB9XG4gICAgYnJpZGdlLnJlZ2lzdGVyKFwiX2hhc0phdmFzY3JpcHRNZXRob2RcIiwgZnVuY3Rpb24gKG1ldGhvZCwgdGFnKSB7XG4gICAgICAgICB2YXIgbmFtZSA9IG1ldGhvZC5zcGxpdCgnLicpXG4gICAgICAgICBpZihuYW1lLmxlbmd0aDwyKSB7XG4gICAgICAgICAgIHJldHVybiAhIShfZHNmW25hbWVdfHxfZHNhZltuYW1lXSlcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAvLyB3aXRoIG5hbWVzcGFjZVxuICAgICAgICAgICB2YXIgbWV0aG9kPW5hbWUucG9wKClcbiAgICAgICAgICAgdmFyIG5hbWVzcGFjZT1uYW1lLmpvaW4oJy4nKVxuICAgICAgICAgICB2YXIgb2I9X2RzZi5fb2JzW25hbWVzcGFjZV18fF9kc2FmLl9vYnNbbmFtZXNwYWNlXVxuICAgICAgICAgICByZXR1cm4gb2ImJiEhb2JbbWV0aG9kXVxuICAgICAgICAgfVxuICAgIH0pXG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYnJpZGdlOyIsImltcG9ydCBkc2JyaWRnZSBmcm9tICdkc2JyaWRnZSdcblxuY29uc3QgaW52b2tlRHNCcmlkZ2UgPSAobmFtZSwgcGFyYW1zID0ge30pID0+IHtcbiAgaWYgKCFkc2JyaWRnZSkge1xuICAgIHdpbmRvdy5hbGVydCgnbm8gc3VwcG9ydGVkLCDor7flnKjovabkuLvmg6BBUFDlhoXkvb/nlKgnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBkc2JyaWRnZS5jYWxsKG5hbWUsIHBhcmFtcywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpXG4gICAgICAgICAgcmVzLmNvZGUgPSArcmVzLmNvZGVcbiAgICAgICAgICByZXNvbHZlKHJlcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuY29uc3QgT3B0aW11cyA9IHtcbiAgLyoqXG4gICAqIOWIhuS6q1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHNoYXJlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzaGFyZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWFs+mXrXdlYnZpZXdcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBjbG9zZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnY2xvc2UnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmi6jmiZPnlLXor51cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICB0ZWxlcGhvbmU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3RlbGVwaG9uZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1t+WOn+eUn+eZu+W9lVxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGxvZ2luOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdsb2dpbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1t+WcsOWbvuWvvOiIqlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIG1hcE5hdmk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ21hcE5hdmknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmlK/ku5jmiJDlip/osIPnlKgg6YCa55+l5Y6f55SfXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgcGF5U3VjY2VzczogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgncGF5U3VjY2VzcycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlmFwcOeJiOacrOS/oeaBr1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGdldEFwcFZlcnNpb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldEFwcFZlcnNpb24nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmiZPlvIDljp/nlJ/pobXpnaLmiJbmlrDnmoR3ZWJ2aWV3IOWPr+aOp+WItuWOn+eUn+WktOaYvuekuuexu+Wei1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIG5ld0FjdGlvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbmV3QWN0aW9uJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5qCh6aqM55u45YaM5p2D6ZmQXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgaXNIYXZlQ2FtZXJhUGVybWlzc2lvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnaXNIYXZlQ2FtZXJhUGVybWlzc2lvbicsIHBhcmFtcylcbiAgfSxcbiAgd3hOYXRpdmVQYXk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3d4TmF0aXZlUGF5JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W6auY5b635a6a5L2N5L+h5oGvXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZ2V0QU1hcExvYzogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0QU1hcExvYycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWktOmDqOS/oeaBryDnirbmgIHmoI/pq5jluqbjgIHmmK/lkKbkvb/nlKjkuobljp/nlJ/lpLRcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnZXRXZWJIZWFkSW5mbzogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0V2ViSGVhZEluZm8nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmt7flkIjlvIDlj5Hnibnmrorkuovku7YgcHM6IOmmlumhteekvOWMheS6pOS6klxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGh5YnJpZEV2ZW50OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdoeWJyaWRFdmVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWQjOaEj+makOengeWNj+iurlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGNvbmZpcm1BZ3JlZW1lbnQ6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2NvbmZpcm1BZ3JlZW1lbnQnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDkuI3lkIzmhI/pmpDnp4HljY/orq5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBkaXNhZ3JlZUFncmVlbWVudDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZGlzYWdyZWVBZ3JlZW1lbnQnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDpgIDlh7phcHBcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBleGl0QXBwOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdleGl0QXBwJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5YWz6Zet5by55bGCd2Vidmlld1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGNsb3NlUG9wV2ViVmlldzogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnY2xvc2VQb3BXZWJWaWV3JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ruR5Z2X5qCh6aqMXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgc2xpZGVyQXV0aDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnc2xpZGVyQXV0aCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOezu+e7n+iuvue9rlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnb3RvQXBwU3lzdGVtU2V0dGluZzogKCkgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ290b0FwcFN5c3RlbVNldHRpbmcnKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W6YCa55+l5p2D6ZmQXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdldE5vdGlmaWNhdGlvblBlcm1pc3Npb246ICgpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldE5vdGlmaWNhdGlvblBlcm1pc3Npb24nKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35bCP56iL5bqPXG4gICAqIHY+PTIuNi4zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGV2b2tlV3hNaW5pUHJvZ3JhbTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZXZva2VXeE1pbmlQcm9ncmFtJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5b+r6YCf5YWF5YC8XG4gICAqIHY+PTIuNy4wXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdldFBob25lUmVjaGFyZ2VQYXJhbUFjdDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0UGhvbmVSZWNoYXJnZVBhcmFtQWN0JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW3IOaJq+aPj+S6jOe7tOeggVxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiB0aXA6IFwieHh4eFwiLCDmj5DnpLrmloflrZc6IOS4gOihjO+8jOazqOaEj+Wtl+aVsFxuICAgKiBmbGFzaFR5cGU6IFwiMFwiLCDpl6rlhYnnga/nsbvlnos6ICAwLuWFs+mXrSjpu5jorqQpICAgIDEuQXV0b+iHquWKqCAgMi5NYW51YWzmiYvliqgo5Ye6546w5oyJ6ZKuKVxuICAgKiBjYW5MaWJyYXJ5OiBcIjBcIiwgIOaYr+WQpuWPr+S7peS7juebuOWGjOmAieaLqTogIDAu5LiN5Y+v5LulKOm7mOiupCkgICAxLuWPr+S7peebuOWGjOmAieaLqVxuICAgKiBpc1Nob3dTZWFyY2hSZXN1bHQ6IFwiMFwiLCAg5piv5ZCm5Y6f55Sf6LCD55SoIOS6jOe7tOeggee7k+aenCDmjqXlj6Plubbot7Povaznu5Pmnpw6ICAgMDog55u05o6l6L+U5Zue5omr5o+P57uT5p6cKOm7mOiupCkgIDE66LCD55So5ZCO56uv5o6l5Y+j77yM5bm26Lez6L2s5Yiw55u45bqU55qE55WM6Z2iXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZXZva2VRUkNvZGVTY2FuOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdldm9rZVFSQ29kZVNjYW4nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbcg55u45py6L+ebuOWGjOadg+mZkFxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiBwYXRoOiBcIuWPr+mAiSwg5b2T5YmN6Lev5b6EXCIsXG4gICAqIHR5cGU6IDAgIDAu55u45py6ICAxLuebuOWGjCAgMi7nm7jmnLor55u45YaMICDlv4XpgIlcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBldm9rZUNhbWVyYUFuZExpYnJhcnk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V2b2tlQ2FtZXJhQW5kTGlicmFyeScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOS7jmFwcOacrOWcsOe8k+WtmOWPluaVsOaNrlxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiBrZXk6IFwi57yT5a2Y55qE5YWz6ZSu5a2XXCIsXG4gICAqIGlzQXN5bmM6IFwiMFwiLCAwLuWQjOatpee8k+WtmCjpu5jorqQpIDEuIOW8guatpee8k+WtmFxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdldE9iamVjdEZyb21Mb2NhbENhY2hlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRPYmplY3RGcm9tTG9jYWxDYWNoZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOe8k+WtmOaVsOaNruWIsGFwcOacrOWcsFxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiBkYXRhOiBcIuimgee8k+WtmOeahOaVsOaNrlwiLCDmlbDnu4TjgIHlrZfnrKbkuLLjgIHlrZflhbhcbiAgICoga2V5OiBcIue8k+WtmOeahOWFs+mUruWtl1wiLFxuICAgKiBpc0FzeW5jOiBcIjBcIiwgMC7lkIzmraXnvJPlrZgo6buY6K6kKSAgMS4g5byC5q2l57yT5a2YXG4gICAqIGlzVXNlckNhY2hlOiBcIjBcIiwgIDAu5Z+656GA57yT5a2YICAxLueUqOaIt+e8k+WtmCAgIOeUqOaIt+e8k+WtmOS8muWcqOmAgOWHuueZu+W9leWQjua4heeQhu+8jOWfuuehgOe8k+WtmOS4jeS8mlxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIHNhdmVPYmplY3RUb2xvY2FsQ2FjaGU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NhdmVPYmplY3RUb2xvY2FsQ2FjaGUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmlrDlop7nm5HlkKxcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICogYWN0aW9uOiBcIuebkeWQrOWQjWtleVwiXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgYWRkTmF0aXZlTGlzdGVuZXI6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2FkZE5hdGl2ZUxpc3RlbmVyJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog56e76Zmk55uR5ZCsXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAgKiBhY3Rpb246IFwi55uR5ZCs5ZCNa2V5XCJcbiAgICAqIH1cbiAgICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICAqL1xuICByZW1vdmVOYXRpdmVMaXN0ZW5lcjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgncmVtb3ZlTmF0aXZlTGlzdGVuZXInLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDnu5nnm5HlkKxrZXnlj5HpgIHmlbDmja5cbiAgICog5Y+v5Lul5ZyoYWRkTmF0aXZlTGlzdGVuZXLnmoTlm57osIPkuK3nm5HlkKzliLDkvKDlgLxcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICogYWN0aW9uOiBcIuebkeWQrOWQjWtleVwiLFxuICAgKiB2YWx1ZTogXCLnm5HlkKzliLDnmoTlgLwgdmFsdWVcIlxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIHNlbmRNZXNzYWdlTmF0aXZlVG9MaXN0ZW5lcjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnc2VuZE1lc3NhZ2VOYXRpdmVUb0xpc3RlbmVyJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5L+d5a2Y5Zu+54mH5Yiw5pys5Zyw55u45YaMXG4gICAqIOWVhuWutmFwcCB2PjEuMC4xXG4gICAqIEBwYXJhbSB7XG4gICAqIHR5cGU6ICcxJywgMS4g5Lyg5Zu+54mHdXJsKOm7mOiupCkgICAyLuS8oOWbvueJh+a1gVxuICAgKiBpbWFnZTogJycsICDlm77niYfnmoTlhoXlrrnvvIzkuI3lj6/kuLrnqbrvvIzlkKbliJnkvJrov5Tlm57plJnor69cbiAgICogZmlsZU5hbWU6ICcnLCDlm77niYfmlofku7blpLnlkI3lrZco6buY6K6k56m6Ke+8jCDkuLrnqbrnmoTml7blgJnvvIzkuI3kvJrmlrDlu7rkuIDkuKrlm77niYfmlofku7blpLlcbiAgICogaXNUb2FzdDogJzEnLCAxLiBBcHDmj5DnpLrkv53lrZjmiJDlip8o6buY6K6kKSAgMC5BcHDkuI3mj5DnpLpcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBzYXZlSW1hZ2VUb0xpYnJhcnk6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NhdmVJbWFnZVRvTGlicmFyeScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOS4i+i9vS/kv53lrZjmlofku7bliLDmnKzlnLDno4Hnm5hcbiAgICog5ZWG5a62YXBwIHY+MS4wLjFcbiAgICogQHBhcmFtIHtcbiAgICogdHlwZTogJzEnLCAxLiDkuIvovb3nmoR1cmwo6buY6K6kKSAgICAyLuaWh+S7tua1gVxuICAgKiBkb3dubG9hZFVybDogJycsIOaWh+S7tnVybO+8jCB0eXBlID0gMSDml7blv4XloavvvIzlkKbliJnkvJrov5Tlm57plJnor69cbiAgICogZmlsZURhdGE6ICcnLCDmlofku7bmtYHvvIwgdHlwZSA9IDIg5pe25b+F5aGrXG4gICAqIGZpbGVOYW1lOiAnJywg5paH5Lu25ZCN5a2X77yMdHlwZT0x6YCJ5aGrIOS4uuepuueahOaXtuWAme+8jOS8muS9v+eUqOaOpeWPo+eahOWQjeWtlywgdHlwZT0y5b+F5aGrXG4gICAqIGZpbGVUeXBlOiAnJywg5paH5Lu257G75Z6L77yM6YCJ5aGrICDlpoLmnpxmaWxlTmFtZeeUqOaWh+S7tuexu+Wei++8jOi/meS4quWPguaVsOS4jeeUn+aViFxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGRvd25sb2FkRmlsZXNUb0Rpc2s6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2Rvd25sb2FkRmlsZXNUb0Rpc2snLCBwYXJhbXMpXG4gIH1cbn1cblxuY29uc3QgaW5zdGFsbCA9IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcbiAgaWYgKGluc3RhbGwuaW5zdGFsbGVkKSByZXR1cm5cbiAgVnVlLnByb3RvdHlwZS4kb3AgPSBPcHRpbXVzXG59XG5cbi8qIOaUr+aMgeS9v+eUqOagh+etvueahOaWueW8j+W8leWFpSAqL1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WdWUpIHtcbiAgaW5zdGFsbCh3aW5kb3cuVnVlKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluc3RhbGxcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=