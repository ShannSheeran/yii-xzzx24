define("app/member/bind", ["jQuery", 'Tips', 'app/common/Request'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Tips = require('Tips');
    var oBind = {
        bindEvent: function () {
            $('.J-bindClickBtm').click(function () {
                var $this = $(this);
                Request.ajaxSend($('.J-bindForm'), {
                    url: _aConfig.bindUrl,
                    beforeSend: function () {},
                    success: function (aData) {
                        if (aData.status != 1) {
                            return Tips.showTips(aData.msg);
                        }
                        if (aData.status == 1) {
                            Tips.showTips('绑定成功，跳转中...', 2, function (url) {
                                return location.href = url;
                            }, aData.data.url);
                        }
                    }
                }, $this);
            });

            $('.J-sendCode').click(function () {
                var mobile = $('input[name="mobile"]').val();
                if (mobile == '') {
                    return Tips.showTips('请输入手机号码', 2, function () {
                        $('input[name="mobile"]').focus();
                    });
                }
                if (!/^1\d{10}$/.test(mobile)) {
                    return Tips.showTips('请输入正确的手机号码', 2, function () {
                        $('input[name="mobile"]').focus();
                    });
                }
                var aSendData = _aConfig.sendCodeData;
                aSendData.mobile = mobile;
                Request.ajax({
                    url: _aConfig.apiUrl,
                    data: aSendData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            Tips.showTips(aData.msg, 2);
                            return $('.J-sendCode').html('已发送');
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                });
            });

        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }
    };
    var _aConfig = {
        memberUrl: '',
        apiUrl: '',
        bindUrl: '',
        sendCodeData: ''
    };
    var self = oBind;
    module.exports = oBind;
});

