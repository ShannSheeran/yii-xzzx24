define(["jQuery",'artDialog', 'app/common/Request', 'app/common/Ui', 'app/common/load_more','external/address/address'], function (require, exports, module) {
    var $  = require("jQuery");
    var dialog = require('artDialog');
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var addressInit   = require('external/address/address');

    var loadMore = require('app/common/load_more');

    //去请求分类信息数据的“类”
    var oBargain = {
        initGoodsList: function () {
            //处理加载更多
            loadMore(_$domGoodsList, {loadDownFn: function (oLoadMore) {
                    self.getGoodsList(_$domAppendGoodList, _aConfig.getGoodsListUrl, oLoadMore);
                }});

            self.startBargain();
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
                oLoadMore.resetload();
                return false;
            }

            if (url == undefined) {
                url = _aConfig.getGoodsListUrl;
            }
            Request.ajax({
                type: 'get',
                url: url + '&page=' + page,
                success: function (aData) {
                    if (aData.data.length == 0) {
                        oLoadMore.noData();
                        oLoadMore.resetload();
                        $dom.data('page', 0);
                    } else {
                        page++;
                        $dom.data('page', page);
                    }
                    _oGoodsList.appendGoodsListHtml($dom, aData.data);
                    oLoadMore.resetload();
                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    oLoadMore.resetload();
                }
            });
        },
        //绑定发起按钮
        startBargain: function () {
            _$domGoodsList.on('click', '.J-startBargain', function () {
                var goods_id = $(this).data('goods_id');
                    Request.ajax({
                    type: 'get',
                    url: _aConfig.checkBargainUrl+'&goods_id='+goods_id,
                    success: function (aData){
                        if(aData.data.is_follow == 1){
                            return comfireTips('您还未关注公众号,点击确定去关注公众号！',function(){
                                if(aData.data.url != undefined){
                                    return location.href = aData.data.url;
                                }
                            });
                        }
                        if(aData.status == 0){
                            if(aData.data.status == 1){
                                aData.msg = '你参与本次活动已经完成，请到个人中心留意物流信息';
                            }                            
                            comfireTips(aData.msg,function(){
                                if(aData.data.url != undefined){
                                    return location.href = aData.data.url;
                                }
                                
                            });
                        }else{                           
                            _showAddressModal(goods_id);
                            addressInit('cmbProvince', 'cmbCity', 'cmbArea');
                            
                        }
                    }
               });
               
                
            });
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
    //商品列表处理“类”
    var _oGoodsList = {
        buildGoodsList: function ($dom, oDataList) {
            var aHtml = [];
            for (var i in oDataList) {

                aHtml.push('<div class="col-xs-6 div_pro">\
                                    <a href="' + _aConfig.goodsDetailUrl + oDataList[i].id + '" class="a_picpro">' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb) + '</a>\
                                    <h2 class="font14 colorf40">' + oDataList[i].title + '</h2>\
                                    <h3><span class="font14 colorf40 floatl">' + oDataList[i].marketprice + '</span><a href="javascript:;" data-goods_id = "' + oDataList[i].id + '" class="a_bargainbtn font12 color1 textc floatr J-startBargain J-click">发起砍价</a></h3>\
                            </div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function ($dom, aData) {
            //append商品列表
            $dom.append(_oGoodsList.buildGoodsList($dom, aData));
        }
    };
    
    function showTip(msg) {
        var r = dialog({
            content: msg
        });
        r.show();
        setTimeout(function () {
            r.close().remove();
        }, 2000);
        return;
    }

    /**
     * 去除为空的key
     * @param {type} aData 数组
     * @returns {undefined}
     */
    function clearDataNullWorth(aData) {
        for (var i in aData) {
            if (aData[i] == '') {
                delete aData[i];
            }
        }
    }

    /**
     * 将serializeArray 得到的数据变成key_value格式
     * @param {type} aData serializeArray数组
     * @returns {undefined}
     */
    function getFormJson(aData) {
        var oData = {};
        $.each(aData, function () {
            if (oData[this.name] !== undefined) {
                if (!oData[this.name].push) {
                    oData[this.name] = [oData[this.name]];
                }
                oData[this.name].push(this.value || '');
            } else {
                oData[this.name] = this.value || '';
            }
        });
        return oData;
    }
    
function ajaxSend($formDom, ajaxOption,$clickDom) {
    if ($formDom.attr('url') == undefined && ajaxOption.url == undefined) {
        $.error('url is not defined');
    }
    var aData = getFormJson($formDom.serializeArray());
    for (var i in aData) {
        var $this = $formDom.find('input[name="' + i + '"]');
        if ($this.length == 0) {
            $this = $formDom.find('select[name="' + i + '"]');
        }
        if ($this.length == 0) {
            $this = $formDom.find('textarea[name="' + i + '"]');
        }
        if ($this.data('required')) {
            if ($.trim($this.val()) == "") {
               showTip("该字段不能为空");
                $this.focus();
                return;
            }
        }
        var pattern = $this.data('pattern');
        if (pattern !== undefined && $this.val() != "") {
            if (!new RegExp(pattern).test($this.val())) {
                if ($this.data('error_info') != undefined) {
                    showTip($this.data('error_info'));
                } else {
                    showTip("请正确填写该字段");
                }
                $this.focus();
                return;
            }
        }
    }
    clearDataNullWorth(aData);
     
    if($clickDom != undefined){
     if(ajaxOption.beforeSend != undefined){
         var beforeSend = ajaxOption.beforeSend;
        ajaxOption.beforeSend = function () {           
            if ($clickDom.data('status') != undefined && !$clickDom.data('status')) {
                return false;
            }
            $clickDom.html('数据提交中..');
            $clickDom.data('status', false);
             beforeSend();
        }
     }       
    if(ajaxOption.success != undefined){
        var success = ajaxOption.success;
        ajaxOption.success = function(aResult){            
            $clickDom.html('提交完成');
            $clickDom.data('status', true);
            success(aResult);
        }
    }
    
    }

   
    ajaxOption.data = aData;
    Request.ajax(ajaxOption);
}
    
    function comfireTips(msg,callback){
        var d = dialog({
            title: '提示',
            content: msg,
            okValue: '确定',
            cancel: false,
            ok: function () {
                callback();
                return false;
            }
        });
        d.showModal();
    }
    
    function _showAddressModal(goods_id){
        var d = dialog({            
            fixed: true,
            title: '收货信息',
            content: '<form class="form-horizontal J-bargainFrom" role="form">\
                <div class="form-group">\
                   <label  class="col-xs-3 control-label" style="padding-right: 0px">名字:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                      <input type="text" name="true_name" class="form-control" \
                         placeholder="请输入名字" data-required="true">\
                   </div>\
                </div>\
                <div class="form-group">\
                   <label class="col-xs-3 control-label" style="padding-right: 0px">手机:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                      <input type="text"  name="phone" class="form-control" \
                         placeholder="手机号" data-required="true" data-pattern="^1\\d{10}$">\
                   </div>\
                </div>\
                <div class="form-group">\
                   <label class="col-xs-3 control-label" style="padding-right: 0px">省份:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                   <select id="cmbProvince" name="province"></select>\
                   </div>\
                </div>\
                <div class="form-group">\
                   <label class="col-xs-3 control-label" style="padding-right: 0px">市级:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                   <select id="cmbCity" name="city"></select>\
                   </div>\
                </div>\
                <div class="form-group">\
                   <label class="col-xs-3 control-label" style="padding-right: 0px">地区:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                   <select id="cmbArea" name="area"></select>\
                   </div>\
                </div>\
                <div class="form-group">\
                   <label class="col-xs-3 control-label" style="padding-right: 0px">地址:</label>\
                   <div class="col-xs-9" style="padding-left: 0px">\
                      <input type="text" class="form-control"  placeholder="详细地址"  name="address" data-required="true">\
                   </div>\
                </div>\
                <div class="form-group">\
                   <div class="col-xs-12">\
                      <button type="button" class="btn btn-primary btn-block J-bargainBtn">提交</button>\
                   </div>\
                </div>\
             </form>'
        });
        d.showModal();
        _$dialog = d;
        
        $('.J-bargainBtn').click(function(){
                ajaxSend($('.J-bargainFrom'),{
                    type: 'get',
                    url: _aConfig.startBargainUrl + goods_id,
                    beforeSend:function(){},
                    success: function (aData) {
                        if (aData.status == 1) {
                            _$dialog.close().remove();
                           comfireTips('你已成功发起砍价，分享给好友帮你砍价吧',function(){
                               return location.href = aData.data.url;
                           });
                        }
                        
                        return showTip(aData.msg);
                       
                    }
                },$(this));
        });
        
    }


    var _$domGoodsList = $('.J-goodsList');
    var _$domAppendGoodList = $('.J-goodsDom');
    var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        getGoodsListUrl: '',
        startBargainUrl: '',
        checkBargainUrl: ''
    };
    var self = oBargain;
    var _$dialog = null;
    module.exports = oBargain;
});

