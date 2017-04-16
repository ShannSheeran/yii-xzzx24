define(["jQuery",'app/common/Request','app/common/Ui'],function(require,exports,module) {
    var $ =  require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");

    //代理商店铺商品处理“类”
    var _oAgentShopGoodsList = {
        buildAgentShopGoodsList:function(oDataList){
            //var aData = oDataList;
            //if(aData.length == 0){
            //    if(_indexAgentShopGoodsLoadDataPage == 1){
            //        return '<div>数据为空</div>';
            //    }
            //    _indexAgentShopGoodsLoadDataPage = 'noData';
            //    return '暂无数据';
            //}


            var html = '';
            for(var i in oDataList.goods){
                html += '<li class="item clear item_resell">';
                html += '<div class="itemtop clear">';
                html += '<label><div class="itemtop_left">';
                html += '<div>';
                html += '<input type="checkbox" class="check_box" name="checkGoods" value="' + oDataList.goods[i].id + '" for="check">';
                html += '</div>';
                html += '</div></label>';
                html += '<a style="margin-left:2em; display:block;" href="'+_aConfig.baseUrl+ oDataList.goods[i].id+'" class="indexListPic">';
                html += '<input type="hidden" class="check_box" value="' + oDataList.goods[i].id + '">';
                html += '<div class="itemtop_right">';
                html += '<div class="item_img bigImg">';
                html += '<img src="'+_aConfig.thumbUrl + oDataList.goods[i].thumb +' ">';
                html += '</div>';
                html += '<div class="item_des allGoods_des">';
                html += '<p class="goodsMain">' + oDataList.goods[i].title + '</p>';
                html += '<div class="goodsBig">售价￥' + oDataList.goods[i].marketprice + '</div>';
                html += '<div class="goodsPrice">销售佣金<span>￥' + oDataList.goods[i].sale_commission + '</span></div>';
                html += '<div class="goodsPrice">分销佣金<span>￥' + oDataList.goods[i].market_commission + '</span></div>';
                html += '</div>';
                html += '</div>';
                html += '</a>';
                html += '</div>';
                if (_aConfig.status == 1) {
                    html += '<a href="javascript:void(0)" data-id="' + oDataList.goods[i].id + '" class="toggle down J-optStatus" data-type="1" data-goods_id="' + oDataList.goods[i].id + '">下架</a><div><a href="javascript:void(0)" data-id="' + oDataList.goods[i].id + '" style="bottom:3em" class="top up">置顶</a></div>';
                } else {
                    html += '<a href="javascript:void(0)" data-id="' + oDataList.goods[i].id + '" class="toggle up J-optStatus" data-type="2" data-goods_id="' + oDataList.goods[i].id + '">上架</a>';
                }
                html += '</li>';

            }
            return html;
        },

        appendAgentShopGoodsListHtml:function(aData){

            //append代理商店铺商品
            //_$domAgentShopNav.html();
            //append代理商店铺商品列表
            _$domAgentShopGoods.append(_oAgentShopGoodsList.buildAgentShopGoodsList(aData));

        }
    };
    var oAgentShopGoods = {

        //请求代理商店铺商品数据
        getAgentShopGoodsList:function(url){
            if(_indexAgentShopGoodsLoadDataPage == 'noData'){
                return;
            }
            Request.ajax({
                type:'get',
                url:url+'&page='+_indexAgentShopGoodsLoadDataPage,
                success:function(aData){
                    _oAgentShopGoodsList.appendAgentShopGoodsListHtml(aData);
                    _indexAgentShopGoodsLoadDataPage++;
                }
            });
        },

        config : function(aOptions){
            for(var key in aOptions){
                if(_aConfig[key] !== undefined){
                    _aConfig[key] = aOptions[key];
                }
            }
        }

    };
    var _$domAgentShopGoods = $('.J-AgentShopGoodsList');
    var _$domAgentShopNav = $('.J-agentShopNav');
    var _indexAgentShopGoodsLoadDataPage = 1;

    var _aConfig = {
        thumbUrl:'',
        baseUrl:'',
        status:''
    };
    var self = oAgentShopGoods;
    module.exports = oAgentShopGoods;
})

