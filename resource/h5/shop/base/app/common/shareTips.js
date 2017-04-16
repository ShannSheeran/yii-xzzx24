define('app/common/shareTips', ["jQuery",'app/join/join_index','app/common/Ui'],function(require,exports,module) {
	var $ =  require("jQuery");
        var aJoin = require('app/join/join_index');
        var Ui = require("app/common/Ui");
        aJoin.showJoin();
	var oShareIips = {
                buildTipsShareHtml:function(){
                  return  '<div class="div_popup J-divPopup">\
                  ' + Ui.buildImage(App.url.resource + "/static/h5/images/share_remind.png", undefined, {class: 'img-responsive', alt: 'Responsive image'}) + '\
                    <div class="div_mask"></div>\
                </div>';  
                },
                appendTipsShare:function($dom){
                    var $dommm = $(self.buildTipsShareHtml());                   
                    $dommm.appendTo($dom);
                     $dom.find('.J-divPopup img').click(function(){
                        $(this).parents(".J-divPopup").hide();
                        $dom.find('.J-divPopup').remove();
                    });
                },
                bindClickShowEvent:function(dom,appendDom){
                    $(dom).click(function(){
                        self.appendTipsShare($(appendDom));
                    });
                },
	};
        var self = oShareIips;
	module.exports = oShareIips;
});