define(function(require, exports, module){	
	/*用户名称验证模块*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),message = require('./message'),md_fn_placeholder = require('./placeholder');
	var md_username = function(g){
		this.type = (g.type || "REG").toUpperCase();
		this.input = g.input && $(g.input);
		this.nick = this.input.attr("name");
		this.tip = g.tip && $(g.tip) ? message($(g.tip)) : null;
		this.async = false;
		this.on = g.on || "keyup blur";
		this.errCls = $.type(g.errCls)==="string" && g.errCls || "";
		this.timeout = $.isNumeric(g.timeout) ? g.timeout: 0;
		this.defaultOn = g.defaultOn || "";
        this.defaultTip = g.defaultTip || null;
		this.checkCallback = $.isFunction(g.checkCallback) ? g.checkCallback: function() {};
		this.checkUrl = g.checkUrl || "";
		this.checkData = $.isPlainObject(g.checkData) && g.checkData || {};
		this.tipMsg = $.isPlainObject(g.tipMsg) ? g.tipMsg: {};
		this.disabledMsg = $.isString(g.disabledMsg) ? g.disabledMsg: "\u7528\u6237\u540d\u8f93\u5165\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.disabled = true;
		this.recommendNick = null;
		this.placeholder = g.placeholder && g.input ? md_fn_placeholder({
            input: g.input,
            placeholder: g.placeholder,
            blurCls: "ph_blur"
        }) : null;
	};
	var md_fn_username = function(g) {
        return new md_username(g);
    };
	$.augment(md_username,{
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
                msg: "\u7528\u6237\u540d\u683c\u5f0f\u9519\u8bef"
            },
            ajaxError: {
                code: 3,
                msg: "\u7528\u6237\u540d\u9519\u8bef"
            },
            sizeError: {
                code: 4,
                msg: "5-25\u4e2a\u5b57\u7b26"
            },
            allNumberError: {
                code: 5,
                msg: "\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57"
            },
            illegalError: {
                code: 6,
                msg: "\u5305\u542b\u975e\u6cd5\u5b57\u7b26"
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
		regex: {
            illegal: /[~\uff5e]|[!\uff01]|[?\uff1f]|\.\.|--|__|\uff0d|\uff3f|\u203b|\u25b2|\u25b3|\u3000| |@/,
            allNumber: /^\d+$/
        },
        init: function() {
			
            if (!this.input || !this.tip) {
                return this
            }
			this.placeholder && this.placeholder.init();
            var g = this;
			
            g.validate(true, false);
            g.input.on(this.on,function() {
                $.later(function() {g.validate(false, true)},g.timeout, false, this)
            });
            this.defaultOn && (this.input.on(this.defaultOn,function() { 
				! $.trim(g.input.val()) && g.reset()
            }));
			
            /*this.suggestNickList && this.suggestNickKey && $.Event.delegate(document, "click", ".i_radio_nick",
            function(h) {
                g.input.val(h.currentTarget.value);
                if (g.suggestAutoClose) {
                    g.suggestNick.hide()
                }
                g.validate()
            });*/
            return this
        },
		validate: function(h) {
            if (!this.input) {
                this.disabled = false;
                return this.disabled
            }
            var j = this;
            var g = arguments,
            h = $.isPlainObject(g[0]) ? g[0] : {
                def: !!g[0],
                async: !!g[1],
                callback: null,
                context: window
            };
            var m = h.def,
            l = h.async,
            n = h.callback,
            k = h.context;
            this.checkAble(function(o) {
                j.validateCallback(m);
                $.isFunction(n) && n.call(this, o)
            },
            l, k)
        },
		validateCallback: function(g) {
			
            if (g && this.tip.type.toLowerCase() == "error" && !this.tip.isHide()) {
                return this.disabled
            }
            this.check(g);
            if (!this.recommendNick) {
                this.suggestNick && this.suggestNick.hide()
            } else {
                if (this.async) {
                    this.updateSuggestList()
                }
            }
            this.async && this.updateSuggestList(); ! g && this.checkCallback(this.disabled, this.asyncRetData, this.recommendNick);
            return this.disabled
        },
		updateSuggestList: function() {
            if (!this.recommendNick) {
                return
            }
            var h = this.suggestNickTemplate,
            g = this;
            var j = "";
            $.each(this.recommendNick,
            function(k, l) {
                j += $.substitute(h, {
                    id: "nick_" + l,
                    nick: k,
                    checked: k === g.input.val() ? "checked": ""
                })
            });
            this.suggestNickList.html(j);
            this.suggestNick.show()
        },
        check: function(g) {
            if (g && !$.trim(this.input.val())) { ! this.defaultOn && this.reset();
                return
            }
            switch (this.stat.code) {
            case - 1 : case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                this.tip.error(this.stat.msg);
                this.input.removeClass(this.errCls);
                $.later(function() {
                    this.input.addClass(this.errCls)
                },
                1, false, this);
                break;
            case 100:
                this.tip.ok(this.tipMsg.ok || "");
                this.input.removeClass(this.errCls);
                break;
            default:
                break
            }
        },
        checkAble: function(m, k, j) {
            var h = this,
            l, g;
            var j = j || h,
            k = !!k,
            m = $.isFunction(m) && m ||
            function() {};
            this.asyncRetData = null;
            this.recommendNick = null;
            h.async = k;
            if (!$.trim(h.input.val()).length) {
                h.disabled = true;
                h.stat = h.statusCode.empty;
                m.call(j, h.disabled);
                return
            } else {
                if (!h.cache || h.cache.getIndex("value", h.input.val()) == -1) {
                    if (l = h._checkAble()) {
                        h.disabled = true;
                        if (h.type == "REG") {
                            switch (l) {
                            case 4:
                                h.stat = h.statusCode.sizeError;
                                break;
                            case 5:
                                h.stat = h.statusCode.allNumberError;
                                break;
                            case 6:
                                h.stat = h.statusCode.illegalError;
                                break;
                            default:
                                break
                            }
                        } else {
                            h.stat = h.statusCode.formatError
                        }
                    } else {
                        h.disabled = false;
                        h.stat = h.statusCode.ok
                    }
                    if (!h.checkUrl || h.disabled || !k) {
                        if (h.cache) {
                            g = h._updateCache();
                            h.cache.set(g, "value")
                        }
                        m.call(j, h.disabled);
                        return
                    }
                    $.ajax({
                        url: h.checkUrl,
                         // data: $.mix(h.checkData,{h.nick+":"+$.trim(h.input.val())}),
						data:h.nick+"="+$.trim(h.input.val()),
                        type: "post",
                        dataType: "json",
                        success: function(n) {
                            var o = n.msg || n.reason || "";
                            o = h.msgTemplate ? h.msgTemplate[o] || o: o;
                            if (n.success) {
                                h.disabled = false;
                                h.stat = {
                                    code: h.statusCode.ok.code,
                                    msg: o || h.statusCode.ok.msg
                                };
                                h.recommendNick = null
                            } else {
                                h.disabled = true;
                                h.stat = {
                                    code: h.statusCode.ajaxError.code,
                                    msg: o || h.statusCode.ajaxError.msg
                                };
                                h.recommendNick = h.suggestNick && h.suggestNickList && h.suggestNickKey ? n[h.suggestNickKey] : null
                            }
                            this.asyncRetData = n;
                            m.call(j, h.disabled);
                            if (h.cache) {
                                g = h._updateCache();
                                h.cache.set(g, "value")
                            }
                        },
                        error: function() {
                            this.asyncRetData = null;
                            h.stat = {
                                code: h.statusCode.netError.code,
                                value: $.trim(h.input.val()),
                                msg: h.statusCode.netError.msg
                            };
                            h.recommendNick = null;
                            m.call(j, h.disabled)
                        }
                    })
                } else {
                    g = h.cache.get("value", h.input.val());
                    h.disabled = g.disabled;
                    h.stat = g.stat;
                    h.recommendNick = g.recommendNick;
                    m.call(j, h.disabled)
                }
            }
        },
        _checkAble: function() {
            var h = 0,
            g;
            if (!this.matchSize()) {
                h = 4
            } else {
                if (this.type == "REG" && this.isAllNumber()) {
                    h = 5
                } else {
                    if (g = this.isIllegal()) {
                        this.statusCode.illegalError = {
                            code: 6,
                            msg: "\u5305\u542b\u975e\u6cd5\u5b57\u7b26" + g
                        };
                        h = 6
                    }
                }
            }
            return h
        },
		_updateCache: function() {
            return {
                value: $.trim(this.input.val()),
                disabled: this.disabled,
                stat: this.stat,
                recommendNick: this.recommendNick
            }
        },
        _updateRecommendNick: function() {
            if (!this.recommendNick || !this.recommendNick.length) {
                return this
            }
            var h = "",
            g = 0;
            while (g < this.recommendNick.length) {
                h += $.substitute(this.suggestNickListTemplate, {
                    index: g,
                    nick: this.recommendNick[g]
                });
                g++
            }
            this.suggestNickList.html(h);
            return this
        },
        isAllNumber: function() {
            return !! this.input.val().match(this.regex.allNumber)
        },
        isIllegal: function() {
            var g = this.input.val().match(this.regex.illegal);
            return g ? g.join(" ") : ""
        },
        size: function() {
            return $.trim(this.input.val()).replace(/[^\x00-\xff]/g, "***").length
        },
        matchSize: function() {
            var g = this.type == "REG" ? 5 : 2;
            return this.size() >= g && this.size() <= (this.type == "REG" ? 25 : 9999)
        },
		reset: function() {
            this.input && this.input.removeClass(this.errCls);
            this.resetTip();
            return this
        },
		resetTip: function() {
            if (!this.tip) {
                return this
            }
            if (this.defaultTip && this.defaultTip.type && this.defaultTip.msg) {
                this.tip.change(this.defaultTip.type, this.defaultTip.msg)
            } else {
                this.tip.hide()
            }
            return this
        }
	})
	return md_fn_username;
})