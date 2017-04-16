try{//防止运营商广告iframe嵌套
	if(top != self && top.location.hostname.search('umfun') == -1){throw 'iframejacking';}
}catch(e){
	top.location = self.location;
}

//IE方法修复
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){               
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
} 

(function($, win){
function _clone(oObj){
	//数组或对象克隆
	if(oObj == null || typeof(oObj) !== 'object'){
		return oObj;
	}

	try{
		var oTempObj = new oObj.constructor();
	}catch(e){
		$.error('对象克隆失败,请确认对象中没有jQuery的fn对象');
		return oObj;
	}

	for(var key in oObj){
		oTempObj[key] = arguments.callee(oObj[key]);
	}
	return oTempObj;
}


/**
 * JS辅助工具
 */
var JsTools = {
    /**
     * 检测一个变量是否对象
     */
    isObject : function(variable){
        return typeof(variable) == 'object' && Object.prototype.toString.call(variable).toLowerCase() == '[object object]' && !variable.length;
    },

    /**
     * 合并两个数组或对象
     */
    merge : function(obj1, obj2) {
        var oTmpObj1 = this.clone(obj1);
        if($.isArray(obj1) && $.isArray(obj2)){
            for(var i in obj2){
                if($.inArray(obj2[i], oTmpObj1) === -1){
                    oTmpObj1.push(obj2[i]);
                }
            }
        }else if($.isPlainObject(obj1) && $.isPlainObject(obj2)){
            for(var key in obj2) {
                if(oTmpObj1.hasOwnProperty(key) || obj2.hasOwnProperty(key)){
                    oTmpObj1[key] = obj2[key];
                }
            }
        }
        return this.clone(oTmpObj1);
    },

    /**
     * 判断一个元素是否在数组内
     * @param {type} value 元素值
     * @param {type} array 数组
     * @param {type} isStrict 是否严格模式
     * @returns {Boolean}
     */
    inArray : function(value, array, isStrict){
        for(var i in array){
            if(array[i] == value && !isStrict){
                return true;
            }else if(array[i] === value && isStrict){
                return true;
            }
        }
        return false;
    },

    /**
     * 计算数组最大最小值差距
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    calArray : function(array){
        return Math.max.apply(null, array) - Math.min.apply(null,array);
    },

	removeArrayItemIndex : function(aArray, removeIndex){
		if(isNaN(removeIndex) || removeIndex > aArray.length){
			return false;
		}

		for(var i = 0, n = 0; i < aArray.length; i++){
			if(aArray[i] != aArray[removeIndex]){
				aArray[n++] = aArray[i];
			}
		}
		aArray.length--;
		return aArray;
	},

    /**
     * 克隆一个数组或对象
     */
    clone : _clone,

    shuffle : function(aArray){
        aArray.sort(function(key, value){
            return Math.random() > 0.5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
        });
        return aArray;
    },

    getCache : function(key){
    	if(localStorage && localStorage.getItem){
    		return localStorage.getItem(key);
    	}
    },

    setCache : function(key, value){
    	if(localStorage && localStorage.setItem){
    		return localStorage.setItem(key, value);
    	}
    }
};

win.JsTools = $.extend(win.JsTools, JsTools);

/**
 * 事件类
 * @param {type} aConfig 字段配置
 */
win.UmFunEvent = function(aConfig){
	this.name = '';
	this.oSender = null;
	this.xSenderData = {};
	if(aConfig != undefined){
		if(aConfig.name){
			this.name = aConfig.name;
		}

		if(aConfig.oSender){
			this.oSender = aConfig.oSender;
		}

		if(aConfig.xSenderData){
			this.xSenderData = aConfig.xSenderData;
		}
	}
	this.xListenerData = {};
	this.handled = false;
};

/**
 * 前端组件
 * @returns
 */
win.Component = function(){
	this.aRegisterEvents = [];
};
/**
 * 添加监听事件
 * @param {type} eventName 事件名称
 * @param {type} callBack 回调
 * @param {type} xParams = null 附加参数
 * @param {type} isAppend = true 是否追加到事件列表的最后
 */
win.Component.prototype.bindEvent = function(eventName, fCallback, xParams, isAppend){
	if(this.aRegisterEvents[eventName] == undefined){
		//分配事件储存空间
		this.aRegisterEvents[eventName] = [];
	}

	var oEvent = {
		fCallback : fCallback,
		xParams : xParams
	};
	if(isAppend == undefined){
		isAppend = true;
	}

	if(isAppend === undefined || isAppend){
		this.aRegisterEvents[eventName].push(oEvent);
	}else{
		this.aRegisterEvents[eventName].unshift(oEvent);
	}
};

win.Component.prototype.hasEvent = function (eventName){
	return this.aRegisterEvents[eventName] !== undefined;
};

/**
 * 触发事件
 * @param {type} eventName 事件名称
 * @param {type} oContextEvent = null 事件上下文
 */
win.Component.prototype.triggerEvent = function(eventName, oContextEvent){
	if(this.aRegisterEvents[eventName] == undefined){
		return;
	}

	for(var i in this.aRegisterEvents[eventName]){
		var oRegisterEvent = this.aRegisterEvents[eventName][i];
		if(oContextEvent instanceof UmFunEvent){
			oEvent = oContextEvent;
			if(!oEvent.name){
				oEvent.name = eventName;
			}
			if(!oEvent.oSender){
				oEvent.oSender = this;
			}
			if(oRegisterEvent.xParams != undefined){
				oEvent.xListenerData = oRegisterEvent.xParams;
			}
		}else{
			var oEvent = new UmFunEvent({
				name : eventName,
				oSender : this
			});
			if(oRegisterEvent.xParams != undefined){
				oEvent.xListenerData = oRegisterEvent.xParams;
			}
		}
		oEvent.handled = false;
		if(oRegisterEvent.fCallback){
			oRegisterEvent.fCallback(oEvent);
		}
		if(oEvent.handled){
			return;
		}
	}
};
})(jQuery, window);

