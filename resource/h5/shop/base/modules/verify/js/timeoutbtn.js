define(function(require, exports, module){	
	/*
	倒计时按钮
	*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery');
	var md_TimeoutBtn = function(d) {
        this.btn = d.btn && $(d.btn);
        this.timeout = d.timeout ? (Number(d.timeout) || 0) : 0;
        this.callback = $.isFunction(d.callback) && d.callback || null;
        this.text = d.text || (this.btn ? this.btn.text() : "");
        this.waitText = d.waitText || "%t%\u79d2\u540e\u53ef\u91cd\u65b0\u64cd\u4f5c";
        this.timeoutText = d.timeoutText || this.text;
        this.timeoutCls = d.timeoutCls || "";
        this.disabledCls = d.disabledCls || "";
        this.autoStart = !!d.autoStart;
        this._id = 0;
        this.autoStart && this.start()
    };
    var md_fn_TimeoutBtn = function(d) {
        return new md_TimeoutBtn(d)
    };
    $.augment(md_TimeoutBtn, {
        _counter: 0,
        start: function() {
            if (!this.btn || !this.timeout) {
                return
            }
            this._counter = 0;
            this.btn.prop("disabled", true);
            this.refresh();
            var d = this;
            if (this._id) {
                window.clearInterval(this._id)
            }
            this._id = setInterval(function() {
                d.disabled()
            },
            1000)
        },
        disabled: function() {
            this._counter++;
            if (this._counter == this.timeout) {
                this.clear();
                this.callback && this.callback()
            } else {
                this.refresh()
            }
        },
        clear: function() {
            window.clearInterval(this._id);
            this._id = "";
            this._counter = 0;
            this.btn.prop("disabled", false);
            this.btn.text(this.timeoutText);
            this.btn.removeClass(this.timeoutCls);
            this.btn.removeClass(this.disabledCls);
            this.btn.text(this.text)
        },
        refresh: function() {
            this.btn.text(this.waitText.replace("%t%", this.timeout - this._counter));
            this.btn.addClass(this.disabledCls)
        },
        reset: function() {
            this.clear()
        }
    });
	return md_fn_TimeoutBtn;
})