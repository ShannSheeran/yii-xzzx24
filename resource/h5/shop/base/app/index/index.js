define('app/index/index',["jQuery",'artDialog','external/touchSlider/TouchSlide.1.1', 'app/common/Request', 'app/common/Ui', 'external/swiper/swiper.min','app/common/load_more','external/cookie/jquery.cookie'], function (require, exports, module) {
    var $ = require("jQuery");
    require("external/cookie/jquery.cookie");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var oTouchSlide = require('external/touchSlider/TouchSlide.1.1');
    var Swiper = require('external/swiper/swiper.min');
    var loadMore = require('app/common/load_more');	
    var dialog = require('artDialog');

    //幻灯片列表处理“类”
    var _oSlideList = {
        buildSlideList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                var url = 'javascript:void(0);';
                if (oDataList[i].url != '') {
                    url = oDataList[i].url;
                }
                aHtml.push('<li><a href="' + url + '">' + Ui.buildImage(App.url.resource + oDataList[i].thumb) + '</a></li>');
            }
            return aHtml.join('');
        },
        appendSlideListHtml: function (oData) {
            _$domSlide.append(_oSlideList.buildSlideList(oData));
        }
    };

    var _oActivity = {
        buildActivityList: function (oDataList) {
            var aHtml = [];
            for (var i in oDataList) {
                aHtml.push('<div class="div_banner J-activityBanner" data-aid='+ oDataList[i].id +' data-url="' + oDataList[i].url + '">\
                   <div id="focus'+i+'" class="focus J-acitivityFocus">\
                   <div class="hd"><ul></ul></div>\
                   <div class="bd"><ul>');          
               aHtml.push('<li><a href="' + oDataList[i].url + '">' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].pic) + '</a></li>');            
               aHtml.push('</ul></div></div></div>');
            }
            return aHtml.join('');
        },
        appendActivityHtml: function (aData) {
            _$domActivity.append(_oActivity.buildActivityList(aData));
            _$domActivity.find('.J-activityBanner').each(function(){
                var $this = $(this);
				var aid = $this.data('aid');
				$this.attr('id','J-activityBanner'+aid);                
                _oActivity.getGoodsList($this,_aConfig.getActivityGoodsListUrl + '&aid='+aid,aid);
            });
			if(aData.length > 0){
				self.activitysliderShow();
			}            
        },
        buildActivityGoodsList:function(oDataList,aid){
            
            var aHtml = [];
            if(aid == 3){ 
                for (var i in oDataList) {
                   aHtml.push('<div class="swiper-slide col-xs-3">');
                   aHtml.push('<a class="div_recommend" href="' + _aConfig.getBargainGoodsDetailUrl + oDataList[i].id + '">');
                   aHtml.push('<div>' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</div>');
                   aHtml.push('<h3 class="font12 title_jiequ">'+ oDataList[i].title +'</h3>');
                   aHtml.push('<p><span class="floatleft colorred">￥'+ parseInt(oDataList[i].marketprice) +'</span></p>');
                   aHtml.push('</a></div>');
                }
                return aHtml.join('');
            }else{ 
                for (var i in oDataList) {
                   aHtml.push('<div class="swiper-slide col-xs-3">');
                   aHtml.push('<a class="div_recommend" href="' + _aConfig.goodsDetailUrl + oDataList[i].id + '">');
                   aHtml.push('<div>' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</div>');
                   aHtml.push('<h3 class="font12 title_jiequ">'+ oDataList[i].title +'</h3>');
                   aHtml.push('<p><span class="floatleft colorred">￥'+ parseInt(oDataList[i].marketprice) +'</span><s class="pricedelete floatleft">￥'+ parseInt(oDataList[i].productprice) +'</s></p>');
                   aHtml.push('</a></div>');
                }
                return aHtml.join('');
            }
           
        },
        appendActivityGoodsListHtml:function($dom,aData,page,aid){
			if(page == 1){			
				var $mainHtml = $('<div class="J-swiper-container swiper-container container-fluid"><div class="swiper-wrapper row J-hSliderItemList">\
						<div class="swiper-slide col-xs-3 J-hLoadMore" style="cursor:pointer;" data-aid="'+ aid +'">\
							<a href="javascript:;" class="div_recommend">\
								<div>\
									<img src="/resource/static/images/loading.jpg" class="img-responsive" alt="Responsive image">\
								</div>\
								<h3 class="font12"></h3>\
								<p>\
									<span class="floatleft colorred"></span>\
									<s class="pricedelete floatleft"></s>\
								</p>\
							</a>\
						</div>\
				</div></div>');
				$mainHtml.appendTo($dom);
					$mainHtml.on('click','.J-hLoadMore',function(){
                       var url =  $(this).closest('.J-activityBanner').data('url');
                       if(url != undefined){
                        return location.href=  url;
                       }
                    return;
					var aid = $(this).data('aid');
					var $dom = $('#J-activityBanner'+aid);
					_oActivity.getGoodsList($dom,_aConfig.getActivityGoodsListUrl + '&aid='+aid,aid,'loadMore');
				});
			}	
            $dom.find('.J-hLoadMore').before($(_oActivity.buildActivityGoodsList(aData,aid)));
        },
        getGoodsList: function ($dom,url,aid,opt) {            
            if($dom == undefined){
                return $.error('page dom is not defined');
            }
            if($dom.data('page') == undefined){
                $dom.data('page',1)
            }
            var page = $dom.data('page');
            if (page == 'noData') {
                return;
            }
            
            if(url == undefined){
                url = _aConfig.getApiUrl;
            }
            Request.ajax({
                type: 'get',
                url: url + '&page=' + page,
                dataType:'json',
                success: function (aData) {
					if(opt != undefined && aData.data.length == 0){
						 var r = dialog({
							content: '没有数据更多数据了哦亲'
						});
						r.show();
						setTimeout(function () {
							r.close().remove();
						}, 2000);
						return;
					}
                    _oActivity.appendActivityGoodsListHtml($dom,aData.data,page,aid);
					self.hSwiperSlider();
					
                    page = page + 1 ;
                    $dom.data('page',page);
                }
            });
        }
    };

    //商品列表处理“类”
    var _oGoodsList = {
        buildGoodsList: function ($dom,oDataList) {
//            var aData = oDataList;
            var aHtml = [];
            for (var i in oDataList) {
//                if(oDataList[i].like_no > 99){ 
//                    oDataList[i].like_no = '99+';
//                }
                var likeClass = ''; 
                if(oDataList[i].is_like == 1){ 
                    likeClass = 'current';
                }
//                var special = "";
//                if(oDataList[i].isespecial == 1){
//                    special = '<span>特卖</span>';
//                }
//                //改成横向之后加上的样式start
//                if(oDataList[i].isespecial == 1){
//                    special = '<span class="span_temai">特卖</span>';
//                }
//                var icon = (App.oCountry[oDataList[i].country] != undefined) ? App.oCountry[oDataList[i].country] : 'i_korea';
//_aConfig.goodsDetailUrl.replace('____tag',oDataList[i].id)
                aHtml.push('<div class="swiper-slide col-xs-12 div_products">\
                    <div class="div_product"> \
                            <a href="' + _aConfig.goodsDetailUrl.replace('____tag',oDataList[i].id) +'" class="col-xs-7 product_left">\
                                    <div class="img_box">' + Ui.buildImage(App.url.resource + oDataList[i].goods_img,undefined,{class:'img-responsive',alt:'Responsive image'}) + '</div>\
                            </a>\
                            <div class="col-xs-5 product_right">\
                                    <a href="javascript:;"><h2 >' + oDataList[i].name + '</h2></a>\
                                    <h4>\
                                            <span style= "border:0px;"><u>￥</u>' + oDataList[i].sale_price + '</span>\
                                    </h4>\
                                    <h5>\
                                            <span>销量：'+oDataList[i].sale_nums+'</span>\
                                    </h5>\
                            </div>\
                    </div>\
            </div>');
                //改成横向之后加上的样式end
                //原来的样式
//                aHtml.push('<a href="' + _aConfig.goodsDetailUrl + oDataList[i].id + '"><div class="swiper-slide col-xs-6 div_products">\
//                        <div class="div_product"><i class="'+ icon +'"></i>' + Ui.buildImage(_aConfig.thumbUrl + oDataList[i].thumb) + '\
//                                <p>' + oDataList[i].title + '</p>'+special+'</a>\
//                                <h4>\
//                                    <span> <u>￥</u>' + oDataList[i].marketprice + '</span>\
//                                    <b style="text-decoration:line-through">'+ oDataList[i].productprice +'</b>\
//                                </h4>\
//                                <h5>\
//                                        <span>销量：'+oDataList[i].sales+'</span>\
//                                        <b><s class="s_collect J-like '+ likeClass +'" data-goods_gid="'+ oDataList[i].id +'"></s><b>'+oDataList[i].like_no+'</b></b>\
//                                        <!--<s class="s_shopcar J-goodsCartBtn" data-goods_id="'+ oDataList[i].id +'"></s>-->\
//                                </h5>\
//                        </div>\
//                </div>');
            }
            return aHtml.join('');
        },
        appendGoodsListHtml: function ($dom,aData) {
            //append商品列表
            $dom.append(_oGoodsList.buildGoodsList($dom,aData));            
        }
    };
    var oIndex = {
        slideShow: function () {			
            // 头部轮播图控制
            oTouchSlide({
                slideCell: "#leftTabBox",
                slideCell:"#focus",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "leftLoop",
                autoPlay: true, //自动播放
                autoPage: true //自动分页
            });
        },
        activitysliderShow: function () {
			$('.J-acitivityFocus').each(function(){
				try{
					var id = $(this).attr('id');
					oTouchSlide({
						slideCell: "#leftTabBox",
						slideCell:"#"+id,
						titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
						mainCell: ".bd ul",
						effect: "leftLoop",
						//autoPlay: true, //自动播放
						//autoPage: true //自动分页 
					});
				}catch (e) {}
			
			});
           
        },
        hSwiperSlider: function () {
            var swiper = new Swiper('.J-swiper-container', {				
				freeMode : true,
                                slidesPerView: 4,
                                paginationClickable: true,
                                spaceBetween: 0,
				freeModeMomentum : false,
				loop : false,
            });
        },
        initGoodsList:function(){
            $(function(){
                //处理加载更多
            loadMore({
                dom: _$domGoodsList,
                cb: function(oLoadMore){
                    self.getGoodsList(_$domAppendGoodList,_aConfig.getApiUrl,oLoadMore)
                }
            });
            });
            
        },
        //请求商品信息数据
        getGoodsList: function ($dom,url,oLoadMore) {
            if($dom == undefined){
                return $.error('page dom is not defined');
            }
            
            if($dom.data('page') == undefined){
                $dom.data('page',1)
            }
            var page = Number($dom.data('page'));
            if (page == 0) {
                oLoadMore.noData();
                return false;
            }
            
            if(url == undefined){
                url = _aConfig.getApiUrl;
            }
            var aData = $.extend({},_aConfig.getGoodsParam,{page:page,pageSize:10});
            Request.ajax({
                url: url,
                data:aData,
                success: function (aData) {
                    if(aData.data.length == 0){
                        oLoadMore.noData();                      
                        $dom.data('page',0);
                    }else{
                        page++;
                        $dom.data('page',page);
                        oLoadMore.closeLoading();
                    }
                    _oGoodsList.appendGoodsListHtml($dom,aData.data);
                    //self.goPosition();
                }
            });
        },
        //请求幻灯片信息数据
        getSlideList: function () {
            Request.ajax({
                type: 'post',
                url: _aConfig.getApiUrl,
                data:_aConfig.getSlideParam,
                success: function (aData) {
                    _oSlideList.appendSlideListHtml(aData.data.aData);
                    if(aData.data.aData.length > 0){
                        self.slideShow();
                    }
                }
            });
        },
        getActivityList: function () {
            Request.ajax({
                type: 'get',
                url: _aConfig.getActivityUrl,
                success: function (aData) {
                    _oActivity.appendActivityHtml(aData.data);                    
                }
            });
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        },
		///*返回上次浏览位置*/
		goPosition:function(){
			try {
				var ua = navigator.userAgent.toLowerCase();
				if (/iphone|ipad|ipod/.test(ua)) {
					var str = window.location.href;
					//str = str.substring(str.lastIndexOf("/") + 1);
					if ($.cookie(str)) {
						//定位
						//$("html,body").scrollTop($.cookie(str));
						$("html,body").animate({ scrollTop: $.cookie(str) }, 100);
					} else {
					}
				}
			} catch (e) {}
		},
		recordPosition :function(){			    
			$(window).scroll(function () {        
				try {
					ua = navigator.userAgent.toLowerCase();
					if (/iphone|ipad|ipod/.test(ua)) {
						
						var str = window.location.href;
						//str = str.substring(str.lastIndexOf("/") + 1);
						var top = $(document).scrollTop();
						//记录位置
						$.cookie(str, top, {path: '/'});
						return $.cookie(str);
					}
					///android/.test(ua)
				} catch (e) {
				}

			});
		}

    };
    var _$domGoodsList = $('.J-goodsList');
    var _$domAppendGoodList = $('.J-goodsDom');
    var _$domSlide = $('.J-slideList');
    var _$domActivity = $('.J-activityDom'); 
     var _aCountry = { 
        33:'i_korea',
        34:'i_japan',
        35: 'i_france',
        36: 'i_usa'
    };
    var _aConfig = {
        thumbUrl: '',
        goodsDetailUrl: '',
        getBannerUrl: '',
        getActivityUrl:'',
        getApiUrl:'',
        getGoodsParam:'',
        getSlideParam:'',
        getActivityGoodsListUrl:'',
        getBargainGoodsDetailUrl:''
    };
    var self = oIndex;	
    module.exports = oIndex;
	self.recordPosition();
})

