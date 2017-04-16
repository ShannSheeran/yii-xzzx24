define('app/agent/index', ["jQuery", 'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oFansList = {
        buildFansList: function ($dom, oDataList) {
            var aHtml = [];
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center;">暂无下级用户信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                aHtml.push('<div class="col-xs-12 div_visitor">\
                                <div class="row div_visi ">\
                                <div class="col-xs-3 div_vleft">\
                                '+ Ui.buildImage(App.url.resource + oDataList[i].avatar, undefined, {class: 'img-responsive', alt: 'Responsive image'}) +'\
                                </div>\
                                <div class="col-xs-9 div_vright " >\
                                <h5>用户名：<span>' + oDataList[i].real_name + '</span></h5>\
                                <h5>\
                                <span>级别：' + oDataList[i].level + '级</span>\
                                <span>积分：<b>' + oDataList[i].score + '</b></span>\
                                </h5>\
                                </div>\
                                <p style="bottom:0px;">' +  Ui.date('Y-m-d', oDataList[i].create_time) + '</p>\
                                </div>\
                            </div>');


            }
            return aHtml.join('');
        },
        appendFansListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oFansList.buildFansList($dom, aData));
        },
    };
    var oIndex = {
        //请求商品信息数据
        getFansList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getFansUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    _oFansList.appendFansListHtml(_$domAppendFansList, aData.data);
                    //self.goPosition();
                }
            });
        },
        getMycommission: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getCommissionUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    $('.J-noApply').html(aData.data.noApply);
                    $('.J-applying').html(aData.data.applying);
                    $('.J-applyed').html(aData.data.applyed);
                    $('.J-canApply').html(aData.data.canApply);
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
    var _$domAppendFansList = $('.J-fansList');
    var _aConfig = {
        getFansUrl: '',
        data: '',
        getCommissionUrl:''
    };
    var self = oIndex;
    module.exports = oIndex;
})

