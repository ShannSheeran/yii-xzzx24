define('app/common/Ui',['jQuery'],function(require, exports, module){
	var $ =  require("jQuery");	
	var _aPathInfo = (function () {
		var $scripts = $('script');
		var src = $scripts[0].src;
		return {
			domain: src.match(/http:\/\/([^\/]+)\//i)[0],
			rootPath: src.substr(0, src.lastIndexOf('static/'))
		};
	})();
        
        var loading = function () {
            var contHeight = $(window).height() + 800;
            var contop = 0;
            if ($(window).get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = $(window).offset().top;
            }

            $.each(oImageList, function (i, data) {
                var o = data.obj, url = data.url, post, posb;
                if (o) {
                    post = o.offset().top - contop, post + o.height();

                    if (o.is(':visible') && (post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            $('<img src="' + url + '">').appendTo('body').hide().load(function () {
                                o.attr('onload', '').attr('src', url).attr('real', '');
                                $(this).remove();
                            });
                        }
                        data.obj = null;
                    }
                }
            });
        };
    console.log(_aPathInfo);
	var Ui = {
		rootPath: _aPathInfo.rootPath,
		resourceUrl: _aPathInfo.domain,
		defaultImage: _aPathInfo.rootPath + 'static/h5/img_error1.png',
		defaultProfile: _aPathInfo.rootPath + 'static/h5/head_error.png',
		/**
		 * 构建img标签
		 * @param {type} imageUrl 图片地址
		 * @returns {String}
		 */
		buildImage: function (imageUrl, defaultImage, aOptions) {
			if (defaultImage == undefined) {
				defaultImage = self.defaultImage;
			}

			var aAxtendAttrs = [];	//扩展属性
			if (aOptions != undefined) {
				delete aOptions.src;
				delete aOptions.real;
				for (var name in aOptions) {
					aAxtendAttrs.push(' ' + name + '="' + aOptions[name] + '"');
				}
			}

			return '<img src="' + defaultImage + '" real="' + imageUrl + '"' + aAxtendAttrs.join('') + ' onload="Ui.loadImage(this)" />';
		},
		/**
		 * 加载img标签的real地址到src
		 * @param {type} o
		 * @returns {undefined}
		 */
		loadImage: function (o) {                        
			var $o = $(o);                        
			var imgUrl = $o.attr('real');
                        var data = {
                            obj: $o,
                            url: imgUrl
                        };
                         oImageList.push(data);
                         //每次更新
                        return loading();
			$('<img src="' + imgUrl + '">').appendTo('body').hide().load(function () {
				$o.attr('onload', '').attr('src', imgUrl).attr('real', '');
				$(this).remove();
			});
		},
		/**
		 * 将一个过去的时间戳转换成"XXX前"的文字
		 * @param int timeStamp 小于当前时间的过去的时间戳,单位:秒
		 * @returns string
		 */
		timeToAgo: function (timeStamp) {
			var seconds = Math.floor(($.now()) / 1000) - timeStamp;
			if (seconds < 1) {
				return '刚刚';
			}
			if (seconds >= 1 && seconds < 60) {
				return parseInt(seconds) + '秒前';
			} else if (seconds >= 60 && seconds < 3600) {
				var minutes = Math.floor(seconds / 60);
				return minutes + '分钟前';
			} else if (seconds >= 3600 && seconds < 86400) {
				var hour = Math.floor(seconds / 3600);
				return hour + '小时前';
			} else if (seconds >= 86400 && seconds < 172800) {
				return '昨天';
			} else if (seconds >= 172800 && seconds < 259200) {
				return '前天';
			} else {
				var manyDay = Math.floor(seconds / 86400);
				if (isNaN(manyDay)) {
					return '未知';
				}

				if (manyDay < 30) {
					return manyDay + '天前';
				} else if (manyDay > 30 && manyDay < 180) {
					return Math.floor(manyDay / 30) + '个月前';
				} else if (manyDay > 180 && manyDay < 365) {
					return '半年前';
				}

				return '很久以前';
			}
		},
		date: function (format, timestamp, isLocalTime) {
			if (isLocalTime == undefined) {
				isLocalTime = true;
			}

			if (!isLocalTime) {
				var oLocalDate = new Date();
				timestamp = timestamp - Math.abs(oLocalDate.getTimezoneOffset()) * 60;
			}

			var jsdate = new Date(timestamp * 1000);


			//补零
			var pad = function (data, len) {
				if ((data += '').length < len) {
					//计算要补多少个零
					len = len - data.length;
					var str = '0000';
					return data = str.substr(0, len) + data;
				} else {
					return data;
				}
			};
			var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

			//计算一年中的第几天
			var inYearDay = function () {
				var aDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				var day = jsdate.getDate();
				var month = jsdate.getMonth();
				var year = jsdate.getFullYear();
				var $reDay = 0;
				for (var i = 0; i < month; i++) {
					$reDay += aDay[i];
				}
				$reDay += day;
				//计算闰年
				if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
					$reDay += 1;
				}
				return $reDay;
			};

			var fm = {
				//天
				j: function () {
					return jsdate.getDate();
				},
				d: function () {
					return pad(fm.j(), 2);
				},
				w: function () {
					return jsdate.getDay();
				},
				l: function () {
					return weekdays[fm.w()];
				},
				D: function () {
					return fm.l().substr(0, 3);
				},
				N: function () {
					return fm.w() + 1;
				},
				z: function () {
					return inYearDay();
				},
				//月
				n: function () {
					return jsdate.getMonth() + 1;
				},
				m: function () {
					return pad(fm.n(), 2);
				},
				t: function () {
					var n;
					if ((n = jsdate.getMonth() + 1) == 2) {
						return 28 + fm.L();
					} else {
						if (n & 1 && n < 8 || !(n & 1) && n > 7) {
							return 31;
						} else {
							return 30;
						}
					}
				},
				//年
				Y: function () {
					return jsdate.getFullYear();
				},
				y: function () {
					return (jsdate.getFullYear() + "").slice(2);
				},
				L: function () {
					var y = fm.Y();
					return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
				},
				//秒
				s: function () {
					return pad(jsdate.getSeconds(), 2);
				},
				//分
				i: function () {
					return pad(jsdate.getMinutes(), 2);
				},
				//时
				H: function () {
					return pad(jsdate.getHours(), 2);
				},
				g: function () {
					return jsdate.getHours() % 12 || 12;
				},
				//am或pm
				a: function () {
					return jsdate.getHours() > 11 ? 'pm' : 'am';
				},
				//AM或PM
				A: function () {
					return fm.a().toUpperCase();
				},
				//周
				W: function () {
					var a = fm.z(), b = 364 + fm.L() - a;
					var nd2, nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() || 7) - 1;
					if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
						return 1;
					} else {
						if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
							nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
							return self.date("W", Math.round(nd2.getTime() / 1000));
						} else {
							return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
						}
					}
				}

			};

			//分析format
			return format.replace(/[\\]?([a-zA-Z])/g, function (rekey1, rekey2) {
				var result = '';
				if (rekey1 != rekey2) {
					result = rekey2;
				} else if (fm[rekey2]) {
					result = fm[rekey2]();
				} else {
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
		timeToFormatStr: function (seconds,isShowDay,dayTag,hourseTag,minuteTag,secondTag) {
			seconds = parseInt(seconds);
			var hourse = Math.floor(seconds / 3600),
            minute = Math.floor((seconds - hourse * 3600) / 60),
            second = seconds - hourse * 3600 - minute * 60;
            var day = Math.floor(hourse / 24);
            if(isShowDay != undefined){
                hourse = hourse - (day * 24);
            }
			if (hourse < 10) {
				hourse = '0' + hourse;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			if (second < 10) {
				second = '0' + second;
			}
            var dTag =':' ,hTag = ':',mTag=':',sTag=':';
            if(dayTag != undefined){
                dTag = dayTag;
            }
            if(hourseTag != undefined){
                hTag = hourseTag;
            }
            if(minuteTag != undefined){
                mTag = minuteTag;
            }
            if(secondTag != undefined){
                sTag = secondTag;
            }
            if(isShowDay != undefined){
                return day + dTag + hourse + hTag + minute + mTag + second +sTag;
            }
			return hourse + hTag + minute + mTag + second +sTag;
		},
		/**
		 * 将一个时间戳转换成星座名称并返回
		 * @author zhou
		 * @return {mixed} 成功返回星座名，失败返回false
		 */
		timeToConstellation: function (timeStamp) {
			timeStamp = parseInt(timeStamp * 1000);
			if (timeStamp === NaN) {
				return false;
			}

			var oDate = new Date(timeStamp);
			var month = oDate.getUTCMonth() + 1;
			var day = oDate.getUTCDate();

			var _getAstro = function (month, day) {
				var s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
				var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
				return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
			};

			return _getAstro(month, day);
		}


	};

	var self = Ui;
	window.Ui = Ui;
        var oImageList = [];
	module.exports = Ui;        
        $(window)[0].addEventListener("scroll", loading);
});
