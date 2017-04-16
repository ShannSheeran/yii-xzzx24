define(["jQuery", "app/common/Request", "app/common/Ui", 'artDialog'], function (require, exports, module) {
    var $ = window.$ || require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var dialog = require('artDialog');
    var mysite = {
        init: function () {
            this.gsAgent = navigator.userAgent.toLowerCase(),
                    this.gsAppVer = navigator.appVersion.toLowerCase(),
                    this.gsAppName = navigator.appName.toLowerCase(),
                    this.gbIsOpera = (this.gsAgent.indexOf("opera") > -1),
                    this.gbIsWebKit = (this.gsAgent.indexOf("applewebkit") > -1),
                    this.gbIsKHTML = this.gsAgent.indexOf("khtml") > -1 || this.gsAgent.indexOf("konqueror") > -1 || this.gbIsWebKit,
                    this.gbIsIE = (this.gsAgent.indexOf("compatible") > -1 && !this.gbIsOpera) || this.gsAgent.indexOf("msie") > -1,
                    this.gbIsTT = this.gbIsIE ? (this.gsAppVer.indexOf("tencenttraveler") != -1 ? 1 : 0) : 0,
                    this.gbIsQBWebKit = this.gbIsWebKit ? (this.gsAppVer.indexOf("qqbrowser") != -1 ? 1 : 0) : 0,
                    this.gbIsQPlus = this.gsAgent.indexOf("qplus") > -1,
                    this.gbIsSogou = this.gsAgent.indexOf("se 2.x metasr 1.0") > -1,
                    this.gbIsChrome = this.gbIsWebKit && !this.gbIsQBWebKit && this.gsAgent.indexOf("chrome") > -1 && !this.gbIsSogou && !this.gbIsQPlus,
                    this.gbIsSafari = this.gbIsWebKit && !this.gbIsChrome && !this.gbIsSogou && !this.gbIsQBWebKit,
                    this.gbIsQBIE = this.gbIsIE && this.gsAppVer.indexOf("qqbrowser") != -1,
                    this.gbIsFF = this.gsAgent.indexOf("gecko") > -1 && !this.gbIsKHTML,
                    this.gbIsNS = !this.gbIsIE && !this.gbIsOpera && !this.gbIsKHTML && (this.gsAgent.indexOf("mozilla") == 0) && (this.gsAppName == "netscape"),
                    this.gbIsAgentErr = !(this.gbIsOpera || this.gbIsKHTML || this.gbIsSafari || this.gbIsIE || this.gbIsTT || this.gbIsFF || this.gbIsNS),
                    this.gbIsWin = this.gsAgent.indexOf("windows") > -1 || this.gsAgent.indexOf("win32") > -1,
                    this.gbIsVista = this.gbIsWin && (this.gsAgent.indexOf("nt 6.0") > -1 || this.gsAgent.indexOf("windows vista") > -1),
                    this.gbIsWin7 = this.gbIsWin && this.gsAgent.indexOf("nt 6.1") > -1,
                    this.gbIsMac = this.gsAgent.indexOf("macintosh") > -1 || this.gsAgent.indexOf("mac os x") > -1,
                    this.gsMacVer = /mac os x (\d+)(\.|_)(\d+)/.test(this.gsAgent) && parseFloat(RegExp.$1 + "." + RegExp.$3),
                    this.gbIsLinux = this.gsAgent.indexOf("linux") > -1,
                    this.gbIsAir = this.gsAgent.indexOf("adobeair") > -1,
                    this.gnIEVer = /MSIE (\d+.\d+);/i.test(this.gsAgent) && parseFloat(RegExp["$1"]),
                    this.gnIEDocTypeVer = 0,
                    this.gsFFVer = /firefox\/((\d|\.)+)/i.test(this.gsAgent) && RegExp["$1"],
                    this.gsSafariVer = "" + (/version\/((\d|\.)+)/i.test(this.gsAgent) && RegExp["$1"]),
                    this.gsChromeVer = "" + (/chrome\/((\d|\.)+)/i.test(this.gsAgent) && RegExp["$1"]),
                    this.gsQBVer = "" + (/qqbrowser\/((\d|\.)+)/i.test(this.gsAgent) && RegExp["$1"]);
        },
        weixinShare: {
            init: function () {
                $("#QY_siteFastLink .weixin").on("click", function (event) {
                    var ths = this;
                    require.async('artDialog', function (dialog) {
                        require.async('modules/qrcode/1.0.2/qrcode', function (qrcode) {
                            var d = dialog({
                                title: "分享到微信朋友圈",
                                content: new qrcode({text: $(ths).attr("data-QRCode")}),
                                quickClose: true// 点击空白处快速关闭
                            });
                            d.show(ths);
                        })
                    });
                    return false;
                })
            }
        },
        addFavorite: function () {
            $("#QY_addFavorite").on("click", function (event) {
                var sURL = $(this).attr("href"), sTitle = $(this).attr("data-title");
                try {
                    window.external.addFavorite(sURL, sTitle);
                } catch (e) {
                    try
                    {
                        window.sidebar.addPanel(sTitle, sURL, "");
                    } catch (e)
                    {
                        alert("加入收藏失败，请使用Ctrl+D进行添加");
                    }
                }
                return false;
            })
        },
        bindPushCartEvent: function () {
            $('body').on('click', '.J-goodsCartBtn', function () {
                var $this = $(this);
                var goodsId = $this.data('goods_id');
                if (goodsId == undefined) {
                    return console.log('存在不合法的商品id');
                }
                Request.ajax({
                    url: _aConfig.pushCartUrl + '&id=' + Number(goodsId),
                    success: function (aData) {
                        if (aData.status == 1) {
                            var r = dialog({
                                content: '商品已经成功加入购物车'
                            });
                            r.show();
                            $this.addClass('current');
                            self.appendNavCartNums(aData.data.total);
                            setTimeout(function () {
                                r.close().remove();
                            }, 2000);
                            
                        }
                        console.log(aData)
                    },
                });
            });
        },
        bindLikeEvent:function(){
             $('body').on('click', '.J-like', function () {
                var $this = $(this);
                var goodsId = $this.data('goods_gid');
                if (goodsId == undefined) {
                    return console.log('存在不合法的商品id');
                }
                Request.ajax({
                    url: _aConfig.likeUrl + '&id=' + Number(goodsId),
                    success: function (aData) {
                        if (aData.status == 1) {
                            var r = dialog({
                                content: '收藏成功！！'
                            });
                            r.show();
                            $this.addClass('current');
                            $this.next().html(aData.data.total);
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                            
                        }
                        if (aData.status == 0) {
                            var r = dialog({
                                content: '取消收藏！！'
                            });
                            r.show();
                            $this.removeClass('current');
                            $this.next().html(aData.data.total);
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                        }
                        if (aData.status == 2) {
                            var r = dialog({
                                content: '哎哟，收藏失败，请重试！！'
                            });
                            r.show();
                            setTimeout(function () {
                                r.close().remove();
                            }, 1500);
                        }
                        
                        console.log(aData)
                    },
                });
            });
        },
        bindSearchEvent:function(){ 
            $('.a_search').on('click',function(){ 
                window.location.href = _aConfig.searchUrl;
            });
        },
        changeCustomerServicePosition:function(trueName,qq,phone,companyName,userNickname,desciption,email,groupName,oGroupOption){
            if(desciption == undefined || desciption ==''){
                desciption = '来自链接:'+ window.location.href;
            }
            if(groupName == undefined){
                groupName = '客服';
            }
            if(oGroupOption == undefined){
                oGroupOption = "{tenantId: 20374}";
            }else{
                try{
                    oGroupOption = JSON.stringify(oGroupOption);
                }catch(e){
                    oGroupOption = "{tenantId: 20374}";
                }
            }
            
            $("<script>\
            window.easemobim = window.easemobim || {};\
            easemobim.config = {\
                hide: true,\
                visitor: {\
                    trueName: '"+ trueName +"',\
                    qq: '"+ qq +"',\
                    phone: '"+ phone +"',\
                    companyName: '"+ companyName +"',\
                    userNickname: '我是"+ userNickname +"',\
                    description: '"+ desciption +"',\
                    email: '"+ email +"'\
                },\
            };\
            </script>\
            <script src='//kefu.easemob.com/webim/easemob.js?tenantId=20374&sat=false' async='async'></script>\
            <!--<a href='javascript:;' onclick='easemobim.bind("+ oGroupOption +")' style=\"position: fixed;bottom: 74px;left: 10px;background: pink;color: white;line-height: 35px;border-radius: 50%;z-index: 999;width: 35px;height: 35px;text-align: center;opacity: 0.9;\">"+ groupName +"</a>-->").appendTo('body');
        },
        getUserInfo:function(){
            Request.ajax({
                url:_aConfig.getUserInfoUrl,
                success:function(aData){
                    if(aData.status == 1){
                        window.App.oUserInfo = aData.data;
                        self.changeCustomerServicePosition(App.oUserInfo.realname,'',App.oUserInfo.mobile,'云商会',App.oUserInfo.realname,undefined,'');
                    }                    
                }
            });
        },

        
        appendNavCartNums: function (nums) {
            //更新导航数量
            $('.J-totalCartNums').show().html(nums);
            
        },
        checkTotalCartNums:function(){
            var $dom = $('.J-totalCartNums');
            var nums = $dom.html();
            setTimeout(function () {                
                 if(nums == 0){
                     $dom.hide();
                 }else{
                    $dom.show();
                 }
                 self.checkTotalCartNums();
             }, 2000);  
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }
    }
    var _aConfig = {
        thumbUrl: '',
        pushCartUrl: '',
        likeUrl:'',
        searchUrl:'',
        getUserInfoUrl:'',
    };
    mysite.init();
    mysite.checkTotalCartNums();
    var self = mysite;
    
    module.exports = mysite;
})