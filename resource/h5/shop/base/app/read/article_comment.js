define(["jQuery",'artDialog','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    //artDialog为弹窗插件
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oTouchSlide = require('external/touchSlider/TouchSlide.1.1');
    var dialog = require('artDialog');
    
    var oArticle_comment = { 
    
        bindEvent:function(){ 
            $('.J-sub_comment').on('click',function(){ 
                var textarea = $('textarea');
                var comment = textarea.val();
                var aId = textarea.data('article_id');
                Request.ajax({ 
                    data:{comment:comment,article_id:aId},
                    url:_aConfig.commentUrl,
                    success:function(oData){ 
                        if(oData.status == 1){ 
                             var r = dialog({
                                content: '评论成功！！'
                            });
                            r.show();
                            setTimeout(function () {
                                r.close().remove();
                                history.go(-1);
                            }, 2500);
                            
                        }
                        if(oData.status == 0){ 
                             var r = dialog({
                                content: '评论失败！！'
                            });
                            r.show();
                            setTimeout(function () {
                                r.close().remove();
                            }, 2500);
                            history.go(-2);
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
        commentUrl: ''
    };
    
    module.exports = oArticle_comment;
});