import dsbridge from 'dsbridge'

const invokeDsBridge = (name, params = {}) => {
  if (!dsbridge) {
    window.alert('no supported, 请在车主惠APP内使用')
  } else {
    return new Promise(function (resolve, reject) {
      dsbridge.call(name, params, function (res) {
        if (res) {
          res = JSON.parse(res)
          res.code = +res.code
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  }
}

const Optimus = {
  /**
   * 分享
   * @param params
   * @return {undefined}
   */
  share: (params) => {
    return invokeDsBridge('share', params)
  },
  /**
   * 关闭webview
   * @param params
   * @return {undefined}
   */
  close: (params) => {
    return invokeDsBridge('close', params)
  },
  /**
   * 拨打电话
   * @param params
   * @return {undefined}
   */
  telephone: (params) => {
    return invokeDsBridge('telephone', params)
  },
  /**
   * 唤起原生登录
   * @param params
   * @return {undefined}
   */
  login: (params) => {
    return invokeDsBridge('login', params)
  },
  /**
   * 唤起地图导航
   * @param params
   * @return {undefined}
   */
  mapNavi: (params) => {
    return invokeDsBridge('mapNavi', params)
  },
  /**
   * 支付成功调用 通知原生
   * @param params
   * @return {undefined}
   */
  paySuccess: (params) => {
    return invokeDsBridge('paySuccess', params)
  },
  /**
   * 获取app版本信息
   * @param params
   * @return {undefined}
   */
  getAppVersion: (params) => {
    return invokeDsBridge('getAppVersion', params)
  },
  /**
   * 打开原生页面或新的webview 可控制原生头显示类型
   * @param params
   * @return {undefined}
   */
  newAction: (params) => {
    return invokeDsBridge('newAction', params)
  },
  /**
   * 校验相册权限
   * @param params
   * @return {undefined}
   */
  isHaveCameraPermission: (params) => {
    return invokeDsBridge('isHaveCameraPermission', params)
  },
  wxNativePay: (params) => {
    return invokeDsBridge('wxNativePay', params)
  },
  /**
   * 获取高德定位信息
   * @param params
   * @return {any}
   */
  getAMapLoc: (params) => {
    return invokeDsBridge('getAMapLoc', params)
  },
  /**
   * 获取头部信息 状态栏高度、是否使用了原生头
   * @param params
   * @return {Promise<any>}
   */
  getWebHeadInfo: (params) => {
    return invokeDsBridge('getWebHeadInfo', params)
  },
  /**
   * 混合开发特殊事件 ps: 首页礼包交互
   * @param params
   * @return {Promise<any>}
   */
  hybridEvent: (params) => {
    return invokeDsBridge('hybridEvent', params)
  },
  /**
   * 同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  confirmAgreement: (params) => {
    return invokeDsBridge('confirmAgreement', params)
  },
  /**
   * 不同意隐私协议
   * @param params
   * @return {Promise<any>}
   */
  disagreeAgreement: (params) => {
    return invokeDsBridge('disagreeAgreement', params)
  },
  /**
   * 退出app
   * @param params
   * @return {Promise<any>}
   */
  exitApp: (params) => {
    return invokeDsBridge('exitApp', params)
  },
  /**
   * 关闭弹层webview
   * @param params
   * @return {Promise<any>}
   */
  closePopWebView: (params) => {
    return invokeDsBridge('closePopWebView', params)
  },
  /**
   * 滑块校验
   * @param params
   * @return {Promise<any>}
   */
  sliderAuth: (params) => {
    return invokeDsBridge('sliderAuth', params)
  },
  /**
   * 系统设置
   * @return {Promise<any>}
   */
  gotoAppSystemSetting: () => {
    return invokeDsBridge('gotoAppSystemSetting')
  },
  /**
   * 获取通知权限
   * @return {Promise<any>}
   */
  getNotificationPermission: () => {
    return invokeDsBridge('getNotificationPermission')
  },
  /**
   * 唤起小程序
   * v>=2.6.3
   * @return {Promise<any>}
   */
  evokeWxMiniProgram: (params) => {
    return invokeDsBridge('evokeWxMiniProgram', params)
  },
  /**
   * 快速充值
   * v>=2.7.0
   * @return {Promise<any>}
   */
  getPhoneRechargeParamAct: (params) => {
    return invokeDsBridge('getPhoneRechargeParamAct', params)
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
  evokeQRCodeScan: (params) => {
    return invokeDsBridge('evokeQRCodeScan', params)
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
  evokeCameraAndLibrary: (params) => {
    return invokeDsBridge('evokeCameraAndLibrary', params)
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
  getObjectFromLocalCache: (params) => {
    return invokeDsBridge('getObjectFromLocalCache', params)
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
  saveObjectTolocalCache: (params) => {
    return invokeDsBridge('saveObjectTolocalCache', params)
  },
  /**
   * 新增监听
   * 商家app v>1.0.0
   * @param {
   * action: "监听名key"
   * }
   * @return {Promise<any>}
   */
  addNativeListener: (params) => {
    return invokeDsBridge('addNativeListener', params)
  },
  /**
   * 移除监听
   * 商家app v>1.0.0
   * @param {
    * action: "监听名key"
    * }
    * @return {Promise<any>}
    */
  removeNativeListener: (params) => {
    return invokeDsBridge('removeNativeListener', params)
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
  sendMessageNativeToListener: (params) => {
    return invokeDsBridge('sendMessageNativeToListener', params)
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
  saveImageToLibrary: (params) => {
    return invokeDsBridge('saveImageToLibrary', params)
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
  downloadFilesToDisk: (params) => {
    return invokeDsBridge('downloadFilesToDisk', params)
  },
  /**
   * 获取应用基础信息
   * 车主惠app v>2.7.2
   * @param params
   * @return {Promise<any>}
   */
  getApplicationInfo: (params) => {
    return invokeDsBridge('getApplicationInfo', params)
  },
  /**
   * 唤起原生浏览器
   * 车主惠app v>2.7.4
   * @param params
   * @return {Promise<any>}
   */
  evokeNativeBrowser: (params) => {
    return invokeDsBridge('evokeNativeBrowser', params)
  }
}

const install = function (Vue, options) {
  if (install.installed) return
  Vue.prototype.$op = Optimus
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}
