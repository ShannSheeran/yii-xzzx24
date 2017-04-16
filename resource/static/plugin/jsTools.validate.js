(function(win){
    var JsTools = {
    	/**
    	 * 是否是邮箱格式
    	 * @param  {[type]}  value [检测值]
    	 * @return {Boolean}       [结果]
    	 */
    	isEmail: function(val){
    		return new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$').test(val);
    	},

    	/**
    	 * 是否范围内
    	 * @param  {[type]}  val [检测值]
    	 * @param  {[type]}  min [最小]
    	 * @param  {[type]}  max [最大]
    	 * @return {Boolean}     [结果]
    	 */
    	isRange: function(val, min, max){
    		if(min == undefined){min = -Infinity}
    		if(max == undefined){max = Infinity}
    		return min <= val && val <= max;
    	},

    	/**
    	 * 是否是手机号
    	 * @param  {[type]}  val [检测值]
    	 * @return {Boolean}     [结果]
    	 */
    	isPhone: function(val){
    		return new RegExp('^((\\+86)|(86))?1[3|4|5|8]{1}\\d{9}$').test(val);
    	},

    	isNumber: function(val, len){
    		return new RegExp('^\\d{' + len + '}$').test(val);
    	},

    	/**
    	 * 是否链接
    	 * @param  {[type]}  val [检测值]
    	 * @return {Boolean}     [结果]
    	 */
    	isUrl: function(val){
    		return new RegExp('(\\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])', 'ig').test(val);
    	}
    };
    win.JsTools = $.extend(win.JsTools, JsTools);
})(window);