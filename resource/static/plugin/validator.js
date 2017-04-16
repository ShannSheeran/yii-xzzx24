(function ($, win) {
	win.Validator = {
		//第二个参数是否等于第一个参数,true
		isEquals: function (compare, compareValue) {
			return (compare == compareValue) ? true : false;
		},
		//第二个参数是否不等于第一个参数
		isNotEquals: function (compare, compareValue) {
			return (compare == compareValue) ? false : true;
		},
		//不为空
		isNotEmpty: function (validateValue) {
			return (validateValue.length > 0) ? true : false;
		},
		//第二个参数的字符长度是否大于第一个参数
		isLengthGreaterThan: function (compare, compareValue) {
			if (!self.isPositiveInteger(compare)) {
				throw new Error('不是个整数');
			}
			return (compareValue.length > compare) ? true : false;
		},
		//第二个参数的字符长度是否大于或等于第一个参数
		isLengthGreaterThanOrEqual: function (compare, compareValue) {
			if (!self.isPositiveInteger(compare)) {
				throw new Error('不是个整数');
			}
			return (compareValue.length >= compare) ? true : false;
		},
		//第二个参数的字符长度是否小于第一个参数
		isLengthLessThan: function (compare, compareValue) {
			if (!self.isPositiveInteger(compare)) {
				throw new Error('不是个整数');
			}
			return (compareValue.length < compare) ? true : false;
		},
		//第二个参数的字符长度是否小于或等于第
		isLengthLessThanOrEqual: function (compare, compareValue) {
			if (!self.isPositiveInteger(compare)) {
				throw new Error('不是个整数');
			}
			return (compareValue.length <= compare) ? true : false;
		},
		//第二个参数是否在第一个数组中的其中一个元素,true
		isIn: function (aArr, value) {
			for (var i in aArr) {
				if (aArr[i] == value) {
					return true;
				}
			}
			return false;
		},
		//第二个参数是否不在第一个数组中的其中一个元素,true
		isNotIn: function (aArr, value) {
			for (var i in aArr) {
				if (aArr[i] == value) {
					return false;
				}
			}
			return true;
		},
		//第三个参数(数字)是否在第1和第二个参数范围内
		isInRange: function (startNums, endNums, compareValue) {
			return (startNums <= compareValue && compareValue <= endNums);
		},
		//是否email格式
		isEmail: function (strEmail) {
			return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(strEmail);
		},
		//是否手机号
		isTelNumber: function (strMobile) {
			//+8615807657230
			if (strMobile.indexOf('+86') == 0) {
				return /^\+86[1][0-9]{10}$/.test(strMobile);
			}
			return /^[1+][0-9]{10}$/.test(strMobile);
		},
		//是否字母组合
		isAlphabet: function (strAlphabete) {
			return /^[a-zA-Z]+$/.test(strAlphabete);
		},
		//是否数字
		isNumber: function (strNumber) {
			//正整数处理
			if (self.isPositiveInteger(strNumber)) {
				return true;
			}
			return /^[-+]{0,1}(\d+)[\.]{0,1}(\d+)$/.test(strNumber);

		},
		//是否数字
		isInteger: function (strNumber) {
			return /^[-]{0,1}\d+$/.test(strNumber);

		},
		//是否是正整数
		isPositiveInteger: function (strNumber) {
			return /^\d+$/.test(strNumber);
		},
		//是否字母数字组合
		isAlphabeticCharacters: function (str) {
			return /^[0-9a-zA-Z]+$/.test(str);
		},
		//是否字母数字下划线组合
		isAlphabeticCharactersAndUnderline: function (str) {
			return /^[0-9a-zA-Z_]+$/.test(str);
		},
		//是否字母数字下划线组合
		isUrl: function (str) {
			return /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.\-\&\?\=]*)*\/?$/.test(str);
		},
		//是否全中文
		isAllChinese: function (str) {
			return /^[\u4e00-\u9fa5]+$/.test(str);
		}
	};
	var self = win.Validator;
})(jQuery, window);

