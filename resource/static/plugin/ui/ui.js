(function($, win){

var _aPathInfo = (function(){
		var $scripts = $('script');
		var src = $scripts[$scripts.length - 1].src;
		return {
			domain : src.match(/http:\/\/([^\/]+)\//i)[0],
			rootPath : src.substr(0, src.lastIndexOf('/')) + '/'
		};
	})();

win.Ui = {
	rootPath : _aPathInfo.rootPath,
	resourceUrl : _aPathInfo.domain,
	defaultImage: _aPathInfo.rootPath + 'img_error.png',
	defaultProfile : _aPathInfo.rootPath + 'head_error.png',

	/**
	 * 构建img标签
	 * @param {type} imageUrl 图片地址
	 * @returns {String}
	 */
	buildImage : function(imageUrl, defaultImage, aOptions){
		if(defaultImage == undefined){
			defaultImage = self.defaultImage;
		}

		var aAxtendAttrs = [];	//扩展属性
		if(aOptions != undefined){
			delete aOptions.src;
			delete aOptions.real;
			for(var name in aOptions){
				aAxtendAttrs.push(' ' + name + '="' + aOptions[name] + '"');
			}
		}

		return '<img src="' + defaultImage + '" real="' + imageUrl + '"' + aAxtendAttrs.join('') + ' onload="Ui.loadImage(this)" />';
	},

	/**
	 * 构建头像
	 * @param {type} aStudentInfo
	 * @param {type} isJump
	 * @param {type} aOptions
	 * @returns {String}
	 */
	buildProfile : function(aStudentInfo, isJump, aOptions){
		var profilePath = aStudentInfo.profile;
		var href = '',
			blank = '';
		if(isJump == undefined || isJump){
			href = ' href="' + self.buildZoneUrl(aStudentInfo.id) + '"';
			blank = ' target="_blank"';
		}

		var addClass = '';
		if(JsTools.isObject(aOptions)){
			if(typeof(aOptions.addClass) == 'string'){
				addClass = ' ' + aOptions.addClass;
			}
		}

		if(!profilePath.length){
			profilePath = self.defaultProfile;
		}else if(profilePath.substr(0, 7) != 'http://'){
			profilePath = self.resourceUrl + profilePath;
		}

		var title = aStudentInfo.name ? ' title="' + aStudentInfo.name + '"' : '';
		return '<a' + href + blank + ' class="avatar' + addClass + '"' + title + '>' + self.buildImage(profilePath, self.defaultProfile, {'data-student_id' : aStudentInfo.id}) + '</a>';
	},

	/**
	 * 构建用户主页URL
	 * @param {type} studentId
	 * @returns {unresolved}
	 */
	buildZoneUrl : function(studentId){
		return App.getUrl('zoneHome').replace('_studentId', studentId);
	},

	/**
	 * 构建用户名称
	 * @param {type} aStudentInfo
	 * @param {type} isJump
	 * @returns {String}
	 */
	buildVipName : function(aStudentInfo, isJump){
		var href = '',
			blank = '';
		if(isJump == undefined || isJump){
			href = ' href="' + self.buildZoneUrl(aStudentInfo.id) + '"';
			blank = ' target="_blank"';
		}
		return '<a class="vip' + aStudentInfo.vip + '-name vname"' + href + blank + '>' + aStudentInfo.name + '</a>';
	},

	/**
	 * 构建会员图标
	 * @param {type} vipLevel
	 * @returns {String}
	 */
	buildVipIcon : function(vipLevel){
		var vipHomeUrl = App.getUrl('vipHome');
		if(!vipHomeUrl){
			vipHomeUrl = 'http://vip.' + App.domain;
		}
		return '<a href="' + vipHomeUrl + '" target="_blank" class="vip' + vipLevel + '-icon vicon"><i class="icon"></i></a>';
	},

	/**
	 * 加载img标签的real地址到src
	 * @param {type} o
	 * @returns {undefined}
	 */
	loadImage : function (o){
		var $o = $(o);
		if ($o.attr('class') == 'testQQExist'){
			sendQQemail();
			return;
		}
		var imgUrl = $o.attr('real');
		$('<img src="' + imgUrl + '">').appendTo('body').hide().load(function(){
			$o.attr('onload', '').attr('src', imgUrl).attr('real', '');
			$(this).remove();
		});
	},

	/**
	 * 构建活动转盘
	 * @param {type} option
	 * @returns {Object}
	 */
	buildTrochalDisk: function (option){
	    if(option.num == undefined){
	        $.error('buildTrochalDisk::请输入最小转动圈数');
	    }else if(option.requestUrl == undefined){
	        $.error('buildTrochalDisk::请输入请求地址');
	    }else if(option.awardsUrl == undefined){
	        $.error('buildTrochalDisk::请输入轮盘图片地址');
	    }else if(option.count == undefined){
	        $.error('buildTrochalDisk::请输入抽奖次数');
	    }
	    var self = this;
	    self.url = option.requestUrl;
	    self.num = option.num;    //最少转动圈数，约等于秒，请求阶段1圈0.5秒，结果阶段1圈1秒（额外度数不计入）
	    self.imgWheel = option.awardsUrl;
	    self.count = option.count;	//抽奖次数
	    self.times = 0;     //当前已经转动圈数
	    self.intervalHandle = 0;
	    self.reponse = '';  //请求结果
	    self.angle = 0;     //结果度数
	    self.imgStar = '/static/activity/trochal-disk/img/wheel-star.png';	//星星装饰
	    self.imgContent = '/static/activity/trochal-disk/img/wheel-content.png';	//轮盘外圈
	    self.imgCursor = '/static/activity/trochal-disk/img/wheel-cursor.png';	//轮盘指针
	    self.imgButton = '/static/activity/trochal-disk/img/wheel-button.png';	//轮盘按钮
	    self.eventStart = 'eventTrochalDiskStart';
	    self.eventEnd = 'eventTrochalDiskEnd';
	    self.reponse = {};	//响应数据

	    //装饰星星
	    var $star = $('<img/>');
	    $star.css({
	        'position': 'absolute',
	        'top': 0,
	        'left': 0
	    });
	    $star.attr({
	       'src': self.imgStar,
	        'width': '105%'
	    });

	    //轮盘内圈
	    var $wheel = $('<img/>');
	    $wheel.attr({
	        'src': self.imgWheel,
	        'width': '100%'
	    });

	    //光标
	    var $cursor = $('<img/>');
	    $cursor.css({
	        'position': 'absolute',
	        'margin': 'auto',
	        'left': 0,
	        'right': 0,
	        'top': '-15px',
	        'width': '12%'
	    });
	    $cursor.attr({
	        'src': self.imgCursor
	    });

	    //轮盘按钮
	    var $button = $('<img/>');
	    $button.css({
	        'position': 'absolute',
	        'margin': 'auto',
	        'left': 0,
	        'right': 0,
	        'top': 0,
	        'bottom': 0,
	        'width': '22%',
	        '-webkit-tap-highlight-color': 'transparent',
	        'transition': 'transform .3s linear',
	        '-webkit-transition': '-webkit-transform .3s linear'
	    });
	    $button.attr({
	        'src': self.imgButton
	    });
	    $button.click(function(){
	        if(0 < self.times){
	            return;
	        }

	        //次数用尽
	        if(self.count <= 0){
	        	$wheelCtn.trigger(self.eventEnd, {status: 0});
	        	return;
	        }else{
	        	self.count -= 1;
	        	$wheelCtn.trigger(self.eventStart, self.count);
	        }

	        //隐藏按钮
	        $button.css('display', 'none');

	        //滚轮动画
	        $wheel.css({
	            'transition': 'transform .5s linear',
	            '-webkit-transition': '-webkit-transform .5s linear'
	        });

	        //轮盘转动
	        _trochalAction({extra: 0, times: 1});
	        clearInterval(self.intervalHandle);
	        self.intervalHandle = setInterval(_runTrochalDisk , 500);
	        
	        ajax({
	        	url: self.url,
	        	success: function(res){
	        		var data = res['data'];
	        		if(res.status == 1){
	        			self.reponse = res;
	        			self.angle = data.degree;
	        		}
	        	}
	        });
	    });
	    _buttonThrob();

	    //轮盘外圈
	    var $wheelCtn = $('<div></div>');
	    $wheelCtn.css({
	        'position': 'relative',
	        'box-sizing': 'border-box',
	        '-webkit-box-sizing': 'border-box',
	        'width': '100%',
	        'padding': '6%',
	        'font-size': 0,
	        'background': 'url(' + self.imgContent + ') center no-repeat',
	        'background-size': '100%'
	    });
	    $wheelCtn.append($star);
	    $wheelCtn.append($wheel);
	    $wheelCtn.append($cursor);
	    $wheelCtn.append($button);
	    $wheelCtn.EVENT_START = self.eventStart;
	    $wheelCtn.EVENT_END = self.eventEnd;

	    function _runTrochalDisk(){
	        var angle = $wheel.data('angle');
	        if(self.angle != 0){
	            var times = self.times < self.num? self.num - self.times: 1;
	            self.intervalHandle = clearInterval(self.intervalHandle);
	            $wheel.css({
	                'transition': 'transform ' + times + 's cubic-bezier(0, 0, 0, 1)',
	                '-webkit-transition': '-webkit-transform ' + times + 's cubic-bezier(0, 0.5, 0, 1)'
	            });
	            _trochalAction({extra: 360 - self.angle, times: times});
	            setTimeout(_stopTrochalDisk, times * 1000);
	        }else{
	            _trochalAction({extra: 0, times: 1});
	        }
	    }

	    function _stopTrochalDisk(){
	        self.times = 0;   //reset begin status
	        $button.css('display', 'block');
	        $wheelCtn.trigger(self.eventEnd, self.reponse);

	        _buttonThrob();	//重置按钮动画
	    }

	    function _trochalAction(parameters){
	        var extra = parameters.extra;
	        var times = parameters.times;
	        var prevAngle = $wheel.data('angle') || 0;
	        var angle = extra + prevAngle - prevAngle % 360 + 360 * times;
	        $wheel.data('angle', angle);
	        $wheel.css({
	            'transform': 'rotate(' + angle + 'deg)',
	            '-webkit-transform': 'rotate(' + angle + 'deg)'
	        });
	        self.times += 1;
	    }

	    function _buttonThrob(){
	        self.intervalHandle = setInterval(_buttonAction, 300);
	    }

	    function _buttonAction(){
	        var isScale = $button.data('scale');
	        if(isScale){
	            $button.css({
	                'transform': 'scale(1.0)',
	                '-webkit-transform': 'scale(1.0)'
	            });
	        }else{
	            $button.css({
	                'transform': 'scale(0.9)',
	                '-webkit-transform': 'scale(0.9)'
	            });
	        }
	        $button.data('scale', !isScale);
	    }

	    return $wheelCtn;
	},

	/**
	 * 将一个过去的时间戳转换成"XXX前"的文字
	 * @param int timeStamp 小于当前时间的过去的时间戳,单位:秒
	 * @returns string
	 */
	timeToAgo : function(timeStamp){
		var seconds = Math.floor(($.now()) / 1000) - timeStamp;
		if(seconds < 1) {
			return '刚刚';
		}
		if(seconds >= 1 && seconds < 60){
			return parseInt(seconds) + '秒前';
		}else if (seconds >= 60 && seconds < 3600){
			var minutes = Math.floor(seconds / 60);
			return minutes + '分钟前';
		}else if (seconds >= 3600 && seconds < 86400){
			var hour = Math.floor(seconds / 3600);
			return hour + '小时前';
		}else if (seconds >= 86400 && seconds < 172800){
			return '昨天';
		}else if (seconds >= 172800 && seconds < 259200){
			return '前天';
		}else{
			var manyDay = Math.floor(seconds / 86400);
			if(isNaN(manyDay)){
				return '未知';
			}

			if(manyDay < 30){
				return manyDay + '天前';
			}else if(manyDay > 30 && manyDay < 180){
				return Math.floor(manyDay / 30) + '个月前';
			}else if(manyDay > 180 && manyDay < 365){
				return '半年前';
			}

			return '很久以前';
		}
	},

	date : function(format, timestamp, isLocalTime){
		if(isLocalTime == undefined){
			isLocalTime = true;
		}

		if(!isLocalTime){
			var oLocalDate = new Date();
			timestamp = timestamp - Math.abs(oLocalDate.getTimezoneOffset()) * 60;
		}

		var jsdate = new Date(timestamp * 1000);


		//补零
		var pad = function(data, len){
			if((data += '').length < len){
				//计算要补多少个零
				len = len - data.length;
				var str =  '0000';
				return data = str.substr(0, len) + data;
			}else{
				return data;
			}
		};
		var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		//计算一年中的第几天
		var inYearDay = function(){
			var aDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var day = jsdate.getDate();
			var month = jsdate.getMonth();
			var year = jsdate.getFullYear();
			var $reDay = 0;
			for(var i = 0; i < month; i++){
				$reDay += aDay[i];
			}
			$reDay += day;
			//计算闰年
			if(month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
				$reDay += 1;
			}
			return $reDay;
		};

		var fm = {
			//天
			j : function(){return jsdate.getDate();},
			d : function(){return pad(fm.j(), 2);},
			w : function(){return jsdate.getDay();},
			l : function(){return weekdays[fm.w()];},
			D: function(){return fm.l().substr(0,3);},
			N : function(){return fm.w() + 1;},
			z : function(){return inYearDay();},

			//月
			n : function(){return jsdate.getMonth() + 1;},
			m : function(){return pad(fm.n(), 2);},
			t : function(){
				var n;
				if( (n = jsdate.getMonth() + 1) == 2 ){
					return 28 + fm.L();
				} else{
					if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
						return 31;
					} else{
						return 30;
					}
				}
			},

			//年
			Y : function(){return jsdate.getFullYear();},
			y : function(){return (jsdate.getFullYear() + "").slice(2);},
			L : function(){var y = fm.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;},

			//秒
			s : function(){return pad(jsdate.getSeconds(), 2);},

			//分
			i : function(){return pad(jsdate.getMinutes(), 2);},

			//时
			H : function(){return pad(jsdate.getHours(), 2);},
			g : function(){return jsdate.getHours() % 12 || 12;},

			//am或pm
			a : function(){return jsdate.getHours() > 11 ? 'pm' : 'am';},

			//AM或PM
			A : function(){return fm.a().toUpperCase();},

			//周
			W : function(){
				var a = fm.z(), b = 364 + fm.L() - a;
				var nd2, nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() || 7) - 1;
				if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
					return 1;
				} else{
					if(a <= 2 && nd >= 4 && a >= (6 - nd)){
						nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
						return self.date("W", Math.round(nd2.getTime()/1000));
					} else{
						return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
					}
				}
			}

		};

		//分析format
		return format.replace(/[\\]?([a-zA-Z])/g, function(rekey1, rekey2){
			var result = '';
			if(rekey1 != rekey2){
				result = rekey2;
			}else if(fm[rekey2]){
				result = fm[rekey2]();
			}else{
				result = rekey2;
			}
			return result;
		});
	},

	/**
	 * 将一个秒数转换成时分秒表达式
	 * @param int seconds
	 * @returns {String}
	 */
	timeToFormatStr : function(seconds){
		seconds = parseInt(seconds);
		var hourse = Math.floor(seconds / 3600),
		minute = Math.floor((seconds - hourse * 3600) / 60),
		second = seconds - hourse * 3600 - minute * 60;

		if(hourse < 10){
			hourse = '0' + hourse;
		}
		if(minute < 10){
			minute = '0' + minute;
		}
		if(second < 10){
			second = '0' + second;
		}
		return hourse + ':' + minute + ':' + second;
	},

	/**
	 * 将一个时间戳转换成星座名称并返回
	 * @author zhou
	 * @return {mixed} 成功返回星座名，失败返回false
	 */
	timeToConstellation : function(timeStamp){
		timeStamp = parseInt(timeStamp * 1000);
		if(timeStamp === NaN){
			return false;
		}

		var oDate = new Date(timeStamp);
		var month = oDate.getUTCMonth() + 1;
		var day = oDate.getUTCDate();

		var _getAstro = function(month, day){
			var s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
			var arr = [20,19,21,21,21,22,23,23,23,23,22,22];
			return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
		};

		return _getAstro(month, day);
	},

	renderSlide : function($wrapper, aBannerList){
		var photosHtml = [];
		if(aBannerList.length > 1){
			photosHtml = '<a id="UFbanner_pre_img" target="_blank"><img width="1000" height="80" /></a>\
				<a id="UFbanner_cur_img" target="_blank"><img width="1000" height="80" /></a>\
				<a id="UFbanner_nex_img" target="_blank"><img width="1000" height="80" /></a>\
				<img id="UFbanner_left" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAJFBMVEUAAAAAAACqqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHYGc9AAAADHRSTlOAAMBoCBhgWFBIMCDWvd32AAAAz0lEQVQoz43TOw6CQBSF4T+M4qMjkRBDY1gBhQvAuAHZAUuQHVBb6Q4obdmhMCNzJ7nRcLo5+bp7hsTm8C7BPC7u5cr8js1mkDJt+CauffnEZzeXV4KcXZmWBDH1VAosTpbacoaRK81UHj10Ja+xvHlYYLMeyyaANnFCHkKXgSyELi2VgqzoFWRPpyBbSgUxaAgI1CULZbSElpoaOk239Ci6p0LRFRmKtuQoOvhzCI3lcELX4YkjObGMARmDzEYWhh7Yzynq0ep5//sI+st8AMGAJfV4wTOqAAAAAElFTkSuQmCC">\
				<img id="UFbanner_right" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAALVBMVEUAAAAAAACqqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrWvIMAAAAD3RSTlOAAMBoCRhgWFBIIDAXMQd/aZr8AAAA2UlEQVQoz4XTsQ2CQBjF8X88RY02JhojlXGCK6wNxgVkA0aQDehtZAQ2sLRlA0vHEe/kjtxH9HW8/ELzvWNhsnxoUNej/bJlfMFkXPlylfFNVLvyhsu0LU90crDlSndLVZvSwMHOUVNqW25b+ik32NLRsinPmOwcnTdlRkCjBTGEtGINIc1JEHTIHUFnFAg6QSOoAiQFJCWgf6X8p4RaQkUh4YSngMxIBGTIWkByYgGp3Dk8jMzhAjjyJ3aQ0o/BQeVn47PvG1gqp8i+f7Ry3umPh2CyfHWfzBvroCa4Cn7xkwAAAABJRU5ErkJggg==">';

		}else{
			photosHtml = '<a target="_blank" href="' + aBannerList[0].url + '"><img width="1000" height="80" src="' + aBannerList[0].img + '" /></a>';
		}

		var $slider = $('<div id="UFbanner" class="ufSlider">\
	<style>\
	#UFbanner{width:1000px; margin:0px auto; height:80px; overflow:hidden; position:relative; border-radius:5px;}\
	#UFbanner a{display:block; position:absolute;}\
	#UFbanner a img{display:block; max-width:1000px;}\
	#UFbanner_left{position:absolute; top:20px; left:10px; cursor:pointer;}\
	#UFbanner_right{position:absolute; top:20px; right:10px; cursor:pointer;}\
	#UFbanner_pre_img {left:-1000px;}\
	#UFbanner_nex_img {left:1000px;}\
</style>\n\
	' + photosHtml + '\
</div>');

		$wrapper.html($slider);

		if(aBannerList.length == 1){
			return;
		}

		var rndIndex = parseInt(Math.random() * aBannerList.length);
		var $cur = $('#UFbanner_cur_img');
		var $curImg = $('#UFbanner_cur_img img');
		$cur.attr('href', aBannerList[rndIndex].url);
		$curImg.attr('src', aBannerList[rndIndex].img);
		$curImg.attr('index', rndIndex);
		var update = function(a,b,c,x){
			var p = (x - 1 + aBannerList.length) % aBannerList.length;
			$('#' + a ).attr('href', aBannerList[p].url);
			$('#' + a +' img').attr('src', aBannerList[p].img);
			$('#' + a +' img').attr('index', p);
			var n = (x + 1)  % aBannerList.length;
			$('#' + c ).attr('href', aBannerList[n].url);
			$('#' + c +' img').attr('src', aBannerList[n].img);
			$('#' + c +' img').attr('index', n);
		};
		var play = function(a,b,c,x){
			$('#'+a).css({'z-index':'0'});
			$('#'+b).css({'z-index':'0'});
			$('#'+c).css({'z-index':'-1'});
			$('#'+a).animate({'left':'0px'});
			if(x > 0){
				$('#'+b).animate({'left':'1000px'});
				$('#'+c).animate({'left':'-1000px'});
			}else{
				$('#'+b).animate({'left':'-1000px'});
				$('#'+c).animate({'left':'1000px'});
			}
			$('#'+b).attr('id', b+'__');
			$('#'+a).attr('id', b);
			$('#'+c).attr('id', a);
			$('#'+b+'__').attr('id', c);
		};
		update('UFbanner_pre_img', 'UFbanner_cur_img', 'UFbanner_nex_img', rndIndex);
		var autoSlideHandler = setInterval(function(){
			$('#UFbanner_right').trigger('click');
		}, 4000);
		$('#UFbanner_left').click(function(){
			autoSlideHandler && clearInterval(autoSlideHandler);
			play('UFbanner_pre_img', 'UFbanner_cur_img', 'UFbanner_nex_img', 1);
			update('UFbanner_pre_img', 'UFbanner_cur_img', 'UFbanner_nex_img', parseInt($('#UFbanner_cur_img img').attr('index')));
		});
		$('#UFbanner_right').click(function(){
			autoSlideHandler && clearInterval(autoSlideHandler);
			play('UFbanner_nex_img', 'UFbanner_cur_img', 'UFbanner_pre_img', -1);
			update('UFbanner_pre_img', 'UFbanner_cur_img', 'UFbanner_nex_img', parseInt($('#UFbanner_cur_img img').attr('index')));
		});
	}
};

var self = win.Ui;
})($, window);