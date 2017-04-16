define("app/search/search",["jQuery", 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'Tips'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");

    var loadMore = require('app/common/load_more');
    var Tips = require('Tips');
    //去请求分类信息数据的“类”
    var oSearch = {
        initGoodsList: function () {
            //处理加载更多
            var keywordd = $.trim($('.J-searchKeyword').val());
            if (keywordd != "") {
                //处理从详情页面返回时，没有商品展示。
                (function () {
                    $('.J-searchZongHe').addClass('current');
                    $('.J-searchZongHe').closest('div').siblings().find('a').removeClass('current').data('value', null);
                    _$domAppendGoodList.children().remove();
                    _$domAppendGoodList.next().remove();
                    _$domAppendGoodList.data('page', 1);
                    if ($('.J-searchZongHe').data('value') == null) {
                        $('.J-searchZongHe').data('value', 2);
                    }
                    
                    loadMore({
                        dom: _$domGoodsList,
                        cb: function (oLoadMore) {
                            self.getGoodsList(_$domAppendGoodList, _aConfig.searchUrl, oLoadMore);
                        }
                    });

                }());
            }
            $('.J-searchBtn').click(function () {
                var keyword = $.trim($('.J-searchKeyword').val());
                if (keyword == "") {
                    Tips.showTips('请输入商品名称！', 2);
                    return false;
                }
                $('.J-searchZongHe').addClass('current');
                $('.J-searchZongHe').closest('div').siblings().find('a').removeClass('current').data('value', null);
                _$domAppendGoodList.children().remove();
                _$domAppendGoodList.next().remove();
                if ($('.J-searchZongHe').data('value') == null) {
                    $('.J-searchZongHe').data('value', 2);
                }
                _$domAppendGoodList.data('page', 1);
                loadMore({
                    dom: _$domGoodsList,
                    isReset:true,
                    cb: function (oLoadMore) {
                        self.getGoodsList(_$domAppendGoodList, _aConfig.searchUrl, oLoadMore);
                    }
                });
            });
        },
        //请求商品信息数据
        getGoodsList: function ($dom, url, oLoadMore) {
            if ($dom == undefined) {
                return $.error('page dom is not defined');
            }

            if ($dom.data('page') == undefined) {
                $dom.data('page', 1)
            }

            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData()
                return false;
            }

            if (url == undefined) {
                url = _aConfig.searchUrl;
            }
            var zonghe = $('.J-searchZongHe').data('value');
            var keyword = $('.J-searchKeyword').val();
            if (keyword == "") {
                Tips.showTips('请输入商品名称！', 2);
                return false;
            }
            var sales = $('.J-searchSales').data('value');
            var price = $('.J-searchPrice').data('value');
            var aSendData = _aConfig.data;
            aSendData.page = page;
            aSendData.keyword = keyword;
            aSendData.sales = sales;
            aSendData.price = price;
            aSendData.zonghe = zonghe;


            Request.ajax({
                type: 'post',
                url: url,
                data: aSendData,
                success: function (aData) {
                    if (aData.data.length == 0) {
                        oLoadMore.noData();
                        $dom.data('page', 0);
                    } else {
                        page++;
                        $dom.data('page', page);
                        oLoadMore.closeLoading();
                    }
                    _oGoodsList.appendGoodsListHtml($dom, aData.data);
                },
            });
        },
        //参数处理函数
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }

        },
        bindSearchEvent: function () {
            //价格检索
            $('.J-searchPrice').click(function () {
                var keyword = $.trim($('.J-searchKeyword').val());
                if (keyword == "") {
                    Tips.showTips('请输入商品名称！', 2);
                    return false;
                }
                
                $(this).addClass('current');
                $(this).closest('div').siblings().find('a').removeClass('current').data('value', null);
                _$domAppendGoodList.children().remove();
                _$domAppendGoodList.next().remove();
                _$domAppendGoodList.data('page', 1);
                var page=_$domAppendGoodList.data('page');
                var order = $('.J-searchPrice').data('value');
                if (order == 1) {
                    $('.J-searchPrice').data('value', 0);
                } else {
                    $('.J-searchPrice').data('value', 1);
                }
                loadMore({
                    dom: _$domGoodsList,
                    isReset:true,
                    cb: function (oLoadMore) {
                        oSearch.getGoodsList(_$domAppendGoodList, _aConfig.searchUrl, oLoadMore);
                    }
                });
            });

        },
        bindSearchSalesEvent: function () {
            //销量检索
            $('.J-searchSales').click(function () {
                var keyword = $.trim($('.J-searchKeyword').val());
                ;
                if (keyword == "") {
                    Tips.showTips('请输入商品名称！', 2);
                    return false;
                }
                $(this).addClass('current');
                $(this).closest('div').siblings().find('a').removeClass('current').data('value', null);
                _$domAppendGoodList.children().remove();
                _$domAppendGoodList.next().remove();
                _$domAppendGoodList.data('page', 1);
                var order = $('.J-searchSales').data('value');
                if (order == 1) {
                    $('.J-searchSales').data('value', 0);
                } else {
                    $('.J-searchSales').data('value', 1);
                }
                loadMore({
                    dom: _$domGoodsList,
                    isReset:true,
                    cb: function (oLoadMore) {
                        oSearch.getGoodsList(_$domAppendGoodList, _aConfig.searchUrl, oLoadMore);
                    }
                });
            });
        }

    };

    //商品列表处理“类”
    var _oGoodsList = {
        buildGoodsList: function ($dom, oDataList) {
            var aData = oDataList;
            var aHtml = [];
            var likeClass = '';
            for (var i in oDataList) {
               
                aHtml.push('<a href="' + _aConfig.goodsDetailUrl.replace('____tag', oDataList[i].id) + '"><div class="swiper-slide col-xs-6 div_products" style="padding-left:0px; padding-right:0px;">\
                        <div class="div_product">' + Ui.buildImage(App.url.resource + oDataList[i].goods_img,undefined,{class:'img-responsive',alt:'Responsive image'}) + '\
                                <p>' + oDataList[i].name + '</p></a>\
                                <h4>\
                                    <span> <u>￥</u>' + oDataList[i].sale_price + '</span>\
                                    <b style="text-decoration:line-through">' + oDataList[i].market_price + '</b>\
                                </h4>\
                                <h5>\
                                        <span>销量：' + oDataList[i].sale_nums + '</span>\
                                </h5>\
                        </div>\
                </div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oGoodsList.buildGoodsList($dom, aData));
        }
    };
    var _$domGoodsList = $('.J-goodsList');
    var _$domAppendGoodList = $('.J-goodsDom');
    var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        searchUrl: '',
        data: ''

    };
    var self = oSearch;
    module.exports = oSearch;
});