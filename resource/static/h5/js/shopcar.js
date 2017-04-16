$(document).ready(function  () {
	//购物车增加减去
	$(".spinner").spinner();

	//复选框
	$(".div_inshopcar_left label").click(function () {
		if (!$(this).hasClass("checked")) {
			$(this).addClass("checked");
		} else {
			$(this).removeClass("checked");
		}
	});
    
	var param = "1";
   
	// 全选或者取消全选
	$(".J-span_allcheck").click(function(){
		if(param=="1"){
			$("label").each(function(){
				$(this).addClass("checked");
				param = "2";
			})
		}else{
			$("label").each(function(){
				$(this).removeClass("checked");
				param = "1";
			})
		}		
	});
})