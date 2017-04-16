define(function(require, exports, module){	
	/*
	邮箱注册的建议提示
	*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),md_Cache = require('./cache'),message = require('./message');
	var md_EmailSuggest = function(g){
        this.input = g.input && $(g.input) || null;
        this.host = $.isString(g.host) && [g.host] || $.isArray(g.host) && g.host || null;
        this.list = null;
        this.lis = null;
        this.current = -1;
        this.length = this.host && this.host.length || 0;
        this.events = {};
        this.ing = false
	};
	var md_fn_EmailSuggest = function(g) {
        return new md_EmailSuggest(g);
    };
	$.augment(md_EmailSuggest,{
		suggest: null,
        bound: false,
        laterId: 0,
        init: function() {
            if (!this.input || !this.host) {
                return this
            }
            var d = this;
            this.input.on("focus",
            function() {
                d.show()
            }).on("keyup",
            function(e) {
                var f = e.keyCode;
                if (f != 13 && f != 40 && f != 38) {
                    d.update();
                    d.bind()
                } else {
                    if (f == 38 && d.ing) {
                        d.select( - 1)
                    } else {
                        if (f == 40 && d.ing) {
                            d.select(1)
                        } else {
                            if (f == 13 && d.ing) {
                                d.complete()
                            }
                        }
                    }
                }
            }).on("blur",
            function() {
                d.complete()
            });
            $(window).on("resize",
            function() {
                d.fix()
            });
            return this
        },
        show: function() {
            this.suggest || this.create();
            this.input.parent().append(this.suggest);
            this.fix();
            this.ing = true;
            if (!$.trim(this.input.val())) {
                this.hide()
            } else {
                this.update()
            }
        },
        hide: function() {
            this.suggest.hide();
            this.lis && this.lis.length && this.lis.eq(this.current).removeClass("current");
            this.current = -1;
            this.ing = false;
            this.events.hide && this.events.hide()
        },
        complete: function() {
			
            if (!this.lis || !this.lis.length) {
                return
            }
			if (this.current==-1){
				this.hide();
				return
			}else{
				this.input.val(this.lis.eq(this.current).text());
				this.hide();
				this.events.complete && this.events.complete(this.input.val())
			}
		},
        bind: function() {
            if (!this.lis || !this.lis.length) {
                return
            }
            var d = this;
            this.lis.on("mouseover",
            function() {
                d.lis.eq(d.current).removeClass("current");
                d.current = parseInt($(this).attr("data-index"));
                d.lis.eq(d.current).addClass("current")
            })
        },
        create: function() {
            this.suggest = $('<div class="nomad-email-suggest"><span class="nomad-email-suggest-title">\u8bf7\u9009\u62e9</span><ul></ul></div>');
        },
        update: function() {
            if (this.input.val().indexOf("@") > -1 || !$.trim(this.input.val())) {
                this.hide();
                return
            }
            if (!this.list) {
                this.list = this.suggest.find("ul")
            }
            var j = this.lis || this.list.find("li");
            var g = j.length && j || "",
            f = $.trim(this.input.val());
            var e = this;
            if (!g) {
                for (var h = 0,
                d = this.host.length; h < d; h++) {
                    g += '<li data-index="' + h + '">' + f + "@" + this.host[h] + "</li>"
                }
                this.list.html(g)
            } else {
                for (var h = 0,
                d = this.host.length; h < d; h++) {
                    g.eq(h).html(f + "@" + e.host[h])
                }
            }
            this.lis = this.lis || this.suggest.find("li");
            this.suggest.show();
            this.ing = true
        },
        fix: function() {
            var d = this.input.offset();
            this.suggest && this.suggest.css({
                position: "absolute",
                left: d.left,
                top: d.top + this.input[0].clientHeight,
                minWidth: this.input[0].clientWidth
            });
            if ($.browser.msie&&$.browser.version=="6.0") {
                this.suggest.css("width", this.input[0].clientWidth)
            }
        },
        select: function(e) {
            if (!this.lis || !this.lis.length) {
                return
            }
            if (this.current >= 0) {
                this.lis.eq(this.current).removeClass("current")
            }
            if (e > 0) {
                this.current = this.current + 1 >= this.length ? 0 : this.current + 1
            } else {
                if (e < 0) {
                    this.current = this.current - 1 < 0 ? this.length - 1 : this.current - 1
                }
            }
            this.lis.eq(this.current).addClass("current")
        },
        on: function(d, e) {
            if (!$.isString(d) || !$.isFunction(e)) {
                return this
            }
            switch (d.toLowerCase()) {
            case "hide":
                this.events.hide = e;
                break;
            case "complete":
                this.events.complete = e;
                break;
            default:
                break
            }
            return this
        }
	});
	
	/*邮箱注册*/
	var md_Email = function(g){
        this.input = g.input && $(g.input);
        this.errCls = $.isString(g.errCls) && g.errCls || "";
        this.tip = g.tip && $(g.tip) && message($(g.tip));
        this.on = g.on || "keydown blur";
        this.checkUrl = g.checkUrl || "";
        this.checkData = $.isPlainObject(g.checkData) && g.checkData || {};
        this.checkCallback = $.isFunction(g.checkCallback) ? g.checkCallback: function() {};
        this.checkUseCache = $.isFunction(g.checkUseCache) ? g.checkUseCache: function() {
            return true
        };
        this.suggest = !!g.suggest;
        this.host = g.host || "";
        this.timeout = $.isNumeric(g.timeout) ? g.timeout: 0;
        this.defaultTip = g.defaultTip || null;
        this.defaultOn = g.defaultOn || "";
        this.msgTemplate = $.isPlainObject(g.msgTemplate) ? g.msgTemplate: null;
        this.disabledMsg = $.isString(g.disabledMsg) ? g.disabledMsg: "\u8f93\u5165\u683c\u5f0f\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.disabled = true;
        this.checked = false;
        this._suggest = null;
        this.stat = {
            code: 0,
            msg: ""
        };
        this.cache = !!g.cache ? md_Cache().init() : null;
        this.asyncRetData = null
	};
	
	var md_fn_Email = function(g) {
        return new md_Email(g);
    };
	$.augment(md_Email,{
		ctype: "CHECKER",
        pattern: /^[a-zA-Z\d][-\.\w]*@(?:[-\w]+\.)+(?:[a-zA-Z])+$/,
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
                msg: "\u8f93\u5165\u9519\u8bef"
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
        init: function() {
            if (!this.input || !this.tip || !this.pattern) {
                return this
            }
            var g = this;
            this.input.on(this.on,
            function() {
                $.later(function() {
                    if (!g._suggest || !g._suggest.ing) {
                        g.validate(false, true);
                        g._inputValidated = true
                    } else {
                        g._inputValidated = false
                    }
                },
                g.timeout, false, g)
            });
            this.defaultOn && (this.input.on(this.defaultOn,
            function() { ! $.trim(g.input.val()) && g.reset()
            }));
            if (this.suggest) {
                this._suggest = md_fn_EmailSuggest({
                    input: this.input,
                    host: this.host
                }).init().on("complete",
                function() {
                    if (!g._inputValidated) {
                        g.validate(false, true)
                    }
                })
            }
            this.validate(true, true);
            return this
        },
        validate: function(m) {
            if (!this.input) {
                this.disabled = false;
                return this.disabled
            }
            if (this.suggest && this._suggest && this._suggest.ing) {
                this.disabled = true;
                return this.disabled
            }
            var j = this;
            var g = arguments,
            h = $.isPlainObject(g[0]) ? g[0] : {
                def: !!g[0],
                async: !!g[1],
                callback: null,
                context: window
            },
            m = h.def,
            l = h.async,
            n = $.isFunction(h.callback) ? h.callback: function() {},
            k = h.context;
            this.externalCallback = n;
            if (this.ajaxing) {
                if ($.trim(this.input.val()) === this.ajaxingValue) {
                    return
                } else {
                    this.io && this.io.abort && this.io.abort()
                }
            }
            this.checkAble(function(o) {
                j.ajaxing = false;
                j.ajaxingValue = "";
                j.validateCallback(m);
                j.externalCallback.call(this, o)
            },
            l, k)
        },
        validateCallback: function(g) {
            if (g && this.tip.type.toLowerCase() == "error" && !this.tip.isHide()) {
                return this.disabled
            }
            this.check(g);
            this.checkCallback(this.disabled, this.asyncRetData, g);
            return this.disabled
        },
        check: function(g) {
            if (g && !$.trim(this.input.val())) { ! this.defaultOn && this.reset();
                return
            }
            switch (this.stat.code) {
            case - 1 : case 1:
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
                this.tip.ok();
                this.input.removeClass(this.errCls);
                break;
            default:
                break
            }
        },
        checkAble: function(n, k, j) {
            var h = this,
            l, g, j = j || this,
            k = !!k,
            n = $.isFunction(n) && n ||
            function() {},
            m = $.trim(this.input.val());
            if (!m.length) {
                this.disabled = true;
                this.stat = this.statusCode.empty;
                n.call(j, this.disabled);
                return
            } else {
                if (!this.cache || this.cache.getIndex("value", m) == -1) {
                    if (m.match(this.pattern)) {
                        this.disabled = false;
                        this.stat = this.statusCode.ok
                    } else {
                        this.disabled = true;
                        this.stat = this.statusCode.formatError
                    }
                    if (!this.checkUrl || this.disabled || !k) {
                        if (this.cache) {
                            g = this._updateCache();
                            this.cache.set(g, "value")
                        }
                        this.asyncRetData = null;
                        n.call(j, this.disabled);
                        return
                    }
                    this.ajaxing = true;
                    this.ajaxingValue = m;
                    this.io = $.ajax({
                        url: this.checkUrl,
                        data: $.mix(this.checkData, {
                            email: m
                        }),
                        type: "post",
                        dataType: "json",
                        success: function(o) {
                            h.asyncRetData = o;
                            if (o) {
                                var p = o.msg || o.reason || "";
                                p = h.msgTemplate ? h.msgTemplate[p] || p: p;
                                if (o.success) {
                                    h.disabled = false;
                                    h.stat = {
                                        code: h.statusCode.ok.code,
                                        msg: p || ""
                                    }
                                } else {
                                    h.disabled = true;
                                    h.stat = {
                                        code: h.statusCode.ajaxError.code,
                                        msg: p || h.statusCode.ajaxError.msg
                                    }
                                }
                                if (h.cache) {
                                    g = h._updateCache();
                                    checkCache = h.checkUseCache(h.disabled, h.asyncRetData);
                                    if (checkCache) {
                                        h.cache.set(g, "value")
                                    } else {
                                        h.cache.del("value", g.value)
                                    }
                                }
                            } else {
                                h.stat = {
                                    code: h.statusCode.netError.code,
                                    msg: h.statusCode.netError.msg,
                                    value: d.trim(h.input.val())
                                }
                            }
                            n.call(j, h.disabled)
                        }
                    })
                } else {
                    g = this.cache.get("value", m);
                    this.disabled = g.disabled;
                    this.stat = g.stat;
                    this.asyncRetData = g.data;
                    n.call(j, this.disabled)
                }
            }
        },
        _updateCache: function() {
            return {
                value: $.trim(this.input.val()),
                disabled: this.disabled,
                data: this.asyncRetData,
                stat: this.stat
            }
        },
        reset: function() {
            this.input && this.input.val("") && this.input.removeClass(this.errCls);
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
	});
	return md_fn_Email;
})