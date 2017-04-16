
function _tooltip(){
	// 提示
	$('[data-toggle="tooltip"]').tooltip({
		'placement': 'bottom',
		'show': false,
		'html': true
	});
}

function _modalVerticalCenter(dom){
	if(typeof dom == 'string'){
		var dom = $(dom);
	}else if(dom instanceof jQuery){
		var dom = dom;
	}else{
		$.error("你传进了奇怪的参数");
	}
	var dh = $(window).height();
	var domh = dom.outerHeight();
	var $top = Math.ceil((dh - domh) / 2);
	dom.css({
		top: $top
	});
}

// ul宽度控制
function ulWidth(id){
	var $ul = $(id).find('ul');
	var $li = $(id).find('li');
	var liWidth = $li.outerWidth(true);
	var liLength = $li.length;
	$ul.width(liWidth * liLength);
} 
function _sideScrollFix(dom){
	
	$(document).scroll(function(){
		if($(document).scrollTop() > 135){
			dom.css({
				position: 'absolute',
				top: $(document).scrollTop() - 145,
				right: '0'
			});
		}else{
			dom.css({
				position: 'static'
			});
		}
//		$('.um-layout-2 #sideBar')
	});
}

$(function(){
	var $selectDOM = $('.um-layout-2 #sideBar');
	_sideScrollFix($selectDOM);
});

