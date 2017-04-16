define(["jQuery",'app/common/Request','app/common/Ui','app/common/load_more'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    
    var loadMore = require('app/common/load_more');

    //去请求分类信息数据的“类”
    var oCategory = {
        getCategoryList:function(){
            Request.ajax({
                type:'get',
                url:_aConfig.cateUrl,
                success:function(aData){
                    _oCategoryList.appendCategoryListHtml(aData.data);
                }
            });
        },
        initGoodsList:function(){
            //处理加载更多
            loadMore(_$domGoodsList,{loadDownFn:function(oLoadMore){
                self.getGoodsList(_$domAppendGoodList,_aConfig.getGoodsListUrl,oLoadMore);
            }});
        },
        //请求商品信息数据
        getGoodsList: function ($dom,url,oLoadMore) {            
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
                url = _aConfig.getGoodsListUrl;
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
                    _oGoodsList.appendGoodsListHtml($dom,aData.data);                    
                    oLoadMore.resetload();
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    oLoadMore.resetload();
                }
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
    //分类数据处理的"类"
    var _oCategoryList ={

        //负责append
        appendCategoryListHtml:function(oData){

            _domSlidePic.append(_oCategoryList.buildCategoryList(oData));
        },
        //负责遍历数据
        buildCategoryList:function(oDataList){

            var cHtml = [];
            for(var i in oDataList){

                cHtml.push('<a href="">\
                            <img src="'+ _aConfig.thumbUrl + oDataList[i].thumb+'" class="img-responsive" alt="Responsive image"/>\
                            </a>');
            }
            return cHtml.join('');

        }
    };
    
    //商品列表处理“类”
    var _oGoodsList = {
        buildGoodsList: function ($dom,oDataList) {
            var aData = oDataList;
            
            var aHtml = [];
            for (var i in oDataList) {
//                if(oDataList[i].like_no > 99){ 
//                    oDataList[i].like_no = '99+';
//                }
                var likeClass = ''; 
                if(oDataList[i].is_like == 1){ 
                    likeClass = 'current';
                }
                var special = "";
                if(oDataList[i].isespecial == 1){
                    special = '<span>特卖</span>';
                }
                var icon = (App.oCountry[oDataList[i].country] != undefined) ? App.oCountry[oDataList[i].country] : 'i_korea';
                aHtml.push('<a href="' + _aConfig.goodsDetailUrl + oDataList[i].id + '"><div class="swiper-slide col-xs-6 div_products">\
                        <div class="div_product">' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb) + '\
                                <p>' + oDataList[i].title + '</p>'+special+'</a>\
                                <h4>\
                                    <span> <u>￥</u>' + oDataList[i].marketprice + '</span>\
                                    <b style="text-decoration:line-through">'+ oDataList[i].productprice +'</b>\
                                </h4>\
                                <h5>\
                                        <span>销量：'+oDataList[i].sales+'</span>\
                                        <b><s class="s_collect J-like '+likeClass+'" data-goods_gid="'+ oDataList[i].id +'"></s><b>'+oDataList[i].like_no+'</b></b>\
                                </h5>\
                        </div>\
                </div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oGoodsList.buildGoodsList($dom,aData));            
        }
    };
   
    var _domSlidePic = $('.J-slidePic');
    var _$domGoodsList = $('.J-goodsList');
    var _$domAppendGoodList = $('.J-goodsDom');
    var _aCountry = { 
        33:'i_korea',
        34:'i_japan',
        35: 'i_france',
        36: 'i_usa'
    };
    var _aConfig = {
        thumbUrl:'',
        goodsDetailUrl:'',
        cateUrl:'',
        getGoodsListUrl:'',

    };
    var self = oCategory;
    module.exports =  oCategory;
});