define(["jQuery",'artDialog','app/common/Request','app/common/Ui','app/common/load_more','app/bargain/bargain'],function(require,exports,module) {
    var $ =  require("jQuery");
   var dialog = require('artDialog');
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oBargainList = require('app/bargain/bargain');

    //去请求分类信息数据的“类”
    var oBargain = {        
        bindStarBargainEvent:function(){
            oBargainList.config({
                startBargainUrl:_aConfig.startBargainUrl,
                checkBargainUrl:_aConfig.checkBargainUrl
            });
            oBargainList.startBargain();
        },
        //砍价事件
        bindBargainClickEvent:function($dom){
            if($dom == undefined){
                $dom = $('.J-bargainBtn');
            }
            $dom.click(function(){
                var bargainId = $(this).data('bargain_id');
                var goodsId = $(this).data('goods_id');
                if(bargainId == undefined){
                    return console.log('bargain_id is not defined');
                }
                Request.ajax({
                    url:_aConfig.sendBargainUrl,
                    data:{
                        bargain_id:bargainId,
                        goods_id:goodsId,
                    },
                    success:function(oResult){                        
                        if(oResult.status == 1){
                             return showInfo(2,oResult);
                        }
                        return showTip(oResult.msg);
                    }
                });
            });
        },
        //倒计时
        downStartTime:function($dom,seconds){
            _countdownTimer($dom,seconds);
        },
        shareClickEvent:function(){
            $('.J-shareBtn').click(function(){
                showInfo(4);
            });
        },
        //参数处理函数
        config:function(aOptions){
            for(var key in aOptions){
                if(_aConfig[key] !==undefined){
                    _aConfig[key] = aOptions[key];
                }
            }

        }

    }; 
    
    
    function showTip(msg, time, callback) {
        if (time == undefined) {
            time = 2000;
        }
        var r = dialog({
            content: msg
        });
        r.show();
        setTimeout(function () {
            r.close().remove();
            if (callback != undefined) {
                callback();
            }
        }, time);
        return;
    }
    
    function closeShowInfo(){
        $('.J-bargainTipsDom').empty();
    }
    
    function showInfo(type,aData){
        var $dom = $('.J-bargainTipsDom');
        if (type == 1) {
            $dom.empty().append($('<div class="div_popup">\
            <img src="'+ App.Url.staticImagesUrl +'/images/success.png" class="img-responsive" alt="Responsive image">\
            <h2 class="font14 color1 textc h2_title"></h2>\
            <a href="javascript:;" class="a_mybargain font12 color1 textc">我的砍价</a>\
        </div>'));
        }

        if (type == 2) {
            if(aData.data.price == undefined){
                aData.data.price = 0.00;
            }
            $dom.empty().append($('<div class="div_popup youhuiquan">\
            <img src="'+ App.Url.staticImagesUrl +'/images/haixiu.png" class="img-responsive" alt="Responsive image">\
            <h2 class="font14 color1 textc">'+ aData.msg +'<b class="font16 colorf40">'+ aData.data.price +'</b>元</h2>\
            <h2 class="textc"><a href="javascript:;" class="font16 colorf40 textc J-getCoupon" style="cursor:pointer;">领取</a></h2>\
            <h3 class="h3_quan">\
                <a href="javascript:;"><span class="font12 colorwhite"></span></a>\
            </h3>\
        </div>')).find('.J-getCoupon').click(function(){
                 Request.ajax({
                    url: _aConfig.couponUrl,
                    type: 'get',
                    success: function (aData) {
                        if (aData.status == 1) {
                            closeShowInfo();
                            showTip(aData.msg,1000,function () {
                                return location.reload();
                            });
                        } else {
                            showTip(aData.msg);
                        }
                    }
                });
        });
        }
        if(type == 3){
            $dom.empty().append($('<div class="div_popup" >\
                <img src="'+ App.Url.staticImagesUrl +'/images/lose.png" class="img-responsive" alt="Responsive image">\
                <h2 class="font14 color1 textc h2_title lose"></h2>\
                <a href="javascript:;" class="a_mybargain font12 color1 textc">我的砍价</a>\
            </div>'));
        }
        
        if(type == 4){
             $dom.empty().append($('<div class="div_popupbox">\
                <img src="/resource/static/images/share_remind.png" class="img-responsive" alt="Responsive image">\
                <div class="div_mask"></div>\
            </div>')).find('.div_mask').click(function(){$dom.empty()});
        }
    }
     function _countdownTimer($dom,seconds){
		var seconds = Number(seconds) - 1;
		setTimeout(function(){
			if(seconds > 0){
				_countdownTimer($dom,seconds);
			}else{
				$dom.html('活动已结束！');
			}			
		},1000);
		$dom.html(Ui.timeToFormatStr(seconds,1,'天','小时','分钟','秒'));
	};
    var _aConfig = {
        thumbUrl:'',
        goodsDetailUrl:'',
        startBargainUrl:'',
        checkBargainUrl:'',
        sendBargainUrl:'',
        couponUrl:''
    };
    
   
    
    var self = oBargain;
    module.exports =  oBargain;
});

