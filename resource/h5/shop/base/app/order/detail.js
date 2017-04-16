define('app/order/detail', ["jQuery", 'artDialog','Tips', 'external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
//artDialog为弹窗插件
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件
    var _oOrder = {
        appendOrderDetailHtml: function (oDataList) {
            _$domOrderDetailList.append(_oOrder.buildOrderDetailList(oDataList));
        },
        buildOrderDetailList: function (oData) {
            var aHtml = [];
            var expressHtml = '';
            var remarkHtml = '';
            var status = '';
            var payHtml = '';
            var pay = '';
            var cancelBtn = '';
            var confirmBtn = '';
            var expressBtn = '';
            var returnPayBtn = '';
            var changeBtn = '';
            var reason='';
            if ((oData.status == 2 || oData.status == 3) && oData.express_name != '') {
                expressHtml = '<h5 class="borderbottom"><span>快递：<span>' + oData.express_name + '</span></span><b>单号：<b>' + oData.express_number + '</b></b></h5>'
            }
            if (oData.remark != '') {
                remarkHtml = '<h5 class="borderbottom"><span>订单备注：<p>' + oData.remark + '</p></span></h5>';
            }
            if (oData.status == 0) {
                status = '<span class="text-warning">待付款</span>';
                payHtml = '<div class="col-xs-12 div_zhifu">\
                            <span>支付方式：</span>\
                            <select name="payment" id="payment">';
                for (var i in oData.payTypeAll) {
                    var select = '';
                    if (oData.pay_id == oData.payTypeAll[i].id) {
                        select = 'selected';
                    }
                    payHtml += '<option value="' + oData.payTypeAll[i].id + '" ' + select + '>' + oData.payTypeAll[i].name + '</option>';
                }
                payHtml += '</select></div><div class="col-xs-12 div_zhifubtn"></div>';
                pay = '<a href="javascript:;" onclick="topay();">立即支付</a>\
                        <script>\
                        function topay(){\
                            location.href ="' + _aConfig.payUrl +'?order_tag='+ oData.order_tag +'&pay_id='+oData.pay_t + '";\
                            }\
                        </script>';
                cancelBtn = '<a data-id="'+oData.order_id+'"  style="cursor:pointer;" class=" J-cancelBtn">取消订单</a>';
            }
            if (oData.status == 1) {
                status = '<span class="text-danger">待发货</span>';
                returnPayBtn = '<a href="' + _aConfig.returnPayUrl + oData.id + '"  >申请退款</a>';
            }
            if (oData.status == 2) {
                status = '<span class="text-warning">待收货</span>';
                confirmBtn = '<a data-id="'+oData.order_id+'" style="cursor:pointer;"  class="a_qrsh J-confirmBtn">确认收货</a>';
            }
            if (oData.status == 2 && oData.express_id != '') {
                expressBtn = '<a href="' + _aConfig.expressUrl +'?express_name='+ oData.express_name +'&express_number='+ oData.express_number+'&order_id='+oData.order_id+'">查看快递</a>';
            }
            if (oData.status == 3) {
                status = '<span class="text-success">已收货</span>';
                changeBtn = '<a href="' + _aConfig.changeUrl + oData.id + '">申请换货</a><a href="' + _aConfig.backUrl + oData.id + '">申请退货</a>';
            }
            if (oData.status == 4) {
                status = '<span class="text-success">已评价</span>';
            }
            if (oData.status == -1) {
                status = '<span class="text-success">已关闭</span>';
            }
            if (oData.status == -2) {
                status = '<span class="text-danger">退款中</span>';
            }
            if (oData.status == -3) {
                status = '<span class="text-danger">换货中</span>';
            }
            if (oData.status == -4) {
                status = '<span class="text-danger">退货中</span>';
            }
            if (oData.status == -5) {
                status = '<span class="text-success">已退货</span>';
            }
            if (oData.status == -6) {
                status = '<span class="text-success">已退款</span>';
            }
            if(oData.status == -10) {
                status = '<span class="text-danger">拒绝申请</span>';
                reason = '<h5><span>拒绝原因:</span></h5><h5 class="borderbottom" style="color:#f5686d;">' + oData.reason + '</h5>';
            }
            aHtml.push('<div class="row">\
				<div class="col-xs-12 borderbottom div_orderno">\
					<h4>\
                                            <span>订单编号：' + oData.order_id + '</span>\
                                            <b>' + Ui.date('Y-m-d', oData.create_time) + '</b>\
					</h4>\
				</div>');
            for (var j in oData.goods) {
                aHtml.push('<div class = "col-xs-12">\
                        <div class = "div_orderimg">\
                        <a href = "' + _aConfig.goodsDetailUrl.replace('____tag', oData.goods[j].id) + '">' + Ui.buildImage(App.url.resource + oData.goods[j].goods_img, undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '</a>\
                        </div>\
                        <div class = "div_orderimfor">\
                        <h3>\
                        <span>' + oData.goods[j].goods_name + '</span>\
                        <p><b> ' + oData.goods[j].price + '元 </b><span>x' + oData.goods[j].nums + '</span></p>\
                        </h3>\
                        </div>\
                        </div>');
            }
            aHtml.push('<div class="col-xs-12">\
					<h5 class="borderbottom"><span>状态</span><b>' + status + '</b></h5>'+reason+'\
					<h5 class="borderbottom"><span>支付方式</span><b>' + oData.pay_type + '</b></h5>' + expressHtml + remarkHtml + '\
				</div>\
				<div class="col-xs-12 div_totalmoney">\
                                    <span>共计：<b>' + oData.total_money + '元</b></span>\
				</div>\
                                <!-- 支付方式 -->\
                                ' + payHtml + '\
                                <!-- 支付方式 -->\
				<div class="col-xs-12 div_btnapply div_zhifubtn">' + pay + cancelBtn + expressBtn + confirmBtn + returnPayBtn + changeBtn + '\
				</div>\
			</div>');
            return aHtml.join('');
        }
    };
    var oOrderDetail = {
        getOrderDetail: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getOrderDetailUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (oData) {
                    _oOrder.appendOrderDetailHtml(oData.data);
                    self.bindOrderEvent();
                }
            });
        },
        bindOrderEvent:function(){
            $('.J-cancelBtn').click(function(){
                var $this = $(this);
                var orderId = $this.data('id');
                var aSendData=_aConfig.cancelData;
//                var aSendData = $.extend({},_aConfig.cancelData,{
//                    page:1,
//                    pager_size:10
//                });
                aSendData.order_id = orderId;
                
                Tips.askIips('你确定要取消该订单吗？',{
                    rBtnTitle:'确定',
                    lBtnTitle:'取消',
                    rFn:function(){
                       Request.ajax({
                            url: _aConfig.getOrderDetailUrl ,
                            data: aSendData,
                            success: function (aData) {
                                Tips.showTips('已经成功取消该订单！',2,function(){return location.reload(); });
                            },
                        });
                        return false;
                    },
                    rPramater:{id:999},
                    lPramater:{id:100},
                });
            });
            $('.J-confirmBtn').click(function(){
                var $this = $(this);
                var orderId = $this.data('id');
                var aSendData=_aConfig.confirmData;
//                var aSendData = $.extend({},_aConfig.cancelData,{
//                    page:1,
//                    pager_size:10
//                });
                aSendData.order_id = orderId;
                
                Tips.askIips('确定收到商品了吗？',{
                    rBtnTitle:'确定',
                    lBtnTitle:'取消',
                    rFn:function(){
                       Request.ajax({
                            url: _aConfig.getOrderDetailUrl ,
                            data: aSendData,
                            success: function (aData) {
                                Tips.showTips('确认收货成功！',2,function(){return location.reload(); });
                            },
                        });
                        return false;
                    },
                    rPramater:{id:999},
                    lPramater:{id:100},
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
        thumbUrl: '',
        getOrderDetailUrl: '',
        data: "",
        payUrl: "",
        expressUrl: "",
        changeUrl: "",
        backUrl: "",
        returnPayUrl: "",
        goodsDetailUrl: "",
        cancelData:"",
        confirmData:""
    };
    var _$domOrderDetailList = $('.J-orderDetailDom');
    var self = oOrderDetail;
    module.exports = oOrderDetail;
});