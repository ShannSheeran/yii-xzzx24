define(["jQuery"],function(require,exports,module) {
	var $ =  require("jQuery");	
	var oShareIips = {
                buildTipsShareHtml:function(){
                  return  '<div class="div_popup J-divPopup">\
                    <img src="images/share_remind.png" class="img-responsive" alt="Responsive image">\
                    <div class="div_mask"></div>\
                </div>';  
                },
                appendTipsShare:function($dom){
                    var $dommm = $(self.buildTipsShareHtml());
                     $dommm.find(".J-divPopup img").click(function () {
                        $(this).parents(".J-divPopup").hide();
                    });
                    $dommm.appendTo($dom);
                }
	};
        var self = oShareIips;
	module.exports = oShareIips;
});