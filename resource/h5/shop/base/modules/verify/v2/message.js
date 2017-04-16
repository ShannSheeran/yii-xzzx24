define(function(require, exports, module){	
	/*消息方法*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery');
	var messageFun = function(f, e){
		this.msg = f.msg && $(f.msg);
       	this.input = f.input && $(f.input);
		this.icon = f.icon || {left:0,top:0};
		this.title = this.msg && this.msg.find(".msg-tit");
        this.content = this.msg && this.msg.find(".msg-cnt");
        this.source = $.isPlainObject(e) ? e: null;
        this.type = this._getType();
		this.init();
	};
	var message = function(f, e) {
        return new messageFun(f, e)
    };
	$.augment(messageFun, {
		init:function(){
			if (!this.input) {
                return this
            }
			var s = document.createElement("div");
			s.className = "msg-icon-status";
			this.input.after(s);
			this.placeholder = $(s);
			this.placeholder.css({"position":"absolute","display":"none"});
			this.fix();
		},
        fix: function() {
            var d = this.input.position();
            this.placeholder.css({
                position: "absolute",
                left: d.left + this.icon.left
            }).css({
                top: d.top + Math.floor((this.input[0].clientHeight + this.icon.top - this.placeholder[0].clientHeight) / 2)
            })
        },
		/*改变样式*/
		change: function(f, e) {
            if (!this.msg) {
                return this
            }
            this.show();
            var f = f && f.toUpperCase() || "";
            switch (f) {
            case "OK":
            case "ERROR":
            case "TIPS":
            case "NOTICE":
            case "ATTENTION":
            case "QUESTION":
            case "STOP":
                this._changeType(f);
                break;
            default:
                break
            }
            this.type = this._getType();
            this._changeText(e);
            return this
        },
		_changeType: function(f) {
            var e = this.msg.attr("class"),h = this.placeholder.attr("class"),
            g = /\bmsg-ok\b|\bmsg-error\b|\bmsg-tips\b|\bmsg-notice\b|\bmsg-attention\b|\bmsg-question\b|\bmsg-stop\b/g;
			d = /\bmsg-icon-ok\b|\bmsg-icon-error\b|\bmsg-icon-tips\b|\bmsg-icon-notice\b|\bmsg-icon-attention\b|\bmsg-icon-question\b|\bmsg-icon-stop\b/g;
            if (e.match(g)) {
                this.msg.attr("class", e.replace(g, "msg-" + f.toLowerCase()));
				this.placeholder.attr("class",h.replace(d, "msg-icon-" + f.toLowerCase()));
            } else {
                this.msg.addClass("msg-" + f.toLowerCase());
				this.placeholder.addClass("msg-icon-" + f.toLowerCase());
            }
        },
        _changeTitle: function(e) {
            if (!this.title || !$.type(e)==="string") {
                return
            }
            this.title.html(e)
        },
        _changeContent: function(e) {
            if (!this.content || !$.type(e)==="string") {
                return
            }
            this.content.html(this.source ? this.source[e] || "": e)
        },
        _changeText: function(e) {
			
            var g = $.isPlainObject(e) && $.type(e.title)==="string" ? e.title: "",
            f = $.isPlainObject(e) && $.type(e.content)==="string" ? e.content: ($.type(e)==="string" ? e: "");
            this._changeTitle(g);
            this._changeContent(f);
            if (!g && !f && this.msg) {
                this.msg.addClass("msg-weak");
				this.placeholder.addClass("msg-icon-weak");
            }
        },
		ok: function(e) {
            this.change("ok", e);
            return this
        },
        error: function(e) {
            this.change("error", e);
            return this
        },
        tips: function(e) {
            this.change("tips", e);
            return this
        },
        notice: function(e) {
            this.change("notice", e);
            return this
        },
        attention: function(e) {
            this.change("attention", e);
            return this
        },
        question: function(e) {
            this.change("question", e);
            return this
        },
        stop: function(e) {
            this.change("stop", e);
            return this
        },
		weak: function() {
            this.msg.replaceClass("msg", "msg-weak");
            this.msg.replaceClass("msg-b", "msg-b-weak")
			this.placeholder.replaceClass("msg-icon", "msg-icon-weak");
        },
        _getType: function() {
            var f = "",
            e = this.msg.attr("class");
            if (e.match(/\bmsg-(b-)?error\b/)) {
                f = "ERROR"
            } else {
                if (e.match(/\bmsg-(b-)?-tips\b/)) {
                    f = "TIPS"
                } else {
                    if (e.match(/\bmsg-(b-)?-attention\b/)) {
                        f = "ATTENTION"
                    } else {
                        if (e.match(/\bmsg-(b-)?-notice\b/)) {
                            f = "NOTICE"
                        } else {
                            if (e.match(/msg-ok|msg-b-ok/)) {
                                f = "OK"
                            } else {
                                if (e.match(/\bmsg-(b-)?-question\b/)) {
                                    f = "QUESTION"
                                } else {
                                    if (e.match(/\bmsg-(b-)?-stop\b/)) {
                                        f = "STOP"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return f
        },
		isHide: function() {
			this.placeholder.css("visibility") == "hidden" || this.placeholder.css("display") == "none";
            return this.msg.css("visibility") == "hidden" || this.msg.css("display") == "none"
        },
        hide: function() {
			this.placeholder.css("display","none");
            this.msg.removeClass("msg-show").addClass("msg-hide");
            return this
        },
        show: function() {
            this.placeholder.css("display","block");
            this.msg.removeClass("msg-hide").addClass("msg-show");
            return this
        }
	});
	return message;
})