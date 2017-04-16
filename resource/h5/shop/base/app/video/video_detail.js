define(["jQuery",'app/common/Request','artDialog'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    var dialog = require("artDialog");
    
    var oVideo = {
        bindEvent:function(){
        $(".J-commentBtn").click(function () {
            var content = $(".J-comment").val();
            Request.ajax({
                url: $(this).data('rel'),
                data:{video_id: _aConfig.videoId,content:content },
                success: function (data) {
                    if (data.status == 1) {
                        _showTip(data.msg);
                        $('.J-appraiseItem').before('<div class="col-xs-12 div_evaluate">\
                                <div class="div_myevaluate">\
                                    <div class="div_atouxiang">\
                                        <a href="" class="a_touxiang">\
                                            <img src="'+data.data.avatar+'" class="img-responsive" alt="Responsive image">\
                                        </a>\
                                    </div>\
                                    <div class="div_ppingjia">\
                                        <p class="font14 color6">'+data.data.content+'</p>\
                                        <h4 class="font12 color9">评论时间：'+data.data.create_time+'<span></span></h4>\
                                    </div>\
                                </div>\
                            </div>');
                    } 
                    return _showTip(data.msg);
                }
            });
        });
        $(".J-zan").click(function () {            
            Request.ajax({
                url: $(this).data('rel'),
                data:{video_id: _aConfig.videoId},
                success: function (data) {
                    if (data.status == 1) {
                        _showTip(data.msg);
                        location.reload();
                    } 
                    return _showTip(data.msg);
                }
            });
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
    function _showTip(msg) {
        var r = dialog({
            content: msg
        });
        r.show();
        setTimeout(function () {
            r.close().remove();
        }, 2000);
        return;
    }

    var _aConfig = {
        videoId:'',
    };
    var self = oVideo;
    module.exports =  oVideo;
});