(function($, win){
	//Umfun前端应用程序对象
    win.UmFun = {
		EVENT_AFTER_AJAX_SUCCESS : 'after_ajax_success',
		url : {
			resource : '',	//'http://s.umfun.com'
			updateStudentInfo : ''
		},
		tips : {},
		domain : '',
		isDebug : false,
		inited : false,	//是否已经初始化
		oCurrentStudent: null,
		isNative: window.AndroidSDK ? window.AndroidSDK.isInstalled() : false,		//是否app端
		isComputer: !new RegExp('iPhone|Android').test(navigator.userAgent), 	//是否PC端
		isIos: new RegExp('\\(i[^;]+;( U;)? CPU.+Mac OS X').test(navigator.userAgent),

		//配置
		config : function(aConfig){
			aConfig = $.extend({
				url : {
					resource : ''
				},
				tips : {},
				domain : ''
			}, aConfig);

			if(aConfig.url){
				$.extend(self.url, aConfig.url);
				if(self.url.resource.substr(-1) != '/'){
					//resource地址自动加上/号结尾
					self.url.resource += '/';
				}
			}

			var aRootKeys = ['tips', 'domain', 'oCurrentStudent'];
			for (var i in aRootKeys) {
				var key = aRootKeys[i];
				if(!aConfig[key]){
					continue;
				}
				self[key] = aConfig[key];
			}

			if(self.oCurrentStudent){
				//扩展当前用户
				self.oCurrentStudent.EVENT_AFTER_UPDATE_INFO = 'after_update_info';
				self.oCurrentStudent.hasNewMessage = _hasNewMessage;
				self.oCurrentStudent.hasEventNotice = _hasEventNotice;
				self.oCurrentStudent.hasFriendNotice = _hasFriendNotice;
				self.oCurrentStudent.hasHomework = _hasHomework;
				self.oCurrentStudent.updateInfo = function(){

					if(!self.getUrl('updateStudentInfo')){
						$.error('缺少更新信息地址');
						return false;
					}
					ajax({
						url : self.getUrl('updateStudentInfo'),
						success : function(aResult){
							if(aResult.status != 1){
								$.error('更新用户信息失败');
								return;
							}

							var aNewUserInfo = aResult.data.info;
							for(var field in aResult.data.info){
								self.oCurrentStudent[field] = aNewUserInfo[field];
							}

							self.oCurrentStudent.ub = Number(self.oCurrentStudent.ub);
							self.oCurrentStudent.gold = Number(self.oCurrentStudent.gold);
							self.oCurrentStudent.level = Number(self.oCurrentStudent.level);

							self.oCurrentStudent.triggerEvent(self.oCurrentStudent.EVENT_AFTER_UPDATE_INFO);
						}
					});
				};

				self.oCurrentStudent.ub = Number(self.oCurrentStudent.ub);
				self.oCurrentStudent.gold = Number(self.oCurrentStudent.gold);
				self.oCurrentStudent.level = Number(self.oCurrentStudent.level);

				$.extend(self.oCurrentStudent, new Component());

				/*if(self.getUrl('updateStudentInfo')){
					//定时更新用户信息,也能顺便定时更新token
					setInterval(function(){
						self.oCurrentStudent.updateInfo();
					}, 600000);
				}*/
			}

			self.inited = true;
		},

		/**
		 * 获取URL
		 * @param {type} pageName 标识符
		 * @returns String URL字符串
		 */
		getUrl : function(key){
			if(self.url[key] != undefined){
				return self.url[key];
			}else{
				return '';
			}
		},

		/**
		 * 导入URL列表
		 * @param {type} aUrlList
		 */
		importUrl : function(aUrlList){
			for(var pageName in aUrlList){
				self.url[pageName] = aUrlList[pageName];
			}
		}
	};

	/**
	 * 是否有新的小纸条
	 * @returns {Boolean}
	 */
	function _hasNewMessage(){
		return self.oCurrentStudent.has_new_message > 0;
	}

	/**
	 * 是否有新的与我相关消息
	 * @returns {Boolean}
	 */
	function _hasEventNotice(){
		return self.oCurrentStudent.new_feed_flag > 0;
	}

	/**
	 * 是否有新的好友请求要处理
	 * @returns {Boolean}
	 */
	function _hasFriendNotice(){
		return self.oCurrentStudent.new_friend_flag > 0;
	}

	/**
	 * 是否有新测验
	 * @returns {Boolean}
	 */
	function _hasHomework(){
		return self.oCurrentStudent.new_home_work > 0;
	}	

	win.App = win.UmFun;	//增加App别名
	var self = win.UmFun;
	$.extend(self, new Component());
})(jQuery, window);



