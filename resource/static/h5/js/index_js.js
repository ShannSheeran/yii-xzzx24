$(function() {

	//div_navbar切换
	

	


	// 底部footer控制
	
	$(".J-footerNav a").eq(0).children('span').addClass('current');//初始化第一个渲染
	$(".J-footerNav a").click(function(){
		var spanEl = $('#div_footer a');//所有a标签模块
		var index = $(this).index();//当前位置
		for (var i = 0; i < spanEl.length; i++) {
			if(index==i){//遍历所有A标签==当前点击时
				$("#div_footer a").eq(i).children('span').addClass('current');
			}else{
				$("#div_footer a").eq(i).children('span').removeClass('current');	
			}
		}
	});

	

	


})