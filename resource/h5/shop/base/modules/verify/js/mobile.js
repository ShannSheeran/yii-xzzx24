define(function(require, exports, module){	
	/*step2 手机注册*/
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
            cn: /^(?:0?1)[3458]\d{9}$/,
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
	var md_Phone = function(g){
        this.input = g.input && $(g.input);
        this.errCls = $.isString(g.errCls) && g.errCls || "";
        this.tipBox = g.tipBox && $(g.tipBox);
        this.tip = (g.tip && $(g.tip)) ? message($(g.tip)) : null;
        this.on = g.on || "keyup blur";
        this.defaultTip = g.defaultTip || null;
        this.checkUrl = g.checkUrl || "";
        this.checkData = $.isPlainObject(g.checkData) || $.isFunction(g.checkData) ? g.checkData: {};
        this.checkCallback = $.isFunction(g.checkCallback) ? g.checkCallback: function() {};
        this.checkUseCache = $.isFunction(g.checkUseCache) ? g.checkUseCache: function() {
            return true
        };
        this.timeout = $.isNumeric(g.timeout) ? g.timeout: 0;
        this.select = g.select && $(g.select);
        this.area = g.area && $(g.area);
        this.type = "";
        this.retrieveTrigger = g.retrieveTrigger && $(g.retrieveTrigger);
        this.panel = g.panel && $(g.panel);
        this._showPanel = !!g.showPanel;
        this.ifrRetrieve = g.ifrRetrieve && $(g.ifrRetrieve);
        this._ifrRetrieveUrl = this.ifrRetrieve && this.ifrRetrieve.attr("data-src") || "";
        this.disabledMsg = $.isString(g.disabledMsg) ? g.disabledMsg: "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.disabled = true;
        this.msgTemplate = $.isPlainObject(g.msgTemplate) ? g.msgTemplate: null;
        this.stat = {
            code: 0,
            msg: ""
        };
        this._validated = false;
        this._retrieving = false;
        this.cache = !!g.cache ? md_Cache().init() : null;
        this.code = "";
        this.asyncRetData = null
	};
	var md_fn_Phone = function(g) {
        return new md_Phone(g);
    };
	$.augment(md_Phone,{
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
                msg: "\u624b\u673a\u53f7\u7801\u9519\u8bef"
            },
            ajaxError: {
                code: 3,
                msg: "\u53f7\u7801\u4e0d\u53ef\u7528"
            },
            used: {
                code: 4,
                msg: "\u5df2\u88ab\u5360\u7528\uff0c\u8bf7\u66f4\u6362\u5176\u4ed6\u53f7\u7801\uff0c\u82e5\u60a8\u662f\u6b64\u53f7\u7801\u7684\u4f7f\u7528\u8005"
            },
            ok: {
                code: 100,
                msg: ""
            }
        },
        init: function() {
            if (!this.input || !this.tip) {
                return this
            }
            this.type = this.getArea();
            var g = this;
            this.input.on(this.on,
            function() {
                $.later(function() {
                    g.validate(false, true)
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
            this._showPanel && this.showPanel();
            this.retrieveTrigger && this.retrieveTrigger.on("click",
            function() {
                g.togglePanel()
            });
            this.validate(true, true);
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
                    this.io = $.ajax({
                        url: h.checkUrl,
                        data: $.mix($.isFunction(h.checkData) ? h.checkData() : h.checkData, {
                            mobile_area: h.select.val(),
                            mobile: $.trim(h.input.val())
                        }),
                        type: "post",
                        dataType: "json",
                        success: function(n) {
                            h.asyncRetData = n;
                            if (n) {
                                var o = n.msg || n.reason || "";
                                o = h.msgTemplate ? h.msgTemplate[o] || o: o;
                                if (n.success) {
									
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
        _updateCache: function() {
            return {
                value: this._getFullNumber(),
                disabled: this.disabled,
                data: this.asyncRetData,
                stat: this.stat
            }
        },
        _getFullNumber: function() {
            return (this.select ? this.select.val() + "-": "") + $.trim(this.input.val())
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
        showPanel: function() {
            this.panel.show();
            this.retrieveTrigger.html("\u53d6\u6d88\u7533\u8bf7 \u25b2");
            this._retrieving = true;
            this.select.prop("disabled", true);
            this.input.prop("disabled", true);
            this._ifrRetrieveUrl && this.ifrRetrieve.attr("src", this._ifrRetrieveUrl)
        },
        hidePanel: function() {
            this.panel.hide();
            this.retrieveTrigger.html("\u7533\u8bf7\u7ed1\u5b9a\u6b64\u53f7\u7801 \u25bc");
            this._retrieving = false;
            this.select.prop("disabled", false);
            this.input.prop("disabled", false);
            this._ifrRetrieveUrl && this.ifrRetrieve.attr("src", "about:blank")
        },
        togglePanel: function() {
            this._retrieving ? this.hidePanel() : this.showPanel()
        },
        isEmpty: function() {
            return ! $.trim(this.input.val()).length
        },
        showTipBox: function(g) {
            this.tipBox && this.tipBox.removeClass("hide").addClass("show");
            this.retrieveTrigger && this.retrieveTrigger.hide();
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
            case "retrieve":
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
	return md_fn_Phone;
})