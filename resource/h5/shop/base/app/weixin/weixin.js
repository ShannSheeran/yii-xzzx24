define("app/weixin/weixin",["jQuery", 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'], function (require, exports, module) {
    var $ = require("jQuery");
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    module.exports = {
        bindWeichatEvent: function () {
            var wxData = {
                title: _aConfig.title,
                link: _aConfig.link,
                desc: _aConfig.desc,
                imgUrl: _aConfig.imgUrl
            };

            wx.config({
                debug: false,
                appId: _aConfig.appId,
                timestamp: _aConfig.timestamp,
                nonceStr: _aConfig.nonceStr,
                signature: _aConfig.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });
            wx.ready(function () {
                //朋友圈
                wx.onMenuShareTimeline({
                    title: wxData.title,
                    link: wxData.link,
                    imgUrl: wxData.imgUrl,
                    success: function () {
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: wxData.title,
                    link: wxData.link,
                    desc: wxData.desc,
                    imgUrl: wxData.imgUrl,
                    success: function () {
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //QQ
                wx.onMenuShareQQ({
                    title: wxData.title,
                    link: wxData.link,
                    desc: wxData.desc,
                    imgUrl: wxData.imgUrl,
                    success: function () {
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //腾讯微博
                wx.onMenuShareWeibo({
                    title: wxData.title,
                    link: wxData.link,
                    desc: wxData.desc,
                    imgUrl: wxData.imgUrl,
                    success: function () {
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //QQ空间
                wx.onMenuShareQZone({
                    title: wxData.title,
                    link: wxData.link,
                    desc: wxData.desc,
                    imgUrl: wxData.imgUrl,
                    success: function () {
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        },
        //参数处理函数
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }

    };

    var _aConfig = {
        title: "",
        link: "",
        desc: "",
        imgUrl: "",
        appId: "",
        timestamp: "",
        nonceStr: "",
        signature: ""
    };
    console.log('this is weixin test script');
});

