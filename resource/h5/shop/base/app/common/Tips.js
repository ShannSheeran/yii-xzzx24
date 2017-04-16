define('app/common/Tips',["jQuery","external/layer_mobile/layer"], function (require, exports, module) {
    var $ = window.$ || require("jQuery");
    var oLy = require("external/layer_mobile/layer");
    
    var _index = null;
    module.exports = {
        /**
         * 消息提示框
         * @param {type} content
         * @param {type} second
         * @param {type} cb
         * @param {type} oPrameter
         * 
         * oTips.showTips('cotent',5,function(o){
            console.log(o);
        },{id:88888});
         */
        showTips: function (content, second, cb, oPrameter) {
            if (second == undefined) {
                second = 3;
            }
            if (oPrameter == undefined) {
                oPrameter = {};
            }
            if (cb == undefined) {
                cb = function () {};
            }
            var index = oLy.open({
                shadeClose: false,
                content: content,
                skin: 'msg',
            });
            setTimeout(function () {
                oLy.close(index);
                cb(oPrameter);
            }, second * 1000);
        },
        
        /**
         * 消息框弹框
         * @param {type} content
         * @param {type} btn
         * @param {type} cb
         */
        messageTips:function(content,btn,cb){ 
            if(content == undefined){ 
                content = 'please try again';
            }
            if (cb == undefined) {
                cb = function () {};
            }
            oLy.open({
                content: content,
                btn: btn
             });
        },
        
        /**
         * 询问框
         * 所有参数都是可选（左右按钮的回调函数一旦定义必须手动关闭弹窗）
         * @param {type} content
         * @param {type} oConfig
         * 使用如下
         * Tips.askIips('询问提示',{
            rBtnTitle:'右边按钮标题',
            lBtnTitle:'左边按钮标题',
            rFn:function(dd,obj){ //点击右边按钮回调函数 dd 为 传进来的rPramater obj 为弹窗对象里面有关闭方法
                console.log(dd);//传进来的rPramater
                obj.close();//为弹窗对象里面关闭方法
            },
            lFn:function(cc,obj){ //点击右边按钮回调函数 cc 为 传进来的rPramater obj 为弹窗对象里面有关闭方法
                console.log(cc);
                obj.close();//为弹窗对象里面关闭方法
            },
            rPramater:{id:999},//可选
            lPramater:{id:100},//可选
           });
         * 
         */
        askIips: function (content,oConfig) {
            if(oConfig == undefined){
                oConfig = {};
            }
            var oDefault ={
                rBtnTitle:'确定',
                lBtnTitle:'取消',
                rFn:null,
                lFn:null,
                rPramater:null,
                lPramater:null,
            }            
            var oNowConfig = $.extend({},oDefault,oConfig); 
            
            _index = oLy.open({
                content: content,
                shadeClose: false,
                btn: [oNowConfig.rBtnTitle, oNowConfig.lBtnTitle],
                yes: function () {
                    if(oNowConfig.rFn != null && typeof(oNowConfig.rFn) == 'function'){
                        oNowConfig.rFn(oNowConfig.rPramater,{
                            close:function(){
                                oLy.close(_index); 
                            }
                        });
                    }else{
                        oLy.close(_index);
                    }
                    
                },
                no:function(){
                    if(oNowConfig.lFn != null && typeof(oNowConfig.lFn) == 'function'){
                        oNowConfig.lFn(oNowConfig.lPramater,{
                            close:function(){
                                oLy.close(_index); 
                            }
                        });
                    }else{
                        oLy.close(_index);
                    }
                    
                }
            });
            
        },
        loading:function(type,content){
            if(type == undefined){
                type = 2;
            }
            if(content == undefined){
                content = '加载中';
            }
            //loading带文字
            var index = oLy.open({
                shadeClose: false,
                type: type,
                content: content
            });
            return index;
        },
        closeLoading:function(index){
            oLy.close(index);
        },
        xxx:function(){
              var oDefaultConfig = {
                content: content,
                skin: title,
                time: 2 //2秒后自动关闭
           };
           var aNowConfig = {
                content: content,
                skin: title,
                time: 2 //2秒后自动关闭
           };
            //提示
            oLy.open($.extend({},oDefaultConfig,aNowConfig));
        },
        showLayer:function(xcotent,cb){
            var index = oLy.open({
                type: 1,
                content: xcotent,
                anim: 'up',
                style: 'position:fixed; left:0; top:0; width:100%; height:100%; border: none; -webkit-animation-duration: .5s; animation-duration: .5s;'
            });
            if(cb !== undefined){
                cb({close:function(){
                    oLy.close(index)
                }});
            }
        }

       
        
    }
});

