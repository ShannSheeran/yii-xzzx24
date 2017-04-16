define(["jQuery"], function (require, exports, module) {
    var $ = window.$ || require("jQuery");
    module.exports = function (aInConfig) {
        var oDefaultConfig = {
            dom: null,
            cb: null,
            loadingTips: '数据加载中。。',
            waitingTips: '拖动加载更多。。',
            noDataTips: '没有数据啦。。',
            range: 10,
            isReset:false,
        };
        var isNoData = false;
        var oConfig = $.extend({}, oDefaultConfig, aInConfig);
        var oLoadMoreStatus = {
            closeLoading: function (newTips) {
                if (newTips == undefined) {
                    newTips = oConfig.waitingTips;
                }
                oConfig.dom.data('is_loading', false);
                oConfig.dom.data('is_nodata', false);
                oConfig.dom.closest('.J-loadMoreParentDiv').find('#pullUp').removeClass('loading');
                oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpLabel').text(newTips);
            },
            close: function () {
                oConfig.dom.closest('.J-loadMoreParentDiv').find('#pullUp').remove();
            },
            noData: function () {
                oConfig.dom.data('is_nodata', true);
                oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpIcon').hide();
                oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpLabel').text(oConfig.noDataTips);
            }
        };
        
        if(oConfig.isReset){
            oConfig.dom.data('is_nodata', false);
            oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpIcon').show();
            oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpLabel').text(oConfig.loadingTips);
            oConfig.cb(oLoadMoreStatus);
        }

        //第一自动加载
        if (oConfig.dom.closest('.J-loadMoreParentDiv').find('#pullUp').length == 0) {
            var $tag = $(_buildLoadMoreStatusTag(oConfig.waitingTips));
            oConfig.dom.wrap("<div class='J-loadMoreParentDiv'></div>");
            oConfig.dom.after($tag);

            oConfig.dom.closest('.J-loadMoreParentDiv').find('#pullUp').addClass('loading');
            oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpLabel').text(oConfig.loadingTips);
            oConfig.dom.data('is_loading', true);
            setTimeout(function () {
                oConfig.cb(oLoadMoreStatus);
                if($(document).height() == $(window).height()){              
                    oConfig.dom.height($('body').height(($(document).height()) + 20));
                }
            }, 800);
        }

        $(window).scroll(function () {
            var srollPos = $(window).scrollTop();
            var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
            if (($(document).height() - oConfig.range) <= totalheight && !isNoData && !oConfig.dom.data('is_loading') && !oConfig.dom.data('is_nodata')) {
                oConfig.dom.closest('.J-loadMoreParentDiv').find('#pullUp').addClass('loading');
                oConfig.dom.closest('.J-loadMoreParentDiv').find('.pullUpLabel').text(oConfig.loadingTips);
                setTimeout(function () {
                    oConfig.dom.data('is_loading', true);
                    oConfig.cb(oLoadMoreStatus);
                }, 800);
            }
        });
    }
    function _buildLoadMoreStatusTag(waitingTips) {
        return '<div id="pullUp"><span class="pullUpIcon"></span><span class="pullUpLabel">' + waitingTips + '</span></div>';
    }
});

