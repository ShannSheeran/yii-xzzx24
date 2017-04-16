define(['jQuery'], function (require, exports, module) {
    var $ = require('jQuery');
    var _cookie = {
        setCookie: function (name, value, expTime) {
            var Days = 30;
            var exp = new Date();
            if (expTime == undefined) {
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            } else {
                exp.setTime(exp.getTime() + expTime * 1000);
            }
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        delCookie: function (name)
        {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }

    };
    var oNav = {
        navInit: function () {        
            $(".J-footerNav a").each(function () {
                var url = $(this).attr('href');
                var thisUrl = window.location.href;
                if (url != '/' && -1 != thisUrl.indexOf(url)) {
                    _hasSelect = true;
                    _setCurrent($(this));
                }
            });
            _hasLevelSelect(_hasSelect);
            $(".J-footerNav a").click(function () {
                var url = $(this).attr('href');
                Cookie.setCookie('__current_nav', url);
                _setCurrent($(this));
            });
            if (window.location.pathname == '/') {
                _setCurrent($(".J-footerNav a:first"));
            }
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }

    };


    function _setCurrent($this) {
        $(".J-footerNav a").find('i').removeClass('current');
        $this.find('i').addClass('current');
        $(".J-footerNav a").find('span').removeClass('current');
        $this.find('span').addClass('current');
    }

    function _hasLevelSelect(_hasSelect) {
        if (!_hasSelect) {
            var thisUrl = Cookie.getCookie('__current_nav');
            if (!thisUrl) {
                return;
            }
            var $this = $(".J-footerNav a[href='" + thisUrl + "']");
            var url = $this.attr('href');
            if (-1 != thisUrl.indexOf(url)) {
                _setCurrent($this);
            }
        }
    }
    var _aConfig = {
        current: 0,
    };
    var _hasSelect = false;
    var self = oNav;
    var Cookie = _cookie;
    module.exports = oNav;
});


