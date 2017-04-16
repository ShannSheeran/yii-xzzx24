define(["jQuery",'artDialog','app/common/Request', 'app/common/Ui','app/common/load_more'], function (require, exports, module) {
	var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');	
    var dialog = require('artDialog');	   
	   var _oGoodsList = {
        buildGoodsList: function ($dom,oDataList) {
            var aData = oDataList;
            var aHtml = [];
            for (var i in oDataList) {
                var icon = (_aCountry[oDataList[i].country] != undefined) ? _aCountry[oDataList[i].country] : '无';
				aHtml.push('<div class="col-xs-12 xianshigou">\
						<a href="' + _aConfig.goodsDetailUrl + oDataList[i].id + '">\
							' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb,undefined,{class:'img-responsive',alt:'Responsive image'}) + '\
							<div>\
								<span class="font14">' + oDataList[i].title + '</span>\
							</div>\
							<div class="div_marks">\
								<span class="font12">限时购</span>\
								<i><b><s></s><strong class="J-countdownTimer" data-time="'+ (oDataList[i].timeend - _serviceTime) +'">00:00:00</strong></b></i>\
							</div>\
						</a>\
					</div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function ($dom,aData) {
            //append商品列表
			var $goodsList = $(_oGoodsList.buildGoodsList($dom,aData));
			$goodsList.find('.J-countdownTimer').each(function(){
				var $this = $(this);
				var seconds = $(this).data('time');
				_countdownTimer($this,seconds);
			});
			$goodsList.appendTo($dom);       
        }
    };
	var oTimeGoods = {
		//请求商品信息数据
        getGoodsList: function ($dom,url,oLoadMore) {            
            if($dom == undefined){
                return $.error('page dom is not defined');
            }
            
            if($dom.data('page') == undefined){
                $dom.data('page',1)
            }
            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData()
                oLoadMore.resetload();
                return false;
            }
            
            if(url == undefined){
                url = _aConfig.getGoodsListUrl;
            }
            Request.ajax({
                type: 'get',
                url: url + '&page=' + page,
                success: function (aData) {
                    if(aData.data.aDataList.length == 0){
                        oLoadMore.noData();
                        oLoadMore.resetload();                        
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                    }
					//服务器时间
					_serviceTime = aData.data.time;
                    _oGoodsList.appendGoodsListHtml($dom,aData.data.aDataList);                    
                    oLoadMore.resetload();
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    oLoadMore.resetload();
                }
            });
        },
		initGoodsList:function(){
            //处理加载更多
            loadMore(_$domGoodsList,{loadDownFn:function(oLoadMore){
                self.getGoodsList(_$domAppendGoodList,_aConfig.getGoodsListUrl,oLoadMore);
            }});
        },
		config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }
	};
	function _countdownTimer($dom,seconds){
		var seconds = Number(seconds) - 1;
		setTimeout(function(){
			if(seconds > 0){
				_countdownTimer($dom,seconds);
			}else{
				return window.location.reload();
			}			
		},1000);
		$dom.html(Ui.timeToFormatStr(seconds));
	};
	var _aCountry = { 
        33:'韩国',
        34:'日本'
    };
	var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        getGoodsListUrl:''
    };
	var _serviceTime = 0;
	var _$domGoodsList = $('.J-timeGoodsListParentDiv');
	var _$domAppendGoodList = $('.J-timeGoodsList');
	var self = oTimeGoods;
    module.exports = oTimeGoods;
});