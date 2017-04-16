define(["jQuery", 'app/common/Request', 'app/common/Ui','app/read/read'], function (require, exports, module) {
    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oRead = require('app/read/read');

    //分类列表处理“类”
    var _oCateList = {
        buildCateList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<a class="col-xs-3 J-artcleCategory current" href="javascript:void(0)" data-cid="'+ oDataList[i].id  +'" rel="' + _aConfig.cateUrl + oDataList[i].id + '" >\
                        <span class="font14 ">' + oDataList[i].title + '</span>\
                        <span class=""></span>\
                </a>');
            }

            return aHtml.join('');

        },
        appendCateListHtml: function (oData) {
            _aConfig.$appendDom.append(_oCateList.buildCateList(oData));
            _aConfig.$appendDom.find('.J-artcleCategory').click(function(){
              var $this = $(this);
              var url = $this.attr('rel');
              if(url == ''){
                 return; 
              }
               _$domArticleList.empty();
                _aConfig.$appendDom.find('.J-artcleCategory span').removeClass('current');
               $this.find('span').addClass('current');
              oRead.getArticles(url,$(this).data('cid'));
            });
             _aConfig.$appendDom.find('.J-artcleCategory:first').click();
        }
    };

    var oReadNav = {
        //请求分类信息数据
        getCateList: function () {
            Request.ajax({
                type: 'get',
                url: _aConfig.getCategoryUrl,
                success: function (aData) {
                    
                    _oCateList.appendCateListHtml(aData.data);
                    self.bindLengthEvent();
                    if (aData.length > 0) {
                        self.activitysliderShow();
                    }
                }
            });
        },
         //实时设置分类的a标签的长度
        bindLengthEvent:function(){ 
            var aLength = $('.J-headerNav a').length;
            $('.J-artcleCategory ').css('width',parseInt(100/aLength)+'%');
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }

    };
    var _aConfig = {
        cateUrl: '',
        getCategoryUrl: '',
        $appendDom: $('.J-categoryDom'),
        current: null,
    };
    var _$domArticleList = $('.J-articleList');
    var self = oReadNav;
    module.exports = oReadNav;
});

