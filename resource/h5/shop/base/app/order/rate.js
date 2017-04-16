define('app/order/rate',["jQuery", 'app/common/Request', 'app/common/Ui', 'Tips'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    //加载弹窗插件
    var Tips = require('Tips');//弹框插件
    
 
    var _oRateList = {
        
        buildRateList: function(aData){ 
            var oDataList = aData;
            var aHtml = [];
            for(var i in oDataList){ 
                aHtml.push('<div class="row" style="margin-bottom: 10px;">\
                                <div class="col-xs-12 div_picture">\
                                   '+Ui.buildImage(App.url.resource + oDataList[i].goods_img)+'\
                                    <p style="float:left;margin-left:15px; margin-top: 10px; font-size: 16px;">\
                                        '+oDataList[i].goods_name+'\
                                        <br/>\
                                        <span style="margin-top: 20px; display:block;">￥'+oDataList[i].price+'</span>\
                                    </p>\
                                </div>\
                                <div class="col-xs-12 div_myfankui">\
                                    <textarea rows="8" cols="5" class="textarea_fankui J-textarea_pingjia" placeholder="请输入您的评价！" data-goods_id="'+ oDataList[i].goods_id +'"></textarea>\
                                </div>\
                            </div>');
                }
            return aHtml.join('');
        },
        appendRateList:function(aData){ 
            $('.J-detailGoods').append(_oRateList.buildRateList(aData));
            
        }
    };
    
    var oRate = {
        getOrderDetail: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.returnUrl,
                datatype: 'json',
                data: _aConfig.orderDetailData,
                success: function (oData) {
                    console.log(oData);
                    _oRateList.appendRateList(oData.data.goods);
                }
            });
        },
        bindEvent: function () {
            //提交
            $('.J-submit').click(function () {
                var aData = [];
                    $('textarea').each(function(){
                        if($.trim($(this).val()) === ""){ 
                            return Tips.showTips('请输入评价内容！', 2);
                        }
                        aData.push({content:$(this).val(),goods_id:$(this).data('goods_id')});
                    });
                    if(aData.length !== $('textarea').length){
                        return Tips.showTips('请输入评价内容！', 2);
                    }
                var rateData = $.extend({},_aConfig.rateData,{aData:aData});
                Request.ajax({ 
                    type:'post',
                    url:_aConfig.returnUrl,
                    data:rateData,
                    success:function(aData){ 
                        
                        if(aData.status == 1){ 
                            return Tips.showTips(aData.msg, 2,function(){ 
                                    window.location.href = _aConfig.rateSuccess;
                            });
                        }
                        return Tips.showTips(aData.msg, 2);
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
        orderDetailData: '',
        rateData: '',
        rateSuccess:''
    };
    module.exports = oRate;
});