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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29wdGltdXMtc2RrLXYvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGstdi8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnZva2VEc0JyaWRnZSIsIm5hbWUiLCJwYXJhbXMiLCJ3aW5kb3ciLCJhbGVydCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2FsbCIsInJlcyIsIkpTT04iLCJwYXJzZSIsImNvZGUiLCJPcHRpbXVzIiwic2hhcmUiLCJjbG9zZSIsInRlbGVwaG9uZSIsImxvZ2luIiwibWFwTmF2aSIsInBheVN1Y2Nlc3MiLCJnZXRBcHBWZXJzaW9uIiwibmV3QWN0aW9uIiwiaXNIYXZlQ2FtZXJhUGVybWlzc2lvbiIsInd4TmF0aXZlUGF5IiwiZ2V0QU1hcExvYyIsImdldFdlYkhlYWRJbmZvIiwiaHlicmlkRXZlbnQiLCJjb25maXJtQWdyZWVtZW50IiwiZGlzYWdyZWVBZ3JlZW1lbnQiLCJleGl0QXBwIiwiY2xvc2VQb3BXZWJWaWV3Iiwic2xpZGVyQXV0aCIsImdvdG9BcHBTeXN0ZW1TZXR0aW5nIiwiZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbiIsImV2b2tlV3hNaW5pUHJvZ3JhbSIsImdldFBob25lUmVjaGFyZ2VQYXJhbUFjdCIsImV2b2tlUVJDb2RlU2NhbiIsImV2b2tlQ2FtZXJhQW5kTGlicmFyeSIsImdldE9iamVjdEZyb21Mb2NhbENhY2hlIiwic2F2ZU9iamVjdFRvbG9jYWxDYWNoZSIsImFkZE5hdGl2ZUxpc3RlbmVyIiwicmVtb3ZlTmF0aXZlTGlzdGVuZXIiLCJzZW5kTWVzc2FnZU5hdGl2ZVRvTGlzdGVuZXIiLCJpbnN0YWxsIiwiVnVlIiwib3B0aW9u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QVk7QUFDbEMsV0FBT0YsY0FBYyxDQUFDLHdCQUFELEVBQTJCRSxNQUEzQixDQUFyQjtBQUNELEdBN05hOztBQThOZDs7Ozs7Ozs7QUFRQXNDLG1CQUFpQixFQUFFLDJCQUFDdEMsTUFBRCxFQUFZO0FBQzdCLFdBQU9GLGNBQWMsQ0FBQyxtQkFBRCxFQUFzQkUsTUFBdEIsQ0FBckI7QUFDRCxHQXhPYTs7QUF5T2Q7Ozs7Ozs7O0FBUUF1QyxzQkFBb0IsRUFBRSw4QkFBQ3ZDLE1BQUQsRUFBWTtBQUNoQyxXQUFPRixjQUFjLENBQUMsc0JBQUQsRUFBeUJFLE1BQXpCLENBQXJCO0FBQ0QsR0FuUGE7O0FBb1BkOzs7Ozs7Ozs7O0FBVUF3Qyw2QkFBMkIsRUFBRSxxQ0FBQ3hDLE1BQUQsRUFBWTtBQUN2QyxXQUFPRixjQUFjLENBQUMsNkJBQUQsRUFBZ0NFLE1BQWhDLENBQXJCO0FBQ0Q7QUFoUWEsQ0FBaEI7O0FBbVFBLElBQU15QyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDdEMsTUFBSUYsT0FBTyxDQUFDRyxTQUFaLEVBQXVCO0FBQ3ZCRixLQUFHLENBQUNHLFNBQUosQ0FBY0MsR0FBZCxHQUFvQm5DLE9BQXBCO0FBQ0QsQ0FIRDtBQUtBOzs7QUFDQSxJQUFJLE9BQU9WLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ3lDLEdBQTVDLEVBQWlEO0FBQy9DRCxTQUFPLENBQUN4QyxNQUFNLENBQUN5QyxHQUFSLENBQVA7QUFDRDs7ZUFFYztBQUNiRCxTQUFPLEVBQVBBO0FBRGEsQyIsImZpbGUiOiJvcHRpbXVzLXNkay12LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJvcHRpbXVzLXNkay12XCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm9wdGltdXMtc2RrLXZcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wib3B0aW11cy1zZGstdlwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsInZhciBicmlkZ2UgPSB7XG4gICAgZGVmYXVsdDp0aGlzLC8vIGZvciB0eXBlc2NyaXB0XG4gICAgY2FsbDogZnVuY3Rpb24gKG1ldGhvZCwgYXJncywgY2IpIHtcbiAgICAgICAgdmFyIHJldCA9ICcnO1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3MgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2IgPSBhcmdzO1xuICAgICAgICAgICAgYXJncyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmc9e2RhdGE6YXJncz09PXVuZGVmaW5lZD9udWxsOmFyZ3N9XG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGNiTmFtZSA9ICdkc2NiJyArIHdpbmRvdy5kc2NiKys7XG4gICAgICAgICAgICB3aW5kb3dbY2JOYW1lXSA9IGNiO1xuICAgICAgICAgICAgYXJnWydfZHNjYnN0dWInXSA9IGNiTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcpXG5cbiAgICAgICAgLy9pZiBpbiB3ZWJ2aWV3IHRoYXQgZHNCcmlkZ2UgcHJvdmlkZWQsIGNhbGwhXG4gICAgICAgIGlmKHdpbmRvdy5fZHNicmlkZ2Upe1xuICAgICAgICAgICByZXQ9ICBfZHNicmlkZ2UuY2FsbChtZXRob2QsIGFyZylcbiAgICAgICAgfWVsc2UgaWYod2luZG93Ll9kc3drfHxuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJfZHNicmlkZ2VcIikhPS0xKXtcbiAgICAgICAgICAgcmV0ID0gcHJvbXB0KFwiX2RzYnJpZGdlPVwiICsgbWV0aG9kLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICByZXR1cm4gIEpTT04ucGFyc2UocmV0fHwne30nKS5kYXRhXG4gICAgfSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24gKG5hbWUsIGZ1biwgYXN5bikge1xuICAgICAgICB2YXIgcSA9IGFzeW4gPyB3aW5kb3cuX2RzYWYgOiB3aW5kb3cuX2RzZlxuICAgICAgICBpZiAoIXdpbmRvdy5fZHNJbml0KSB7XG4gICAgICAgICAgICB3aW5kb3cuX2RzSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAvL25vdGlmeSBuYXRpdmUgdGhhdCBqcyBhcGlzIHJlZ2lzdGVyIHN1Y2Nlc3NmdWxseSBvbiBuZXh0IGV2ZW50IGxvb3BcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5kc2luaXRcIik7XG4gICAgICAgICAgICB9LCAwKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHEuX29ic1tuYW1lXSA9IGZ1bjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHFbbmFtZV0gPSBmdW5cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVnaXN0ZXJBc3luOiBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXIobmFtZSwgZnVuLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhc05hdGl2ZU1ldGhvZDogZnVuY3Rpb24gKG5hbWUsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChcIl9kc2IuaGFzTmF0aXZlTWV0aG9kXCIsIHtuYW1lOiBuYW1lLCB0eXBlOnR5cGV8fFwiYWxsXCJ9KTtcbiAgICB9LFxuICAgIGRpc2FibGVKYXZhc2NyaXB0RGlhbG9nQmxvY2s6IGZ1bmN0aW9uIChkaXNhYmxlKSB7XG4gICAgICAgIHRoaXMuY2FsbChcIl9kc2IuZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9ja1wiLCB7XG4gICAgICAgICAgICBkaXNhYmxlOiBkaXNhYmxlICE9PSBmYWxzZVxuICAgICAgICB9KVxuICAgIH1cbn07XG5cbiFmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5fZHNmKSByZXR1cm47XG4gICAgdmFyIG9iID0ge1xuICAgICAgICBfZHNmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBfZHNhZjoge1xuICAgICAgICAgICAgX29iczoge31cbiAgICAgICAgfSxcbiAgICAgICAgZHNjYjogMCxcbiAgICAgICAgZHNCcmlkZ2U6IGJyaWRnZSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5jbG9zZVBhZ2VcIilcbiAgICAgICAgfSxcbiAgICAgICAgX2hhbmRsZU1lc3NhZ2VGcm9tTmF0aXZlOiBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IEpTT04ucGFyc2UoaW5mby5kYXRhKTtcbiAgICAgICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGluZm8uY2FsbGJhY2tJZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9kc2ZbaW5mby5tZXRob2RdO1xuICAgICAgICAgICAgdmFyIGFmID0gdGhpcy5fZHNhZltpbmZvLm1ldGhvZF1cbiAgICAgICAgICAgIHZhciBjYWxsU3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgcmV0LmRhdGEgPSBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWxsQXN5biA9IGZ1bmN0aW9uIChmLCBvYikge1xuICAgICAgICAgICAgICAgIGFyZy5wdXNoKGZ1bmN0aW9uIChkYXRhLCBjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldC5jb21wbGV0ZSA9IGNvbXBsZXRlIT09ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5yZXR1cm5WYWx1ZVwiLCByZXQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZikge1xuICAgICAgICAgICAgICAgIGNhbGxTeW4oZiwgdGhpcy5fZHNmKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWYpIHtcbiAgICAgICAgICAgICAgICBjYWxsQXN5bihhZiwgdGhpcy5fZHNhZik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGluZm8ubWV0aG9kLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoPDIpIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kPW5hbWUucG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZT1uYW1lLmpvaW4oJy4nKVxuICAgICAgICAgICAgICAgIHZhciBvYnMgPSB0aGlzLl9kc2YuX29icztcbiAgICAgICAgICAgICAgICB2YXIgb2IgPSBvYnNbbmFtZXNwYWNlXSB8fCB7fTtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxTeW4obSwgb2IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9icyA9IHRoaXMuX2RzYWYuX29icztcbiAgICAgICAgICAgICAgICBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIG0gPSBvYlttZXRob2RdO1xuICAgICAgICAgICAgICAgIGlmIChtICYmIHR5cGVvZiBtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsQXN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgYXR0ciBpbiBvYikge1xuICAgICAgICB3aW5kb3dbYXR0cl0gPSBvYlthdHRyXVxuICAgIH1cbiAgICBicmlkZ2UucmVnaXN0ZXIoXCJfaGFzSmF2YXNjcmlwdE1ldGhvZFwiLCBmdW5jdGlvbiAobWV0aG9kLCB0YWcpIHtcbiAgICAgICAgIHZhciBuYW1lID0gbWV0aG9kLnNwbGl0KCcuJylcbiAgICAgICAgIGlmKG5hbWUubGVuZ3RoPDIpIHtcbiAgICAgICAgICAgcmV0dXJuICEhKF9kc2ZbbmFtZV18fF9kc2FmW25hbWVdKVxuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIC8vIHdpdGggbmFtZXNwYWNlXG4gICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKVxuICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgIHZhciBvYj1fZHNmLl9vYnNbbmFtZXNwYWNlXXx8X2RzYWYuX29ic1tuYW1lc3BhY2VdXG4gICAgICAgICAgIHJldHVybiBvYiYmISFvYlttZXRob2RdXG4gICAgICAgICB9XG4gICAgfSlcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBicmlkZ2U7IiwiaW1wb3J0IGRzYnJpZGdlIGZyb20gJ2RzYnJpZGdlJ1xuXG5jb25zdCBpbnZva2VEc0JyaWRnZSA9IChuYW1lLCBwYXJhbXMgPSB7fSkgPT4ge1xuICBpZiAoIWRzYnJpZGdlKSB7XG4gICAgd2luZG93LmFsZXJ0KCdubyBzdXBwb3J0ZWQsIOivt+WcqOi9puS4u+aDoEFQUOWGheS9v+eUqCcpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGRzYnJpZGdlLmNhbGwobmFtZSwgcGFyYW1zLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICByZXMgPSBKU09OLnBhcnNlKHJlcylcbiAgICAgICAgICByZXMuY29kZSA9ICtyZXMuY29kZVxuICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBPcHRpbXVzID0ge1xuICAvKipcbiAgICog5YiG5LqrXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgc2hhcmU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NoYXJlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5YWz6Zetd2Vidmlld1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGNsb3NlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjbG9zZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaLqOaJk+eUteivnVxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHRlbGVwaG9uZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgndGVsZXBob25lJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Y6f55Sf55m75b2VXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbG9naW46IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2xvZ2luJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Zyw5Zu+5a+86IiqXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbWFwTmF2aTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbWFwTmF2aScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaUr+S7mOaIkOWKn+iwg+eUqCDpgJrnn6Xljp/nlJ9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBwYXlTdWNjZXNzOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdwYXlTdWNjZXNzJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+WYXBw54mI5pys5L+h5oGvXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0QXBwVmVyc2lvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0QXBwVmVyc2lvbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaJk+W8gOWOn+eUn+mhtemdouaIluaWsOeahHdlYnZpZXcg5Y+v5o6n5Yi25Y6f55Sf5aS05pi+56S657G75Z6LXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbmV3QWN0aW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCduZXdBY3Rpb24nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmoKHpqoznm7jlhozmnYPpmZBcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBpc0hhdmVDYW1lcmFQZXJtaXNzaW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdpc0hhdmVDYW1lcmFQZXJtaXNzaW9uJywgcGFyYW1zKVxuICB9LFxuICB3eE5hdGl2ZVBheTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnd3hOYXRpdmVQYXknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bpq5jlvrflrprkvY3kv6Hmga9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBnZXRBTWFwTG9jOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBTWFwTG9jJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W5aS06YOo5L+h5oGvIOeKtuaAgeagj+mrmOW6puOAgeaYr+WQpuS9v+eUqOS6huWOn+eUn+WktFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdldFdlYkhlYWRJbmZvOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRXZWJIZWFkSW5mbycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOa3t+WQiOW8gOWPkeeJueauiuS6i+S7tiBwczog6aaW6aG156S85YyF5Lqk5LqSXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgaHlicmlkRXZlbnQ6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2h5YnJpZEV2ZW50JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZCM5oSP6ZqQ56eB5Y2P6K6uXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgY29uZmlybUFncmVlbWVudDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnY29uZmlybUFncmVlbWVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOS4jeWQjOaEj+makOengeWNj+iurlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGRpc2FncmVlQWdyZWVtZW50OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdkaXNhZ3JlZUFncmVlbWVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOmAgOWHumFwcFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGV4aXRBcHA6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V4aXRBcHAnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlhbPpl63lvLnlsYJ3ZWJ2aWV3XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgY2xvc2VQb3BXZWJWaWV3OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjbG9zZVBvcFdlYlZpZXcnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmu5HlnZfmoKHpqoxcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBzbGlkZXJBdXRoOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzbGlkZXJBdXRoJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog57O757uf6K6+572uXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdvdG9BcHBTeXN0ZW1TZXR0aW5nOiAoKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnb3RvQXBwU3lzdGVtU2V0dGluZycpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bpgJrnn6XmnYPpmZBcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbjogKCkgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbicpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbflsI/nqIvluo9cbiAgICogdj49Mi42LjNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZXZva2VXeE1pbmlQcm9ncmFtOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdldm9rZVd4TWluaVByb2dyYW0nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlv6vpgJ/lhYXlgLxcbiAgICogdj49Mi43LjBcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0UGhvbmVSZWNoYXJnZVBhcmFtQWN0OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRQaG9uZVJlY2hhcmdlUGFyYW1BY3QnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbcg5omr5o+P5LqM57u056CBXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIHRpcDogXCJ4eHh4XCIsIOaPkOekuuaWh+Wtlzog5LiA6KGM77yM5rOo5oSP5a2X5pWwXG4gICAqIGZsYXNoVHlwZTogXCIwXCIsIOmXquWFieeBr+exu+WeizogIDAu5YWz6ZetKOm7mOiupCkgICAgMS5BdXRv6Ieq5YqoICAyLk1hbnVhbOaJi+WKqCjlh7rnjrDmjInpkq4pXG4gICAqIGNhbkxpYnJhcnk6IFwiMFwiLCAg5piv5ZCm5Y+v5Lul5LuO55u45YaM6YCJ5oupOiAgMC7kuI3lj6/ku6Uo6buY6K6kKSAgIDEu5Y+v5Lul55u45YaM6YCJ5oupXG4gICAqIGlzU2hvd1NlYXJjaFJlc3VsdDogXCIwXCIsICDmmK/lkKbljp/nlJ/osIPnlKgg5LqM57u056CB57uT5p6cIOaOpeWPo+W5tui3s+i9rOe7k+aenDogICAwOiDnm7TmjqXov5Tlm57miavmj4/nu5Pmnpwo6buY6K6kKSAgMTrosIPnlKjlkI7nq6/mjqXlj6PvvIzlubbot7PovazliLDnm7jlupTnmoTnlYzpnaJcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBldm9rZVFSQ29kZVNjYW46IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V2b2tlUVJDb2RlU2NhbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOWUpOi1tyDnm7jmnLov55u45YaM5p2D6ZmQXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIHBhdGg6IFwi5Y+v6YCJLCDlvZPliY3ot6/lvoRcIixcbiAgICogdHlwZTogMCAgMC7nm7jmnLogIDEu55u45YaMICAyLuebuOacuivnm7jlhowgIOW/hemAiVxuICAgKiB9XG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGV2b2tlQ2FtZXJhQW5kTGlicmFyeTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZXZva2VDYW1lcmFBbmRMaWJyYXJ5JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5LuOYXBw5pys5Zyw57yT5a2Y5Y+W5pWw5o2uXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIGtleTogXCLnvJPlrZjnmoTlhbPplK7lrZdcIixcbiAgICogaXNBc3luYzogXCIwXCIsIDAu5ZCM5q2l57yT5a2YKOm7mOiupCkgMS4g5byC5q2l57yT5a2YXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0T2JqZWN0RnJvbUxvY2FsQ2FjaGU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2dldE9iamVjdEZyb21Mb2NhbENhY2hlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog57yT5a2Y5pWw5o2u5YiwYXBw5pys5ZywXG4gICAqIOWVhuWutmFwcCB2PjEuMC4wXG4gICAqIEBwYXJhbSB7XG4gICAqIGRhdGE6IFwi6KaB57yT5a2Y55qE5pWw5o2uXCIsIOaVsOe7hOOAgeWtl+espuS4suOAgeWtl+WFuFxuICAgKiBrZXk6IFwi57yT5a2Y55qE5YWz6ZSu5a2XXCIsXG4gICAqIGlzQXN5bmM6IFwiMFwiLCAwLuWQjOatpee8k+WtmCjpu5jorqQpICAxLiDlvILmraXnvJPlrZhcbiAgICogaXNVc2VyQ2FjaGU6IFwiMFwiLCAgMC7ln7rnoYDnvJPlrZggIDEu55So5oi357yT5a2YICAg55So5oi357yT5a2Y5Lya5Zyo6YCA5Ye655m75b2V5ZCO5riF55CG77yM5Z+656GA57yT5a2Y5LiN5LyaXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgc2F2ZU9iamVjdFRvbG9jYWxDYWNoZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnc2F2ZU9iamVjdFRvbG9jYWxDYWNoZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaWsOWinuebkeWQrFxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiBhY3Rpb246IFwi55uR5ZCs5ZCNa2V5XCJcbiAgICogfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBhZGROYXRpdmVMaXN0ZW5lcjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnYWRkTmF0aXZlTGlzdGVuZXInLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDnp7vpmaTnm5HlkKxcbiAgICog5ZWG5a62YXBwIHY+MS4wLjBcbiAgICogQHBhcmFtIHtcbiAgICAqIGFjdGlvbjogXCLnm5HlkKzlkI1rZXlcIlxuICAgICogfVxuICAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgICovXG4gIHJlbW92ZU5hdGl2ZUxpc3RlbmVyOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdyZW1vdmVOYXRpdmVMaXN0ZW5lcicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOe7meebkeWQrGtleeWPkemAgeaVsOaNrlxuICAgKiDlj6/ku6XlnKhhZGROYXRpdmVMaXN0ZW5lcueahOWbnuiwg+S4reebkeWQrOWIsOS8oOWAvFxuICAgKiDllYblrrZhcHAgdj4xLjAuMFxuICAgKiBAcGFyYW0ge1xuICAgKiBhY3Rpb246IFwi55uR5ZCs5ZCNa2V5XCIsXG4gICAqIHZhbHVlOiBcIuebkeWQrOWIsOeahOWAvCB2YWx1ZVwiXG4gICAqIH1cbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgc2VuZE1lc3NhZ2VOYXRpdmVUb0xpc3RlbmVyOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzZW5kTWVzc2FnZU5hdGl2ZVRvTGlzdGVuZXInLCBwYXJhbXMpXG4gIH1cbn1cblxuY29uc3QgaW5zdGFsbCA9IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcbiAgaWYgKGluc3RhbGwuaW5zdGFsbGVkKSByZXR1cm5cbiAgVnVlLnByb3RvdHlwZS4kb3AgPSBPcHRpbXVzXG59XG5cbi8qIOaUr+aMgeS9v+eUqOagh+etvueahOaWueW8j+W8leWFpSAqL1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WdWUpIHtcbiAgaW5zdGFsbCh3aW5kb3cuVnVlKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluc3RhbGxcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=