(function (oContainer, $) {
oContainer.UmFunRequestManager = {
	STATUS_REQUESTING : 1,
	STATUS_OVER : 2,
	aQueque : {},
	isRequesting : function(url, xParams){
		return self.aQueque[url + _convertParams(xParams)] != undefined;
	},
	addQueque : function(url, xParams){
		self.aQueque[url + _convertParams(xParams)] = self.STATUS_REQUESTING;
	},
	markOver : function(url, xParams){
		delete self.aQueque[url + _convertParams(xParams)];
	}
};

function _convertParams(xParams){
	var params = '';
	if(typeof xParams == 'object'){
		params = $.param(xParams);
	}
	return params;
}

var self = oContainer.UmFunRequestManager;
})(window, jQuery);

/**
 * 封装的ajax
 * @param {type} aTmpOption ajax选项
 * @returns {undefined}
 */
function ajax(aTmpOption){
	if(!aTmpOption.url){
		$.error('亲,没配置URL啊');
		return;
	}

	var aOption = JsTools.clone(aTmpOption);
	aOption.type = aOption.type || 'post';
	aOption.dataType = aOption.dataType || 'json';

	if(aOption.type == 'post'){
		if(aOption.data == undefined){
			aOption.data = {};
		}
		if(typeof(aOption.data) == 'object' && aOption.data['_csrf'] == undefined){
			var csrfToken = $('meta[name="csrf-token"]').attr('content');
			if(csrfToken){
				aOption.data['_csrf'] = csrfToken;
			}else{
				UBox.show('会话信息已过期,请刷新重试');
			}
		}
	}

	if(!aOption.error){
		aOption.error = function(oXhr){
			if(window.App && App.errorHandler){
				App.errorHandler(oXhr);
			}else{
				if(!(oXhr.status >= 300 && oXhr.status < 400 && oXhr.status != 304)){
					if(oXhr.responseText.length){
						UBox.show(oXhr.responseText);
					}else{
						UBox.show('抱歉,系统繁忙,请重试!');
					}
				}
			}
			if(aOption.afterError){
				aOption.afterError(oXhr);
			}
		};
	}

	aOption.success = function(aResult, status, oXhr){
		if(aResult.token != undefined && window.App){
			$('meta[name="csrf-token"]').attr('content', aResult.token); //更新口令
		}

		var contentType = oXhr.getResponseHeader('content-type');
		if(contentType && contentType.indexOf('application/json') != -1){
			//返回的是JSON才触发该事件!
			var oEvent = new UmFunEvent();
			oEvent.aResult = JsTools.clone(aResult);
			App.triggerEvent(App.EVENT_AFTER_AJAX_SUCCESS, oEvent);
		}

		aTmpOption.success(aResult);
		if(aTmpOption.afterDelay){
			var delayTime = 300;
			if(aTmpOption.delayTime){
				delayTime = aTmpOption.delayTime;
			}
			setTimeout(function(){
				aTmpOption.afterDelay(aResult);
			}, delayTime);
		}
	};

	if(UmFunRequestManager.isRequesting(aOption.url, aOption.data)){
		aOption.onResendBeforeOver && aOption.onResendBeforeOver();
		return;
	}

	aOption.beforeSend = function(oXhr){
		UmFunRequestManager.addQueque(aOption.url, aOption.data);
		aTmpOption.beforeSend && aTmpOption.beforeSend(oXhr);
	};

	aOption.complete = function(oXhr){
		UmFunRequestManager.markOver(aOption.url, aOption.data);
		//自带的请求完成回调
		if(oXhr.status >= 300 && oXhr.status < 400 && oXhr.status != 304){
			var redirectUrl = oXhr.getResponseHeader('X-Redirect');
			if(oXhr.responseText){
				if(window.UBox){
					UBox.show(oXhr.responseText, 0, redirectUrl);
				}else{
					alert(oXhr.responseText);
					location.href = redirectUrl;
				}
			}else{
				location.href = redirectUrl;
			}
		}
		aTmpOption.complete && aTmpOption.complete(oXhr);
	};

	return $.ajax(aOption);
}



