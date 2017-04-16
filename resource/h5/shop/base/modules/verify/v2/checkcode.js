define(function(require, exports, module){	
	/*验证码基础*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),message = require('./message');
	var md_CheckCode = function(p) {
		if (! (this instanceof md_CheckCode)) {
			return new md_CheckCode(p)
		}
		this.input = p.input && $(p.input);
		this.container = p.container && $(p.container);
		this.prefixCls = $.isString(p.prefixCls) ? p.prefixCls: "";
		this.identity = $.isString(p.identity) ? p.identity: "";
		this.sessionid = $.isString(p.sessionid) ? p.sessionid: "";
		this.refresher = p.refresher && $(p.refresher);
		this.checkedCode = "";
		//this.uid = g++;
		this.now =  new Date().getTime();
		this.img = p.checkCodeImg;
		this.getImgURL = p.checkCodeImg&&p.checkCodeImg.attr("data-src");
        this.checkImgURL =  p.apiserver&&p.apiserver;
		this.k = /^[\da-zA-Z]{4}$/,
		this.codeType = "IMG",
		this.h = {}
	};
	$.augment(md_CheckCode, {
		init: function() {
			
			if (!this.container || !this.input || !this.identity || !this.sessionid) {
				return
			}
			
			if (this.INITED) {
				return this
			}
			
			this.bind();
			this.INITED = true;
			return this
		},
		bind: function() {
			var p = this;
			this.bindImg();
			this.refresher.on("click",
			function(q) {
				q.preventDefault();
				q.stopPropagation();
				p.refresh();
				p.focus()
			});
			this.input.on("change",
			function(q) {
				p.now = new Date().getTime();
			}).on("paste",
			function() {
				if (this.value.length !== 0) {
					return
				}
				p.now = new Date().getTime();
			})
		},
		bindImg: function() {
			if (!this.img) {
				return this
			}
			var p = this;
			this.SHOWED = true;
			this.img && this.img.on("click",
			function() {
				p.refresh();
				p.focus()
			}).on("load",
			function() {}).on("error",
			function() {
				
			});
			return this
		},
		switchTo: function(p) {
			if (!p || !b.isString(p)) {
				return this
			}
			var p = p.toUpperCase();
			if (p === "IMG") {
				this.audioCode.hide();
				this.stopAudio();
				this.imgCode.css({
					display: "block"
				});
				this.codeType = p
			} else {
				if (p === "AUDIO") {
					this.imgCode.hide();
					this.audioProgress.width(0);
					this.audioStateText.removeClass(this.prefixCls + "audio-replay");
					this.audioCode.css({
						display: "block"
					});
					this.codeType = p
				}
			}
			this.checkedCode = "";
			this.toggleRefresher();
			this.SHOWED = true;
			this.fire("switch");
			return this
		},
		toggleRefresher: function() {
			if (this.codeType !== "AUDIO") {
				this.refresher.show();
				return
			}
			if (!this.audioSupport || c) {
				this.refresher.hide()
			}
		},
		refreshImg: function() {
			if (!this.getImgURL) {
				return this
			}
			var p = this.getImgURL + (this.getImgURL.indexOf("?") >= 0 ? "&t=": "?t=") + new Date().getTime();
			this.img.attr("src", p);
			return this
		},
		refresh: function(p) {
			var p = $.isString(p) && p ? p.toUpperCase() : this.codeType;
			this.refreshImg();
			this.checkedCode = "";
			//this.fire("refresh");
			//j = d = new Date().getTime();
		},
		focus: function() {
			this.input[0].focus();
			this.input[0].select()
		},
		showImg: function() {
			this.switchTo("img");
			this.refresh();
			return this
		},
		check: function(q) {
			var p = $.trim(this.input.val()),
			q = $.isFunction(q) ? q: function() {};
			if (!this.k.test(p)) {
				q({
					success: false,
					codeType: this.codeType
				});
				return
			}
			if (this.checkedCode && this.checkedCode === p) {
				q({
					success: true,
					codeType: this.codeType
				});
				return
			}
			this.h[p] = q;
			if (this.checkingCode) {
				if (this.checkingCode === p) {
					return
				} else {
					this.io && this.io.abort && this.io.abort()
				}
			}
			this.checkingCode = p;
			$.later(function() {
				this._check(q)
			},
			500, false, this)
		},
		_check: function(t) {
			var p = this.checkImgURL,
			s = $.trim(this.input.val());
			var q = this;
			q.io = $.ajax({
				url: p,
				data: {
					code: s
				},
				dataType: "json",
				success: function(u) {
					q.checkingCode = "";
					if (u && u.status) {
						q.checkedCode = s;
						q.h[s] && q.h[s]({
							success: true,
							codeType: q.codeType
						})
					} else {
						r()
					}
				},
				error: function() {
					r()
				}
			});
			function r() {
				if (q.codeType === "IMG") {
					q.refresh()
				}
				q.checkedCode = "";
				q.h[s] && q.h[s]({
					success: false,
					codeType: q.codeType
				})
			}
		}
	});
	/*验证码区域___________________________*/
	var SuperCheckCode = function(e) {
        if (! (this instanceof SuperCheckCode)) {
            return new SuperCheckCode(e)
        }
        this.input = e.input && $(e.input);
        this.errCls = $.isString(e.errCls) && e.errCls || "";
        this.container = e.container && $(e.container);
        this.defaultType = $.isString(e.defaultType) ? e.defaultType: "img";
        this.apiserver = e.apiserver;
        this.identity = e.identity;
        this.sessionid = e.sessionid;
		this.refresher = e.refresher && $(e.refresher);

        this.prefixCls = $.isString(e.prefixCls) ? e.prefixCls: "";
        this.checkData = $.isPlainObject(e.checkData) && e.checkData || {};
        this.checkCallback = $.isFunction(e.checkCallback) ? e.checkCallback: function() {};
		this.tip = (e.tip && $(e.tip)) ? message({
			input:e.input && $(e.input),
			msg:$(e.tip),
			icon:{
				left:e.tip_icon.left,
				top:e.tip_icon.top
			}
		}) : null;
		
		
        this.checkOn = e.on || "keyup blur";
        this.defaultTip = e.defaultTip || null;
        this.disabledMsg = $.isString(e.disabledMsg) ? e.disabledMsg: "\u9a8c\u8bc1\u7801\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.disabled = true;
		this.checkCodeImg  = e.checkCodeImg && $(e.checkCodeImg);
        this.stat = {
            code: 0,
            msg: ""
        };
        this.checkcode = null;
        this.codeType = ""
    };
    $.augment(SuperCheckCode, {
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
                msg: "\u9a8c\u8bc1\u7801\u683c\u5f0f\u9519\u8bef"
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
            if (!this.input || !this.container || !this.identity || !this.sessionid) {
                return this
            }
            var e = this;
            this.checkcode = md_CheckCode({
                input: e.input,
                container: e.container,
                apiserver: e.apiserver,
                identity: e.identity,
                sessionid: e.sessionid,
                prefixCls: e.prefixCls,
				refresher:e.refresher,
				checkCodeImg:e.checkCodeImg
            }).init();
            this.validate(true);
            this.input.on(this.checkOn,
            function() {
                e.validate(false, true)
            });
            return this
        },
        validate: function(f) {
            var g = this;
            var e = arguments,
            f = $.isPlainObject(e[0]) ? e[0] : {
                def: !!e[0],
                async: !!e[1],
                callback: null,
                context: window
            };
            var k = f.def,
            j = f.async,
            l = f.callback,
            h = f.context;
            this.checkAble(function(m) {
                g.validateCallback(k);
                $.isFunction(l) && l.call(this, m)
            },
            j, h)
        },
        validateCallback: function(e) {
            if (e && this.tip.type.toLowerCase() == "error" && !this.tip.isHide()) {
                return this.disabled
            }
            this.check(e); ! e && this.checkCallback(this.disabled);
            return this.disabled
        },
        check: function(e) {
            if (e && !$.trim(this.input.val())) {
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
                this.tip.ok();
                this.input.removeClass(this.errCls);
                break;
            default:

                break
            }
        },
        checkAble: function(j, g, f) {
            var e = this,
            h;
            var f = f || e,
            g = !!g,
            j = $.isFunction(j) && j ||
            function() {};
            if (!$.trim(this.input.val()).length) {
                this.disabled = true;
                this.disabledMsg = "\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a";
                this.stat = this.statusCode.empty;
                j.call(f, e.disabled);
                return
            } else {
                if (!$.trim(this.input.val()).match(/^[\da-zA-Z]{4,6}$/)) {
                    this.disabled = true;
                    this.disabledMsg = "\u9a8c\u8bc1\u7801\u683c\u5f0f\u9519\u8bef";
                    this.stat = this.statusCode.formatError
                } else {
                    this.disabled = false;
                    this.stat = this.statusCode.ok
                }
            }
            if (e.disabled || !g) {
                j.call(f, e.disabled);
                return
            }
            if (!this.checkcode || !this.checkcode.INITED || !this.checkcode.SHOWED) {
                j.call(f, e.disabled);
                return
            }
            this.checkcode.check(function(k) {
                if (k.success) {
                    e.disabled = false;
                    e.stat = e.statusCode.ok
                } else {
                    e.disabled = true;
                    e.stat = e.statusCode.ajaxError
                }
                j.call(f, e.disabled);
                e.checkCallback(e.disabled)
            })
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
        },
        showCode: function(f) {
            var f = f || this.defaultType,
            e = this;
            if (this.checkcode && !this.checkcode.SHOWED) {
                if (!this.checkcode.INITED) {
                    this.checkcode.init();
                    this.checkcode.on("switch",
                    function() {
                        e.disabled = true;
                        e.tip.hide();
                        e.codeType = this.codeType;
                        e.fire("switch")
                    }).on("refresh",
                    function() {
                        e.disabled = true;
                        e.tip.hide();
                        e.fire("refresh")
                    })
                }
                if (f.toLowerCase() === "audio") {
                    this.checkcode.showAudio()
                } else {
                    this.checkcode.showImg()
                }
            }
            this.INITED = this.checkcode && this.checkcode.INITED;
            this.SHOWED = this.checkcode && this.checkcode.SHOWED
        }
    });
	return SuperCheckCode;
})