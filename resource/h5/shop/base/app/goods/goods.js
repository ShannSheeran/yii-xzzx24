define(["jQuery"],function(require,exports,module) {
	var $ =  require("jQuery");	
	var oTest = {
		tt:function(){
			console.log($('body'),'this is goodsjs');
		}
		
	};
	module.exports =  oTest;
})