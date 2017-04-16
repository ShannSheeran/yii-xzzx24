define('app/footmark/index', ["jQuery", 'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oGoodsHistoryList = {
        buildGoodsHistoryList: function ($dom, oDataList) {
            var aHtml = [];
            if (oDataList.length == 0) {
                aHtml.push('<div class="col-xs-12 " style="text-align:center;padding:10px 15px;">\
                            <span >你还没有任何足迹哦！</span>\
                            </div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                aHtml.push('<div class="col-xs-12 div_myzuji">\
					<a href="' + _aConfig.goodsDetailUrl.replace('____tag', oDataList[i].id) + '">\
					<div class="div_imgbox">' + Ui.buildImage(App.url.resource + oDataList[i].goods_img, undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '</div></a>\
					<h3>\
						<span>' + oDataList[i].name + '</span>\
						<p>￥' + oDataList[i].sale_price + '</p>\
					</h3>\
				</div>');


            }

            return aHtml.join('');
        },
        appendGoodsHistoryListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oGoodsHistoryList.buildGoodsHistoryList($dom, aData));
        }
    };
    var oIndex = {
        //请求商品信息数据
        getGoodsHistoryList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getGoodsHistoryUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    _oGoodsHistoryList.appendGoodsHistoryListHtml(_$domAppendGoodsHistoryList, aData.data);
                }
            });
        },
        bindGoodsHistoryEvent: function () {
            $('.J-deleteAll').click(function () {
                Tips.askIips('你确定要清空访问记录吗？', {
                    rBtnTitle: '确定',
                    lBtnTitle: '取消',
                    rFn: function () {
                        Request.ajax({
                            url: _aConfig.deleteUrl,
                            success: function (aData) {
                                return Tips.showTips(aData.msg, 2, function () {
                                    location.href = _aConfig.footMarkUrl;
                                });
                            }
                        });
                        return false;
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
    var _$domAppendGoodsHistoryList = $('.J-goodsHistoryDom');
    var _aConfig = {
        getGoodsHistoryUrl: '',
        footMarkUrl: '',
        data: '',
        dataDelete: '',
        goodsDetailUrl: '',
        deleteUrl: ''
    };
    var self = oIndex;
    module.exports = oIndex;
});

