define('app/order/buynow',["jQuery",'Tips','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min','app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');
    var Tips = require('Tips');//弹框插件
    
    //商品处理“类”
    var _oGoodsDetail = {
        buildGoodsDetail:function (oDataDetail) {
            var aHtml = [];
            aHtml.push('<img src="' + App.url.resource + oDataDetail.goods_img + '" class="img-responsive" alt="Responsive image">');
            return aHtml.join('');
        },
       
        appendGoodsDetailHtml: function (aData) {
            
            //append商品图片
            _$domGoodsDetail.append(_oGoodsDetail.buildGoodsDetail(aData));            
        }
        
    };
    //地址处理“类”
    var _oAddressDetail = {
        buildAddressDetail:function (oDataDetail) {
            var aHtml = [];
            aHtml.push('<div class="row">\
                            <a href="'+_aConfig.addressUrl+'?address_id='+oDataDetail.id+'">\
                                <div class="col-xs-12 div_receivername">\
                                    <span class="font14">收货人:</span>\
                                    <span class="J-username">'+oDataDetail.receiver+'</span>\
                                    <span style="margin-left: 60px;" class="J-userphone">'+oDataDetail.phone+'</span>\
                                </div>\
                                <div class="col-xs-12 div_receiveradd">\
                                    <span class="font14">地址:</span>\
                                    <span class="J-useraddress">'+oDataDetail.address+'</span>\
                                    <s></s>\
                                </div>\
                            </a>\
                        </div>');
            return aHtml.join('');
        },
       
        appendAddressDetailHtml: function (aData) {
            
            //append商品图片
            _$domAddressDetail.append(_oAddressDetail.buildAddressDetail(aData));            
        },
        buildNoAddressDetail:function(){ 
            var aHtml = [];
            aHtml.push('<div class="row">\
                            <div class="col-xs-12 div_receiveradd">\
                                <a href="'+_aConfig.addressUrl+'" class="font14"><span class="col-xs-4">地址:</span>\
                                <span class="J-useraddress col-xs-8">暂无地址,去设置</span>\
                                <s></s></a>\
                            </div>\
                        </div>');
            return aHtml.join('');
        },
        appendNoAddressDetailHtml:function(){ 
            _$domAddressDetail.append(_oAddressDetail.buildNoAddressDetail());
        }
        
    };
    var oIndex = {
        //请求商品信息数据
        getGoodsDetail: function () {   
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGoodsDetailParam,
                success: function (aData) {
                    _oGoodsDetail.appendGoodsDetailHtml(aData.data.aData);
                    $('.J-goods_name').html(aData.data.aData.name);
                }
            });
        },
        //请求当前用户的默认地址
        getDefaultAddress:function(){ 
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGetUserDefaultAddressParam,
                success: function (aData) {
                    if(aData.status == 0){ 
                        _oAddressDetail.appendNoAddressDetailHtml();
                        return Tips.showTips('请设置你的地址',3);
                    }
                    _oAddressDetail.appendAddressDetailHtml(aData.data);
                    _address_id = aData.data.id;
                    
                    
                }
            });
        },
        //请求当前商品的属性
        getPropertyDetail:function(){ 
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGoodsPropertyDetailParam,
                success: function (aData) {
                        $('.J-goods_property').html(aData.data.name);
                        $('.J-goods_price').html(aData.data.price * _aConfig.getBuyNums);
                        $('.J-buy_nums').html(_aConfig.getBuyNums);
                        $('.J-final_price').html(aData.data.price * _aConfig.getBuyNums);
                   
                   
                    
                }
            });
        },
        //生成订单
        createOrder:function(){ 
            $('.J-div_abtnbuy').click(function(){ 
                if(_address_id == null){ 
                    return Tips.showTips('请设置你的地址',3);
                }
                var payType = $("input[name='payType']:checked").val();
                var remark = $('.J-remarks').val();
                var _finalData = $.extend({},_aConfig.create0rderParam,{address_id:_address_id,remark:remark,pay_type:payType});
                Request.ajax({
                    url:_aConfig.getApiUrl,
                    data:_finalData,
                    success:function(aData){ 
                        if(aData.status == 1){
                             return window.location.href = _aConfig.getPayUrl+'?order_tag='+aData.data.order_tag+'&success_back_url='+aData.data.success_back_url+'&pay_id='+aData.data.pay_id;
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
        },

    };
    var _address_id = null;
    var _$domGoodsDetail = $('.J-div_mybuypic');
    var _$domAddressDetail = $('.J-div_myaddress');
    var _aConfig = {
        getApiUrl: '',
        getGoodsDetailParam: '',
        getGoodsPropertyDetailParam: '',
        getGetUserDefaultAddressParam:'',
        create0rderParam:'',
        getBuyNums:"",
        getPayUrl:'',
        addressUrl:''
    };
    var self = oIndex;	
    module.exports = oIndex;
})

