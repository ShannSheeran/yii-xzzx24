define('app/agent/apply', ["jQuery", 'Tips', 'external/spinner/jquery.Spinner', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/spinner/jquery.Spinner");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');


    //商品列表处理“类”
    var _oCommissionCommissionList = {
        buildCommissionList: function (oDataList) {
            if (oDataList.length == 0) {
                return "<div class='col-xs-12'><p class=\"text-center\" style='line-height:50px;'>暂无可提现佣金！</p></div>";
            }
            var aHtml = [];
            var aData = oDataList;
            for (var i in aData) {
                aHtml.push('<div class="col-xs-12 div_goods J-commissionItem" data-order_id="' + aData[i].order_id + '" data-id="'+ aData[i].id+'"  data-sum="' + aData[i].sum + '" style="padding-bottom:5px; margin-top:10px;">\
				<div class="row">\
					<div class="col-xs-2 div_inshopcar_left">\
						<input type="checkbox">\
						<label class="J-commissionCheck" data-commission_id="' + aData[i].id + '"></label>\
					</div>\
					<div class="col-xs-6 div_inshopcar_right" style="width:90%;">\
						<p class="font14 fontColor4"> 订单编号： ' + aData[i].order_id + '</p>\
						<p class="font14 fontColor4"> 创建时间： '+Ui.date('Y-m-d H:i:s',aData[i].create_time)+'</p>\
						<h3 style="margin:0px; text-align:right;">\
							<span class="price">佣金：￥<b>' + aData[i].sum + '</b></span>\
						</h3>\
					</div>\
				</div>\
			</div>');
            }
            return aHtml.join('');
        },
        appendCommissionListHtml: function (aData) {
            //append商品列表
            _$commissionDom.find('.J-commission').append(_oCommissionCommissionList.buildCommissionList(aData));
        },
        appendCarStatus: function () {
            var nums = 0;
            var totalprice = 0;
            $('<div class="row">\
				<div class="col-xs-3 div_inshopcar_left">\
					<input type="checkbox" name="vehicle">\
					<label class="J-check" style="margin-top:-15px;"></label>\
					<span class="span_allcheck ">全选</span>\
				</div>\
				<div class="col-xs-5 div_total" style="padding-left:0px;">\
					<h3 class="font16">合计: <span class="font14">￥<span class="J-totalPrice">' + totalprice + '<span></span></h3>\
				</div>\
				<div class="col-xs-4 div_btnPay">\
					<a href="javascript:;" class="font14 fontColorf J-apply">提现</a>\
				</div>\
			</div>').appendTo(_$commissionDom.find('.J-commissionStatus'));
        }
    };

    var oCommission = {
        getCommissionList: function () {
            Request.ajax({
                url: _aConfig.getCommissionUrl,
                data: _aConfig.data,
                success: function (aData) {
                    _oCommissionCommissionList.appendCommissionListHtml(aData.data);
                    _oCommissionCommissionList.appendCarStatus();
                    self.bindEvent();
                },
            });
        },
        updateCommissionByCommissionId: function (oData) {
            var aSendUpdateData = _aConfig.updateData;
            aSendUpdateData.commissionId = oData.commission_id;
            aSendUpdateData.commissionId = oData.commission_id;
            aSendUpdateData.nums = oData.nums;
            Request.ajax({
                url: _aConfig.getCommissionUrl,
                data: aSendUpdateData,
                success: function (aData) {
                    //oIndex.appendNavCommissionNums(aData.data.total);
                    if (aData.status != 1) {
                        return Tips.showTips(aData.msg, 2);
                    }
                },
            });
        },
        bindEvent: function () {
            _$commissionDom.find(".spinner").spinner();



            //复选框算价格
            _$commissionDom.find(".div_inshopcar_left label").click(function () {
                if (!$(this).hasClass("checked")) {
                    $(this).addClass("checked");
                } else {
                    $(this).removeClass("checked");
                }
                _countTatolCommissionNumsAndPrice();
            });

            // 全选或者取消全选
            _$commissionDom.find(".J-check").click(function () {
                var $this = $(this);
                if ($this.hasClass('checked')) {
                    _$commissionDom.find('.J-commissionCheck').each(function () {
                        $(this).addClass('checked');
                    });
                } else {
                    _$commissionDom.find('.J-commissionCheck').each(function () {
                        $(this).removeClass("checked");
                    });
                }
                _countTatolCommissionNumsAndPrice();
            });


            //点击去结算
            $('.J-apply').click(function () {
                var _aCommissionData = [];
                var totalPrice = $('.J-totalPrice').html();
                _$commissionDom.find('.J-commissionCheck').each(function () {
                    if ($(this).hasClass('checked')) {
                        _aCommissionData.push($(this).closest('.J-commissionItem').data('id'));
                    }
                });

                if (_aCommissionData.length == 0) {
                    return Tips.showTips('请选择提现的佣金！', 2, function () {
                    });
                }
                var aSelectData = _aConfig.applyData;
                aSelectData.commissionIds = _aCommissionData;
                aSelectData.total = totalPrice;
                Request.ajax({
                    url: _aConfig.getCommissionUrl,
                    data: aSelectData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            return Tips.showTips('提现成功！', 2, function(){
                               location.href = _aConfig.indexUrl;
                            });
                        }
                        return Tips.showTips(aData.msg,2);
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

    /**
     * 算出所有被选中的商品价格和数量
     */
    function _countTatolCommissionNumsAndPrice() {
        var totalPrice = 0.00;
        //获取所有数量和价格
        _$commissionDom.find('.J-commissionItem .J-commissionCheck').each(function () {
            var $this = $(this);
            if ($this.hasClass('checked')) {
                var price = $(this).closest('.J-commissionItem').data('sum');
                //这次的价格 100 倍
                totalPrice = ((totalPrice + price)).toFixed(2);
            }
        });

        var _$totalPrice = _$commissionDom.find('.J-commissionStatus .J-totalPrice');
        _$totalPrice.html(totalPrice);

    }
    var _aConfig = {
        getCommissionUrl: '',
        data: '',
        applyData: '',
        indexUrl:''
    };
    var self = oCommission;
    module.exports = oCommission;
    var _$commissionDom = $('.J-CommissionDom');
})