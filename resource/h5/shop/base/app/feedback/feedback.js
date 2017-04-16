define("app/feedback/feedback",["jQuery",'app/common/Request', 'app/common/Ui', 'Tips'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    //加载弹窗插件
    var Tips = require('Tips');//弹框插件
    
    var oFankui = { 
            bindEvent:function(){ 
                //提交
                $('.J-fankui').click(function(){ 
                    var content = $('.textarea_fankui').val();
                    if(content.length == 0){
                        return Tips.showTips('请输入反馈内容！',2);;
                    }
                    var aSendData = _aConfig.data;
                    aSendData.content=content;
                    Request.ajax({ 
                        type: 'post',
                        url: _aConfig.fankuiUrl,
                        datatype: 'json',
                        data:aSendData,
                        success:function(oData){
                            if(oData.status ==1){ 
                              Tips.showTips('反馈成功！',2,function(){location.href=history.go(-1);});
                            }
                            if(oData.status ==0){ 
                               Tips.showTips('反馈失败！',2,function(){ location.href=history.go(-1);});
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
        fankuiUrl: '',
        data:''
    };
   module.exports = oFankui;
});