window.onerror = function(msg, url, line, col, error){
	var logUrl = App.getUrl('add_js_log');
	if(logUrl == ''){
		return;
	}
	if (!url){
		return true;
	}else if(msg.search(/ReferenceError.*(PageIndex|PageManager).*not.*defined/) != -1){
		window.document.body.innerHTML += '<div style="text-align: center; font-size: large;">资源加载失败<br>请刷新!</div>';
		return true;
	}

	setTimeout(function(){
		var data = {};
		//不一定所有浏览器都支持col参数
		col = col || (window.event && window.event.errorCharacter) || 0;

		data.url = url;
		data.line = line;
		data.col = col;
		if (!!error && !!error.stack){
			//如果浏览器有堆栈信息
			//直接使用
			data.msg = error.stack.toString();
		}else if (!!arguments.callee){
			//尝试通过callee拿堆栈信息
			var ext = [];
			var f = arguments.callee.caller, c = 3;
			//这里只拿三层堆栈信息
			while (f && (--c > 0)) {
			   ext.push(f.toString());
			   if (f  === f.caller) {
					break;//如果有环
			   }
			   f = f.caller;
			}
			ext = ext.join(',');
			data.msg = ext;
		}
		//把data上报到后台！
		data.errorMsg = msg;
		data.cookie = document.cookie;
		data.requestUrl = window.location.href;
		data.userAgent = navigator.userAgent;

		$.ajax({
			url : logUrl,
			method : 'POST',
			crossDomain : true,
			data : {data : data},
			success : $.noop,
			error : $.noop
		});
	},0);
	$.error(msg);
	return true;
};

