define('app/award/award', ["jQuery", 'Tips', 'external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min', 'app/common/load_more', 'external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oAwardList = {
        buildAwardList: function ($dom, oDataList) {
            var aHtml = [];
            var type = '+';
            var typeHtml = new Array();
            typeHtml[1] = '签到奖励';
            typeHtml[2] = '分享奖励';
            typeHtml[3] = '兑换消耗';
            for (var i in oDataList) {
                if (oDataList[i].type == 3) {
                    type = '-';
                }
                aHtml.push('<div class="col-xs-12 div_jifentotal">\
					<h2>' + typeHtml[oDataList[i].type] + '</h2>\
					<p>' + Ui.date('Y-m-d', oDataList[i].create_time) + '</p>\
					<b>' + type + oDataList[i].score + '</b>\
				</div>');
            }
            return aHtml.join('');
        },
        appendAwardListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oAwardList.buildAwardList($dom, aData));
        },
    };
    var oIndex = {
        initAwardList: function () {
            $(function () {
                loadMore({
                    dom: _$domAwardList,
                    cb: function (oLoadMore) {
                        self.getAwardList(_$domAppendAwardList, _aConfig.getAwardUrl, oLoadMore)
                    }
                });//处理加载更多
            });

        },
        //请求商品信息数据
        getAwardList: function ($dom, url, oLoadMore) {
            if ($dom == undefined) {
                return $.error('page dom is not defined');
            }

            if ($dom.data('page') == undefined) {
                $dom.data('page', 1)
            }
            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData();
                return false;
            }

            if (url == undefined) {
                url = _aConfig.getAwardUrl;
            }
            var aSendData = _aConfig.data;
            aSendData.page = page;
            Request.ajax({
                type: 'post',
                url: url,
                datatype: 'json',
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
                    _oAwardList.appendAwardListHtml($dom, aData.data);
                    //self.goPosition();
                }
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
    var _$domAwardList = $('.J-awardList');
    var _$domAppendAwardList = $('.J-awardDom');
    var _aConfig = {
        getAwardUrl: '',
        data: '',
    };
    var self = oIndex;
    module.exports = oIndex;
})

