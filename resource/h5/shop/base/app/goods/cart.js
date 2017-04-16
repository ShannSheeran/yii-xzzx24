define("app/goods/cart",["jQuery", 'Tips', 'sitebase', 'external/spinner/jquery.Spinner', 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/spinner/jquery.Spinner");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var dialog = require('artDialog');
    var Tips = require('Tips');
    var oIndex = require('sitebase');


    //商品列表处理“类”
    var _oCartGoodsList = {
        buildGoodsList: function (oDataList) {
            if (oDataList.length == 0) {
                return "<div class='col-xs-12'><p class=\"text-center\" style='line-height:50px;'>购物车数据为空哦亲！先去选购商品吧！</p></div>";
            }
            var aHtml = [];
            var aData = oDataList;
            for (var i in aData) {
                var aGoods = aData[i].goods;
                aHtml.push('<div class="col-xs-12 div_goods J-goodsItem" data-cart_id="' + aData[i].id + '" data-goods_id="' + aGoods.id + '" data-nums=' + aData[i].total + ' data-price="' + aGoods.sale_price + '">\
				<div class="row">\
					<div class="col-xs-2 div_inshopcar_left">\
						<input type="checkbox">\
						<label class="J-goodCheck" data-goods_id="' + aData[i].id + '"></label>\
					</div>\
					<div class="col-xs-4 div_inshopcar_mid"><a href="' + _aConfig.goodsDetailUrl.replace('____tag',aGoods.id) + '">' + Ui.buildImage(App.url.resource + aGoods.goods_img, undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '</a></div>\
					<div class="col-xs-6 div_inshopcar_right">\
						<p class="font14 fontColor4"><a href="' + _aConfig.goodsDetailUrl.replace('____tag',aGoods.id) + '">' + aGoods.name + '</a></p>\
						<h3 >\
							<span class="price">￥<b>' + aGoods.sale_price + '</b></span>\
						</h3>\
						<h4>\
							<s class="J-deleteGoods"></s>\
							<span class="increaseAndDecrease spinner J-goodsNums"></span>\
						</h4>\
					</div>\
				</div>\
			</div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function (aData) {
            //append商品列表
            _$cartDom.find('.J-goodsCart').append(_oCartGoodsList.buildGoodsList(aData));
        },
        appendCarStatus: function (aData, totalprice) {
            var nums = 0;
            var totalprice = 0;
//            for (var i in aData) {
//                nums += Number(aData[i].total)
//            }
            $('<div class="row">\
				<div class="col-xs-3 div_inshopcar_left">\
					<input type="checkbox" name="vehicle">\
					<label class="J-check"></label>\
					<span class="span_allcheck ">全选</span>\
				</div>\
				<div class="col-xs-5 div_total" style="padding-left:0px;">\
					<h3 class="font16">合计: <span class="font14">￥<span class="J-totalPrice">' + totalprice + '<span></span></h3>\
				</div>\
				<div class="col-xs-4 div_btnPay">\
					<a href="javascript:;" class="font14 fontColorf J-pay">结算(<span class="J-cartAllNums">' + nums + '</span>)</a>\
				</div>\
			</div>').appendTo(_$cartDom.find('.J-cartStatus'));
        }
    };

    var oCart = {
        getCartGodsList: function () {
            Request.ajax({
                url: _aConfig.getCartUrl,
                data: _aConfig.data,
                success: function (aData) {
                    
                    if(aData.data.data.length>0){
                        $('.J-clear').append('<span class="textright J-deleteAllGoods a_qk">清空</span>')
                    }
                    console.log(aData.data.data);
                    _oCartGoodsList.appendGoodsListHtml(aData.data.data);
                    _oCartGoodsList.appendCarStatus(aData.data.data, aData.data.totalprice);
                    self.bindEvent();
                },
            });
        },
        updateCartByGoodsId: function (oData) {
            var aSendUpdateData = _aConfig.updateData;
            aSendUpdateData.cartId = oData.cart_id;
            aSendUpdateData.goodsId = oData.goods_id;
            aSendUpdateData.nums = oData.nums;
            Request.ajax({
                url: _aConfig.getCartUrl,
                data: aSendUpdateData,
                success: function (aData) {
                    //oIndex.appendNavCartNums(aData.data.total);
                    if (aData.status != 1) {
                        return Tips.showTips(aData.msg, 2);
                    }
                },
            });
        },
        bindEvent: function () {
            _$cartDom.find(".spinner").spinner();

            //给加减插件加默认值
            _$cartDom.find(".J-goodsItem").each(function () {
                var $this = $(this);
                $this.find('.J-goodsNums input').val($this.data('nums'));
            });

            //复选框算价格
            _$cartDom.find(".div_inshopcar_left label").click(function () {
                if (!$(this).hasClass("checked")) {
                    $(this).addClass("checked");
                } else {
                    $(this).removeClass("checked");
                }
                _countTatolCartNumsAndPrice();
            });

            // 全选或者取消全选
            _$cartDom.find(".J-check").click(function () {
                var $this = $(this);
                if ($this.hasClass('checked')) {
                    _$cartDom.find('.J-goodCheck').each(function () {
                        $(this).addClass('checked');
                    });
                } else {
                    _$cartDom.find('.J-goodCheck').each(function () {
                        $(this).removeClass("checked");
                    });
                }
                _countTatolCartNumsAndPrice();
            });

            //每个购物车商品加减数量通知总数量加减
            _$cartDom.find('.J-goodsItem .J-goodsNums a').each(function () {
                //监听加减操作
                $(this)[0].addEventListener('click', function () {
                    var $goodsItemDom = $(this).closest('.J-goodsItem');
                    var itemNums = $(this).closest('.J-goodsNums').find('input').val();
                    if (itemNums == 0) {
                        $(this).closest('.J-goodsNums').find('input').val(1);
                        return Tips.showTips('数量不能少于1！', 2);
                    }
                    //更新后台数量
                    self.updateCartByGoodsId({cart_id: $goodsItemDom.data('cart_id'), goods_id: $goodsItemDom.data('goods_id'), nums: itemNums});
                    //只有勾选了才算价格
                    if (!$goodsItemDom.find('.J-goodCheck').hasClass('checked')) {
                        return;
                    }
                    _countTatolCartNumsAndPrice();
                });
            });

            _$cartDom.find('.J-deleteGoods').click(function () {
                var $this = $(this);
                var $goodsItemDom = $this.closest('.J-goodsItem');
                var cartId = $goodsItemDom.data('cart_id');
                var aSendData = _aConfig.deleteOneData;
                aSendData.cartId = cartId;
                Tips.askIips('你确定要删除该商品吗？', {
                    rBtnTitle: '确定',
                    lBtnTitle: '取消',
                    rFn: function () {
                        Request.ajax({
                            url: _aConfig.getCartUrl,
                            data: aSendData,
                            success: function (aData) {
                                $goodsItemDom.remove();
                                return Tips.showTips('删除成功！', 2, function () {
                                    //oIndex.appendNavCartNums(aData.data.total);
                                });
                            }
                        });
                        return false;
                    },
                });
            });
            $('.J-deleteAllGoods').click(function () {
                var aSendData = _aConfig.deleteAllData;
                Tips.askIips('你确定要清空购物车的商品吗？', {
                    rBtnTitle: '确定',
                    lBtnTitle: '取消',
                    rFn: function () {
                        Request.ajax({
                            url: _aConfig.getCartUrl,
                            data: aSendData,
                            success: function (aData) {
                                return Tips.showTips('删除成功！', 2, function () {
                                    _$cartDom.empty().append("<div class='col-xs-12'><p class=\"text-center\" style='line-height:50px;'>购物车数据为空哦亲！先去选购商品吧！</p></div>");
                                    //oIndex.appendNavCartNums(aData.data.total);
                                });
                            }
                        });
                        return false;
                    },
                });
            });

            //点击去结算
            $('.J-pay').click(function () {
                var _aCartGoodsPayData = [];
                _$cartDom.find('.J-goodCheck').each(function () {
                    if ($(this).hasClass('checked')) {
                        var nums = $(this).closest('.J-goodsItem').find('.J-goodsNums input').val();
                        _aCartGoodsPayData.push($(this).closest('.J-goodsItem').data('cart_id'));
                    }
                });
                console.log(_aCartGoodsPayData);

                if (_aCartGoodsPayData.length == 0) {
                    return Tips.showTips('请选择要付款的商品！', 2, function () {
                                });
                }
                var aSelectData = _aConfig.selectData;
                aSelectData.cartIds = _aCartGoodsPayData;
                Request.ajax({
                    url: _aConfig.getCartUrl,
                    data: aSelectData,
                    success: function (aData) {
                        console.log(aData);
                        if (aData.status == 1) {
                            window.location = _aConfig.payCartUrl;
                        }
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
        }

    };

    /**
     * 算出所有被选中的商品价格和数量
     */
    function _countTatolCartNumsAndPrice() {
        var totalPrice = 0.00;
        var totalNums = 0;
        //获取所有数量和价格
        _$cartDom.find('.J-goodsItem .J-goodCheck').each(function () {
            var $this = $(this);
            if ($this.hasClass('checked')) {
                var nums = $(this).closest('.J-goodsItem').find('.J-goodsNums input').val();
                totalNums = totalNums + Number(nums);
                var price = $(this).closest('.J-goodsItem').data('price');

                //这次的价格 100 倍
                totalPrice = (((parseFloat(totalPrice).toFixed(2) * 100) + (nums * parseFloat(price)).toFixed(2) * 100) / 100).toFixed(2);
            }
        });

        var _$totalDom = _$cartDom.find('.J-cartStatus .J-cartAllNums');
        var _$totalPrice = _$cartDom.find('.J-cartStatus .J-totalPrice');
        _$totalPrice.html(totalPrice);
        _$totalDom.html(totalNums);

    }
    var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        getCartUrl: '',
        removeCartUrl: '',
        updateCartUrl: '',
        payCartUrl: '',
        selectCartGoods: '',
        data: '',
        deleteOneData: '',
        deleteAllData: '',
        updateData: '',
        selectData: ''
    };
    var self = oCart;
    module.exports = oCart;
    var _$cartDom = $('.J-carGoodsDom');
})