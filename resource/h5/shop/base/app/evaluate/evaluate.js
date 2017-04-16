define(["jQuery",'app/common/Request', 'app/common/Ui', 'external/raty/jquery.raty.min'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    require('external/raty/jquery.raty.min');
    
    var oRaty = { 
            getStar:function(){ 
                $(".span_star").raty();
                
                
            },
            bindEvent:function(){ 
                $(".div_inshopcar_left label").click(function () {
                    
			if (!$(this).hasClass("checked")) {
				$(this).addClass("checked");
			} else {
				$(this).removeClass("checked");
			}
                        
		});
	    
		var param = "1";
	   
		// 全选或者取消全选
		$(".J-span_allcheck").click(function(){
			if(param=="1"){
				$("label").each(function(){
					$(this).addClass("checked");
					param = "2";
				});
			}else{
				$("label").each(function(){
					$(this).removeClass("checked");
					param = "1";
				});
			}		
		});
                //提交
                $('.J-submit').click(function(){ 
                    var aData = [];
                    $('textarea').each(function(){
                        var socre = $(this).closest('.J-detailGoods').find('input').val();
                        if($(this).val() === ""){ 
                            $(this).val('好评！！');
                        }
                        aData.push({content:$(this).val(),id:$(this).data('id'),socre:socre});
                    });
                    if(aData.length == 0){
                        return;
                    }
                    Request.ajax({ 
                        url: _aConfig.rateUrl+'&submit=1',
                        data:{aData:aData,orderid:_aConfig.orderId},
                        success:function(oData){
                            if(oData.status ==1){ 
                                alert('评价成功！');
                                window.location.href = _aConfig.commentUrl;
                            }
                            if(oData.status ==0){ 
                                alert('评价失败！');
                                window.location.href ='javascript:history.go(-1);';
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
        rateUrl: '',
        commentUrl: '',
        orderId: 0,
    };
   module.exports = oRaty;
});