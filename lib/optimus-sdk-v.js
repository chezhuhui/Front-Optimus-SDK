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
  },

  /**
   * 获取应用基础信息
   * 车主惠app v>2.7.2
   * @param params
   * @return {Promise<any>}
   */
  getApplicationInfo: function getApplicationInfo(params) {
    return invokeDsBridge('getApplicationInfo', params);
  },

  /**
   * 唤起原生浏览器
   * 车主惠app v>2.7.4
   * @param params
   * @return {Promise<any>}
   */
  evokeNativeBrowser: function evokeNativeBrowser(params) {
    return invokeDsBridge('evokeNativeBrowser', params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29wdGltdXMtc2RrLXYvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGstdi8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnZva2VEc0JyaWRnZSIsIm5hbWUiLCJwYXJhbXMiLCJ3aW5kb3ciLCJhbGVydCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2FsbCIsInJlcyIsIkpTT04iLCJwYXJzZSIsImNvZGUiLCJPcHRpbXVzIiwic2hhcmUiLCJjbG9zZSIsInRlbGVwaG9uZSIsImxvZ2luIiwibWFwTmF2aSIsInBheVN1Y2Nlc3MiLCJnZXRBcHBWZXJzaW9uIiwibmV3QWN0aW9uIiwiaXNIYXZlQ2FtZXJhUGVybWlzc2lvbiIsInd4TmF0aXZlUGF5IiwiZ2V0QU1hcExvYyIsImdldFdlYkhlYWRJbmZvIiwiaHlicmlkRXZlbnQiLCJjb25maXJtQWdyZWVtZW50IiwiZGlzYWdyZWVBZ3JlZW1lbnQiLCJleGl0QXBwIiwiY2xvc2VQb3BXZWJWaWV3Iiwic2xpZGVyQXV0aCIsImdvdG9BcHBTeXN0ZW1TZXR0aW5nIiwiZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbiIsImV2b2tlV3hNaW5pUHJvZ3JhbSIsImdldFBob25lUmVjaGFyZ2VQYXJhbUFjdCIsImV2b2tlUVJDb2RlU2NhbiIsImV2b2tlQ2FtZXJhQW5kTGlicmFyeSIsImdldE9iamVjdEZyb21Mb2NhbENhY2hlIiwic2F2ZU9iamVjdFRvbG9jYWxDYWNoZSIsImFkZE5hdGl2ZUxpc3RlbmVyIiwicmVtb3ZlTmF0aXZlTGlzdGVuZXIiLCJzZW5kTWVzc2FnZU5hdGl2ZVRvTGlzdGVuZXIiLCJzYXZlSW1hZ2VUb0xpYnJhcnkiLCJkb3dubG9hZEZpbGVzVG9EaXNrIiwiZ2V0QXBwbGljYXRpb25JbmZvIiwiZXZva2VOYXRpdmVCcm93c2VyIiwiaW5zdGFsbCIsIlZ1ZSIsIm9wdGlvbnMiLCJpbnN0YWxsZWQiLCJwcm90b3R5cGUiLCIkb3AiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsa0NBQWtDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7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ckI7QUFDRDtBQS9TYSxDQUFoQjs7QUFrVEEsSUFBTTZDLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQVVDLEdBQVYsRUFBZUMsT0FBZixFQUF3QjtBQUN0QyxNQUFJRixPQUFPLENBQUNHLFNBQVosRUFBdUI7QUFDdkJGLEtBQUcsQ0FBQ0csU0FBSixDQUFjQyxHQUFkLEdBQW9CdkMsT0FBcEI7QUFDRCxDQUhEO0FBS0E7OztBQUNBLElBQUksT0FBT1YsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDNkMsR0FBNUMsRUFBaUQ7QUFDL0NELFNBQU8sQ0FBQzVDLE1BQU0sQ0FBQzZDLEdBQVIsQ0FBUDtBQUNEOztlQUVjO0FBQ2JELFNBQU8sRUFBUEE7QUFEYSxDIiwiZmlsZSI6Im9wdGltdXMtc2RrLXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIm9wdGltdXMtc2RrLXZcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wib3B0aW11cy1zZGstdlwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJvcHRpbXVzLXNkay12XCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwidmFyIGJyaWRnZSA9IHtcbiAgICBkZWZhdWx0OnRoaXMsLy8gZm9yIHR5cGVzY3JpcHRcbiAgICBjYWxsOiBmdW5jdGlvbiAobWV0aG9kLCBhcmdzLCBjYikge1xuICAgICAgICB2YXIgcmV0ID0gJyc7XG4gICAgICAgIGlmICh0eXBlb2YgYXJncyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYiA9IGFyZ3M7XG4gICAgICAgICAgICBhcmdzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZz17ZGF0YTphcmdzPT09dW5kZWZpbmVkP251bGw6YXJnc31cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgY2JOYW1lID0gJ2RzY2InICsgd2luZG93LmRzY2IrKztcbiAgICAgICAgICAgIHdpbmRvd1tjYk5hbWVdID0gY2I7XG4gICAgICAgICAgICBhcmdbJ19kc2Nic3R1YiddID0gY2JOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZylcblxuICAgICAgICAvL2lmIGluIHdlYnZpZXcgdGhhdCBkc0JyaWRnZSBwcm92aWRlZCwgY2FsbCFcbiAgICAgICAgaWYod2luZG93Ll9kc2JyaWRnZSl7XG4gICAgICAgICAgIHJldD0gIF9kc2JyaWRnZS5jYWxsKG1ldGhvZCwgYXJnKVxuICAgICAgICB9ZWxzZSBpZih3aW5kb3cuX2Rzd2t8fG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIl9kc2JyaWRnZVwiKSE9LTEpe1xuICAgICAgICAgICByZXQgPSBwcm9tcHQoXCJfZHNicmlkZ2U9XCIgKyBtZXRob2QsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgIHJldHVybiAgSlNPTi5wYXJzZShyZXR8fCd7fScpLmRhdGFcbiAgICB9LFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiAobmFtZSwgZnVuLCBhc3luKSB7XG4gICAgICAgIHZhciBxID0gYXN5biA/IHdpbmRvdy5fZHNhZiA6IHdpbmRvdy5fZHNmXG4gICAgICAgIGlmICghd2luZG93Ll9kc0luaXQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5fZHNJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vbm90aWZ5IG5hdGl2ZSB0aGF0IGpzIGFwaXMgcmVnaXN0ZXIgc3VjY2Vzc2Z1bGx5IG9uIG5leHQgZXZlbnQgbG9vcFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmRzaW5pdFwiKTtcbiAgICAgICAgICAgIH0sIDApXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmdW4gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcS5fb2JzW25hbWVdID0gZnVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcVtuYW1lXSA9IGZ1blxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWdpc3RlckFzeW46IGZ1bmN0aW9uIChuYW1lLCBmdW4pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlcihuYW1lLCBmdW4sIHRydWUpO1xuICAgIH0sXG4gICAgaGFzTmF0aXZlTWV0aG9kOiBmdW5jdGlvbiAobmFtZSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKFwiX2RzYi5oYXNOYXRpdmVNZXRob2RcIiwge25hbWU6IG5hbWUsIHR5cGU6dHlwZXx8XCJhbGxcIn0pO1xuICAgIH0sXG4gICAgZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9jazogZnVuY3Rpb24gKGRpc2FibGUpIHtcbiAgICAgICAgdGhpcy5jYWxsKFwiX2RzYi5kaXNhYmxlSmF2YXNjcmlwdERpYWxvZ0Jsb2NrXCIsIHtcbiAgICAgICAgICAgIGRpc2FibGU6IGRpc2FibGUgIT09IGZhbHNlXG4gICAgICAgIH0pXG4gICAgfVxufTtcblxuIWZ1bmN0aW9uICgpIHtcbiAgICBpZiAod2luZG93Ll9kc2YpIHJldHVybjtcbiAgICB2YXIgb2IgPSB7XG4gICAgICAgIF9kc2Y6IHtcbiAgICAgICAgICAgIF9vYnM6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIF9kc2FmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBkc2NiOiAwLFxuICAgICAgICBkc0JyaWRnZTogYnJpZGdlLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLmNsb3NlUGFnZVwiKVxuICAgICAgICB9LFxuICAgICAgICBfaGFuZGxlTWVzc2FnZUZyb21OYXRpdmU6IGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gSlNPTi5wYXJzZShpbmZvLmRhdGEpO1xuICAgICAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICAgICAgICBpZDogaW5mby5jYWxsYmFja0lkLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuX2RzZltpbmZvLm1ldGhvZF07XG4gICAgICAgICAgICB2YXIgYWYgPSB0aGlzLl9kc2FmW2luZm8ubWV0aG9kXVxuICAgICAgICAgICAgdmFyIGNhbGxTeW4gPSBmdW5jdGlvbiAoZiwgb2IpIHtcbiAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgICAgICBicmlkZ2UuY2FsbChcIl9kc2IucmV0dXJuVmFsdWVcIiwgcmV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNhbGxBc3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgYXJnLnB1c2goZnVuY3Rpb24gKGRhdGEsIGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldC5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0LmNvbXBsZXRlID0gY29tcGxldGUhPT1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGYuYXBwbHkob2IsIGFyZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgY2FsbFN5bihmLCB0aGlzLl9kc2YpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhZikge1xuICAgICAgICAgICAgICAgIGNhbGxBc3luKGFmLCB0aGlzLl9kc2FmKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy93aXRoIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gaW5mby5tZXRob2Quc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGg8MikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgICAgICAgdmFyIG9icyA9IHRoaXMuX2RzZi5fb2JzO1xuICAgICAgICAgICAgICAgIHZhciBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIHZhciBtID0gb2JbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICBpZiAobSAmJiB0eXBlb2YgbSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbFN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JzID0gdGhpcy5fZHNhZi5fb2JzO1xuICAgICAgICAgICAgICAgIG9iID0gb2JzW25hbWVzcGFjZV0gfHwge307XG4gICAgICAgICAgICAgICAgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxBc3luKG0sIG9iKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBhdHRyIGluIG9iKSB7XG4gICAgICAgIHdpbmRvd1thdHRyXSA9IG9iW2F0dHJdXG4gICAgfVxuICAgIGJyaWRnZS5yZWdpc3RlcihcIl9oYXNKYXZhc2NyaXB0TWV0aG9kXCIsIGZ1bmN0aW9uIChtZXRob2QsIHRhZykge1xuICAgICAgICAgdmFyIG5hbWUgPSBtZXRob2Quc3BsaXQoJy4nKVxuICAgICAgICAgaWYobmFtZS5sZW5ndGg8Mikge1xuICAgICAgICAgICByZXR1cm4gISEoX2RzZltuYW1lXXx8X2RzYWZbbmFtZV0pXG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgLy8gd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgdmFyIG1ldGhvZD1uYW1lLnBvcCgpXG4gICAgICAgICAgIHZhciBuYW1lc3BhY2U9bmFtZS5qb2luKCcuJylcbiAgICAgICAgICAgdmFyIG9iPV9kc2YuX29ic1tuYW1lc3BhY2VdfHxfZHNhZi5fb2JzW25hbWVzcGFjZV1cbiAgICAgICAgICAgcmV0dXJuIG9iJiYhIW9iW21ldGhvZF1cbiAgICAgICAgIH1cbiAgICB9KVxufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyaWRnZTsiLCJpbXBvcnQgZHNicmlkZ2UgZnJvbSAnZHNicmlkZ2UnXG5cbmNvbnN0IGludm9rZURzQnJpZGdlID0gKG5hbWUsIHBhcmFtcyA9IHt9KSA9PiB7XG4gIGlmICghZHNicmlkZ2UpIHtcbiAgICB3aW5kb3cuYWxlcnQoJ25vIHN1cHBvcnRlZCwg6K+35Zyo6L2m5Li75oOgQVBQ5YaF5L2/55SoJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZHNicmlkZ2UuY2FsbChuYW1lLCBwYXJhbXMsIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIHJlcyA9IEpTT04ucGFyc2UocmVzKVxuICAgICAgICAgIHJlcy5jb2RlID0gK3Jlcy5jb2RlXG4gICAgICAgICAgcmVzb2x2ZShyZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHJlcylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbmNvbnN0IE9wdGltdXMgPSB7XG4gIC8qKlxuICAgKiDliIbkuqtcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBzaGFyZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnc2hhcmUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlhbPpl613ZWJ2aWV3XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgY2xvc2U6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2Nsb3NlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ouo5omT55S16K+dXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgdGVsZXBob25lOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCd0ZWxlcGhvbmUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbfljp/nlJ/nmbvlvZVcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBsb2dpbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbG9naW4nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbflnLDlm77lr7zoiKpcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBtYXBOYXZpOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdtYXBOYXZpJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5pSv5LuY5oiQ5Yqf6LCD55SoIOmAmuefpeWOn+eUn1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHBheVN1Y2Nlc3M6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3BheVN1Y2Nlc3MnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5ZhcHDniYjmnKzkv6Hmga9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBnZXRBcHBWZXJzaW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBcHBWZXJzaW9uJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5omT5byA5Y6f55Sf6aG16Z2i5oiW5paw55qEd2VidmlldyDlj6/mjqfliLbljp/nlJ/lpLTmmL7npLrnsbvlnotcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBuZXdBY3Rpb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ25ld0FjdGlvbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOagoemqjOebuOWGjOadg+mZkFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGlzSGF2ZUNhbWVyYVBlcm1pc3Npb246IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2lzSGF2ZUNhbWVyYVBlcm1pc3Npb24nLCBwYXJhbXMpXG4gIH0sXG4gIHd4TmF0aXZlUGF5OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCd3eE5hdGl2ZVBheScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlumrmOW+t+WumuS9jeS/oeaBr1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGdldEFNYXBMb2M6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldEFNYXBMb2MnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blpLTpg6jkv6Hmga8g54q25oCB5qCP6auY5bqm44CB5piv5ZCm5L2/55So5LqG5Y6f55Sf5aS0XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0V2ViSGVhZEluZm86IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldFdlYkhlYWRJbmZvJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5re35ZCI5byA5Y+R54m55q6K5LqL5Lu2IHBzOiDpppbpobXnpLzljIXkuqTkupJcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBoeWJyaWRFdmVudDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnaHlicmlkRXZlbnQnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlkIzmhI/pmpDnp4HljY/orq5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBjb25maXJtQWdyZWVtZW50OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjb25maXJtQWdyZWVtZW50JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5LiN5ZCM5oSP6ZqQ56eB5Y2P6K6uXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZGlzYWdyZWVBZ3JlZW1lbnQ6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2Rpc2FncmVlQWdyZWVtZW50JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6YCA5Ye6YXBwXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZXhpdEFwcDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZXhpdEFwcCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWFs+mXreW8ueWxgndlYnZpZXdcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBjbG9zZVBvcFdlYlZpZXc6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2Nsb3NlUG9wV2ViVmlldycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOa7keWdl+agoemqjFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIHNsaWRlckF1dGg6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NsaWRlckF1dGgnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDns7vnu5/orr7nva5cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ290b0FwcFN5c3RlbVNldHRpbmc6ICgpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dvdG9BcHBTeXN0ZW1TZXR0aW5nJylcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPlumAmuefpeadg+mZkFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnZXROb3RpZmljYXRpb25QZXJtaXNzaW9uOiAoKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXROb3RpZmljYXRpb25QZXJtaXNzaW9uJylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1t+Wwj+eoi+W6j1xuICAgKiB2Pj0yLjYuM1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBldm9rZVd4TWluaVByb2dyYW06IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V2b2tlV3hNaW5pUHJvZ3JhbScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOW/q+mAn+WFheWAvFxuICAgKiB2Pj0yLjcuMFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnZXRQaG9uZVJlY2hhcmdlUGFyYW1BY3Q6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldFBob25lUmVjaGFyZ2VQYXJhbUFjdCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1tyDmiavmj4/kuoznu7TnoIFcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICogdGlwOiBcInh4eHhcIiwg5o+Q56S65paH5a2XOiDkuIDooYzvvIzms6jmhI/lrZfmlbBcbiAgICogZmxhc2hUeXBlOiBcIjBcIiwg6Zeq5YWJ54Gv57G75Z6LOiAgMC7lhbPpl60o6buY6K6kKSAgICAxLkF1dG/oh6rliqggIDIuTWFudWFs5omL5YqoKOWHuueOsOaMiemSrilcbiAgICogY2FuTGlicmFyeTogXCIwXCIsICDmmK/lkKblj6/ku6Xku47nm7jlhozpgInmi6k6ICAwLuS4jeWPr+S7pSjpu5jorqQpICAgMS7lj6/ku6Xnm7jlhozpgInmi6lcbiAgICogaXNTaG93U2VhcmNoUmVzdWx0OiBcIjBcIiwgIOaYr+WQpuWOn+eUn+iwg+eUqCDkuoznu7TnoIHnu5Pmnpwg5o6l5Y+j5bm26Lez6L2s57uT5p6cOiAgIDA6IOebtOaOpei/lOWbnuaJq+aPj+e7k+aenCjpu5jorqQpICAxOuiwg+eUqOWQjuerr+aOpeWPo++8jOW5tui3s+i9rOWIsOebuOW6lOeahOeVjOmdolxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGV2b2tlUVJDb2RlU2NhbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZXZva2VRUkNvZGVTY2FuJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW3IOebuOacui/nm7jlhozmnYPpmZBcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICogcGF0aDogXCLlj6/pgIksIOW9k+WJjei3r+W+hFwiLFxuICAgKiB0eXBlOiAwICAwLuebuOacuiAgMS7nm7jlhowgIDIu55u45py6K+ebuOWGjCAg5b+F6YCJXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZXZva2VDYW1lcmFBbmRMaWJyYXJ5OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdldm9rZUNhbWVyYUFuZExpYnJhcnknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDku45hcHDmnKzlnLDnvJPlrZjlj5bmlbDmja5cbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICoga2V5OiBcIue8k+WtmOeahOWFs+mUruWtl1wiLFxuICAgKiBpc0FzeW5jOiBcIjBcIiwgMC7lkIzmraXnvJPlrZgo6buY6K6kKSAxLiDlvILmraXnvJPlrZhcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBnZXRPYmplY3RGcm9tTG9jYWxDYWNoZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0T2JqZWN0RnJvbUxvY2FsQ2FjaGUnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDnvJPlrZjmlbDmja7liLBhcHDmnKzlnLBcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICogZGF0YTogXCLopoHnvJPlrZjnmoTmlbDmja5cIiwg5pWw57uE44CB5a2X56ym5Liy44CB5a2X5YW4XG4gICAqIGtleTogXCLnvJPlrZjnmoTlhbPplK7lrZdcIixcbiAgICogaXNBc3luYzogXCIwXCIsIDAu5ZCM5q2l57yT5a2YKOm7mOiupCkgIDEuIOW8guatpee8k+WtmFxuICAgKiBpc1VzZXJDYWNoZTogXCIwXCIsICAwLuWfuuehgOe8k+WtmCAgMS7nlKjmiLfnvJPlrZggICDnlKjmiLfnvJPlrZjkvJrlnKjpgIDlh7rnmbvlvZXlkI7muIXnkIbvvIzln7rnoYDnvJPlrZjkuI3kvJpcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBzYXZlT2JqZWN0VG9sb2NhbENhY2hlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzYXZlT2JqZWN0VG9sb2NhbENhY2hlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5paw5aKe55uR5ZCsXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIGFjdGlvbjogXCLnm5HlkKzlkI1rZXlcIlxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGFkZE5hdGl2ZUxpc3RlbmVyOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdhZGROYXRpdmVMaXN0ZW5lcicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOenu+mZpOebkeWQrFxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgICogYWN0aW9uOiBcIuebkeWQrOWQjWtleVwiXG4gICAgKiB9XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAgKi9cbiAgcmVtb3ZlTmF0aXZlTGlzdGVuZXI6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3JlbW92ZU5hdGl2ZUxpc3RlbmVyJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog57uZ55uR5ZCsa2V55Y+R6YCB5pWw5o2uXG4gICAqIOWPr+S7peWcqGFkZE5hdGl2ZUxpc3RlbmVy55qE5Zue6LCD5Lit55uR5ZCs5Yiw5Lyg5YC8XG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIGFjdGlvbjogXCLnm5HlkKzlkI1rZXlcIixcbiAgICogdmFsdWU6IFwi55uR5ZCs5Yiw55qE5YC8IHZhbHVlXCJcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBzZW5kTWVzc2FnZU5hdGl2ZVRvTGlzdGVuZXI6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NlbmRNZXNzYWdlTmF0aXZlVG9MaXN0ZW5lcicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOS/neWtmOWbvueJh+WIsOacrOWcsOebuOWGjFxuICAgKiDllYblrrZhcHAgdj4xLjAuMVxuICAgKiBAcGFyYW0ge1xuICAgKiB0eXBlOiAnMScsIDEuIOS8oOWbvueJh3VybCjpu5jorqQpICAgMi7kvKDlm77niYfmtYFcbiAgICogaW1hZ2U6ICcnLCAg5Zu+54mH55qE5YaF5a6577yM5LiN5Y+v5Li656m677yM5ZCm5YiZ5Lya6L+U5Zue6ZSZ6K+vXG4gICAqIGZpbGVOYW1lOiAnJywg5Zu+54mH5paH5Lu25aS55ZCN5a2XKOm7mOiupOepuinvvIwg5Li656m655qE5pe25YCZ77yM5LiN5Lya5paw5bu65LiA5Liq5Zu+54mH5paH5Lu25aS5XG4gICAqIGlzVG9hc3Q6ICcxJywgMS4gQXBw5o+Q56S65L+d5a2Y5oiQ5YqfKOm7mOiupCkgIDAuQXBw5LiN5o+Q56S6XG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgc2F2ZUltYWdlVG9MaWJyYXJ5OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzYXZlSW1hZ2VUb0xpYnJhcnknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDkuIvovb0v5L+d5a2Y5paH5Lu25Yiw5pys5Zyw56OB55uYXG4gICAqIOWVhuWutmFwcCB2PjEuMC4xXG4gICAqIEBwYXJhbSB7XG4gICAqIHR5cGU6ICcxJywgMS4g5LiL6L2955qEdXJsKOm7mOiupCkgICAgMi7mlofku7bmtYFcbiAgICogZG93bmxvYWRVcmw6ICcnLCDmlofku7Z1cmzvvIwgdHlwZSA9IDEg5pe25b+F5aGr77yM5ZCm5YiZ5Lya6L+U5Zue6ZSZ6K+vXG4gICAqIGZpbGVEYXRhOiAnJywg5paH5Lu25rWB77yMIHR5cGUgPSAyIOaXtuW/heWhq1xuICAgKiBmaWxlTmFtZTogJycsIOaWh+S7tuWQjeWtl++8jHR5cGU9MemAieWhqyDkuLrnqbrnmoTml7blgJnvvIzkvJrkvb/nlKjmjqXlj6PnmoTlkI3lrZcsIHR5cGU9MuW/heWhq1xuICAgKiBmaWxlVHlwZTogJycsIOaWh+S7tuexu+Wei++8jOmAieWhqyAg5aaC5p6cZmlsZU5hbWXnlKjmlofku7bnsbvlnovvvIzov5nkuKrlj4LmlbDkuI3nlJ/mlYhcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBkb3dubG9hZEZpbGVzVG9EaXNrOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdkb3dubG9hZEZpbGVzVG9EaXNrJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W5bqU55So5Z+656GA5L+h5oGvXG4gICAqIOi9puS4u+aDoGFwcCB2PjIuNy4yXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0QXBwbGljYXRpb25JbmZvOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBcHBsaWNhdGlvbkluZm8nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbfljp/nlJ/mtY/op4jlmahcbiAgICog6L2m5Li75oOgYXBwIHY+Mi43LjRcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBldm9rZU5hdGl2ZUJyb3dzZXI6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V2b2tlTmF0aXZlQnJvd3NlcicsIHBhcmFtcylcbiAgfVxufVxuXG5jb25zdCBpbnN0YWxsID0gZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xuICBpZiAoaW5zdGFsbC5pbnN0YWxsZWQpIHJldHVyblxuICBWdWUucHJvdG90eXBlLiRvcCA9IE9wdGltdXNcbn1cblxuLyog5pSv5oyB5L2/55So5qCH562+55qE5pa55byP5byV5YWlICovXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZ1ZSkge1xuICBpbnN0YWxsKHdpbmRvdy5WdWUpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5zdGFsbFxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==