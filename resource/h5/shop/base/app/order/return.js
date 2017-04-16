define("app/order/return", ["jQuery", 'app/common/Request', 'app/common/Ui', 'Tips'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    //加载弹窗插件
    var Tips = require('Tips');//弹框插件

    var oFankui = {
        getOrderDetail: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.returnUrl,
                datatype: 'json',
                data: _aConfig.detailData,
                success: function (oData) {
                    $('.J-ordersn').html(oData.data.order_id);
                }
            });
        },
        bindReturnEvent: function () {
            //提交
            $('.J-Return').click(function () {
                var content = $('.textarea_fankui').val();
                if (content.length == 0) {
                    return Tips.showTips('请输入申请原因！', 2);

                }
                var upload = [];
                var inputArray = $("input[name='file[]']");//取到所有的input 并且放到一个数组中
                inputArray.each(//使用数组的循环函数 循环这个input数组
                        function () {
                            var input = $(this);//循环中的每一个input元素
                            upload.push(input.val());
                        }
                );
                var aSendData = _aConfig.returnData;
                aSendData.content = content;
                aSendData.upload = upload;

                Request.ajax({
                    type: 'post',
                    url: _aConfig.returnUrl,
                    data: aSendData,
                    beforeSend: function () {
                        if ($('.J-Return').data('status') != undefined && !$('.J-Return').data('status')) {
                            return false;
                        }
                        $('.J-Return').html('提交中');
                        $('.J-Return').data('status', false);
                    },
                    success: function (oData) {

                        if (oData.status == 1) {
                            Tips.showTips('申请成功，请等待审核！', 2, function () {
                                return window.history.go(-1);
                            });
                        }
                        if (oData.status == 0) {
                            Tips.showTips(oData.msg, 2, function () {
                                return window.history.go(-1);
                            });
                        }
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
        returnUrl: '',
        returnData: '',
        detailData: '',
        orderId: ''
    };
    module.exports = oFankui;
});