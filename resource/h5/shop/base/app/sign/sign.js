 define(["jQuery",'app/common/Request','app/common/Ui','artDialog'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var dialog = require('artDialog');
    var oSign = { 
            getSignDays:function(){ 
                Request.ajax({
                        type:'get',
                        url:_aConfig.getSignDay,
                        success:function(aData){
                            console.log(aData);
                            if(aData.status == 0){
                                _domSignContinue.html(0);
                                _domSignTotal.html(0);
                            }
                            _domSignContinue.html(aData.data.signcontinuedays);
                            _domSignTotal.html(aData.data.signtotaldays);
                            if(aData.data.points == null){aData.data.points = 0}
                            _domSignPoints.html(aData.data.points);
                        }
                    });
            },
            bindEvent:function(){
              $('.J-markBtn').click(function(){
                  
                  Request.ajax({
                            type:'get',
                            url:_aConfig.doSign,
                            success:function(aData){
                                console.log(aData);
                                if(aData.status == 1){ 
                                    //弹窗
                                     var r = dialog({
                                            content: aData.data[0]
                                        });
                                        r.show();
                                        setTimeout(function () {
                                            r.close().remove();
                                        }, 1500);
                                   //请求数据
                                    self.getSignDays();
                                    //签到后改成 签到成功
                                    $('.J-markBtn').html('签到成功');
                                    
                                }
                                if(aData.status == 2){ 
                                    //弹窗
                                     var r = dialog({
                                            content: aData.data[0]
                                        });
                                        r.show();
                                        setTimeout(function () {
                                            r.close().remove();
                                        }, 1500);
                                }
                                if(aData.status == 0){ 
                                    //弹窗
                                    var r = dialog({
                                            content: aData.data[0]
                                        });
                                        r.show();
                                        setTimeout(function () {
                                            r.close().remove();
                                        }, 1500);
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
    
   var _domSignContinue = $('.J-signContinue');
   var _domSignTotal = $('.J-signTotal');
   var _domSignPoints = $('.J-signPoints');
    var _aConfig = {
        getSignDay: '',
        doSign: ''
       
    };
    
    var self = oSign;
    module.exports = oSign;
    });