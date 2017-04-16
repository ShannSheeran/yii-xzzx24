define(["jQuery"], function (require, exports, module) {
    var $ = require("jQuery");
	var oJoin = {
		showJoin:function(){
			var winWidth=0;
			var winHeight=0;
			//��ȡ���ڿ��
			if (window.innerWidth){
				winWidth = window.innerWidth;
			}else if ((document.body) && (document.body.clientWidth)){
				winWidth = document.body.clientWidth;
			}
			//��ȡ���ڸ߶�
			if (window.innerHeight){
				winHeight = window.innerHeight;
			}else if((document.body) && (document.body.clientHeight)){
				winHeight = document.body.clientHeight;
			}
			//ͨ������Document�ڲ���body���м�⣬��ȡ���ڸ߶�
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
				winWidth = document.documentElement.clientWidth;
				winHeight = document.documentElement.clientHeight;
			}
			$(".div_share").css({"height":parseInt(winHeight-48),"width":parseInt(winWidth)});
			$(".div_jiameng").css({"height":parseInt(winHeight-48),"width":parseInt(winWidth)});
		}
	};
	module.exports = oJoin;
});