/**
 * 联系方式通用组件
 * @param  {[type]} param[title] 标题文本
 * @param  {[type]} param[button] 确认按钮文本
 * @param  {[type]} param[buttonBg] 确认按钮背景颜色(可选)
 * @param  {[type]} param[buttonCancel] 取消按钮文本(可选)
 * @param  {[type]} param[buttonCancelBg] 取消按钮背景颜色(可选)
 * @param  {[type]} param[desc] 额外说明
 * @param  {[type]} param[aFormData] 表单数据对象（键值对形式），key值可选['contact', 'qq', 'phone', 'areaId', 'address']
 * @param  {[type]} param[callback] 按钮回调事件第二个参数为表单数据
 * @return {[type]} 联系方式组件jQuery对象
 * var $contact = window.buildContact({
 *     title: '标题',
 *     button: '按钮',
 *     desc: '说明内容',
 *     aFormData: {
 *         'contact': '',
 *         'qq': '',
 *         'phone': '',
 *         'areaId': '',
 *         'address': ''
 *     }
 * });
 * $contact.bind($contact.RES_SUBMIT, function(event, aForm){});
 * $contact.bind($contact.RES_CANCEL, function(event){});
 */
window.buildContact = function(param){
	var title = param['title'];
	var desc = param['desc'];
	var button = param['button'];
	var buttonCancel = param['buttonCancel'];
	var bgColor = param['bgColor'] || 'white';
	var buttonBg = param['buttonBg'] || 'orange';	//确定按钮颜色
	var buttonCancelBg = param['buttonCancelBg'] || '#f16139';	//确定按钮颜色
	var aFormData = param['aFormData'];
	var html = '<div class="J-contact-container pop-contact-container"> <style> .pop-contact-container {display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;padding-top: 10%;background: rgba(0, 0, 0, 0.5);background-size: 320px; } .contact-form {margin: 0 auto;width: 100%;max-width: 640px;padding: 10px 15px;background-color: white;box-sizing: border-box;-webkit-box-sizing: border-box; } .contact-form > .title {font-size: 1.4rem; } .contact-form > .title > .strong {text-align: center;font-size: 1.6rem; } .contact-form > div {margin: 5px 0; } .contact-form > div > select {padding: 6px;font-size: 1.4rem;width: 31%;border-radius: 5px;border: 1px solid #CCCCCC; } .contact-form > div > select:first-child {width: 32%;margin-right: 3%; } .contact-form > div > select:last-child {margin-left: 3%; } .contact-form > div > input, .contact-form > div > textarea {margin: 0;padding: 6px;font-size: 1.6rem;width: 100%;border-radius: 5px;border: 1px solid #CCCCCC;box-sizing: border-box;-webkit-box-sizing: border-box; }.contact-form > .contact-button{text-align: center;} .contact-form > .contact-button > button {display: inline-block;width: 30%;border: 0;border-radius: 5px;padding: 5px 0;font-size: 1.6rem;font-weight: bold;margin: 0 5px;color: white; } @media screen and (min-width: 640px) {.contact-form {border-radius: 5px;} .contact-form > .contact-button > button{padding:10px 0; margin: 10px 5px 5px;}}</style> <form class="J-contact-form contact-form" onsubmit="return false;"><div class="title"><div class="strong"><strong class="J-contact-title"><!-- data:标题 --></strong></div><div class="J-contact-desc"><!-- data:描述 --></div></div><div class="contact"><input type="text" class="J-contact-contact" placeholder="请输入联系人姓名" required/></div><div class="qq"><input type="text" class="J-contact-qq" placeholder="请输入QQ号码" required/></div><div class="phone"><input type="text" class="J-contact-phone" placeholder="请输入电话号码" required/></div><div class="area"><select class="J-contact-province"></select><select class="J-contact-city"></select><select class="J-contact-areaId" required></select></div><div class="address"><textarea type="text" class="J-contact-address" placeholder="请输入详细地址" required/></div><div class="contact-button"><button class="J-contact-submit"><!-- data:确认按钮名称 --></button></form></div>';
	var $root = $(html);

	if(param['noMask']){
		$root.removeClass('pop-contact-container');
	}
	
	$root.RES_SUBMIT = 'res_submit';
	$root.RES_CANCEL = 'res_cancel';
	$root.find('.J-contact-form').css('background-color', bgColor);
	$root.find('.J-contact-title').text(title);
	$root.find('.J-contact-desc').text(desc);
	$root.find('.J-contact-submit').text(button).css('background-color', buttonBg);
	$root.find('.J-contact-submit').click(function(){
		var aForm = {};
		var val = '', key = '', aKeys = ['contact', 'qq', 'phone', 'areaId', 'address'];
		var aTips = ['联系人', 'QQ号码', '电话号码', '地区信息', '详细地址'];
		var tipsPrefix = '';
		for(var i=0; i<aKeys.length; ++i){
			key = aKeys[i];
			val = $root.find('.J-contact-' + key).val();
			if(aFormData.hasOwnProperty(key) == false){continue;}
			if(!val || (key == 'areaId' && val == '0')){
				tipsPrefix = key == 'areaId'? '请选择': '请填写';
				UBox.show(tipsPrefix + aTips[i]);
				return;
			}
			aForm[key] = val;
		}
		$root.trigger($root.RES_SUBMIT, aForm);
	});

	if(buttonCancel){
		var $cancelBtn = $('<button>' + buttonCancel + '</button>')
		$cancelBtn.css('background-color', buttonCancelBg).click(function(){
			$root.trigger($root.RES_CANCEL);
		});
		$root.find('.J-contact-submit').before($cancelBtn);
	}
	$root.find('.J-contact-form').click(function(){
		return false;
	});
	$root.click(function(){
		$root.css('display', 'none');
	});

	var aKeys = ['contact', 'qq', 'phone', 'address'];
	for(var i=0; i<aKeys.length; ++i){
		var key = aKeys[i];
		if(aFormData.hasOwnProperty(key)){
			$root.find('.J-contact-' + key).val(aFormData[key] || '');
		}else{
			$root.find('.J-contact-' + key).parent().css('display', 'none');
		}
	}

	if(aFormData.hasOwnProperty('areaId')){
		var $address = new AreaSelector({
			$province : $root.find('.J-contact-province'),
			$city : $root.find('.J-contact-city'),
			$area : $root.find('.J-contact-areaId'),
			defaultArea: aFormData['areaId']
		});
		$address.init();
	}else{
		$root.find('.J-contact-areaId').parent().css('display', 'none');
	}

	return $root;
};
/**
 * 页面公用方法基类
 */
