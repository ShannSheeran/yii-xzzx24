define('app/coupon/index', ["jQuery", 'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oCouponList = {
        buildCouponList: function ($dom, oDataList) {
            var aHtml = [];
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center;">暂无优惠券信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                var status = '';
                if (oDataList[i].status == 0) {
                    status = '未使用';
                } else if (oDataList[i].status == 1) {
                    status = '已使用';
                } else {
                    status = '已过期';
                }
                if (oDataList[i].coupon) {
                    aHtml.push('<div class="col-xs-12 div_kaquan">\
					<div class="div_kaquanleft">\
						<span><b>￥</b>' + oDataList[i].coupon.denomination + '</span>\
					</div>\
					<div class="div_kaquanright" style="padding:0 0 0 10px; position:relative;width:70%; font-family:"微软雅黑";">\
                                        <span style="position:absolute; right:5px; top:5px; color:#f40;">' + status + '</span>\
						<h3 style="margin:0px; height:30px; line-height:30px;">' + oDataList[i].coupon.title + '</h3>\
						<h3 style="margin:0px; height:30px; line-height:30px;">满' + oDataList[i].coupon.limit + '元使用</h3>\
                                                <h3 style="margin:0px; height:30px; line-height:30px; color:#ccc;">期限：' + Ui.date('Y-m-d H:i:s', oDataList[i].coupon.end_time) + '</h3>\
					</div>\
				</div>');
                }

            }
            aHtml.push('<div style="width:100%; text-align:center;"><a href="' + _aConfig.receiveUrl + '" class="btn" style="background:#FD6E75;width:50%; line-height:20px; color:#fff;margin:30px auto;">领取优惠券</a></div>');
            return aHtml.join('');
        },
        buildAllCouponList: function ($dom, oDataList) {
            var aHtml = [];
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center;">暂无优惠券信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                aHtml.push('<div class="col-xs-12 div_kaquan" style="padding:0px 5px;">\
					<div class="div_kaquanright" style="padding:0 0 0 10px; position:relative;width:80%;border:dashed 1px #FD6E75; box-sizing:border-box;">\
						<h3 style="margin:10px 0 0 0; height:30px; line-height:30px; color:#FD6E75; font-size:16px;">面额：' + oDataList[i].denomination + '元</h3>\
						<h3 style="margin:0px; height:24px; line-height:24px;">' + oDataList[i].title + '</h3>\
						<h3 style="margin:0px; height:24px; line-height:24px;">限额：满' + oDataList[i].limit + '元使用</h3>\
                                                <h3 style="margin:0px; height:24px; line-height:24px;">每人可领取' + oDataList[i].pretotal + '张</h3>\
                                                <h3 style="margin:0px; height:24px; line-height:24px; color:#ccc;">开始日期：' + Ui.date('Y-m-d H:i:s', oDataList[i].start_time) + '</h3>\
                                                <h3 style="margin:0px; height:24px; line-height:24px; color:#ccc;">截止日期：' + Ui.date('Y-m-d H:i:s', oDataList[i].end_time) + '</h3>\
					</div>\
                                        <div style="width:20%;float:right; line-height:162px;text-align:center; background:#FD6E75;color:#fff; font-size:16px; font-family:"黑体"" class="J-receive" data-id="' + oDataList[i].id + '">领取</div>\
				</div>');



            }
            return aHtml.join('');
        },
        appendCouponListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oCouponList.buildCouponList($dom, aData));
        },
        appendAllCouponListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oCouponList.buildAllCouponList($dom, aData));
        }
    };
    var oIndex = {
        //请求商品信息数据
        getCouponList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getCouponUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    _oCouponList.appendCouponListHtml(_$domAppendCouponList, aData.data);
                }
            });
        },
        getAllCouponList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getCouponUrl,
                datatype: 'json',
                data: _aConfig.dataAllCoupon,
                success: function (aData) {
                    _oCouponList.appendAllCouponListHtml(_$domAppendCouponList, aData.data);
                    self.bindCouponEvent();
                }
            });
        },
        bindCouponEvent: function () {
            $(".J-receive").click(function () {
                var coupon_id = $(this).data('id');
                console.log(coupon_id);
                var aSendData = _aConfig.dataReceive;
                aSendData.coupon_id = coupon_id;
                Request.ajax({
                    type: 'post',
                    url: _aConfig.getCouponUrl,
                    datatype: 'json',
                    data: aSendData,
                    success: function (aData) {
                        return Tips.showTips(aData.msg, 2);
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
    var _$domAppendCouponList = $('.J-couponDom');
    var _aConfig = {
        getCouponUrl: '',
        data: '',
        dataAllCoupon: '',
        dataReceive: '',
        receiveUrl: ''
    };
    var self = oIndex;
    module.exports = oIndex;
})

