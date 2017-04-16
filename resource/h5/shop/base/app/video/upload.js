define(["jQuery",'app/common/Request'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    
    var oVideo = {
        bindSumbitEvent:function($btnDom,$formDom){
           
            $btnDom.click(function(){
            if($('.J-fileKey').val() == ''){
                return alert('视频必须上传');
            };
                Request.ajaxSend($formDom,{
                    url: _aConfig.uploadUrl,
                    beforeSend:function(){},
                    success: function (aData) {                        
                        if (aData.status == 1) {
                           
                        }
                        return alert(aData.msg);
                       
                    }
                },$(this));
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
    var _aConfig = {
        uploadUrl:'',
    };
    var self = oVideo;
    module.exports =  oVideo;
});