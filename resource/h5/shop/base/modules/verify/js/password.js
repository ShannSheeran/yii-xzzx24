define(function(require, exports, module){	
	/*密码基础*/
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery'),message = require('./message');
	
	
	
	
	/*密码基础*/
	var md_PasswordCore = function(d) {
        this.password = d || ""
    };
    var PasswordCore= function(d) {
        return new md_PasswordCore(d)
    };
    $.augment(md_PasswordCore, {
        regex:{
			illegal:/[^-+=|,0-9a-zA-Z!@#$%^&*?_.~+/\\(){}\[\]<>]/g,
			allNumber:/^\d+$/,
			allLetter:/^[a-zA-Z]+$/,
			allCharacter:/^[-+=|,!@#$%^&*?_.~+/\\(){}\[\]<>]+$/,
			allSame:/^([\s\S])\1*$/,
			number:/\d/g,letter:/[a-zA-Z]/g,
			lowerAndUpperLetter:/[a-z][^A-Z]*[A-Z]|[A-Z][^a-z]*[a-z]/,
			numberAndLetter:/\d[^a-zA-Z]*[a-zA-Z]|[a-zA-Z][^\d]*\d/,character:/[-+=|,!@#$%^&*?_.~+/\\()|{}\[\]<>]/g},
        score: function() {
            var g = 0;
            if (this.isIllegal()) {
                return g
            }
            var j = this.size();
            if (j <= 4) {
                g += 5
            } else {
                if (j > 4 && j < 8) {
                    g += 10
                } else {
                    if (j >= 8) {
                        g += 25
                    }
                }
            }
            var f = this.hasLowerAndUpperLetter(),
            e = this.hasLetter();
            if (f) {
                g += 20
            } else {
                if (e) {
                    g += 10
                }
            }
            var d = this.hasNumber();
            if (d >= 3) {
                g += 20
            } else {
                if (d) {
                    g += 10
                }
            }
            var h = this.hasCharacter();
            if (h >= 3) {
                g += 25
            } else {
                if (h) {
                    g += 10
                }
            }
            if (f && d && h) {
                g += 10
            } else {
                if (e && d && h) {
                    g += 5
                } else {
                    if ((e && d) || (e && h) || (d && h)) {
                        g += 2
                    }
                }
            }
            return g
        },
        level: function() {
            var e = 0;
            var d = Math.floor(this.score() / 10);
            switch (d) {
            case 10:
            case 9:
                e = 7;
                break;
            case 8:
                e = 6;
                break;
            case 7:
                e = 5;
                break;
            case 6:
                e = 4;
                break;
            case 5:
            case 4:
            case 3:
                e = 3;
                break;
            case 2:
                e = 2;
                break;
            default:
                e = 1;
                break
            }
            return e
        },
        size: function() {
            return this.password.length
        },
        isIllegal: function() {
            return !! this.password.match(this.regex.illegal)
        },
        isAllNumber: function() {
            return !! this.password.match(this.regex.allNumber)
        },
        isAllLetter: function() {
            return !! this.password.match(this.regex.allLetter)
        },
        isAllSame: function() {
            return !! this.password.match(this.regex.allSame)
        },
        hasNumber: function() {
            return (this.password.match(this.regex.number) || []).length
        },
        hasLetter: function() {
            return (this.password.match(this.regex.letter) || []).length
        },
        hasLowerAndUpperLetter: function() {
            return !! this.password.match(this.regex.lowerAndUpperLetter)
        },
        hasNumberAndLetter: function() {
            return !! this.password.match(this.regex.numberAndLetter)
        },
        hasCharacter: function() {
            return (this.password.match(this.regex.character) || []).length
        }
    });
	var md_Similar = {
        _str1: null,
        _str3: null,
        _matrix: null,
        init: function(e, d) {
            if (!$.isString(e) || !$.isString(d)) {
                return
            }
            this._str1 = e;
            this._str2 = d;
            e.length && d.length && this._createMatrix(e.length + 1, d.length + 1);
            this._matrix && this._initMatrix();
            return this
        },
        get: function() {
            return 1 - this._getDistance() / Math.max(this._str1.length, this._str2.length)
        },
        _getDistance: function() {
            var g = this._str1.length,
            e = this._str2.length;
            if (!g || !e) {
                return Math.max(g, e)
            }
            var l = this._str1.split(""),
            k = this._str2.split("");
            var h = 0,
            f = 0,
            d = 0;
            while (h++<g) {
                f = 0;
                while (f++<e) {
                    d = l[h - 1] === k[f - 1] ? 0 : 1;
                    this._matrix[h][f] = Math.min(this._matrix[h - 1][f] + 1, this._matrix[h][f - 1] + 1, this._matrix[h - 1][f - 1] + d)
                }
            }
            return this._matrix[h - 1][f - 1]
        },
        _initMatrix: function() {
            var f = this._matrix[0].length,
            e = this._matrix.length;
            var d = Math.max(f, e);
            while (d--) {
                f - 1 >= d && (this._matrix[0][d] = d);
                e - 1 >= d && (this._matrix[d][0] = d)
            }
        },
        _createMatrix: function(e, d) {
            if (!$.isNumeric(e) || !$.isNumeric(d) || e < 1 || d < 1) {
                return
            }
            this._matrix = new Array(e),
            i = 0;
            while (i < e) {
                this._matrix[i++] = new Array(d)
            }
        }
    },
    Similar= function(e, d) {
        return md_Similar.init(e, d).get()
    };
	/*密码*/
	var md_Password = function(g) {
        this.input = g.input && $(g.input);
		
        this.reinput = g.reinput && $(g.reinput);
		
		
		this.rsainput = g.rsainput&& $(g.rsainput);
		this.rsaexponent = g.rsaexponent&& $(g.rsaexponent);
		this.rsamodule = g.rsamodule&& $(g.rsamodule);
		
        this.strengthInput = g.strengthInput && $(g.strengthInput);
        this.timeout = $.isNumeric(g.timeout) ? g.timeout: 0;
        this.errCls = $.isString(g.errCls) && g.errCls || "";
        this.checkCallback = $.isFunction(g.checkCallback) ? g.checkCallback: function() {};
        this.tip = g.tip && $(g.tip) ? message($(g.tip)) : null;
        this.retip = g.retip && $(g.retip) ? message($(g.retip)) : null;
        this.strength = g.strength && $(g.strength);
        this.strengthCls = g.strengthCls ? g.strengthCls: {
            weak: "weak",
            medium: "medium",
            strong: "strong"
        };
        this.on = g.on || "keyup blur";
        this.defaultOn = g.defaultOn || "";
        this.username = g.username && $(g.username);
        this.defaultTip = g.defaultTip || null;
        this.redefaultTip = g.redefaultTip || null;
        this.disabledMsg = $.isString(g.disabledMsg) ? g.disabledMsg: "\u5bc6\u7801\u6216\u91cd\u590d\u5bc6\u7801\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01";
        this.password = null;
        this._disabled = true;
        this._redisabled = !!this.reinput;
        this.disabled = this._disabled || this._redisabled;
        this.stat = {
            code: 0,
            msg: ""
        };
        this.restat = {
            code: 0,
            msg: ""
        }
    };
    var Password = function(g) {
        return new md_Password(g)
    };
    $.augment(md_Password, {
        ctype: "CHECKER",
        statusCode: {
            empty: {
                code: 1,
                msg: "\u4e0d\u80fd\u4e3a\u7a7a"
            },
            size: {
                code: 2,
                msg: "\u957f\u5ea6\u5e94\u4e3a6-16\u4e2a\u5b57\u7b26"
            },
            illegal: {
                code: 3,
                msg: "\u4e0d\u80fd\u5305\u542b\u975e\u6cd5\u5b57\u7b26"
            },
            same: {
                code: 4,
                msg: "\u4e0d\u80fd\u4e3a\u540c\u4e00\u5b57\u7b26"
            },
            allLetter: {
                code: 5,
                msg: "\u4e0d\u80fd\u5168\u4e3a\u5b57\u6bcd"
            },
            allNumber: {
                code: 6,
                msg: "\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57"
            },
            allCharacter: {
                code: 7,
                msg: "\u4e0d\u80fd\u5168\u4e3a\u7b26\u53f7"
            },
            weak: {
                code: 8,
                msg: "\u60a8\u7684\u5bc6\u7801\u5b89\u5168\u6027\u8f83\u4f4e\uff0c\u5efa\u8bae\u4f7f\u7528\u82f1\u6587\u5b57\u6bcd\u52a0\u6570\u5b57\u6216\u7b26\u53f7\u7ec4\u5408"
            },
            similar: {
                code: 9,
                msg: "\u5bc6\u7801\u548c\u8d26\u6237\u540d\u592a\u76f8\u4f3c"
            },
            reEmpty: {
                code: 10,
                msg: "\u518d\u8f93\u4e00\u6b21\u5bc6\u7801"
            },
            reError: {
                code: 11,
                msg: "\u4e24\u6b21\u5bc6\u7801\u8f93\u5165\u4e0d\u4e00\u81f4"
            },
            reOk: {
                code: 99,
                msg: ""
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
            var g = this;
            this.validate(true);
            this.input.on("keyup",
            function() {
                g.checkPassword()
            }).on(this.on,
            function() {
                $.later(function() {
                    g.checkPassword();
                    g.check()
                },
                g.timeout, false, g)
            });
            this.defaultOn && (this.input.on(this.defaultOn,
            function() { ! g.input.val().length && g.reset()
            }));
            if (!this.reinput || !this.retip) {
                return this
            }
            this.reinput.on(this.on,
            function() {
                g.checkRePassword();
                g.checkRe()
            });
            this.defaultOn && (this.reinput.on(this.defaultOn,
            function() { ! g.reinput.val().length && g.resetRe()
            }));
            return this
        },
        validate: function(h) {
            if (!this.input) {
                this.disabled = false;
                return this.disabled
            }
            var g = arguments,
            h = $.isPlainObject(g[0]) ? g[0] : {
                def: !!g[0],
                async: !!g[1],
                callback: null,
                context: window
            };
            var l = h.def,
            k = h.async,
            m = h.callback,
            j = h.context;
            this.checkPassword();
            this.checkRePassword();
            this.validateCallback(l);
            $.isFunction(m) && m.call(j, this.disabled)
        },
        validateCallback: function(g) {
            if (g && this.tip.type.toLowerCase() == "error" && !this.tip.isHide()) {
                return this.disabled
            }
            this.check(g);
            this.checkRe(g); ! g && this.checkCallback(this.disabled);
            return this.disabled
        },
        check: function(g) {
			var ts = this;
            if (g && !this.input.val().length) { ! this.defaultOn && this.reset();
                return
            }
            switch (this.stat.code) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                this.tip.error(this.stat.msg);
                this.input.removeClass(this.errCls);
                $.later(function() {
                    this.input.addClass(this.errCls)
                },
                1, false, this);
                break;
            case 100:
				var ts = this;
				if (this.rsainput){
					require.async('modules/rsa/rsa', function(){
						var exponent = ts.rsaexponent.val(),
						module = ts.rsamodule.val();
						BigTools && BigTools.setMaxDigits(130);
						var RSAKey = new RSAKeyPair(exponent,"",module),vv = RSAKeyPair.encryptedString(RSAKey,ts.input.val());
						ts.rsainput.val(vv);
						ts.tip.ok();
						ts.input.removeClass(ts.errCls);
					});
				}else{
					this.tip.ok();
					this.input.removeClass(this.errCls);
				}
			
                this.tip.ok();
                this.input.removeClass(this.errCls);
                break;
            default:
                break
            }
        },
        checkRe: function(g) {
            if (this.reinput.prop("disabled")) {
                return
            }
            if (g && !this.reinput.val().length) { ! this.defaultOn && this.resetRe();
                return
            }
            switch (this.restat.code) {
            case 10:
            case 11:
                this.retip.error(this.restat.msg);
                this.reinput.removeClass(this.errCls);
                $.later(function() {
                    this.reinput.addClass(this.errCls)
                },
                1, false, this);
                break;
            case 99:
                this.retip.ok();
                this.reinput.removeClass(this.errCls);
            default:
                break
            }
        },
        checkPassword: function() {
            var g = this.password = PasswordCore(this.input.val());
            if (g.size() == 0) {
                this._disabled = true;
                this.stat = this.statusCode.empty
            } else {
                if (g.isIllegal()) {
                    this._disabled = true;
                    this.stat = this.statusCode.illegal
                } else {
                    if (g.isAllSame()) {
                        this._disabled = true;
                        this.stat = this.statusCode.same
                    } else {
                        if (g.isAllLetter()) {
                            this._disabled = true;
                            this.stat = this.statusCode.allLetter
                        } else {
                            if (g.isAllNumber()) {
                                this._disabled = true;
                                this.stat = this.statusCode.allNumber
                            } else {
                                if (g.size() < 6 && g.size() > 0 || g.size() > 16) {
                                    this._disabled = true;
                                    this.stat = this.statusCode.size
                                } else {
                                    this._disabled = false;
                                    this.stat = this.statusCode.ok;
                                    if (this.username) {
                                        var h = Similar($.trim(this.username.val()), this.input.val());
                                        if (h >= 0.8) {
                                            this._disabled = true;
                                            this.stat = this.statusCode.similar
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
            this.checkStrength();
            this.checkReDisabled();
            if (!this._disabled && this.reinput && !!this.reinput.val().length) {
                this.checkRePassword();
                this.checkRe()
            }
            return this
        },
        checkStrength: function() {
            if (!this.input || !this.strength) {
                return
            }
            var h = this.password,
            g = this.strengthCls,
            j = 1;
            var k = h.level();
            if (k >= 6) {
                this.strength.removeClass(g.weak).removeClass(g.medium).addClass(g.strong);
                j = 3
            } else {
                if (k > 2) {
                    this.strength.removeClass(g.weak).removeClass(g.strong).addClass(g.medium);
                    j = 2
                } else {
                    this.strength.removeClass(g.strong).removeClass(g.medium).addClass(g.weak);
                    j = 1
                }
            }
            if (!this._disabled && j <= 1) {
                this._disabled = true;
                this.stat = this.statusCode.weak
            }
            if (this.strengthInput) {
                this.strengthInput.val(j)
            }
            this.disabled = this._disabled || this._redisabled;
            return j
        },
        resetTip: function() {
            this.resetReTip();
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
            this.input && this.input.val("") && this.input.removeClass(this.errCls);
            this.resetTip();
            return this
        },
        checkRePassword: function() {
            if (this.reinput.prop("disabled")) {
                return
            }
            if (!this.reinput.val().length) {
                this._redisabled = true;
                this.restat = this.statusCode.reEmpty
            } else {
                if (this.input.val() === this.reinput.val()) {
                    this._redisabled = false;
                    this.restat = this.statusCode.reOk
                } else {
                    this._redisabled = true;
                    this.restat = this.statusCode.reError
                }
            }
            this.disabled = this._disabled || this._redisabled;
            return this
        },
        checkReDisabled: function(g) {
            this.reinput && this.reinput.prop("disabled", $.isBoolean(g) ? g: this._disabled);
            this._disabled && this.resetReTip()
        },
        resetReTip: function() {
            if (!this.retip) {
                return this
            }
            if (this._disabled) {
                this.retip.hide()
            } else {
                if (this.redefaultTip && this.redefaultTip.type && this.redefaultTip.msg) {
                    this.retip.change(this.redefaultTip.type, this.redefaultTip.msg)
                } else {
                    this.retip.hide()
                }
            }
            return this
        },
        resetRe: function() {
            this.reinput && this.reinput.val("") && this.reinput.removeClass(this.errCls);
            this.resetReTip()
        }
    });
	
	
	return Password;
})