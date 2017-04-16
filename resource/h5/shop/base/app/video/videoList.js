define("app/video/videoList",["jQuery",'artDialog','app/common/Request','app/common/Ui','app/common/load_more'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    
    var loadMore = require('app/common/load_more');
    var dialog = require('artDialog');
    //去请求视频列表信息数据的“类”
    var oVideo = {
        
        initVideosList:function(){
            //处理加载更多
            loadMore(_$domVideosList,{loadDownFn:function(oLoadMore){
                self.getVideosList(_$domAppendGoodList,_aConfig.getVideosListUrl,oLoadMore);
            }});
        },
        //请求视频列表信息数据
        getVideosList: function ($dom,url,oLoadMore) {            
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
                url = _aConfig.getVideosListUrl;
            }
            Request.ajax({
                type: 'get',
                url: url + '&page=' + page,
                success: function (aData) {
                    if(aData.data.length == 0){
                        oLoadMore.noData();
                        oLoadMore.resetload();                        
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                    }
                    _oVideosList.appendVideosListHtml($dom,aData.data);                    
                    oLoadMore.resetload();
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    oLoadMore.resetload();
                }
            });
        },
        //绑定浏览的点击事件
        bindViewEvent:function(){ 
            
            $('.J-viewMark').on('click','.J-viewTotal',function(){ 
               
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
    
    function bindLikeEvent() {
        var video_id = $(this).data('videos_id');
        var $this = $(this).children().eq(1);
        Request.ajax({
            type: 'get',
            url: _aConfig.videoLikeUrl + '&video_id=' + video_id,
            success: function (aData) {
                if (aData.status == 0) {
                    var r = dialog({
                        content: '已经点过赞了哦！'
                    });
                    r.show();
                    setTimeout(function () {
                        r.close().remove();
                    }, 2000);
                    return;
                }
                if (aData.status == 1) {
                    var r = dialog({
                        content: '点赞成功！'
                    });
                    r.show();
                    $this.html(aData.data.like_number);
                    setTimeout(function () {
                        r.close().remove();
                    }, 2000);
                    return;
                }

            }
        });
    }
    
    //视频列表处理“类”
    var _oVideosList = {
        buildVideosList: function ($dom,oDataList) {
            var aHtml = [];
            for(var i in oDataList){
                aHtml.push('<div class="col-xs-12 div_video">\
                            <div class="videobox ">\
                                    <video data-video_id="'+ oDataList[i].id +'" class="J-viewTotal" controls = "controls" poster="'+ _aConfig.demainUrl+oDataList[i].url + '?vframe/png/offset/1/w/900/h/600/rotate/auto'  +'" style="width:100%;height:100%;">\
                                    <source src="'+_aConfig.demainUrl+oDataList[i].url+'" type="video/mp4" /></video>\
                                    <div class="div_videomask font14 colorwhite">\
                                            <span class="font14 color9 floatl span_name">作者：<span class="font14 color9">'+oDataList[i].nickname+'</span></span>\
                                    </div>\
                            </div>\
                            <div class="videoimfor">\
                                    <h2 class="font16 color3">'+oDataList[i].content+'</h2>\
                                    <ul>\
                                            <li class="floatl textright li_icon"><a href="javascript:;" class="J-videoLike" data-videos_id="'+ oDataList[i].id +'"><span class="span_icon span_zan"></span><span class="font12 color9 like_number">'+oDataList[i].like_no+'</span></a></li>\
                                            <li class="floatl textright li_icon"><a href="'+_aConfig.videosDetailUrl+oDataList[i].id+'"><span class="span_icon span_ping"></span><span class="font12 color9">'+oDataList[i].appraise_no+'</span></a></li>\
                                            <li class="floatl textright li_icon"><a href="javascript:;"><span class="font12 color9">'+oDataList[i].view+'次播放</span></a></li>\
                                            <li class="floatl textright li_icon"><span class="font12 color9">'+oDataList[i].forwarded+'次转发</span></li>\
                                    </ul>\
                            </div>\
                            </div>');
            }
                return aHtml.join('');
            
         },
            
        
        appendVideosListHtml: function ($dom, aData) {
            //append商品列表
            var $html = $(_oVideosList.buildVideosList($dom, aData));
            $html.find('.J-videoLike').click(bindLikeEvent);
            $html.find('video').each(function () {                
                $(this)[0].addEventListener('play', function () {
                    var id = $(this).data('video_id');
                    $html.find('video').each(function(){
                        var $oVideo = $(this)[0];
                        console.log($oVideo.paused);
                        if (!$oVideo.paused) {
                            if($($oVideo).data('video_id') != id){
                                $oVideo.pause(); 
                            }
                        }
                    });
                    
                    if (-1 == $.inArray(id, _aVideoPlayList)) {
                        _aVideoPlayList.push(id);
                        Request.ajax({
                            type: 'get',
                            url: _aConfig.viewCountUrl + '&video_id=' + id,
                            success: function (aData) {}
                        });
                    }
                });
            });
            $dom.append($html);
        }
    };
   
    var _$domVideosList = $('.J-videoList');
    var _$domAppendGoodList = $('.J-videoDom');
    
    var _aConfig = {
        demainUrl:'',
        videosDetailUrl:'',
        getVideosListUrl:'',
        videoLikeUrl:'',
        viewCountUrl:''

    };
    var self = oVideo;
    var _aVideoPlayList = [];
    module.exports =  oVideo;
});