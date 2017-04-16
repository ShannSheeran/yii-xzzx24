define('app/agent/fansOrder',["jQuery",'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
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
            if(oDataList[i].status ==0){ 
                status='<i>待付款</i>';
            }
            if(oDataList[i].status ==1){ 
                status='<i>待发货</i>';
            }
            if(oDataList[i].status ==2){ 
                status='<i class="i_dsh">待收货</i>';
            }
            if(oDataList[i].status ==3){ 
                status='<i class="i_yfh">已收货</i>';
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
            aHtml.push('<div class="row" style=" margin-top:5px;">\
                    <div class="col-xs-12 div_nopayorder" style="margin:0px;">\
                            <h4>单号<span>'+ oDataList[i].order_id+'</span> &nbsp;<span>'+Ui.date('Y-m-d',oDataList[i].create_time)+'</span>'+status+'</h4>');
                for(var j in oDataList[i].goods){
                    aHtml.push('<div class="div_nopaymid">\
					<div class="div_nopayleft">' + Ui.buildImage(App.url.resource + oDataList[i].goods[j].goods_img,undefined,{class:'img-responsive',alt:'Responsive image'}) + '\
					</div>\
					<div class="div_nopayright">\
						<p style="font-size:14px; margin: 0 0 10px 10px; color:#000; font-family:微软雅黑">'+oDataList[i].goods[j].goods_name+'</p>\
                                                <h3>\
							<span>￥'+oDataList[i].goods[j].price+'</span>&nbsp;\
							<b>x'+oDataList[i].goods[j].nums+'<b>\
						</h3>\
					</div>\
				</div>');
                }
                aHtml.push('<p style="font-size:12px; color:#000; font-family:微软雅黑;text-align:right;">佣金：￥'+oDataList[i].commission+'</p></div></div>');
        }
        return aHtml.join('');
        },
        appendOrderListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oOrderList.buildOrderList($dom,aData));            
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
                        oLoadMore.noData();
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                        oLoadMore.closeLoading();
                    }
                    _oOrderList.appendOrderListHtml($dom,aData.data);
                    //self.goPosition();
                }
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
        getOrderUrl: '',
        data:''
    };
    var self = oIndex;	
    module.exports = oIndex;
})

