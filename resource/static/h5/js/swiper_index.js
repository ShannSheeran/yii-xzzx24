$(document).ready(function () {
	//横切
		    var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 4,
		        paginationClickable: true,
		        spaceBetween: 0,
		        freeMode: true,
				onTouchEnd: function(swiper){
					//swiper.translate判断本次滑动的距离
					console.log(swiper.translate);

					if(swiper.translate>60){ //判断下拉刷新  
							//$('.uptipsgray').addClass('visible');//下拉刷新的div显示  
							//loadNewData();//加载更多数据  
					}  
					else if(swiper.translate<-40){ //判断上拉加载新数据  
							if(mySwiper.isEnd){  
									//mySwiper.isEnd这个函数用来判断时候滑动到底部，但是不能单独的用这个来写，还需要在外层写一个swiper.translate<-40，是为了需要先判断是手势是上拉还是下拉，否则可能造成了点击页面，还没设计到上下拉就执行里面的函数了，这里的40也不                  是固定的，只是为了先判断手势方向，再判断是否到底  
									 
								   // $('.tipsgray').addClass('visible');  
									//loadHistoryData();  
							}  
							 

					}  
				}  
		    });

	// 竖切
	var mySwiper = new Swiper('.swiper-container1', { 
		scrollbar: '.swiper-scrollbar',  
		direction: 'vertical',  
		slidesPerView: 'auto',  
		mousewheelControl: true,  
		freeMode: true,  
		onTouchEnd: function(swiper){  
		console.log(swiper.translate);
				if(swiper.translate>60){ //判断下拉刷新  
						//$('.uptipsgray').addClass('visible');//下拉刷新的div显示  
						//loadNewData();//加载更多数据  
						console.log('fdsaf');
				}  
				else if(swiper.translate<-40){ //判断上拉加载新数据  
						if(swiper.isEnd){ 
						console.log('fdsaf1111111111'); 
								//mySwiper.isEnd这个函数用来判断时候滑动到底部，但是不能单独的用这个来写，还需要在外层写一个swiper.translate<-40，是为了需要先判断是手势是上拉还是下拉，否则可能造成了点击页面，还没设计到上下拉就执行里面的函数了，这里的40也不                  是固定的，只是为了先判断手势方向，再判断是否到底  
								 
							   // $('.tipsgray').addClass('visible');  
								//loadHistoryData();  
						}  
						 

				}  
		}  
	}); 

	

})