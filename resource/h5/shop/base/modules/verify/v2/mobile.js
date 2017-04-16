/*
这个是验证手机和邮箱同一个输入项的插件
还有一点区别是，这里不需要message插件显示，所以需要的话要改造此JS
*/
define(function(require, exports, module){	
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),md_Cache = require('./cache'),message = require('./message');
	var md_PhoneCore = function(d) {
        this.phone = d || ""
    };
    var md_fn_PhoneCore = function(d) {
        return new md_PhoneCore(d)
    };
    $.augment(md_PhoneCore, {
        regex: {
            cm: /^(?:0?1)((?:3[56789]|5[0124789]|8[278])\d|34[0-8]|47\d)\d{7}$/,
            cu: /^(?:0?1)(?:3[012]|4[5]|5[356]|8[356]\d|349)\d{7}$/,
            ce: /^(?:0?1)(?:33|53|8[079])\d{8}$/,
            cn: /^(?:0?1)[34578]\d{9}$/,
            hk: /^(?:0?[1569])(?:\d{7}|\d{8}|\d{12})$/,
            macao: /^6\d{7}$/,
            tw: /^(?:0?[679])(?:\d{7}|\d{8}|\d{10})$/,
            kr: /^(?:0?[17])(?:\d{9}|\d{8})$/,
            jp: /^(?:0?[789])(?:\d{9}|\d{8})$/
        },
        defaultArea: ["cn"],
        check: function(f) {
            if (!this.phone) {
                return
            }
            var f = $.isArray(f) ? f: ($.isString(f) ? [f] : this.defaultArea);
            var d = f.length;
            while (d-->0) {
                var e = this.regex[f[d].toLowerCase()];
                if ( !! this.phone.match(e)) {
                    return true
                }
            }
            return false
        }
    });
	var fn_PhoneEmail = function(g) {
        this.input = g.input && $(g.input);
		this.tipBox = g.tipBox && $(g.tipBox);
		this.on = g.on || "keyup blur";
		this.tip = (g.tip && $(g.tip)) ? message({
			input:g.input && $(g.input),
			msg:$(g.tip),
			icon:{
				left:g.tip_icon.left,
				top:g.tip_icon.top
			}
		}) : null;
		this.errCls = $.isString(g.errCls) && g.errCls || "";
		this.checkData = $.isPlainObject(g.checkData) || $.isFunction(g.checkData) ? g.checkData: {};
		this.checkUrl = g.checkUrl || "";
		this.checkCallback = $.isFunction(g.checkCallback) ? g.checkCallback: function() {};
		this.checkUseCache = $.isFunction(g.checkUseCache) ? g.checkUseCache: function() {
            return true
        };//检查用户ID结果缓存
		this.disabled = true;
		this.timeout = $.isNumeric(g.timeout) ? g.timeout:0;
		this.cache = !!g.cache ? md_Cache().init() : null;
		this.area = g.area && $(g.area);
		this._validated = false;
		this.asyncRetData = null;/*异步请求结果*/
		this.select = g.select && $(g.select);/*国家选择*/
		this.area = g.area && $(g.area);/*国家对应的区号*/
		this.defaultTip = g.defaultTip || null;
        this.defaultOn = g.defaultOn || "";
		this.suggest = !!g.suggest;//打开邮箱提示
		this._suggest = null;
		this.host = g.host || "";//邮箱提示的所有后缀
    };
	var md_fn_PhoneEmail = function(g) {
        return new fn_PhoneEmail(g);
    };
	$.augment(fn_PhoneEmail,{
		pattern: /^[a-zA-Z\d][-\.\w]*@(?:[-\w]+\.)+(?:[a-zA-Z])+$/,//邮箱正则
		ctype: "CHECKER",
        areaCode: {
            cn: "86",
            hk: "852",
            macao: "853",
            tw: "886",
            kr: "82",
            jp: "81"
        },
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
                msg: "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u9519\u8bef"
            },
            ajaxError: {
                code: 3,
                msg: "\u8f93\u5165\u9519\u8bef"
            },
            used: {
                code: 4,
                msg: "\u5df2\u88ab\u5360\u7528\uff0c\u8bf7\u66f4\u6362\u5176\u4ed6\u53f7\u7801\uff0c\u82e5\u60a8\u662f\u6b64\u53f7\u7801\u7684\u4f7f\u7528\u8005"
				/*已被占用，请更换其他号码，若您是此号码的使用者*/
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
        getArea: function() {
            var g;
            if (!this.select) {
                g = "cn";
                return g
            }
            switch (this.select.val()) {
            case "1":
                g = "cn";
                break;
            case "2":
                g = "hk";
                break;
            case "3":
                g = "macao";
                break;
            case "4":
                g = "tw";
                break;
            case "5":
                g = "kr";
                break;
            case "6":
                g = "jp";
                break;
            default:
                break
            }
            return g
        },
		init: function() {
            if (!this.input || !this.tip) {
                return this
            }
            this.type = this.getArea();
            var g = this;
            this.input.on(this.on,
            function() {
                /*$.later(function() {
                    g.validate(false, true)
                },*/
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
			this.select && this.area && this.select.on("change",
            function() {
                g.type = g.getArea();
                g.code = g.areaCode[g.type] || "";
                g.area.html("+" + g.code);
                if (g._validated) {
                    $.later(function() {
                        g.validate(false, true)
                    },
                    this.timeout, false, this)
                }
            }) && this.select.trigger("change");
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
        validate: function(h) {
            if (!this.input) {
                this.disabled = false;
                return this.disabled
            }
			/*if (this.suggest && this._suggest && this._suggest.ing) {
                this.disabled = true;
                return this.disabled
            }*/
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
            n = $.isFunction(h.callback) ? h.callback: function() {},
            k = h.context;
            this.externalCallback = n;
            if (this.ajaxing) {
                if (this._getFullNumber() === this.ajaxingValue) {
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
        _getFullNumber: function() {
			var s = $.trim(this.input.val());
			
            return s.indexOf("@")>0?s:(this.select ? this.select.val() + "-": "") + s;
        },
        getArea: function() {
            var g;
            if (!this.select) {
                g = "cn";
                return g
            }
            switch (this.select.val()) {
            case "1":
                g = "cn";
                break;
            case "2":
                g = "hk";
                break;
            case "3":
                g = "macao";
                break;
            case "4":
                g = "tw";
                break;
            case "5":
                g = "kr";
                break;
            case "6":
                g = "jp";
                break;
            default:
                break
            }
            return g
        },
        check: function(g) {
            if (g && !$.trim(this.input.val())) {
                this.resetTip();
                return
            }
            this._validated = true;
            switch (this.stat.code) {
            case - 1 : case 1:
            case 2:
            case 3:
                this.showTipBox({
                    type:
                    "error",
                    msg: {
                        content: this.stat.msg
                    }
                });
                break;
            case 100:
                this.showTipBox({
                    type:
                    "ok"
                });
                break;
            default:
                break
            }
        },
        showTipBox: function(g) {
            this.tipBox && this.tipBox.removeClass("hide").addClass("show");
            if (!$.isPlainObject(g)) {
                return
            }
            switch (g.type.toLowerCase()) {
            case "error":
                this.tip.error(g.msg || "");
                this.input.removeClass(this.errCls);
                $.later(function() {
                    this.input.addClass(this.errCls)
                },
                1, false, this);
                break;
            case "tips":
                this.tip.tips(g.msg || "");
                break;
            case "attention":
                this.tip.attention(g.msg || "");
                break;
            case "ok":
                this.tip.ok(g.msg || "");
                this.input.removeClass(this.errCls);
                break;
            case "stop":
                this.tip.stop(g.msg || "");
                break;
            case "notice":
                this.tip.notice(g.msg || "");
                break;
            case "question":
                this.tip.question(g.msg || "");
                break;
            case "retrieve"://已被占用
                this.tip.error(g.msg || "\u5df2\u88ab\u5360\u7528\uff0c\u8bf7\u66f4\u6362\u5176\u4ed6\u53f7\u7801\uff0c\u82e5\u60a8\u662f\u6b64\u53f7\u7801\u7684\u4f7f\u7528\u8005");
                this.retrieveTrigger && this.retrieveTrigger.show();
                break;
            default:
                break
            }
        },
        hideTipBox: function() {
            this.tipBox && this.tipBox.removeClass("show").addClass("hide");
            this.tip.hide();
            this.input.removeClass(this.errCls)
        },
        _updateCache: function() {
            return {
                value: this._getFullNumber(),
                disabled: this.disabled,
                data: this.asyncRetData,
                stat: this.stat
            }
        },
        isEmpty: function() {
            return ! $.trim(this.input.val()).length
        },
        checkAble: function(m, k, j) {
            var h = this,
            l, g;
            var j = j || h,
            k = !!k,
            m = $.isFunction(m) && m ||
            function() {};
            h.asyncRetData = null;
            if (this.isEmpty()) {
                this.disabled = true;
                this.stat = this.statusCode.empty;
                m.call(j, h.disabled)
            } else {
                if (!h.cache || h.cache.getIndex("value", h._getFullNumber()) == -1) {
                    if (md_fn_PhoneCore($.trim(this.input.val())).check(this.type)) {
                        this.disabled = false;
                        this.stat = this.statusCode.ok
                    } else {
                        this.disabled = true;
                        this.stat = this.statusCode.formatError
                    }
					
                    if (!h.checkUrl || h.disabled || !k) {
                        if (h.cache) {
                            g = h._updateCache();
                            h.cache.set(g, "value")
                        }
                        m.call(j, h.disabled);
                        return
                    }
                    this.ajaxing = true;
                    this.ajaxingValue = this._getFullNumber();
					var Fdata = this.ajaxingValue.indexOf("@")>0?{
                            userid: $.trim(h.input.val())
                    }:{
                        mobile_area: h.select?h.select.val():"86",
                        userid: $.trim(h.input.val())
                    };
					
                    this.io = $.ajax({
                        url: h.checkUrl,
                        data:$.mix($.isFunction(h.checkData) ? h.checkData() : h.checkData,Fdata),
                        type: "post",
                        dataType: "json",
                        success: function(n) {
                            h.asyncRetData = n;
                            if (n) {
                                var o = n.msg || n.reason || "";
                                o = h.msgTemplate ? h.msgTemplate[o] || o: o;
                                if (n.status) {
									
                                    h.disabled = false;
                                    h.stat = {
                                        code: h.statusCode.ok.code,
                                        msg: o || h.statusCode.ok.msg
                                    }
                                } else {
                                    h.disabled = true;
                                    h.stat = {
                                        code: h.statusCode.ajaxError.code,
                                        msg: o || h.statusCode.ajaxError.msg
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
                                    value: $.trim(h.input.val())
                                }
                            }
							
                            m.call(j, h.disabled)
                        }
                    })
                } else {
                    g = h.cache.get("value", this._getFullNumber());
                    h.disabled = g.disabled;
                    h.stat = g.stat;
                    h.asyncRetData = g.data;
                    m.call(j, h.disabled)
                }
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
        }
	});
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
                    g.eq(h).html(f  + e.host[h])
                }
            }
            this.lis = this.lis || this.suggest.find("li");
            this.suggest.show();
            this.ing = true
        },
        fix: function() {
            var d = this.input.position();
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
	return md_fn_PhoneEmail;
})