define(function(require, exports, module){
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),md_fn_placeholder = require("modules/verify/js/placeholder"),message = require("modules/verify/js/message"),md_Cache = require('modules/verify/js/cache');
	/*用户名称验证模块*/
	var md_username = function(f){
        this.type = (f.type || "REG").toUpperCase();
        this.input = f.input && $(f.input);
        this.errCls = $.isString(f.errCls) && f.errCls || "";
        this.placeholder = f.placeholder && f.input ? md_fn_placeholder({
            input: f.input,
            placeholder: f.placeholder,
            blurCls: "ph_blur"
        }) : null;
        this.checkUrl = f.checkUrl || "";
        this.checkData = $.isPlainObject(f.checkData) && f.checkData || {};
        this.tip = f.tip && $(f.tip) ? message($(f.tip)) : null;
        this.on = f.on || "keyup blur";
        this.defaultTip = f.defaultTip || null;
        this.disabledMsg = $.isString(f.disabledMsg) ? f.disabledMsg: "\u7528\u6237\u540d\u8f93\u5165\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.disabled = true;
		this.cache = !!f.cache ? md_Cache().init() : null;
        this.stat = {
            code: 0,
            msg: ""
        };
		this.checkCallback = $.isFunction(f.checkCallback) ? f.checkCallback: function() {};
    };
    var md_fn_username = function(f) {
        return new md_username(f)
    };
    $.augment(md_username, {
        ctype: "CHECKER",
        statusCode: {
            empty: {
                code: 1,
                msg: "\u4e0d\u80fd\u4e3a\u7a7a"
            },
            formatError: {
                code: 2,
                msg: "\u7528\u6237\u540d\u683c\u5f0f\u9519\u8bef"
            },
            ajaxError: {
                code: 3,
                msg: "\u7528\u6237\u540d\u9519\u8bef"
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
        regex: {
            illegal: /\.\.|--|__|\uff0d|\uff3f|\u203b|\u25b2|\u25b3|\u3000| /,
            allNumber: /^\d+$/
        },
        init: function() {
            if (!this.input || !this.tip) {
                return this
            }
			
            this.placeholder && this.placeholder.init();
            var f = this;
            this.validate(false);
            this.input.on(this.on,
            function() {
                f.validate()
            });
			
            return this
        },
        validate: function(h) {
			
			var j = this;
            if (!j.input) {
                j.disabled = false;
                return j.disabled
            }
			
			var g = arguments,
            h = $.isPlainObject(g[0]) ? g[0] : {
                def: !!g[0],
                async: !!g[1],
                callback: null,
                context: window
            };
            var m = h.def,
			l = h.async,
            n = $.isFunction(h.callback) ? h.callback: function() {},
            k = h.context;
			j.externalCallback = n;
			
            j.checkAble(function(o){
				j.validateCallback(m);
				j.externalCallback.call(this, o)
			},
			l,k);
            
            //return this.disabled
        },
        validateCallback: function(g) {
			
            if (g && this.tip.type.toLowerCase() == "error" && !this.tip.isHide()) {
                return this.disabled
            }
			
            this.check(g);
            this.checkCallback(this.disabled, this.asyncRetData, g);
            return this.disabled
        },
        check: function(f) {
			var ths = this;
            if (!f && !$.trim(this.input.val())) {
                this.reset();
                return
            }
            switch (this.stat.code) {
            case 1:
            case 2:
            case 3:
                this.tip.error(this.stat.msg);
                this.input.removeClass(this.errCls);
                $.later(function() {
                    this.input.addClass(this.errCls)
                },
                1, false, this);
                break;
            case 100:
                this.tip.ok(this.stat.msg || "");
                this.input.removeClass(this.errCls);
				/*if (f){
					$.isFunction(f.callback) && f.callback.call(f.context,ths.disabled);
				}*/
                break;
            default:
                break
            }
        },
        checkAble: function(m,l,j) {
            var f = this,j = j || f;
			f.asyncRetData = null;
			
            if (!$.trim(this.input.val()).length) {
                this.disabled = true;
                this.stat = this.statusCode.empty;
				m.call(j,f.disabled);
                return
            } else {
                if (this._checkAble()) {
                    f.disabled = false;
                    this.stat = this.statusCode.ok
                } else {
                    f.disabled = true;
                    this.stat = this.statusCode.formatError
					m.call(j,f.disabled);
                	return 
                }
            }
            if (!this.checkUrl || this.disabled) {
				f.cache.set({"value":$.trim(f.input.val())}, "value");
				m.call(j,f.disabled);
                return 
            }
			
			if (!f.cache || f.cache.getIndex("value",$.trim(f.input.val())) == -1) {
				$.ajax({
					url: f.checkUrl,
					data: $.mix(f.checkData, {
						username: $.trim(f.input.val())
					}),
					type: "post",
					dataType: "json",
					success: function(g) {
						f.asyncRetData = g;
						if (g.status) {
							f.disabled = false;
							f.stat = {
								code: f.statusCode.ok.code,
								msg: g.msg || f.statusCode.ok.msg
							}
							if (f.cache) {
								
                            	f.cache.set({"value":$.trim(f.input.val())}, "value");
							}
						} else {
							
							f.disabled = true;
							f.stat = {
								code: f.statusCode.ajaxError.code,
								msg: g.msg || f.statusCode.ajaxError.msg
							}
						}
						m.call(j,f.disabled)
					}
				})
			}else{
				m.call(j,f.disabled)
			}
        },
        _checkAble: function() {
            var f;
			
			if (this.input.val().match(/^(?:0?1)[34578]\d{9}$/)||this.input.val().match(/^[a-zA-Z\d][-\.\w]*@(?:[-\w]+\.)+(?:[a-zA-Z])+$/)){
				f = true;
			}else{
				f = false;	
			}
            return f
        },
        reset: function() {
            this.input && this.input.removeClass(this.errCls);
            this.resetTip()
        },
        resetTip: function() {
            if (!this.tip) {
                return
            }
            if (this.defaultTip && this.defaultTip.type && this.defaultTip.msg) {
                this.tip.change(this.defaultTip.type, this.defaultTip.msg)
            } else {
                this.tip.hide()
            }
        }
    });
	return md_fn_username;
})