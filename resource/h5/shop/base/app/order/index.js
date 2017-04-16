define('app/order/index',["jQuery",'Tips','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min','app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');
    var Tips = require('Tips');//弹框插件
    
    //商品列表处理“类”
    var _oOrderList = {
        buildOrderList: function ($dom,oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
            var status='<i></i>';
            var payBtn='';
            var confirmBtn='';
            var rateBtn='';
            if(oDataList[i].status ==0){ 
                status='<i>待付款</i>';
                payBtn='<a href="'+ _aConfig.payUrl +'?order_tag='+ oDataList[i].order_tag +'&pay_id='+oDataList[i].pay_id + '"  class="a_ljfk">立即付款</a><span data-id="'+oDataList[i].order_id+'"  style="cursor:pointer;" class="a_ddgz J-cancelBtn">取消订单</span>';
            }
            if(oDataList[i].status ==1){ 
                status='<i>待发货</i>';
            }
            if(oDataList[i].status ==2){ 
                status='<i class="i_dsh">待收货</i>';
                confirmBtn='<a href="'+ _aConfig.expressUrl + '?express_name='+ oDataList[i].express_name +'&express_number='+ oDataList[i].express_number+ '&order_id='+oDataList[i].order_id+'" class="a_ckwl">查看物流</a><span data-id="'+oDataList[i].order_id+'" style="cursor:pointer;"  class="a_qrsh J-confirmBtn">确认收货</span>';
            }
            if(oDataList[i].status ==3){ 
                status='<i class="i_yfh">已收货</i>';
                rateBtn='<a href="'+ _aConfig.rateUrl +'?order_id='+ oDataList[i].order_id + '" class="a_shpj">收货评价</a>';
            }
            if(oDataList[i].status ==4){ 
                status='<i class="i_yfh">已评价</i>';
            }
            if(oDataList[i].status ==-1){ 
                status='<i>已关闭</i>';
            }
            if(oDataList[i].status ==-2){ 
                status='<i>退款中</i>';
            }
            if(oDataList[i].status ==-3){ 
                status='<i>换货中</i>';
            }
            if(oDataList[i].status ==-4){ 
                status='<i>退货中</i>';
            }
            if(oDataList[i].status ==-5){ 
                status='<i>已退货</i>';
            }
            if(oDataList[i].status ==-6){ 
                status='<i>已退款</i>';
            }
            aHtml.push('<div class="row">\
                    <div class="col-xs-12 div_nopayorder">\
                            <h4 style="clear:both; display:inline-block; width:100%;"><span style="float:left;">'+Ui.date('Y-m-d H:i:s',oDataList[i].create_time)+'</span><span style="float:right;">'+status+'</span></h4>');
                for(var j in oDataList[i].goods){
                    aHtml.push('<div class="div_nopaymid">\
                                    <a href="'+ _aConfig.goodsDetailUrl.replace('____tag',oDataList[i].goods[j].id)+'">\
					<div class="div_nopayleft">' + Ui.buildImage(App.url.resource + oDataList[i].goods[j].goods_img,undefined,{class:'img-responsive',alt:'Responsive image'}) + '\
					</div>\
					<div class="div_nopayright">\
						<h2>'+oDataList[i].goods[j].goods_name+'</h2>\
						<p></p>\
						<h3>\
							<span>￥'+oDataList[i].goods[j].price+'</span><br/>\
							<b>x'+oDataList[i].goods[j].nums+'<b>\
						</h3>\
					</div>\
                                    </a>\
				</div>');
                }
            aHtml.push(' '+ payBtn + confirmBtn + rateBtn +'\
            <a href="' + _aConfig.orderDetailUrl.replace('____tag',oDataList[i].id) + '" class="a_ddgz">订单详情</a></div></div>');
        }
        return aHtml.join('');
        },
        buildOrderNull:function($dom){
            var aHtml = [];
            aHtml.push('<div class="myoder img-rounded" style="text-align:center;color:#aaa;padding:30px;">\
                                您暂时没有此类订单!\
                            <ul class="buttons">\
                            <li class="btn"><a href="'+ _aConfig.indexUrl + '" class="button gray">去逛逛</a></li>\
                            </ul>\
                        </div>');
            return aHtml.join('');
        },
        appendOrderListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oOrderList.buildOrderList($dom,aData));            
        },
        appendOrderNullHtml: function ($dom) {
            //append商品列表
            $dom.append(_oOrderList.buildOrderNull($dom));            
        }
    };
    var oIndex = {
        initOrderList:function(){
                $(function(){
                    loadMore({
                        dom: _$domOrderList,
                        cb: function(oLoadMore){
                            self.getOrderList(_$domAppendOrderList,_aConfig.getOrderUrl,oLoadMore)
                        }
                    });//处理加载更多
                });
            
        },
        //请求商品信息数据
        getOrderList: function ($dom,url,oLoadMore) {    
            if($dom == undefined){
                return $.error('page dom is not defined');
            }
            
            if($dom.data('page') == undefined){
                $dom.data('page',1)
            }
            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData();
                return false;
            }
            
            if(url == undefined){
                url = _aConfig.getOrderUrl;
            }
            var aSendData=_aConfig.data;
            aSendData.page=page;
            Request.ajax({
                type: 'post',
                url: url,
                datatype:'json',
                data: aSendData,
                success: function (aData) {
                    if(aData.data.length == 0){
                        if(page==1){
                            _oOrderList.appendOrderNullHtml($dom);
                            $('#pullUp').remove();
                            return false;
                        }
                        oLoadMore.noData();
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                        oLoadMore.closeLoading();
                    }
                    _oOrderList.appendOrderListHtml($dom,aData.data);
                    self.bindOrderEvent();
                    //self.goPosition();
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
                            url: _aConfig.getOrderUrl ,
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
                            url: _aConfig.getOrderUrl ,
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
        },

    };
    var _$domOrderList = $('.J-orderList');
    var _$domAppendOrderList = $('.J-orderDom');
    var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        getOrderUrl: '',
        data:'',
        payUrl:"",
        expressUrl:"",
        rateUrl:"",
        orderDetailUrl:'',
        indexUrl:"",
        cancelData:"",
        confirmData:""
    };
    var self = oIndex;	
    module.exports = oIndex;
})

