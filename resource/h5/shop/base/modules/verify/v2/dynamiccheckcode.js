define(function(require, exports, module){	
	/*
	动态验证码
	*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),md_fn_TimeoutBtn = require('./timeoutbtn'),message = require('./message');
	var md_DynamicCheckCode = function(f) {
        this.trigger = f.trigger && $(f.trigger);
        this.triggerTip = f.triggerTip && $(f.triggerTip) ? message($(f.triggerTip)) : null;
        this.input = f.input && $(f.input);
        //this.inputTip = f.inputTip && $(f.inputTip) ? message($(f.inputTip)) : null;
		
		this.inputTip = (f.inputTip && $(f.inputTip)) ? message({
			input:f.input && $(f.input),
			msg:$(f.inputTip),
			icon:{
				left:f.tip_icon.left,
				top:f.tip_icon.top
			}
		}) : null;
		
		
        this.errCls = $.isString(f.errCls) && f.errCls || "";
        this.on = f.on || "keyup blur";
        this.defaultOn = f.defaultOn || "";
        this.getUrl = f.getUrl || "";
        this.checkUrl = f.checkUrl || "";
        this.checkData = $.isPlainObject(f.checkData) || $.isFunction(f.checkData) ? f.checkData: {};
        this.checkCallback = $.isFunction(f.checkCallback) ? f.checkCallback: function() {};
        this.getData = $.isPlainObject(f.getData) || $.isFunction(f.getData) ? f.getData: {};
        this.defaultMsg = {
            error: "\u9a8c\u8bc1\u7801\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01",
            ok: "\u9a8c\u8bc1\u7801\u5df2\u53d1\u9001\uff0c\u8bf7\u67e5\u6536\uff01"
        };
        this.msg = f.msg || {};
        this.msg.error = this.msg.error || this.defaultMsg.error;
        this.msg.ok = this.msg.ok || this.defaultMsg.ok;
        this.defaultTriggerTip = f.defaultTriggerTip || null;
        this.defaultInputTip = f.defaultInputTip || null;
        this.msgTemplate = $.isPlainObject(f.msgTemplate) ? f.msgTemplate: null;
        this.disabledBtnCls = f.disabledBtnCls || "";
        this.btnText = f.btnText || "\u514d\u8d39\u83b7\u53d6\u9a8c\u8bc1\u7801";
        this.btnWaitText = f.btnWaitText || "%t%\u79d2\u540e\u53ef\u91cd\u65b0\u53d1\u9001";
        this.btnWaitCls = f.btnWaitCls || "";
        this.btnTimeoutText = f.btnTimeoutText || "\u91cd\u65b0\u53d1\u9001";
        this.btnTimeoutCls = f.btnTimeoutCls || "";
        this.btnAutoStart = !!f.btnAutoStart;
        this.tobtn = null;
        this.disabledMsg = $.isString(f.disabledMsg) ? f.disabledMsg: "\u9a8c\u8bc1\u7801\u9519\u8bef";
        this.disabled = true;
        this.stat = {
            code: 0,
            msg: ""
        }
    };
    var md_fn_DynamicCheckCode = function(f) {
        return new md_DynamicCheckCode(f)
    };
    $.augment(md_DynamicCheckCode, {
        ctype: "CHECKER",
        statusCode: {
            netError: {
                code: -1,
                msg: "\u7f51\u7edc\u9519\u8bef"
            },
            empty: {
                code: 1,
                msg: "\u4e0d\u80fd\u4e3a\u7a7a"
            },
            formatError: {
                code: 2,
                msg: "\u683c\u5f0f\u9519\u8bef"
            },
            ajaxError: {
                code: 3,
                msg: "\u9a8c\u8bc1\u7801\u9519\u8bef"
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
        init: function() {
            if (!this.trigger || !this.input || !this.getUrl) {
                return this
            }
            var f = this;
            this.tobtn = md_fn_TimeoutBtn({
                btn: this.trigger,
                timeout: 60,
                disabledCls: f.disabledBtnCls,
                callback: function() {
                    f.resetTriggerTip()
                },
                text: f.btnText,
                waitText: f.btnWaitText,
                waitCls: f.btnWaitCls,
                timeoutText: f.btnTimeoutText,
                timeoutCls: f.btnTimeoutCls,
                autoStart: f.btnAutoStart
            });
            this.trigger.on("click",
            function() {
                f.getCode()
            });
            this.defaultOn && (this.input.on(this.defaultOn,
            function() { ! $.trim(f.input.val()) && f.resetInputTip()
            }));
            this.input.on(this.on,
            function() {
                f.validate()
            });
            this.validate(true);
            return this
        },
        validate: function(l) {
            if (!this.trigger || !this.input || !this.getUrl) {
                this.disabled = false;
                return this.disabled
            }
            var h = this;
            var f = arguments,
            g = $.isPlainObject(f[0]) ? f[0] : {
                def: !!f[0],
                async: !!f[1],
                callback: null,
                context: window
            };
            var l = g.def,
            k = g.async,
            m = g.callback,
            j = g.context;
            this.checkAble(function(n) {
                h.validateCallback(l);
                $.isFunction(m) && m.call(this, n)
            },
            k, j)
        },
        validateCallback: function(f) {
            if (f && this.inputTip.type.toLowerCase() == "error" && !this.inputTip.isHide()) {
                return this.disabled
            }
            this.check(f); ! f && this.checkCallback(this.disabled);
            return this.disabled
        },
        getCode: function() {
			var c = $;
            var f = this;
            this.reset();
            $.ajax({
                url: f.getUrl,
                data: c.isFunction(f.getData) ? f.getData() : f.getData,
                type: "post",
                dataType: "json",
                success: function(g) {
                    if (g.status) {
                        if (f.triggerTip) {
                            //f.triggerTip.ok(g.msg || f.msg.ok || f.defaultMsg.ok);
							alert(g.msg || f.msg.ok || f.defaultMsg.ok)
                        }
                        f.input.trigger("focus");
                        f.tobtn.start()
                    } else {
                        f.disabledMsg = "\u8bf7\u91cd\u65b0\u83b7\u53d6\u9a8c\u8bc1\u7801\uff01";
                        if (f.triggerTip) {
                            f.triggerTip.attention(g.msg || f.msg.error || f.defaultMsg.error)
                        }else{
							alert(g.msg || f.msg.error || f.defaultMsg.error);
						}
                    }
                },
                error: function() {
                    f.disabledMsg = "\u8bf7\u91cd\u65b0\u83b7\u53d6\u9a8c\u8bc1\u7801\uff01";
                    if (f.triggerTip) {
                        f.triggerTip.error("\u9a8c\u8bc1\u7801\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01")
                    }else{
						alert("\u9a8c\u8bc1\u7801\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01");	
					}
                }
            })
        },
        check: function(f) {
            if (f && !$.trim(this.input.val())) { ! this.defaultOn && this.resetInputTip();
                this.resetTriggerTip();
                return
            }
            switch (this.stat.code) {
            case - 1 : case 1:
            case 2:
            case 3:
                this.inputTip.error(this.stat.msg);
                this.input.removeClass(this.errCls);
                $.later(function() {
                    this.input.addClass(this.errCls)
                },
                1, false, this);
                break;
            case 100:
                this.inputTip.hide();
                this.input.removeClass(this.errCls);
                break;
            default:
                break
            }
        },
        checkAble: function(l, j, h) {
            var g = this,
            k, f;
            var h = h || g,
            j = !!j,
            l = $.isFunction(l) && l ||
            function() {};
            if (!$.trim(this.input.val()).length) {
                this.disabled = true;
                this.stat = this.statusCode.empty;
                l.call(h, g.disabled);
                return
            } else {
                if (this._checkAble()) {
                    this.disabled = false;
                    this.stat = this.statusCode.ok
                } else {
                    this.disabled = true;
                    this.stat = this.statusCode.formatError
                }
            }
            if (!this.checkUrl || g.disabled) {
                l.call(h, g.disabled);
                return
            }
            $.io({
                url: g.checkUrl,
                data: $.mix($.isFunction(g.checkData) ? g.checkData() : g.checkData, {
                    code: $.trim(g.input.val())
                }),
                type: "post",
                dataType: "json",
                success: function(m) {
                    var n = m.msg || m.reason || "";
                    n = g.msgTemplate ? g.msgTemplate[n] || n: n;
                    if (m.status) {
                        g.disalbed = false;
                        g.stat = {
                            code: g.statusCode.ok.code,
                            msg: n || g.statusCode.ok.msg
                        }
                    } else {
                        g.disabled = true;
                        g.disabledMsg = "\u9a8c\u8bc1\u7801\u9519\u8bef";
                        g.stat = {
                            code: g.statusCode.ajaxError.code,
                            msg: n || g.statusCode.ajaxError.msg
                        }
                    }
                    l.call(h, g.disabled)
                },
                error: function() {
                    l.call(h, g.disabled)
                }
            })
        },
        _checkAble: function() {
            return !! $.trim(this.input.val()).match(/^\d{6}$/)
        },
        reset: function(f) {
            if (f) {
                return this
            }
            this.disabled = true;
            this.tobtn && this.tobtn.reset();
            this.input && this.input.val("") && this.input.removeClass(this.errCls);
            this.resetTip();
            return this
        },
        resetTriggerTip: function() {
            if (!this.triggerTip) {
                return
            }
            if (this.defaultTriggerTip && this.defaultTriggerTip.type && this.defaultTriggerTip.msg) {
                this.triggerTip.change(this.defaultTriggerTip.type, this.defaultTriggerTip.msg)
            } else {
                this.triggerTip.hide()
            }
        },
        resetInputTip: function() {
            if (!this.inputTip) {
                return this
            }
            if (this.defaultInputTip && this.defaultInputTip.type && this.defaultInputTip.msg) {
                this.inputTip.change(this.defaultInputTip.type, this.defaultInputTip.msg)
            } else {
                this.inputTip.hide()
            }
            return this
        },
        resetTip: function() {
            this.input && this.input.val("");
            this.resetTriggerTip();
            this.resetInputTip();
            return this
        },
        timeoutStart: function() {
            this.tobtn && this.tobtn.start();
            return this
        }
    });
	return md_fn_DynamicCheckCode;
})