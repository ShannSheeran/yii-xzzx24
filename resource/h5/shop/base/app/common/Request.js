define('app/common/Request', ['jQuery', 'Tips'], function (require, exports, module) {
    var $ = require("jQuery");
    var Tips = require('Tips');
    var Request = {};
    Request.getFormJson = function (aData) {
        var oData = {};
        $.each(aData, function () {
            if (oData[this.name] !== undefined) {
                if (!oData[this.name].push) {
                    oData[this.name] = [oData[this.name]];
                }
                oData[this.name].push(this.value || '');
            } else {
                oData[this.name] = this.value || '';
            }
        });
        return oData;
    };

    Request.ajax = function (aOption) {
        (aOption.url == undefined) && $.error('url is null');
        (aOption.type == undefined) && (aOption.type = 'post');
        (aOption.dataType == undefined) && (aOption.dataType = 'json');
        (aOption.error == undefined) && (aOption.error = function () {
            console.log('网络出错了。。');
        });

        var successFunc = function (result) {
            if (result.status != undefined) {
                Tips.showTips(result.info);
            }

        };
        if (aOption.success !== undefined) {
            successFunc = aOption.success;
        }
        aOption.success = function (aResult) {
            //本站请求更新口令
            if (aResult.token != undefined && -1 != this.url.indexOf(window.location.host)) {
                $('meta[name="csrf-token"]').attr('content', aResult.token);
            }
            successFunc(aResult);
        }

        if (aOption.type == 'post') {
            if (aOption.data == undefined) {
                aOption.data = {};
            }
            if (typeof (aOption.data) == 'object' && aOption.data.referrerUrl == undefined) {
                aOption.data.referrer_url = document.referrer;
            }
            if (typeof (aOption.data) == 'object' && aOption.data['_csrf'] == undefined) {
                var csrfToken = $('meta[name="csrf-token"]').attr('content');
                if (csrfToken) {
                    aOption.data['_csrf'] = csrfToken;
                } else {
                    Tips.showTips('会话信息已过期,请刷新重试');
                }
            }
        }
        var complete = function () {

        }
        if (aOption.complete != undefined) {
            complete = aOption.complete;
        }
        aOption.complete = function (oXhr) {
            //自带的请求完成回调
            if (oXhr.status >= 300 && oXhr.status < 400 && oXhr.status != 304) {
                var redirectUrl = oXhr.getResponseHeader('X-Redirect');
                if (oXhr.responseText) {
                    if (Tips) {
                        Tips.showTips(oXhr.responseText);
                        location.href = redirectUrl;
                    }
                } else {
                    location.href = redirectUrl;
                }
            }
            complete(oXhr);
        };

        try {
            $.ajax(aOption);
        } catch (e) {
            $.error('send data is happened error');
        }
    }

    Request.ajaxSend = function ($formDom, ajaxOption, $clickDom) {
        if ($formDom.attr('url') == undefined && ajaxOption.url == undefined) {
            $.error('url is not defined');
        }
        var aData = Request.getFormJson($formDom.serializeArray());
        for (var i in aData) {
            var $this = $formDom.find('input[name="' + i + '"]');
            if ($this.length == 0) {
                $this = $formDom.find('select[name="' + i + '"]');
            }
            if ($this.length == 0) {
                $this = $formDom.find('textarea[name="' + i + '"]');
            }
            if ($this.data('required')) {
                if ($this.val() == "") {
                     Tips.showTips("该字段不能为空");
                    $this.focus();
                    return;
                }
            }
            var pattern = $this.data('pattern');
            if (pattern !== undefined && $this.val() != "") {
                if (!new RegExp(pattern).test($this.val())) {
                    if ($this.data('error_info') != undefined) {
                        Tips.showTips($this.data('error_info'));
                    } else {
                         Tips.showTips('请正确填写该字段');
                    }
                    $this.focus();
                    return;
                }
            }
        }
        Request.clearDataNullWorth(aData);

        if ($clickDom != undefined) {
            if (ajaxOption.beforeSend != undefined) {
                var beforeSend = ajaxOption.beforeSend;
                ajaxOption.beforeSend = function () {
                    if ($clickDom.data('status') != undefined && !$clickDom.data('status')) {
                        return false;
                    }
                    $clickDom.html('数据提交中..');
                    $clickDom.data('status', false);
                    beforeSend();
                }
            }
            if (ajaxOption.success != undefined) {
                var success = ajaxOption.success;
                ajaxOption.success = function (aResult) {
                    $clickDom.html('提交完成');
                    $clickDom.data('status', true);
                    success(aResult);
                }
            }

        }
        if(ajaxOption.data == undefined){
            ajaxOption.data = {};
        }
        ajaxOption.data = $.extend({},aData,ajaxOption.data);
        Request.ajax(ajaxOption);
    }

    Request.ajaxSend1 = function ($formDom, ajaxOption) {
        if ($formDom.attr('url') == undefined && ajaxOption.url == undefined) {
            $.error('url is not defined');
        }
        var aData = Request.getFormJson($formDom.serializeArray());
        for (var i in aData) {
            var $this = $formDom.find('input[name="' + i + '"]');
            if ($this.length == 0) {
                $this = $formDom.find('select[name="' + i + '"]');
            }
            if ($this.length == 0) {
                $this = $formDom.find('textarea[name="' + i + '"]');
            }
            if ($this.data('required')) {
                if ($this.val() == "") {
                     Tips.showTips("该字段不能为空");
                    $this.focus();
                    return;
                }
            }
            var pattern = $this.data('pattern');
            if (pattern !== undefined && $this.val() != "") {
                if (!new RegExp(pattern).test($this.val())) {
                    if ($this.data('error_info') != undefined) {
                         Tips.showTips($this.data('error_info'));
                    } else {
                         Tips.showTips("请正确填写该字段");
                    }
                    $this.focus();
                    return;
                }
            }
        }
        Request.clearDataNullWorth(aData);
        ajaxOption.data = aData;
        Request.ajax(ajaxOption);
    }
    Request.clearDataNullWorth = function (aData) {
        for (var i in aData) {
            if (aData[i] == '') {
                delete aData[i];
            }
        }
    },
            Request.inArray = function (value, array, isStrict) {
                for (var i in array) {
                    if (array[i] == value && !isStrict) {
                        return true;
                    } else if (array[i] === value && isStrict) {
                        return true;
                    }
                }
                return false;
            }
    var self = Request;
    module.exports = Request;
});