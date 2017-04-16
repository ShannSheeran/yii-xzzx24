define('app/like/index',["jQuery",'Tips','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min','app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');
    var Tips = require('Tips');//弹框插件
    
    //商品列表处理“类”
    var _oLikeList = {
        buildLikeList: function ($dom,oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<div class="col-xs-12 div_myzuji">\
                                <a href="'+ _aConfig.goodsDetailUrl.replace('____tag',oDataList[i].id)+'">\
                                <div class="div_imgbox">' + Ui.buildImage(App.url.resource + oDataList[i].goods_img,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</div></a>\
                                <h3>\
                                        <span>'+oDataList[i].name+'</span>\
                                        <p>￥'+oDataList[i].price+'</p>\
                                        <span style="color:#999;" class="J-deleteLike" data-id="'+oDataList[i].id+'">删除</span>\
                                </h3>\
                            </div>');
            }
            return aHtml.join('');
        },
       
        appendLikeListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oLikeList.buildLikeList($dom,aData));            
        }
    };
    var oIndex = {
        initLikeList:function(){
                $(function(){
                    loadMore({
                        dom: _$domLikeList,
                        cb: function(oLoadMore){
                            self.getLikeList(_$domAppendLikeList,_aConfig.getLikeUrl,oLoadMore)
                        }
                    });//处理加载更多
                });
            
        },
        //请求商品信息数据
        getLikeList: function ($dom,url,oLoadMore) {    
            if($dom == undefined){
                return $.error('page dom is not defined');
            }
            
            if($dom.data('page') == undefined){
                $dom.data('page',1)
            }
            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData();
                return false;
            }
            
            if(url == undefined){
                url = _aConfig.getLikeUrl;
            }
            var aSendData=_aConfig.data;
            aSendData.page=page;
            Request.ajax({
                type: 'post',
                url: url,
                datatype:'json',
                data:_aConfig.data,
                success: function (aData) {
                    if(aData.data.length == 0){
                        if(page==1){
                            $('.J-deleteAll').remove();
                        }
                        oLoadMore.noData();
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                        oLoadMore.closeLoading();
                    }
                    _oLikeList.appendLikeListHtml($dom,aData.data);
                    self.bindLikeEvent();
                    //self.goPosition();
                }
            });
        },
        bindLikeEvent:function(){
            $('.J-deleteAll').click(function(){
                Tips.askIips('你确定要清空所有的收藏吗？',{
                    rBtnTitle:'确定',
                    lBtnTitle:'取消',
                    rFn:function(){
                       Request.ajax({
                            url: _aConfig.getLikeUrl ,
                            data: _aConfig.deleteAllData,
                            success: function (aData) {
                                return Tips.showTips('清空成功！',2,function(){
                                    _$domAppendLikeList.remove();
                                    $('.J-deleteAll').remove();
                                    $('#pullUp').remove();
                                    _$domLikeList.append('<span style="text-align:center;display:inline-block; width:100%;">暂无数据</span>');
                                });
                            },
                        });
                        return false;
                    },
                    rPramater:{id:999},
                    lPramater:{id:100},
                });
            });
            $('.J-deleteLike').click(function () {
                var $this = $(this);
                var likeId = $this.data('id');
                var aSendData=_aConfig.deleteOneData;
                aSendData.likeId=likeId;
                Tips.askIips('你确定要删除这个收藏吗？',{
                    rBtnTitle:'确定',
                    lBtnTitle:'取消',
                    rFn:function(){
                       Request.ajax({
                            url: _aConfig.getLikeUrl ,
                            data: aSendData,
                            success: function (aData) {
                                return Tips.showTips('删除成功！',2,function(){
                                    $this.parents('.div_myzuji').remove();
                                });
                            }
                        });
                        return false;
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
        },

    };
    var _$domLikeList = $('.J-likeList');
    var _$domAppendLikeList = $('.J-likeDom');
    var _aConfig = {
        goodsDetailUrl: '',
        getLikeUrl: '',
        data:'',
        deleteAllData:'',
        deleteOneData:'',
    };
    var self = oIndex;	
    module.exports = oIndex;
})

