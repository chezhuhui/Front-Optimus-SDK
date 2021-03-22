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
  evokeWxMiniProgram: function evokeWxMiniProgram() {
    return invokeDsBridge('evokeWxMiniProgram');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9vcHRpbXVzLXNkay12L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29wdGltdXMtc2RrLXYvLi9ub2RlX21vZHVsZXMvZHNicmlkZ2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb3B0aW11cy1zZGstdi8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnZva2VEc0JyaWRnZSIsIm5hbWUiLCJwYXJhbXMiLCJ3aW5kb3ciLCJhbGVydCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2FsbCIsInJlcyIsIkpTT04iLCJwYXJzZSIsImNvZGUiLCJPcHRpbXVzIiwic2hhcmUiLCJjbG9zZSIsInRlbGVwaG9uZSIsImxvZ2luIiwibWFwTmF2aSIsInBheVN1Y2Nlc3MiLCJnZXRBcHBWZXJzaW9uIiwibmV3QWN0aW9uIiwiaXNIYXZlQ2FtZXJhUGVybWlzc2lvbiIsInd4TmF0aXZlUGF5IiwiZ2V0QU1hcExvYyIsImdldFdlYkhlYWRJbmZvIiwiaHlicmlkRXZlbnQiLCJjb25maXJtQWdyZWVtZW50IiwiZGlzYWdyZWVBZ3JlZW1lbnQiLCJleGl0QXBwIiwiY2xvc2VQb3BXZWJWaWV3Iiwic2xpZGVyQXV0aCIsImdvdG9BcHBTeXN0ZW1TZXR0aW5nIiwiZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbiIsImV2b2tlV3hNaW5pUHJvZ3JhbSIsImluc3RhbGwiLCJWdWUiLCJvcHRpb25zIiwiaW5zdGFsbGVkIiwicHJvdG90eXBlIiwiJG9wIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztR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QUFjLENBQUMsc0JBQUQsQ0FBckI7QUFDRCxHQWxKYTs7QUFtSmQ7Ozs7QUFJQWlDLDJCQUF5QixFQUFFLHFDQUFNO0FBQy9CLFdBQU9qQyxjQUFjLENBQUMsMkJBQUQsQ0FBckI7QUFDRCxHQXpKYTs7QUEwSmQ7Ozs7O0FBS0FrQyxvQkFBa0IsRUFBRSw4QkFBTTtBQUN4QixXQUFPbEMsY0FBYyxDQUFDLG9CQUFELENBQXJCO0FBQ0Q7QUFqS2EsQ0FBaEI7O0FBb0tBLElBQU1tQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDdEMsTUFBSUYsT0FBTyxDQUFDRyxTQUFaLEVBQXVCO0FBQ3ZCRixLQUFHLENBQUNHLFNBQUosQ0FBY0MsR0FBZCxHQUFvQjNCLE9BQXBCO0FBQ0QsQ0FIRDtBQUtBOzs7QUFDQSxJQUFJLE9BQU9WLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ2lDLEdBQTVDLEVBQWlEO0FBQy9DRCxTQUFPLENBQUNoQyxNQUFNLENBQUNpQyxHQUFSLENBQVA7QUFDRDs7ZUFFYztBQUNiRCxTQUFPLEVBQVBBO0FBRGEsQyIsImZpbGUiOiJvcHRpbXVzLXNkay12LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJvcHRpbXVzLXNkay12XCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm9wdGltdXMtc2RrLXZcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wib3B0aW11cy1zZGstdlwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsInZhciBicmlkZ2UgPSB7XG4gICAgZGVmYXVsdDp0aGlzLC8vIGZvciB0eXBlc2NyaXB0XG4gICAgY2FsbDogZnVuY3Rpb24gKG1ldGhvZCwgYXJncywgY2IpIHtcbiAgICAgICAgdmFyIHJldCA9ICcnO1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3MgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2IgPSBhcmdzO1xuICAgICAgICAgICAgYXJncyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmc9e2RhdGE6YXJncz09PXVuZGVmaW5lZD9udWxsOmFyZ3N9XG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGNiTmFtZSA9ICdkc2NiJyArIHdpbmRvdy5kc2NiKys7XG4gICAgICAgICAgICB3aW5kb3dbY2JOYW1lXSA9IGNiO1xuICAgICAgICAgICAgYXJnWydfZHNjYnN0dWInXSA9IGNiTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcpXG5cbiAgICAgICAgLy9pZiBpbiB3ZWJ2aWV3IHRoYXQgZHNCcmlkZ2UgcHJvdmlkZWQsIGNhbGwhXG4gICAgICAgIGlmKHdpbmRvdy5fZHNicmlkZ2Upe1xuICAgICAgICAgICByZXQ9ICBfZHNicmlkZ2UuY2FsbChtZXRob2QsIGFyZylcbiAgICAgICAgfWVsc2UgaWYod2luZG93Ll9kc3drfHxuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJfZHNicmlkZ2VcIikhPS0xKXtcbiAgICAgICAgICAgcmV0ID0gcHJvbXB0KFwiX2RzYnJpZGdlPVwiICsgbWV0aG9kLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICByZXR1cm4gIEpTT04ucGFyc2UocmV0fHwne30nKS5kYXRhXG4gICAgfSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24gKG5hbWUsIGZ1biwgYXN5bikge1xuICAgICAgICB2YXIgcSA9IGFzeW4gPyB3aW5kb3cuX2RzYWYgOiB3aW5kb3cuX2RzZlxuICAgICAgICBpZiAoIXdpbmRvdy5fZHNJbml0KSB7XG4gICAgICAgICAgICB3aW5kb3cuX2RzSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAvL25vdGlmeSBuYXRpdmUgdGhhdCBqcyBhcGlzIHJlZ2lzdGVyIHN1Y2Nlc3NmdWxseSBvbiBuZXh0IGV2ZW50IGxvb3BcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5kc2luaXRcIik7XG4gICAgICAgICAgICB9LCAwKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHEuX29ic1tuYW1lXSA9IGZ1bjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHFbbmFtZV0gPSBmdW5cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVnaXN0ZXJBc3luOiBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXIobmFtZSwgZnVuLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhc05hdGl2ZU1ldGhvZDogZnVuY3Rpb24gKG5hbWUsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChcIl9kc2IuaGFzTmF0aXZlTWV0aG9kXCIsIHtuYW1lOiBuYW1lLCB0eXBlOnR5cGV8fFwiYWxsXCJ9KTtcbiAgICB9LFxuICAgIGRpc2FibGVKYXZhc2NyaXB0RGlhbG9nQmxvY2s6IGZ1bmN0aW9uIChkaXNhYmxlKSB7XG4gICAgICAgIHRoaXMuY2FsbChcIl9kc2IuZGlzYWJsZUphdmFzY3JpcHREaWFsb2dCbG9ja1wiLCB7XG4gICAgICAgICAgICBkaXNhYmxlOiBkaXNhYmxlICE9PSBmYWxzZVxuICAgICAgICB9KVxuICAgIH1cbn07XG5cbiFmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5fZHNmKSByZXR1cm47XG4gICAgdmFyIG9iID0ge1xuICAgICAgICBfZHNmOiB7XG4gICAgICAgICAgICBfb2JzOiB7fVxuICAgICAgICB9LFxuICAgICAgICBfZHNhZjoge1xuICAgICAgICAgICAgX29iczoge31cbiAgICAgICAgfSxcbiAgICAgICAgZHNjYjogMCxcbiAgICAgICAgZHNCcmlkZ2U6IGJyaWRnZSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5jbG9zZVBhZ2VcIilcbiAgICAgICAgfSxcbiAgICAgICAgX2hhbmRsZU1lc3NhZ2VGcm9tTmF0aXZlOiBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IEpTT04ucGFyc2UoaW5mby5kYXRhKTtcbiAgICAgICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGluZm8uY2FsbGJhY2tJZCxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGYgPSB0aGlzLl9kc2ZbaW5mby5tZXRob2RdO1xuICAgICAgICAgICAgdmFyIGFmID0gdGhpcy5fZHNhZltpbmZvLm1ldGhvZF1cbiAgICAgICAgICAgIHZhciBjYWxsU3luID0gZnVuY3Rpb24gKGYsIG9iKSB7XG4gICAgICAgICAgICAgICAgcmV0LmRhdGEgPSBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJfZHNiLnJldHVyblZhbHVlXCIsIHJldClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWxsQXN5biA9IGZ1bmN0aW9uIChmLCBvYikge1xuICAgICAgICAgICAgICAgIGFyZy5wdXNoKGZ1bmN0aW9uIChkYXRhLCBjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXQuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldC5jb21wbGV0ZSA9IGNvbXBsZXRlIT09ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwiX2RzYi5yZXR1cm5WYWx1ZVwiLCByZXQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBmLmFwcGx5KG9iLCBhcmcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZikge1xuICAgICAgICAgICAgICAgIGNhbGxTeW4oZiwgdGhpcy5fZHNmKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWYpIHtcbiAgICAgICAgICAgICAgICBjYWxsQXN5bihhZiwgdGhpcy5fZHNhZik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGluZm8ubWV0aG9kLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoPDIpIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kPW5hbWUucG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZT1uYW1lLmpvaW4oJy4nKVxuICAgICAgICAgICAgICAgIHZhciBvYnMgPSB0aGlzLl9kc2YuX29icztcbiAgICAgICAgICAgICAgICB2YXIgb2IgPSBvYnNbbmFtZXNwYWNlXSB8fCB7fTtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IG9iW21ldGhvZF07XG4gICAgICAgICAgICAgICAgaWYgKG0gJiYgdHlwZW9mIG0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxTeW4obSwgb2IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9icyA9IHRoaXMuX2RzYWYuX29icztcbiAgICAgICAgICAgICAgICBvYiA9IG9ic1tuYW1lc3BhY2VdIHx8IHt9O1xuICAgICAgICAgICAgICAgIG0gPSBvYlttZXRob2RdO1xuICAgICAgICAgICAgICAgIGlmIChtICYmIHR5cGVvZiBtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsQXN5bihtLCBvYik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgYXR0ciBpbiBvYikge1xuICAgICAgICB3aW5kb3dbYXR0cl0gPSBvYlthdHRyXVxuICAgIH1cbiAgICBicmlkZ2UucmVnaXN0ZXIoXCJfaGFzSmF2YXNjcmlwdE1ldGhvZFwiLCBmdW5jdGlvbiAobWV0aG9kLCB0YWcpIHtcbiAgICAgICAgIHZhciBuYW1lID0gbWV0aG9kLnNwbGl0KCcuJylcbiAgICAgICAgIGlmKG5hbWUubGVuZ3RoPDIpIHtcbiAgICAgICAgICAgcmV0dXJuICEhKF9kc2ZbbmFtZV18fF9kc2FmW25hbWVdKVxuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIC8vIHdpdGggbmFtZXNwYWNlXG4gICAgICAgICAgIHZhciBtZXRob2Q9bmFtZS5wb3AoKVxuICAgICAgICAgICB2YXIgbmFtZXNwYWNlPW5hbWUuam9pbignLicpXG4gICAgICAgICAgIHZhciBvYj1fZHNmLl9vYnNbbmFtZXNwYWNlXXx8X2RzYWYuX29ic1tuYW1lc3BhY2VdXG4gICAgICAgICAgIHJldHVybiBvYiYmISFvYlttZXRob2RdXG4gICAgICAgICB9XG4gICAgfSlcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBicmlkZ2U7IiwiaW1wb3J0IGRzYnJpZGdlIGZyb20gJ2RzYnJpZGdlJ1xuXG5jb25zdCBpbnZva2VEc0JyaWRnZSA9IChuYW1lLCBwYXJhbXMgPSB7fSkgPT4ge1xuICBpZiAoIWRzYnJpZGdlKSB7XG4gICAgd2luZG93LmFsZXJ0KCdubyBzdXBwb3J0ZWQsIOivt+WcqOi9puS4u+aDoEFQUOWGheS9v+eUqCcpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGRzYnJpZGdlLmNhbGwobmFtZSwgcGFyYW1zLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICByZXMgPSBKU09OLnBhcnNlKHJlcylcbiAgICAgICAgICByZXMuY29kZSA9ICtyZXMuY29kZVxuICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBPcHRpbXVzID0ge1xuICAvKipcbiAgICog5YiG5LqrXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgc2hhcmU6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ3NoYXJlJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5YWz6Zetd2Vidmlld1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIGNsb3NlOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjbG9zZScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaLqOaJk+eUteivnVxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHRlbGVwaG9uZTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgndGVsZXBob25lJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Y6f55Sf55m75b2VXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbG9naW46IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2xvZ2luJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZSk6LW35Zyw5Zu+5a+86IiqXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbWFwTmF2aTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnbWFwTmF2aScsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaUr+S7mOaIkOWKn+iwg+eUqCDpgJrnn6Xljp/nlJ9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBwYXlTdWNjZXNzOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdwYXlTdWNjZXNzJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+WYXBw54mI5pys5L+h5oGvXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0QXBwVmVyc2lvbjogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0QXBwVmVyc2lvbicsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOaJk+W8gOWOn+eUn+mhtemdouaIluaWsOeahHdlYnZpZXcg5Y+v5o6n5Yi25Y6f55Sf5aS05pi+56S657G75Z6LXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgbmV3QWN0aW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCduZXdBY3Rpb24nLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmoKHpqoznm7jlhozmnYPpmZBcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICBpc0hhdmVDYW1lcmFQZXJtaXNzaW9uOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdpc0hhdmVDYW1lcmFQZXJtaXNzaW9uJywgcGFyYW1zKVxuICB9LFxuICB3eE5hdGl2ZVBheTogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnd3hOYXRpdmVQYXknLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bpq5jlvrflrprkvY3kv6Hmga9cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBnZXRBTWFwTG9jOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRBTWFwTG9jJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog6I635Y+W5aS06YOo5L+h5oGvIOeKtuaAgeagj+mrmOW6puOAgeaYr+WQpuS9v+eUqOS6huWOn+eUn+WktFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdldFdlYkhlYWRJbmZvOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnZXRXZWJIZWFkSW5mbycsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOa3t+WQiOW8gOWPkeeJueauiuS6i+S7tiBwczog6aaW6aG156S85YyF5Lqk5LqSXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgaHlicmlkRXZlbnQ6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2h5YnJpZEV2ZW50JywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog5ZCM5oSP6ZqQ56eB5Y2P6K6uXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgY29uZmlybUFncmVlbWVudDogKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnY29uZmlybUFncmVlbWVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOS4jeWQjOaEj+makOengeWNj+iurlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGRpc2FncmVlQWdyZWVtZW50OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdkaXNhZ3JlZUFncmVlbWVudCcsIHBhcmFtcylcbiAgfSxcbiAgLyoqXG4gICAqIOmAgOWHumFwcFxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGV4aXRBcHA6IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gaW52b2tlRHNCcmlkZ2UoJ2V4aXRBcHAnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDlhbPpl63lvLnlsYJ3ZWJ2aWV3XG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgY2xvc2VQb3BXZWJWaWV3OiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdjbG9zZVBvcFdlYlZpZXcnLCBwYXJhbXMpXG4gIH0sXG4gIC8qKlxuICAgKiDmu5HlnZfmoKHpqoxcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBzbGlkZXJBdXRoOiAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdzbGlkZXJBdXRoJywgcGFyYW1zKVxuICB9LFxuICAvKipcbiAgICog57O757uf6K6+572uXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIGdvdG9BcHBTeXN0ZW1TZXR0aW5nOiAoKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdnb3RvQXBwU3lzdGVtU2V0dGluZycpXG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5bpgJrnn6XmnYPpmZBcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbjogKCkgPT4ge1xuICAgIHJldHVybiBpbnZva2VEc0JyaWRnZSgnZ2V0Tm90aWZpY2F0aW9uUGVybWlzc2lvbicpXG4gIH0sXG4gIC8qKlxuICAgKiDllKTotbflsI/nqIvluo9cbiAgICogdj49Mi42LjNcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZXZva2VXeE1pbmlQcm9ncmFtOiAoKSA9PiB7XG4gICAgcmV0dXJuIGludm9rZURzQnJpZGdlKCdldm9rZVd4TWluaVByb2dyYW0nKVxuICB9XG59XG5cbmNvbnN0IGluc3RhbGwgPSBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XG4gIGlmIChpbnN0YWxsLmluc3RhbGxlZCkgcmV0dXJuXG4gIFZ1ZS5wcm90b3R5cGUuJG9wID0gT3B0aW11c1xufVxuXG4vKiDmlK/mjIHkvb/nlKjmoIfnrb7nmoTmlrnlvI/lvJXlhaUgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XG4gIGluc3RhbGwod2luZG93LlZ1ZSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbnN0YWxsXG59XG4iXSwic291cmNlUm9vdCI6IiJ9