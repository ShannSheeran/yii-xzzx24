define(["jQuery",'artDialog','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    //artDialog为弹窗插件
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oTouchSlide = require('external/touchSlider/TouchSlide.1.1');
    var dialog = require('artDialog');
    
    var _oArticle = { 
        appendArticleHtml:function(oDataList){ 
            _$domArticleList.append(_oArticle.buildArticleList(oDataList));
        },
        buildArticleList:function(oDataList){ 
            var aHtml = [];
            for(var i in oDataList){ 
                aHtml.push('<li>\
                                <a href="'+_aConfig.getArticleDetailUrl+'&id='+oDataList[i].id+'">\
                                    <img src="'+_aConfig.thumbUrl+oDataList[i].thumb+'" class="img-responsive" alt="Responsive image">\
                                    <p>'+oDataList[i].title+'</p>\
                                \</a>\
                            </li>');
            }
            return aHtml.join('');
        }
    
    };
    var oReaddetail = { 
        getArticles:function(){ 
            Request.ajax({ 
                type:'get',
                url:_aConfig.getRelationUrl,
                success:function(oData){
                    _oArticle.appendArticleHtml(oData.data);
                }
            });
        },
        bindEvent:function(){
            //为每一个img标签添加属性
            $('.div_main p img').each(function(){ 
                $(this).addClass('img-responsive');
                $(this).attr('alt','Responsive image');
            });
            
           $('.J-articleLike').on('click', function () {
                var $this = $(this);
                var articleId = $this.data('article_id');
                if (articleId == undefined) {
                    return console.log('存在不合法的文章id');
                }
                Request.ajax({
                    url: _aConfig.likeUrl + '&aid=' + articleId,
                    success: function (aData) {
                        if (aData.status == 1) {
                            var r = dialog({
                                content: '点赞成功！！'
                            });
                            r.show();
                            $this.addClass('current');
                            $this.next().html(aData.data.total);
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                            
                        }
                        if (aData.status == 0) {
                            var r = dialog({
                                content: '取消点赞！！'
                            });
                            r.show();
                            $this.removeClass('current');
                            $this.next().html(aData.data.total);
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                        }
                        if (aData.status == 2) {
                            var r = dialog({
                                content: '哎哟，点赞失败，请重试！！'
                            });
                            r.show();
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                        }
                        
                        console.log(aData)
                    },
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
        thumbUrl: '',
        getArticlesUrl: '',
        getArticleDetailUrl: '',
        getRelationUrl:'',
        likeUrl:''
    };
    
    var _$domArticleList = $('.J-articleList');
    var self = oReaddetail;
    module.exports = oReaddetail;
});