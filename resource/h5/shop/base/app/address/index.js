define('app/address/index', ["jQuery", 'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more', 'external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件

    //商品列表处理“类”
    var _oAddressList = {
        buildAddressList: function ($dom, oDataList) {
            var aHtml = [];
            if (oDataList.length == 0) {
                aHtml.push('<div style="text-align:center; display:inline-block; width:100%; line-height:50px;">暂无地址信息</div>');
                return aHtml.join('');
            }
            for (var i in oDataList) {
                var aFront='';
                var aBehind=''
                if(_aConfig.isBuy){
                    aFront='<a href="'+_aConfig.lastUrl+'&address_id='+oDataList[i].id+'">';
                    aBehind='</a>'
                }
                aHtml.push(' <div class="col-xs-12 div_addressimfor" id="address_'+oDataList[i].id+'">'+aFront+'\
                <h2 class="font14 fontColor4"><span>' + oDataList[i].receiver + '</span><b >' + oDataList[i].phone + '</b></h2>\
                <p class="font14 fontc3">' + oDataList[i].province + '&nbsp;&nbsp;' + oDataList[i].city + '&nbsp;&nbsp;' + oDataList[i].area + '&nbsp;&nbsp;' + oDataList[i].address + '</p>'+aBehind+'\
                <h3>\
                    <span class="a_btnrevise J-editOne" data-id="' + oDataList[i].id + '"></span>\
                    <span class="a_btndelete J-deleteOne" data-id="' + oDataList[i].id + '"></span>\
                </h3>\
            </div>');

            }
            return aHtml.join('');
        },
        appendAddressListHtml: function ($dom, aData) {
            //append商品列表
            $dom.empty().append(_oAddressList.buildAddressList($dom, aData));
        },
        buildAddressEdit: function (oData) {
            var id = '', phone = '', receiver = '', province = '', city = '', area = '', is_default = 0, address = '', isDefault = '';
            if (oData != null) {
                id = oData.id;
                phone = oData.phone;
                province = oData.province;
                city = oData.city;
                area = oData.area;
                address = oData.address;
                is_default = oData.is_default;
                receiver = oData.receiver;
                if (oData.is_default == 1) {
                    isDefault = "checked='checked'";
                }
            }
            var xhtml = "<div class='address_content'>\
                                        <form class='J-address'>\
                                            <ul class='clearfix'>\
                                                <li>\
                                                    <div class='label_item'>\
                                                        <label>姓名</label>\
                                                    </div>	\
                                                    <div class='input_container'>\
                                                        <div class='text_container'>\
                                                            <input type='text' name='receiver' data-required='true' placeholder='2-8个字' value='" + receiver + "' />\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                                <li>\
                                                    <div class='label_item'>\
                                                        <label>手机号码</label>\
                                                    </div>\
                                                    <div class='input_container'>\
                                                        <div class='text_container'>\
                                                            <input type='text' placeholder='收货人手机号码' data-required='true' name='phone' value='" + phone + "'/>\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                                <li>\
                                                    <div class='label_item'>\
                                                        <label>所在地区</label>\
                                                    </div>\
                                                    <div class='input_container'>\
                                                        <div class='text_container'>\
                                                            <input id='pop_up' readonly='readonly' type='text' data-required='true' value='" + province + city + area + "' placeholder='省市区信息'/>\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                                <li>\
                                                    <div class='label_item'>\
                                                        <label>详细地址</label>\
                                                    </div>\
                                                    <div class='input_container'>\
                                                        <div class='text_container'>\
                                                            <input type='text' placeholder='街道小区详细地址' data-required='true' name='address' value='" + address + "'/>\
                                                        </div>\
                                                        <input name='province' type='hidden' value='" + province + "' data-required='true'>\
                                                        <input name='city' type='hidden' value='" + city + "' data-required='true'>\
                                                        <input name='area' type='hidden' value='" + area + "' data-required='true'>\
                                                        <notempty name='address.id'>\
                                                            <input name='address_id' type='hidden' value='" + id + "'>\
                                                        </notempty>\
                                                    </div>\
                                                </li>\
                                                <li>\
                                                    <div class='label_item'>\
                                                        <label>设为默认</label>\
                                                    </div>\
                                                    <div class='input_container'>\
                                                        <div class='text_container'>\
                                                            <label>\
                                                                    <input id='default' type='checkbox' name='isdefault' value='" + is_default + "' " + isDefault + " class='ios-switch green' />\
                                                                    <div>\
                                                                    <div></div>\
                                                                </div>\
                                                            </label>\
                                                        </div>\
                                                    </div>\
                                                </li>\
                                            </ul>\
                                            <span class='J-registerEvent btn' style='width: 40%;background: #000;color: #fff; margin: 10px 5% 0px 5%;padding: 0px;line-height: 24px; float:left; display:inline-block;'>保存</span><span class='J-cancel btn' style='width: 40%;background: #000;color: #fff; margin: 10px 5% 0px 0px;padding: 0px;line-height: 24px;float:right; display:inline-block;'>取消</span>\
                                        </form>\
                                    </div>\
                                    <div id='msk_bg' class='msk_bg'></div>\
                                            <div id='city' class='content-con'>\
                                                    <div class='content-line'></div>\
                                                    <div class='content-title'>\
                                                            <span class='fl button btn-cancel'>取消</span>\
                                                            <span id='btn-ok' class='fr button btn-ok'>确定</span>\
                                                    </div>\
                                                    <div class='li-content' id='li_1'>\
                                                            <ul id='s_1'>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                            </ul>\
                                                    </div>\
                                                    <div class='li-content' id='li_2'>\
                                                            <ul id='s_2'>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                            </ul>\
                                                    </div>\
                                                    <div class='li-content' id='li_3'>\
                                                            <ul id='s_3'>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                                    <li></li>\
                                                            </ul>\
                                                    </div>\
                                            </div>";
            Tips.showLayer(xhtml, function (o) {
                self.bindEvent(o);
            });

        }
    };
    var oIndex = {
        //请求商品信息数据
        getAddressList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getAddressUrl,
                datatype: 'json',
                data: _aConfig.data,
                success: function (aData) {
                    _oAddressList.appendAddressListHtml(_$domAppendAddressList, aData.data);
                    self.bindAddressEvent();
                    if(_aConfig.isBuy){
                        self.bindBuyEvent();
                    }
                }
            });
        },
        bindBuyEvent:function(){
            $('#address_'+_aConfig.addressId).css('background','#eee');
        },
        bindAddressEvent: function () {
            $('.J-deleteOne').click(function () {
                var $this = $(this);
                var addressId = $this.data('id');
                var aSendData = _aConfig.deleteData;
                aSendData.address_id = addressId;

                Tips.askIips('你确定要删除该地址吗？', {
                    rBtnTitle: '确定',
                    lBtnTitle: '取消',
                    rFn: function () {
                        Request.ajax({
                            url: _aConfig.getAddressUrl,
                            data: aSendData,
                            success: function (aData) {
                                Tips.showTips('已经成功删除该地址！', 2, function () {
                                    $this.parents('.div_addressimfor').remove();
                                });
                            },
                        });
                        return false;
                    },
                    rPramater: {id: 999},
                    lPramater: {id: 100},
                });
            });
            $('.J-editOne').click(function () {
                var id = $(this).data('id');
                var aSendData = _aConfig.dataOne;
                aSendData.address_id = id;
                Request.ajax({
                    type: 'post',
                    url: _aConfig.getAddressUrl,
                    datatype: 'json',
                    data: aSendData,
                    success: function (aData) {
                        _oAddressList.buildAddressEdit(aData.data);
                    }
                });

            });
            $('.J-addOne').click(function () {
                _oAddressList.buildAddressEdit();
            });
        },
        bindEvent: function (o) {
            $('.J-registerEvent').click(function () {
                var $this = $(this);
                Request.ajaxSend($('.J-address'), {
                    url: _aConfig.getAddressUrl,
                    data: _aConfig.editData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            o.close();
                            self.getAddressList();
                            return Tips.showTips(aData.msg, 3);
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                }, $this);
            });
            $('.J-cancel').click(function () {
                o.close();
            });
            $("#pop_up").click(function () {
                $(".msk_bg").show();
                $("#city").addClass("city_up").removeClass("city_down");
            });
            $(".btn-cancel,.msk_bg").click(function () {
                $("#city").addClass("city_down").removeClass("city_up");
                setTimeout(function () {
                    $(".msk_bg").hide();
                }, 200);
            });
            $('#default').change(function () {
                var is_default = $(this).val();
                if (is_default == 1) {
                    $(this).val(0);
                } else {
                    $(this).val(1);
                }
            });
            var choose_index = [1, 1, 1];//选择引索
            var item_height = 40;//item高度
            var sq_scroll = new Array();
            var sq = [$('#s_1'), $('#s_2'), $('#s_3')];
            var init_city = ['广东省', '广州市', '海珠区'];
            var this_city = ['广东省', '广州市', '海珠区'];

            function ClickItem(temp) {
                var str = "0";
                if (temp == 1) {
                    str += '_' + (choose_index[0] - 1) + '';
                } else if (temp == 2) {
                    str += '_' + (choose_index[0] - 1) + '';
                    str += '_' + (choose_index[1] - 1) + '';
                }
                var temp_str = "";

                if (temp == 1) {
                    sq[1].html('');
                    sq[2].html('');
                } else if (temp == 2) {
                    sq[2].html('');
                }
                if (dsy.Exists(str)) {
                    ar = dsy.Items[str];
                    temp_str += '<li></li>';
                    for (i = 0; i < ar.length; i++) {
                        temp_str += '<li>' + ar[i] + "</li>";
                    }

                    temp_str += '<li></li>';
                    sq[temp].html(temp_str);
                }

            }


            function init_area() {
                var str = '0';
                var isneedinit = false;

                for (var i = 0; i < 3; i++) {
                    if (dsy.Exists(str)) {
                        var temp_dsy = dsy.Items[str];
                        for (var u = 0; u < temp_dsy.length; u++) {
                            if (temp_dsy[u] == init_city[i]) {
                                if (i != 2)
                                    str += '_' + u;
                            } else if (u == temp_dsy.length - 1) {
                                isneedinit = true;
                                break;
                            }
                        }
                    }
                    if (isneedinit == true) {
                        ClickItem(0);
                        ClickItem(1);
                        ClickItem(2);
                        break;
                    }
                }
            }

            function getStr() {
                for (var i = 0; i < choose_index.length; i++) {
                    this_city[i] = sq[i].find('li').eq(choose_index[i]).html();
                }
            }

            function init_scroll() {
                for (var i = 0; i < sq.length; i++) {
                    (function (index) {
                        sq_scroll[index] = new iScroll('li_' + (index + 1), {
                            snap: 'li',
                            hScroll: false,
                            vScrollbar: false,
                            onScrollEnd: function () {
                                choose_index[index] = Math.round((this.y / item_height) * (-1)) + 1;
                                if (index == 0) {
                                    choose_index[1] = 1;
                                    choose_index[2] = 1;
                                    ClickItem(1);
                                    ClickItem(2);
                                    sq_scroll[index + 1].scrollTo(0, 0, 300, false);
                                    sq_scroll[index + 2].scrollTo(0, 0, 300, false);
                                } else if (index == 1) {
                                    choose_index[2] = 1;
                                    ClickItem(2);
                                }
                                if (index < sq_scroll.length - 1)
                                    sq_scroll[index + 1].refresh();
                                getStr();
                            }
                        });
                    })(i);
                }
            }

            $("#btn-ok").click(function () {
                var city_str = "";
                $(':input[name="province"]').val('');
                $(':input[name="city"]').val('');
                $(':input[name="area"]').val('');
                for (var i = 0, long = this_city.length; i < long; i++)
                {
                    var html = this_city[i];
                    if (html) {
                        city_str += html;
                        if (i == 0) {
                            $(':input[name="province"]').val(html);
                        } else if (i == 1) {
                            $(':input[name="city"]').val(html);
                        } else if (i == 2) {
                            $(':input[name="area"]').val(html);
                        }
                    }
                }
                document.getElementById("pop_up").value = city_str;
                document.getElementById("msk_bg").style.display = "none";
                $("#city").addClass("city_down").removeClass("city_up");
            });


            init_area();//初始化函数
            init_scroll();
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        },
    };
    var _$domAppendAddressList = $('.J-addressDom');
    var _aConfig = {
        getAddressUrl: '',
        data: '',
        deleteData: '',
        dataOne: '',
        editData: '',
        lastUrl: '',
        isBuy: '',
        addressId:''
    };
    var self = oIndex;
    module.exports = oIndex;
})

