define('app/category/index', ["jQuery", 'Tips', 'external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min', 'app/common/load_more', 'external/cookie/jquery.cookie','external/scrollLoading/scrollLoading'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    require("external/scrollLoading/scrollLoading");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oSecondCategoryList = {
        buildSecondCategoryList: function ($dom, oDataList) {
            var aHtml = [];
            var url = '';
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center;">暂无分类信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                url = _aConfig.goodsListUrl.replace('___cid', oDataList[i].id).replace('___cname', oDataList[i].name);
                aHtml.push(' <div class="col-xs-6">\
                    <a href="' + url + '" class="a_kindicon a_hufuicon"><div class="table-box"><span class="table-middle">' + Ui.buildImage(App.url.resource + oDataList[i].img, undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '</span></div></a>\
                    <h3 class="font14 textcenter">' + oDataList[i].name + '</h3>\
                </div>');

            }
            return aHtml.join('');
        },
        appendSecondCategoryListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oSecondCategoryList.buildSecondCategoryList($dom, aData));
        },
    };
    //一级分类处理“类”
    var _oFirstCategoryList = {
        buildFirstCategoryList: function ($dom, oDataList) {
            var aHtml = [];
            var url = '';
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center;">暂无分类信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                aHtml.push('<li data-pid="'+oDataList[i].id+'" class="J-clickFindCategory">'+ oDataList[i].name+'</li>');

            }
            return aHtml.join('');
        },
        appendFirstCategoryListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oFirstCategoryList.buildFirstCategoryList($dom, aData));
            $('.J-muen-list').find('li').eq(0).click();
        },
    };
    var oIndex = {
        //请求商品信息数据
        getCategoryList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getCategoryUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    _oFirstCategoryList.appendFirstCategoryListHtml(_$domAppendCategoryList, aData.data);
                    //self.goPosition();
                }
            });
        },
        getSecondCategoryList: function (aCategoryData) {
            Request.ajax({
                type: 'post',
                url: _aConfig.getCategoryUrl,
                datatype: 'json',
                data: aCategoryData,
                success: function (aData) {
                    _oSecondCategoryList.appendSecondCategoryListHtml(_$domAppendSecondCategoryList, aData.data);
                    //self.goPosition();
                }
            });
        },
        bindEvent:function(){ 
            $('.J-muen-list').on('click','li',function(){ 
                
                _$domAppendSecondCategoryList.html('');
                $(this).addClass("muen-list-active").siblings().removeClass("muen-list-active");
                var pid = $(this).data('pid');
                var aData = $.extend({},_aConfig.data,{pid:pid});
                self.getSecondCategoryList(aData);
                
                
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
    var _$domAppendCategoryList = $('.J-muen-list');
    var _$domAppendSecondCategoryList = $('.J-muen-center-box');
    var _aConfig = {
        getCategoryUrl: '',
        data: '',
        goodsListUrl: ''
    };
    var self = oIndex;
    module.exports = oIndex;
})

