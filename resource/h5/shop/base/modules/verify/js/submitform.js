define(function(require, exports, module){	
	/*表单提交*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery') ,message = require('./message');
	var md_SubmitForm = function(e) {
        this.form = e.form && $(e.form);
        this.off = !!e.off;
        this.tip = e.tip && $(e.tip) ? message($(e.tip)) : null;
        this.stopTip = !!e.stopTip;
        this.asyncURL = $.isString(e.asyncURL) ? e.asyncURL: "";
        this.async = !!e.asyncURL;
        this.asyncType = $.isString(e.asyncType) ? e.asyncType: "post";
        this.asyncDataType = $.isString(e.asyncDataType) ? e.asyncDataType: "";
        this.asyncExternalData = $.isFunction(e.asyncExternalData) || $.isPlainObject(e.asyncExternalData) ? e.asyncExternalData: {};
        this.trigger = e.trigger ? $(e.trigger) : null;
        this.stop = $.isBoolean(e.stop) && e.stop || true;
        this.checkers = $.isArray(e.checkers) && e.checkers || ($.isFunction(e.checkers) ? e.checkers: []);
        this.disabledMsg = $.isString(e.disabledMsg) ? e.disabledMsg: "\u4fe1\u606f\u8f93\u5165\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.checkCallback = $.isFunction(e.checkCallback) ? e.checkCallback: null;
        this.asyncCallback = $.isFunction(e.asyncCallback) ? e.asyncCallback: null;
        this.checkerDisabledMsg = "";
        this.disabled = false
    };
    var SubmitForm = function(e) {
        return new md_SubmitForm(e)
    };
    $.augment(md_SubmitForm, {
        init: function() {
            if (!this.form) {
                return
            }
            var e = this;
            if (this.trigger) {
                this.trigger.on("click",
                function() {
                    e.validate()
                })
            }
            if (!e.off) {
                this.form.on("submit",
                function(f) {
					f.preventDefault();
					f.stopPropagation();
                    e.validate()
                })
            }
            return this
        },
        validateCallback: function() {
            var e = this;
            if (e.disabled && e.stop && !e.stopTip) {
                e.tip && e.tip.error(e.checkerDisabledMsg || e.disabledMsg).laterHide(2000);
                return
            }
            if (e.checkCallback) {
                e.checkCallback(e.disabled);
                return
            }
            if (e.disabled && this.stop) {
                return
            }
            if (e.async && e.asyncURL) {
                var f = $.isFunction(e.asyncExternalData) ? e.asyncExternalData() : e.asyncExternalData;
                $.ajax({
                    url: e.asyncURL,
                    type: e.asyncType,
                    data: $.mix($.unparam(e.form.serialize(e.form)), f),
                    dataType: e.asyncDataType,
                    success: function(h, g, j) {
                        e.asyncCallback.call(e, h, g, j)
                    }
                })
            } else {
                this.form[0].submit()
            }
        },
        validate: function() {
            this.disabled = false;
            var e = $.isFunction(this.checkers) ? this.checkers() : this.checkers;
            if (!e.length) {
                return
            }
            this.validateIndex = 0;
            this.checkers = e;
            if ($.isFunction(e[this.validateIndex].validate)) {
                $.isFunction(e[0].validate) && e[0].validate({
                    async: true,
                    callback: this._check,
                    context: this
                })
            }
        },
        _check: function(e) {
            if (e) {
                this.disabled = true;
                if (this.checkers[this.validateIndex].disabledMsg) {
                    this.checkerDisabledMsg = this.checkers[this.validateIndex].disabledMsg
                }
                this.validateCallback();
                return
            } else {
                if (this.checkers[++this.validateIndex] && $.isFunction(this.checkers[this.validateIndex].validate)) {
                    this.checkers[this.validateIndex].validate({
                        async: true,
                        callback: this._check,
                        context: this
                    })
                } else {
                    this.validateCallback()
                }
            }
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
        },
        reset: function() {
            this.disabled = false;
            this.resetTip();
            return this
        }
    });
	return SubmitForm;
})