window.PageBase = function(){
    var _config = {
        selector: '',       //容器选择器
        template: '',       //模板
        templateUrl: ''    //模板url
    };

    this.config = function(args){
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                _config[key] = args[key];
            }
        }
    };

    this.show = function(){
        var self = this;
        if(self.getConfig('template')){
            self.initPage();
            return;
        }

        var templateUrl = self.getConfig('templateUrl');
        $.get(templateUrl, function(html){
            self.setTemplate(html);
            self.initPage();
        });
    };

    this.hide = function(){
    	this.root().empty();
    }

    this.initPage = function(){
        var self = this;
        var selector = self.getConfig('selector');
        var template = self.getConfig('template');
        $(template).appendTo($(selector));
    };

    /**
     * 获取配置数据
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    this.getConfig = function(key){
        return _config[key];
    };

    /**
     * 设置模板数据
     * @param {[type]} html [description]
     */
    this.setTemplate = function(html){
        _config['template'] = html;
    };

    this.getTemplate = function(){
        return _config['template'];
    };

    /**
     * 获取根路径
     * @returns {jQuery|HTMLElement}
     */
    this.root = function() {
        return $(_config['selector']);
    };
};
/**
 * 复制子节点
 * @param select
 * @param len
 * @param $root
 * @returns {*|{}}
 * @private
 */
window.PageBase.cloneChild = function(select, len, $root, isDeep) {
	if(len == 0){
		return $([]);
	}
    var $item = $root.find(select);
    var $itemClone = $item;
    if (!$item[0]) {
        $.error('select ' + select + ' without element!');
        return false;
    }
    for (var i = 0; i < len; ++i) {
        if (!$item[i]) {
            $itemClone = $item.last().clone(isDeep);
            $item.last().after($itemClone);
        }
    }
    for (; i<$item.length; ++i){
    	$item[i].remove();
    }
    return $root.find(select);
};
//扩展页面方法
window.PageBase.init = function(page){
    page.prototype = new window.PageBase();
    page.prototype.constructor = page;
    page.prototype.cloneChild = window.PageBase.cloneChild;
    return page;
};
//获取页面实例
window.PageBase.create = function(){
	var oPage = window.PageBase.init(function(){});
	return new oPage();
};