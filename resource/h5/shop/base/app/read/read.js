define(["jQuery",'artDialog','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    //artDialog为弹窗插件
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oTouchSlide = require('external/touchSlider/TouchSlide.1.1');
    var dialog = require('artDialog');
     //幻灯片列表处理“类”
    var _oSlideList = {
        buildSlideList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                var url = 'javascript:void(0);';
                if (oDataList[i].url == '') {
                    url = oDataList[i].url;
                }
                aHtml.push('<li><a href="' + url + '">' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb) + '</a></li>');
            }
            return aHtml.join('');
        },
        appendSlideListHtml: function (oData) {
            _$domSlide.append(_oSlideList.buildSlideList(oData));
        }
    };
    //文章内容列表
    var _oArticle = { 
        appendArticleHtml:function(oDataList){
			//暂时用刷新解决ios莫名奇妙获取不到元素bug
			if(_$domArticleList.html() == undefined){
				return window.location.reload();
			}
			$(_oArticle.buildArticleList(oDataList)).appendTo(_$domArticleList);
        },
        buildArticleList:function(oDataList){ 
            var aHtml = [];
            if(oDataList == 'no article'){ 
                aHtml.push('<p style="text-align:center;padding-top:10px;"> 暂时没有文章咯！！！</p>');
                return aHtml.join('');
            }
            for(var i in oDataList){ 
                aHtml.push('<div class="col-xs-12 article">\
                                    <a href="'+_aConfig.getArticleDetailUrl+'&id='+oDataList[i].id+'">\
                                            '+ Ui.buildImage(_aConfig.thumbUrl+oDataList[i].thumb,undefined,{class:'img-responsive',alt:'Responsive image'})+'\
                                            <div class="div_readtop">\
                                                    <p class="font14">'+oDataList[i].title.substr(0,(oDataList[i].title.length)/2)+'</p>\
                                                    <p class="font14">'+oDataList[i].title.substr((oDataList[i].title.length)/2)+'</p>\
                                                    <span class="font12 fontColor9">'+Ui.date('Y-m-d',oDataList[i].create_time)+'</span>\
                                            </div>\
                                            <div class="article_main">\
                                                    <p class="font14 fontColor9">'+oDataList[i].description+'</p>\
                                                    <span class="font12 fontColor9"><span>阅读('+oDataList[i].viewcount+')</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>评论('+oDataList[i].commentcount+')<span></span>\
                                            </div>\
                                    </a>\
                            </div>');
            }
            return aHtml.join('');
        }
    
    };
    var oRead = { 
        getArticles:function(url,cid){
            if(cid != undefined && _oCacheArticleList[cid] != undefined){
                return _oArticle.appendArticleHtml(_oCacheArticleList[cid]);
            }
            Request.ajax({ 
                type:'get',
                url:url,
                success:function(oData){
                    _oArticle.appendArticleHtml(oData.data);
                    _oCacheArticleList[cid] = oData.data;
                }
            });
        },
         //请求幻灯片信息数据
        getSlideList: function () {
            Request.ajax({
                type: 'get',
                url: _aConfig.getBannerUrl,
                success: function (aData) {
                    _oSlideList.appendSlideListHtml(aData.data);
                    if(aData.data.length > 0){
                        //长度大于0，自动调用轮播
                        self.slideShow();
                    }
                }
            });
        },
        slideShow: function () {			
            // 头部轮播图控制
            oTouchSlide({
                slideCell: "#leftTabBox",
                slideCell:"#focus",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true, //自动播放
                autoPage: true //自动分页
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
        getArticleDetailUrl: '',
        getRelationUrl:'',
        getBannerUrl:''
    };
    var _oCacheArticleList = [];
    var _$domSlide = $('.J-slideShow');
    var _$domArticleList = $('.J-articleList');
    var self = oRead;
    module.exports = oRead;
});