define('app/appraise/appraise',["jQuery",'Tips','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min','app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var testjs = require('app/index/test');
     var loadMore = require('app/common/load_more');
    var Tips = require('Tips');//弹框插件


    //评论列表处理“类”
    var _oAppraiseList = {
        buildAppraiseList: function (oDataList) {
            var aData = oDataList;
            if (aData.length == 0) {
                if (_indexAppraiseLoadDataPage == 1) {
                    return '<div>数据为空</div>';
                }
                _indexAppraiseLoadDataPage = 'nodata';
                return '暂无数据';
            }

            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<tr>\
                                <td>' + Ui.buildImage(App.url.resource + oDataList[i].thumb) + '</td>\
                                <td>' + oDataList[i].content + '</td>\
                            </tr>');
            }
            return aHtml.join('');
        },
        buildMyAppraiseList: function ($dom,oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<div class="col-xs-12 div_evaluate">\
					<p>评价时间：<span>'+Ui.date('Y-m-d H:i:s',oDataList[i].create_time)+'</span></p>\
                                        <a href="">\
					<div class="div_imgbox">' + Ui.buildImage(App.url.resource + oDataList[i].photos,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</div>\
                                        </a>\
					<h4><s></s>'+oDataList[i].nickname+'</h4>\
					<div class="div_myevaluate">\
						<div class="div_atouxiang">\
                                                    <a href="" class="a_touxiang">' + Ui.buildImage(App.url.resource + oDataList[i].avatar,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</a>\
						</div>\
						<div class="div_ppingjia">\
							<p>'+oDataList[i].content+'</p>\
						</div>\
					</div>\
				</div>');
            }
            return aHtml.join('');
        },
        appendAppraiseListHtml: function (aData) {
            //append商品列表
            _$domAppraise.append(_oAppraiseList.buildAppraiseList(aData));

        },
        appendMyAppraiseListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oAppraiseList.buildMyAppraiseList($dom,aData));

        }
    };
    var oAppraise = {
        initAppraiseList: function () {
            $(function () {
                loadMore({
                    dom: _$domAppraiseList,
                    cb: function (oLoadMore) {
                        self.getMyAppraiseList(_$domAppendAppraiseList, _aConfig.getAppraiseUrl, oLoadMore)
                    }
                });//处理加载更多
            });

        },
        //请求商品信息数据
        getMyAppraiseList: function ($dom, url, oLoadMore) {
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
                url = _aConfig.getMyAppraiseUrl;
            }
            var aSendData = _aConfig.myAppraiseData;
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
                    _oAppraiseList.appendMyAppraiseListHtml($dom, aData.data);
                    //self.goPosition();
                }
            });
        },
        //请求评论信息数据
        getAppraiseList: function (url) {
            if (_indexAppraiseLoadDataPage == 'noData') {
                return;
            }
            Request.ajax({
                type: 'get',
                url: url + '&page=' + _indexAppraiseLoadDataPage,
                success: function (aData) {
                    _oAppraiseList.appendAppraiseListHtml(aData);
                    _indexAppraiseLoadDataPage++;
                }
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
    var _$domAppraise = $('.J-AppraiseList');
    var _$domAppraiseList = $('.J-MyAppraiseList');
    var _$domAppendAppraiseList = $('.J-myAppraiseDom');
    var _indexAppraiseLoadDataPage = 1;
    var _indexCategoryList={168:'icon_foods',169:'icon_beauty',173:'icon_ladies'}
    var _aConfig = {
        thumbUrl: '',
        baseUrl: '',
        getMyAppraiseUrl:'',
        myAppraiseData:''
    };
    var self = oAppraise;
    module.exports = oAppraise;
})

