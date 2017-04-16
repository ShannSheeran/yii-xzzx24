function Log(aOption){
	aOption = _parseOption(aOption);
	
	var self = this
	,aData = []
	,$log = $('<div class="_wrapUMLog">\
		<h5>\
			UMLogger [#' + aOption.name + ']\
			<i xid="btnClose">关闭</i>\
			<i xid="btnClear">清空</i>\
			<i xid="btnRefresh">刷新</i>\
		</h5>\
		<div class="wrapContent">\
			<ul xid="wrapLogContents"></ul>\
		</div>\
	</div>');
	
	self.getData = function(){
		return _cloneObject(aData);
	};
	
	/**
	 * 重新加载数据
	 * @returns
	 */
	self.reloadData = function(){
		var aLogItemList = [];
		for(var i in aData){
			aLogItemList.push($('<li xid="rootItem">\
				<span class="logName">' + (parseInt(i) + 1) + '.' + aData[i].flag + '：</span>\
				<span class="wrapItemContent">\
				' + _parseDataContent(aData[i].data) + '\
				</span>\
				' + (aData[i].filename == undefined ? 
					'' : '<span class="codeInfo">\
						(' + aData[i].filename + ' 第\
						<a href="javascript:;" xid="btnShowTrace" title="点击显示回溯">' + aData[i].fileline + '</a>\
						行)\
					</span>') + '\
				<br class="both">\
			</li>').data('trace_list', aData[i].trace_list)[0]);
		}
		$log.find('[xid="wrapLogContents"]').empty().append(aLogItemList);
		$log.find('li[xid="rootItem"]:even').addClass('lieven');					
	};
	
	/**
	 * 清除数据
	 * @returns {Log.clear}
	 */
	self.clear = function(){
		aData = [];
		$log.find('[xid="wrapLogContents"]').empty();
	};

	/**
	 * 刷新按钮
	 */
	$log.find('[xid="btnRefresh"]').click(self.reloadData);
	
	/**
	 * 清空按钮
	 */
	$log.find('[xid="btnClear"]').click(self.clear);

	/**
	 * 关闭按钮
	 */
	$log.find('[xid="btnClose"]').click(function(){
		$log.detach();
	});

	/**
	 * 数组和对象类型的展开和收缩
	 */
	$log.delegate('[xid="btnSwitchItem"]', 'click', function(){
		var $this = $(this);
		$this.siblings('ul').toggleClass('hide');
		if(!$this.data('isOpen')){
			var oError = new Error(),
			switchText = oError.fileName ? '-&nbsp;' : '-';
			$this.html(switchText).data('isOpen', true);
		}else{
			$this.text('+').data('isOpen', false);
		}
	});
	
	/**
	 * 显示回溯
	 */
	$log.delegate('[xid="btnShowTrace"]', 'click', function(){
		var $logItem = $(this).closest('[xid="rootItem"]');
		var traceList = [],
		aTraceList = $logItem.data('trace_list');
		if(!$.isArray(aTraceList)){
			return;
		}
		for(var i = aTraceList.length - 1; i >= 0; i--){
			var aTrace = aTraceList[i];
			traceList.push('第' + (traceList.length + 1) + '步: ' + aTrace.filename + ' 第' + aTrace.fileline + '行 ' + aTrace.functionName + '函数\n');
		}
		alert(traceList.join(''));
		return false;
	});
	
	/**
	 * 窗口拖动
	 */
	$log.find('h5').bind('mousedown', function(event){
		//获取需要拖动节点的坐标
		var offsetX = $log[0].offsetLeft;
		var offsetY = $log[0].offsetTop;
		
		/* 获取当前鼠标的坐标 */
		var mouseX = event.pageX;
		var mouseY = event.pageY;

		//绑定拖动事件，由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素
		$(document).bind('mousemove', function(ev){
			//计算鼠标移动了的位置
			var moveX = ev.pageX - mouseX;
			var moveY = ev.pageY - mouseY;

			//设置移动后的元素坐标
			var newX = (offsetX + moveX) + 'px';
			var newY = (offsetY + moveY) + 'px';		
			//改变目标元素的位置
			$log.css({
				top : newY,
				left : newX
			});
		});
	});
	
	/**
	 * 释放拖动
	 */
	$(document).bind('mouseup', function(){
		$(this).unbind('mousemove');
	});
	
	/**
	 * 添加日志数据
	 * @param {type} data 日志数据
	 * @param {type} flag 日志标记,可以不传
	 * @returns
	 */
	self.add = function(data, flag){
		if(!flag){
			flag = '调试点' + (aData.length + 1) + '的值';
		}
		
		var filename
		,fileline
		,aTraceList = []
		,aTmpTraceList = [];
		var oError = new Error();
		if(oError.lineNumber){
			//火狐的回溯解析
			aTmpTraceList = oError.stack.split('\n');
			for(var i = 1; i < aTmpTraceList.length; i++){
				var trace = $.trim(aTmpTraceList[i]);
				if(!trace){
					continue;
				}
				var functionName = trace.match(/.+(?=@)/);
				if(!functionName){
					continue;
				}
				functionName = functionName[0];
				trace = trace.substr(functionName.length + 1);
				var lastMaoHao = trace.lastIndexOf(':'),
				lineNumber = trace.substr(0 - (trace.length - lastMaoHao) + 1);
				trace = trace.substr(0, lastMaoHao);
				
				aTraceList.push({
					filename : trace
					,fileline : lineNumber
					,functionName : functionName
				});
				
				if(i == 1){
					filename = trace;
					fileline = lineNumber;
				}
			}
		}else if(oError.stack){
			//谷歌的回溯解析
			aTmpTraceList = oError.stack.split('\n');
			for(var i = 2; i < aTmpTraceList.length; i++){
				var trace = $.trim(aTmpTraceList[i]);
				if(!trace){
					continue;
				}
				var functionName = trace.match(/at ([a-zA-Z\.]+) /);
				if(!functionName){
					continue;
				}
				functionName = functionName[1];
				trace = trace.substr(functionName.length + 5);
				var lastMaoHao = trace.lastIndexOf(':', trace.lastIndexOf(':') - 1),
				lineNumber = trace.substr(lastMaoHao + 1).split(':')[0];
				trace = trace.substr(0, lastMaoHao);
				
				aTraceList.push({
					filename : trace
					,fileline : lineNumber
					,functionName : functionName
				});
				
				if(i == 2){
					filename = trace;
					fileline = lineNumber;
				}
			}
		}
		
		aData.push({
			data : _cloneObject(data)
			,flag : flag
			,filename : filename
			,fileline : fileline
			,trace_list : aTraceList
		});
		
		if($log.is(':visible')){
			self.reloadData();
		}
	};

	/**
	 * 显示日志
	 */
	self.show = function(){
		//初始化样式
		if(!window.isInitStyle){
			_injectCSS();
			window.isInitStyle = true;
		}
		self.reloadData();
		$log.appendTo('body');
	};

	/**
	 * 将记录的数据解析为HTML
	 * @param {type} data
	 * @returns {Log.parseDataContent.result|String}
	 */
	function _parseDataContent(data){
		var result = ':unknow';
		var dataType = $.type(data);
		if(dataType == 'object' || dataType == 'array'){
			var itemList = [];
			for(var key in data){
				var item = '';
				if($.type(data[key]) == 'array' || $.type(data[key]) == 'object'){
					item = _parseDataContent(data[key]);
				}else{
					item = data[key];
				}
				itemList.push('<li>\
					<span class="logName">' + key + ' &gt; </span>\
					<span class="wrapItemContent">' + item + '</span>\
					<br class="both">\
				</li>');
			}
			
			result = '<div>\
				<a xid="btnSwitchItem" href="javascript:;">+</a>\
				<span>' + dataType + '</span>\
				<ul class="itemContent hide">' + itemList.join('') + '</ul>\
			</div>';
		}else if(dataType != 'function'){
			result = data;
		}
		return result;
	}
	
	/**
	 * 克隆对象
	 * @param {type} oObj
	 * @returns {Log._cloneObject.oObj.constructor|Function}
	 */
	function _cloneObject(oObj){
        if(oObj == null || typeof(oObj) !== 'object'){
            return oObj;
        }
        var oTempObj = new oObj.constructor();
        for(var key in oObj){
            oTempObj[key] = arguments.callee(oObj[key]);
        }
        return oTempObj;
    }

	/**
	 * 加载样式
	 * @returns {undefined}
	 */
	function _injectCSS(){
		$('<style type="text/css">\
._wrapUMLog{font-size:14px; background:#fff; z-index:9999; height:385px; width:45%; border:1px #000 solid; padding:1px; overflow:hidden; position:absolute; left:2px; bottom:2px; box-shadow:1px 3px 50px rgba(0,0,0,0.4);}\
._wrapUMLog .wrapContent{overflow-Y:auto; overflow-X:hidden; height:350px;}\
._wrapUMLog ul{margin:0; +margin: 0 0 0 25px; padding:0;}\
._wrapUMLog a{text-decoration:none;}\
._wrapUMLog .both{clear:both;}\
._wrapUMLog li{list-style-type:none; clear:both;}\
._wrapUMLog .logName{float:left;}\
._wrapUMLog .wrapItemContent{float:left; margin-left:5px;}\
._wrapUMLog .codeInfo{float:left; margin-left:15px; color:#666;}\
._wrapUMLog .hide{display:none;}\
._wrapUMLog h5{cursor:cell; height:25px; line-height:25px; margin: 0; padding:0 10px; background: #5077A2;color: #fff;}\
._wrapUMLog h5 i{float:right;font-style: normal;width:50px; height:25px; text-align: center;margin-right: -9px;margin-left: 10px;+margin-right: -9px;+z-index:99999;+margin-top:-25px;line-height: 25px;background: #46729B;}\
._wrapUMLog h5 i:hover{cursor:pointer;background: #34567A;}\
._wrapUMLog .logName{color:#050;}\
._wrapUMLog li{padding:4px;word-wrap: break-all;word-break: normal;margin-bottom:5px;}\
._wrapUMLog .lieven{background-color:rgb(218, 224, 228);}\
</style>').appendTo('head');
	}
	
	/**
	 * 配置解析
	 * @param {type} aOption
	 */
	function _parseOption(aOption){
		if(!aOption){
			aOption = {
				name : $.now()
			};
		}
		if(!aOption.name){
			aOption.name = $.now();
		}
		
		return aOption;
	}
};