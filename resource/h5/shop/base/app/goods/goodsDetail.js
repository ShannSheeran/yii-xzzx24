define('app/goods/goodsDetail', ["jQuery", 'Tips', 'external/spinner/jquery.Spinner', 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'external/touchSlider/TouchSlide.1.1'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/spinner/jquery.Spinner");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var loadMore = require('app/common/load_more');
    var oTouchSlide = require('external/touchSlider/TouchSlide.1.1');
    var Tips = require('Tips');//弹框插件

    //去请求商品详情信息数据的“类”
    var oDetail = {
        getDetailList: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGoodsDetailParam,
                success: function (aData) {
                    var aOdetail = aData.data.aData;
                    if (aData.status == 0) {
                        Tips.showTips(aData.msg, 3, function () {
                            return history.go(-1);
                        });
                    } else {
                        try {
                            $('.J-detailParentDiv').show();
                            _oDetailList.appendDetailListHtml(aOdetail);
                            _oDetailDesc.appendDetailDescHtml(aOdetail);
                            self.initGoodsList();
                            $('.J-showPrice').html(aOdetail.sale_price);
                            _finalAttrList.goods_id = aOdetail.id;

                            aOdetail.goods_other_img.push(aOdetail.goods_img);
                            _oSlideList.appendSlideListHtml(aOdetail.goods_other_img);
                        } catch (e) {
                        }

                        //通过找节点，去改变页面中是否包邮
                        if (aData.data.aData.is_sendfree == 1) {
                            $('.J-isfreesend').html('包邮');
                        } else {
                            $('.J-isfreesend').html('不包邮');
                        }
                        //更换小图像
                        $('.J-littlePic').attr('src', App.url.resource + aOdetail.goods_img);
                        _domGoodsDetail.find(".spinner").spinner();

                    }

                }
            });
        },
        getAppraiseList: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGoodsAppraiseParam,
                success: function (aData) {
                    if (aData.status == 0) {
                    }
                    _oGoodsAppraise.appendGoodsAppraiseHtml(aData.data.aData);
                }
            })
        },
        getPropertyList: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getGoodsPropertyParam,
                success: function (aData) {
                    _oGoodsProperty.appendGoodsPropertyHtml(aData.data);
                    _oAttrDetailList = aData.data.aAttrDetailList;


                    //点击事件（）

                    $('.J-attrListParentLabel:first').find('li').click(function () {
                        var id = $(this).find('a').data('id');
                        $(this).siblings('li').removeClass('choosed');
                        $(this).addClass('choosed');
                        var merge_id = [];
                        for (var a in _oAttrDetailList) {
                            if (_oAttrDetailList[a].attr_merge_id.indexOf(id) != -1) {
                                merge_id[a] = _oAttrDetailList[a].attr_merge_id;
                                //显示价格
                                $('.J-showPrice').html('￥' + _oAttrDetailList[a].price);
                                //这个主要是当只有一个属性的时候
                                _finalAttrList.id = _oAttrDetailList[a].id;
                            }
                        }

                        $(this).closest('.J-attrListParentLabel').siblings('.J-attrListParentLabel').find('li').each(function () {



                            //第一个属性的id
                            var xid = $(this).find('a').data('id');
                            $(this).removeClass('choosed');
                            //颜色变暗
                            $(this).find('a').css({color: '#BEC6CE'});
                            $(this).data('is_invalid', true);
                            for (var item in _oAttrDetailList) {
                                var aTempDetailAttr = _oAttrDetailList[item].attr_merge_id.split(',');
                                //解除禁用
                                if (-1 != $.inArray(xid, aTempDetailAttr) && -1 != $.inArray(id, aTempDetailAttr)) {
                                    $(this).find('a').css({color: '#337ab7'});
                                    $(this).data('is_invalid', false);
                                }
                            }
                        });
                        _setAttrDetailFirstClick();
                    });

                    //给第一个添加默认选中
                    $('.J-attrListParentLabel').find('li:first').click();

                    $('.J-attrListParentLabel:gt(0) li').click(function () {
                        if ($(this).data('is_invalid')) {
                            return;
                        }

                        $(this).siblings('li').removeClass('choosed');
                        $(this).addClass('choosed');
                        var aSelectAttrIds = [];
                        $('.J-attrListParentLabel').find('li').each(function () {
                            $(this).hasClass('choosed') && aSelectAttrIds.push($(this).find('a').data('id'));
                        });

                        for (var _attrIds in _oAttrDetailList) {
                            var aTempDetailAttr = _oAttrDetailList[_attrIds].attr_merge_id.split(',');
                            var count = 0;
                            for (var selectAttrId in aSelectAttrIds) {
                                if (-1 != $.inArray(aSelectAttrIds[selectAttrId], aTempDetailAttr)) {
                                    count++
                                }
                            }
                            //找到组合
                            if (count == aSelectAttrIds.length) {
                                //显示价格
                                $('.J-showPrice').html('￥' + _oAttrDetailList[_attrIds].price);
                                _finalAttrList.id = _oAttrDetailList[_attrIds].id;

                                break;
                            }
                        }
                    });

                    _setAttrDetailFirstClick();

                    //点击“删除按钮”隐藏属性弹框
                    $('.delete_img').click(function () {
                        $('.div_choosebox').css('display', 'none');
                    });

                    //数量的加减
                    $('.J-a_add').click(function () {
                        var value = parseInt($('.J-inputValue').val()) + 1;
                        $('.J-inputValue').val(value);
                    });
                    $('.J-a_remove').click(function () {
                        if (parseInt($('.J-inputValue').val()) == 1 || parseInt($('.J-inputValue').val()) < 0) {
                            return $('.J-inputValue').val(1);
                        }
                        var value = parseInt($('.J-inputValue').val()) - 1;
                        $('.J-inputValue').val(value);
                    })
                    //控制数量输入框只能输入正整数
                    $(".J-inputValue").keyup(function () {
                        $(this).val($(this).val().replace(/[^0-9]/g, '1'));
                    });


                }
            })
        },
        bindClickEvent: function () {
            $('.J-div_xiangqing').click(function () {
                $(this).addClass('current');
                $('.J-div_goodspingjia').removeClass('current');
                $('.div_xiangqing').css('display', 'block');
                $('.div_goodspingjia').css('display', 'none');
            });

            $('.J-div_goodspingjia').click(function () {
                $(this).addClass('current');
                $('.J-div_xiangqing').removeClass('current');
                $('.div_xiangqing').css('display', 'none');
                $('.div_goodspingjia').css('display', 'block');
            });
            //点击按钮弹出属性选择框
            $('.J-showProperty').click(function () {
                $('.div_choosebox').css('display', 'block');
            });
        },
        //加入购物车
        addGoodsCar: function () {
            $('.J-div_addtocar').click(function () {
                _finalAttrList.buy_nums = $('.J-inputValue').val();
                var aData = $.extend({}, _aConfig.addGoodsToCarParam, _finalAttrList);
                Request.ajax({
                    url: _aConfig.getApiUrl,
                    data: aData,
                    success: function (data) {
                        if (data.status == 1) {
                            Tips.showTips(data.msg, 3, function () {
                                $('.div_choosebox').css('display', 'none');
                            });
                            //加入购物车成功后，更新数量
                            self.getCartNum();
                        } else {
                            Tips.showTips(data.msg, 3);
                        }
                    }
                });
            });
        },
        //添加收藏
        addLike: function () {
            $('.J-a_collect').click(function () {
                var $this = $(this);
                Request.ajax({
                    url: _aConfig.getApiUrl,
                    data: _aConfig.addLikeParam,
                    success: function (data) {
                        //添加收藏
                        if (data.status == 1) {
                            Tips.showTips(data.msg, 3, function () {
                                $this.addClass('current');
                            });
                        }
                        //取消收藏
                        if (data.status == 2) {
                            Tips.showTips(data.msg, 3, function () {
                                $this.removeClass('current');
                            });
                        }
                    }
                });
            });
        },
        //是否收藏
        isLike: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.isLikeParam,
                success: function (data) {
                    //已收藏
                    if (data.status == 1) {
                        $('.J-a_collect').addClass('current');
                    }
                }
            });
        },
        //获取购物车中的商品的数量
        getCartNum: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.getCartNumParam,
                success: function (data) {
                    //已收藏
                    if (data.status == 1) {
                        $('.J-shoppingCarNum').html(data.data.nums);
                    }
                }
            });
        },
        //拼接立即购买的url及参数
        buyNow: function () {
            $('.J-div_tobuy').click(function () {
                var buy_nums = $('.J-inputValue').val();
                window.location.href = _aConfig.getBuyNowUrl + '?goods_id=' + _finalAttrList.goods_id + '&attr_id=' + _finalAttrList.id + '&buy_nums=' + buy_nums;

            });

        },
        initGoodsList: function () {
            _$domGoodsPic.append(_$domDetailShowDom);
            $('').appendTo(_$domGoodsPic.next());
            //为每一个img标签添加属性
            $('.J-goodsPic p img').each(function () {
                $(this).addClass('img-responsive');
                $(this).attr('alt', 'Responsive image');
            });
        },
        addViewNums: function () {
            Request.ajax({
                url: _aConfig.getApiUrl,
                data: _aConfig.addViewNumsParam,
                success: function (aData) {
                    if (aData.status == 1) {
                    }
                }
            })
        },
        //参数处理函数
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }

        }

    };
    //幻灯片列表处理“类”
    var _oSlideList = {
        buildSlideList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                var url = 'javascript:void(0);';
                aHtml.push('<li><a href="' + url + '">' + Ui.buildImage(App.url.resource + oDataList[i], undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '</a></li>');
            }
            return aHtml.join('');
        },
        appendSlideListHtml: function (oData) {
            _$domSlide.append(_oSlideList.buildSlideList(oData));
            oTouchSlide({
                slideCell: "#leftTabBox",
                slideCell:"#focusDetailBanner",
                        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true, //自动播放
                autoPage: true //自动分页 
            });
        }
    };
    //分类数据处理的"类"
    var _oDetailList = {
        //负责append
        appendDetailListHtml: function (oData) {
            _domGoodsDetail.append(_oDetailList.buildDetailList(oData));
        },
        //负责遍历数据
        buildDetailList: function (oDataList) {
            var fenxiaoyouhui = '';
            if (oDataList.market_price - oDataList.sale_price > 0) {
                fenxiaoyouhui = "";
//                fenxiaoyouhui = "<i style='background-color: #f5686d; color:#fff; padding:0 5px; border-radius:2px;'>会员优惠" + (oDataList.market_price - oDataList.sale_price) + "元</i>";
            }
            var cHtml = [];
            cHtml.push('<h3 class="h3_price">\
                        <span style="color:#F50808">￥' + oDataList.sale_price + '</span>\
                            ' + fenxiaoyouhui + '\
                        </h3>\
                        <p class="p_proname">\
                                <span>商品名称</span><b>' + oDataList.name + '</b>\
                        </p>\
                        <p class="p_proname">\
                                <a href="javascript:;"><span>' + oDataList.sale_nums + '</span>人已购买</a>\
                        </p>');
            if (oDataList.pcate == 251) {
                cHtml.push('<h4>\
                    <span style="float:left;display: inline-block;width: 25%;color:#898888;vertical-align: top;font-size: 14px; ">商品数量</span>\
                    <span class="increaseAndDecrease spinner J-goodsNums" style="float:left; margin-top:-5px;"></span>\
                </h4>\
                ');
            }

            return cHtml.join('');

        }
    };
    //商品描述
    var _oDetailDesc = {
        //负责append
        appendDetailDescHtml: function (oData) {
            _$domGoodsDesc.append(_oDetailDesc.buildDetailDesc(oData));
            _$domDetailShowDom = oData.detail;
        },
        buildDetailDesc: function (oDataList) {
            var aHtml = [];
            aHtml.push('<p><span>[产品描述]</span> ' + oDataList.desc + '</p>');
            return aHtml.join('');
        },
    };
    //商品评论
    var _oGoodsAppraise = {
        //append
        appendGoodsAppraiseHtml: function (oData) {
            _$domGoodsAppraise.append(_oGoodsAppraise.buildGoodsAppraise(oData));
        },
        buildGoodsAppraise: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<div class="div_atouxiang">\
                                    <a href="" class="a_touxiang">\
                                            <img src="' + App.url.resource + oDataList[i].photos + '" class="img-responsive" alt="Responsive image">\
                                    </a>\
                            </div>\
                            <div class="div_ppingjia">\
                                    <h3>' + oDataList[i].nickname + '</h3>\
                                    <p>' + oDataList[i].content + '</p>\
                                    <h5>' + Ui.date('Y-m-d', oDataList[i].create_time) + '</h5>\
                            </div>');
            }
            return aHtml.join('');
        }
    };
    //商品属性
    var _oGoodsProperty = {
        //append

        appendGoodsPropertyHtml: function (oData) {
            if (oData.length == 0) {
                return _$domGoodsProperty.append(_oGoodsProperty.buildNoGoodsProperty());
            }

            _$domGoodsProperty.append(_oGoodsProperty.buildGoodsProperty(oData));
        },
        buildGoodsProperty: function (oDataList) {
            var oDataList = oDataList.aAttrGroupList;
            var aHtml = [];

            for (var i in oDataList) {
                var aItem = oDataList[i];

                aHtml.push('<p class="font14">' + i + '</p><ul class="sys_spec_text J-attrListParentLabel">');
                for (var j in aItem) {
                    aHtml.push('<li  class="choose_property"><a href="javascript:;"  data-id = "' + j + '" title="' + aItem[j] + '">' + aItem[j] + '</a></li>');
                }
                aHtml.push('</ul>');
            }
            aHtml.push('<div class="form_number">\
                                <span class="font14">数量</span>\
                                <span class="floatright">\
                                <a href="javascript:;" class=" a_add J-a_remove font16 color6">-</a>\
                                        <input type="text" class="J-inputValue" value="1">\
                                         <a href="javascript:;" class="a_remove J-a_add font16 color6">+</a>\
                                </span>\
                            </div>');
            return aHtml.join('');
        },
        appendNoGoodsPropertyHtml: function () {
            _$domGoodsProperty.append(_oGoodsProperty.buildNoGoodsProperty());
        },
        buildNoGoodsProperty: function () {
            var aHtml = [];
            aHtml.push('<div class="form_number">\
                                <span class="font14">数量</span>\
                                <span class="floatright">\
                                        <a href="javascript:;" class="a_add J-a_remove font16 color6">-</a>\
                                        <input type="text" class="J-inputValue" value="1">\
                                <a href="javascript:;" class="a_remove J-a_add font16 color6">+</a>\
                                </span>\
                            </div>');
            return aHtml.join('');
        }
    };
    //默认选中第一个可选项
    function _setAttrDetailFirstClick() {
        var __taggg = false;
        $('.J-attrListParentLabel:gt(0)').find('li').each(function () {
            if (!__taggg && !$(this).data('is_invalid')) {
                $(this).click();
                __taggg = true;
            }

        });
    }
    var _finalAttrList = {'goods_id': 0, 'id': 0};
    var _$domGoodsAppraise = $('.J-goodspingjia');
    var _$domGoodsProperty = $('.J-property');
    var _domGoodsDetail = $('.J-goodsDetail');
    var _$domGoodsDesc = $('.J-goodsDesc');
    var _$domGoodsPic = $('.J-goodsPic');
    var _$domLoadMore = $('.J-loadMore');
    var _$domDetailShowDom = null;
    var _$domSlide = $('.J-slideList');

    var _aConfig = {
        getApiUrl: '',
        getGoodsDetailParam: '',
        getGoodsAppraiseParam: '',
        getGoodsPropertyParam: '',
        addGoodsToCarParam: '',
        addLikeParam: '',
        isLikeParam: '',
        getCartNumParam: '',
        getBuyNowUrl: '',
        addViewNumsParam: ''
    };
    var _oAttrDetailList = null;
    var _aCountry = '';
    var self = oDetail;

    module.exports = oDetail;

});