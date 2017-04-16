define('oNav'["jQuery", 'app/common/Request', 'app/common/Ui'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");

    //分类列表处理“类”
    var _oCateList = {
        buildCateList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<a class="J-cateItem cateItem" href="' + _aConfig.cateUrl + oDataList[i].id + '&cname='+oDataList[i].name+'" >\
                        <span class="font14 ">' + oDataList[i].name + '</span>\
                        <span class=""></span>\
                </a>');
            }

            return aHtml.join('');

        },
//        appendCateListHtml: function (oData) {
//            _aConfig.$appendDom.append(_oCateList.buildCateList(oData));
//            _aConfig.$appendDom.find('a').each(function(){
//                var $this = $(this);
//                var href = $this.attr('href');
//                if(_aConfig.current == 0){
//                    return;
//                }
//                $this.find('span').removeClass('current');
//                if(-1 != href.indexOf('pcate='+_aConfig.current)){
//                    $this.find('span').addClass('current');
//                }
//            });
//        }
appendCateListHtml: function (oData) {
            _aConfig.$appendDom.append(_oCateList.buildCateList(oData));
            var width=$(window).width()/4;
            var aCount=_aConfig.$appendDom.find('a').length;
            $(".J-cateOut").css("width",width*aCount);
            _aConfig.$appendDom.find('a').each(function(){
                var $this = $(this);
                $this.css("width",width);
                var href = $this.attr('href');
                if(_aConfig.current == 0){
                    return;
                }
                $this.find('span').removeClass('current');
                if(-1 != href.indexOf('cid='+_aConfig.current)){
                    $this.find('span').addClass('current');
                }
            });
        }
    };

    var oNav = {
        //请求分类信息数据
        getCateList: function () {
            Request.ajax({
                type: 'get',
                url: _aConfig.getCategoryUrl,
                success: function (aData) {
                    
                    _oCateList.appendCateListHtml(aData.data);
                    if (aData.length > 0) {
                        self.activitysliderShow();
                    }
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

    var _$domCate = $('.J-categoryDom');
    var _aConfig = {
        cateUrl: '',
        getCategoryUrl: '',
        $appendDom: $('.J-categoryDom'),
        current: null,
    };
    var self = oNav;
    module.exports = oNav;
});

