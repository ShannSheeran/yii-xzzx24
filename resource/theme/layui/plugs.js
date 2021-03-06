/* global layer, Pace */

define(['zeroclipboard', 'jquery', 'layui'], function (ZeroClipboard) {

    /*!
     * jQuery placeholder, fix for IE6,7,8,9
     */
    var JPlaceHolder = {
        _check: function () {
            return 'placeholder' in document.createElement('input');
        },
        init: function () {
            !this._check() && this.fix();
        },
        fix: function () {
            $(':input[placeholder]').map(function () {
                var self = $(this), txt = self.attr('placeholder');
                self.wrap($('<div></div>').css({position: 'relative', zoom: '1', border: 'none', background: 'none', padding: 'none', margin: 'none'}));
                var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                var holder = $('<span></span>').text(txt).css({position: 'absolute', left: pos.left, top: pos.top, height: h, lineHeight: h + 'px', paddingLeft: paddingleft, color: '#aaa'}).appendTo(self.parent());
                self.on('focusin focusout change keyup', function () {
                    self.val() ? holder.hide() : holder.show();
                });
                holder.click(function () {
                    self.get(0).focus();
                });
                self.val() && holder.hide();
            });
        }
    };
    JPlaceHolder.init();


    /**
     * 定义消息处理构造方法
     * @returns {common_L11._msg}
     */
    function msg() {
        this.version = '2.0';
        this.shade = [0.02, '#000'];
    }

    /**
     * 关闭消息框
     */
    msg.prototype.close = function () {
        return layer.close(this.index);
    };

    /**
     * 弹出警告消息框
     * @param {type} msg
     * @param {type} callback
     * @returns {undefined}
     */
    msg.prototype.alert = function (msg, callback) {
        this.close();
        return this.index = layer.alert(msg, {end: callback, scrollbar: false});
    };

    /**
     * 确认对话框
     * @param {type} msg 提示消息内容
     * @param {type} ok 确认的回调函数
     * @param {type} no 取消的回调函数
     * @returns {undefined}
     */
    msg.prototype.confirm = function (msg, ok, no) {
        this.close();
        return this.index = layer.confirm(msg, {btn: ['确认', '取消']}, ok, no);
    };

    /**
     * 显示成功类型的消息
     * @param {type} msg 消息内容
     * @param {type} time  延迟关闭时间
     * @param {type} callback 回调函数
     */
    msg.prototype.success = function (msg, time, callback) {
        this.close();
        return this.index = layer.msg(msg, {icon: 1, shade: this.shade, scrollbar: false, end: callback, time: (time || 2) * 1000, shadeClose: true});
    };

    /**
     * 显示失败类型的消息
     * @param {type} msg 消息内容
     * @param {type} time 延迟关闭时间
     * @param {type} callback 回调函数
     */
    msg.prototype.error = function (msg, time, callback) {
        this.close();
        return this.index = layer.msg(msg, {icon: 2, shade: this.shade, scrollbar: false, time: (time || 3) * 1000, end: callback, shadeClose: true});
    };

    /**
     * 状态消息提示
     * @param {type} msg
     * @param {type} time
     * @param {type} callback
     * @returns {unresolved}
     */
    msg.prototype.tips = function (msg, time, callback) {
        this.close();
        return layer.msg(msg, {time: (time || 3) * 1000, shade: this.shade, end: callback, shadeClose: true});
    };

    /**
     * 显示正在加载中的提示
     * @param {type} msg 提示内容
     * @param {type} callback 回调方法
     */
    msg.prototype.loading = function (msg, callback) {
        this.close();
        return this.index = msg
                ? layer.msg(msg, {icon: 16, scrollbar: false, shade: this.shade, time: 0, end: callback})
                : layer.load(2, {time: 0, scrollbar: false, shade: this.shade, end: callback});
    };

    /**
     * 自动处理显示Think返回的Json数据
     * @param {type} data JSON数据对象
     * @param {type} time 延迟关闭时间
     */
    msg.prototype.auto = function (data, time) {
        var self = this;
        if (data.code === 'SUCCESS') {
            self.success(data.info, time, function () {
                if (data.referer === 'back') {
                    window.history.back();
                } else if (data.referer === 'reload') {
                    $.form.reload();
                } else if (data.referer) {
                    window.location.href = data.referer;
                } else {
                    $.form.reload();
                }
            });
        } else {
            self.error(data.info, 3, function () {
                if (data.referer) {
                    window.location.href = data.referer;
                }
            });
        }
    };
	
	
	    /**
     * 自动处理显示Think返回的Json数据
     * @param {type} data JSON数据对象
     * @param {type} time 延迟关闭时间
     */
    msg.prototype.auto = function (data, time) {
        var self = this;
        if (data.status == 1) {
            self.success(data.msg, time, function () {
                if (data.referer === 'back') {
                    window.history.back();
                } else if (data.referer === 'reload') {
                    $.form.reload();
                } else if (data.referer) {
                    window.location.href = data.referer;
                } else {
                    $.form.reload();
                }
            });
        } else {
            self.error(data.msg, 3, function () {
                if (data.referer) {
                    window.location.href = data.referer;
                }
            });
        }
    };

    /**
     * 将消息对象挂载到Jq
     */
    $.msg = new msg();


    /**
     * 表单构造函数
     * @returns {common_L11._form}
     */
    function _form() {
        this.version = '2.0';
        this._model = null;
        this.errMsg = '{status}服务器繁忙，请稍候再试！';
    }

    /**
     * 异步加载的数据
     * @param {type} url 请求的地址
     * @param {json|form|$form} data 额外请求数据
     * @param {type} type 提交的类型 GET|POST
     * @param {type} callback 成功后的回调方法
     * @param {type} loading 是否显示加载层
     * @param {type} tips 提示消息
     * @param {type} time 消息提示时间
     */
    _form.prototype.load = function (url, data, type, callback, loading, tips, time) {
        var self = this;
        if (loading !== false) {
            var index = $.msg.loading(tips);
        }
        var send_data = data;
        if (typeof data === 'object' && data.tagName === 'FORM') {
            send_data = $(data).serialize();
        }
        try {
            Pace && Pace.restart();
        } catch (e) {
        }
        require(['listen'], function () {            
            ajax({
                type: type || 'GET',
                url: parseUri(url),
                data: send_data || {},
                statusCode: {
                    404: function () {
                        $.msg.tips(self.errMsg.replace('{status}', 'E404 - '));
                    },
                    500: function () {
                        $.msg.tips(self.errMsg.replace('{status}', 'E500 - '));
                    },
                    403:function(){
                        $.msg.tips('你没有该操作操作权限');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.msg.tips(self.errMsg.replace('{status}', 'E' + textStatus + ' - '));
                },
                success: function (res) {
                    if (loading !== false) {
                        $.msg.close(index);
                    }
                    if (typeof callback === 'function' && callback.call(self, res) === false) {
                        return false;
                    }
                    if (typeof (res) === 'object') {
                        return $.msg.auto(res, time);
                    }
                    if (res.indexOf('A PHP Error was encountered') !== -1) {
                        return $.msg.tips(self.errMsg.replace('{status}', 'E505 - '));
                    }
					
                    self.show(res);
                }
            });
        });
    };
    /**
     * 动态HTML事件重载
     * @param {type} $container
     * @returns {undefined}
     */
    _form.prototype.reInit = function ($container) {
        $.validate.listen.call(this);
        $('[data-copy]').map(function () {
            var client = new ZeroClipboard(this);
            client.on("ready", function () {
                client.on("copy", function (event) {
                    event.clipboardData.setData("text/plain", event.target.getAttribute('data-copy'));
                });
                client.on("aftercopy", function () {
                    $.msg.tips('内容复制成功！');
                });
            });
        });
        JPlaceHolder.init();
        /* 自动给必填字符加上样式 @zoujingli @by 2016-05-11 */
        $container.find('[required]').parent().prevAll('label').addClass('label-required');
    };
    /**
     * 加载HTML到目标位置
     * @param {type} url
     * @param {type} data
     * @param {type} target
     * @param {type} callback
     * @param {type} loading
     * @param {type} tips
     * @returns {undefined}
     */
    _form.prototype.open = function (url, data, target, callback, loading, tips) {        
        data && (typeof (data) === 'object') && (data = $.param(data));
        data && (url += (url.indexOf('?') === -1 ? '?' : '&') + data);
        this.load(url, data, 'GET', function (res) {
            if (typeof (res) === 'object') {
                return $.msg.auto(res);
            }
            var $container = $('.layer-main-container').html(res);
            function reinit() {
                /* 事件重载 */
                $.form.reInit($container);
            }
            reinit.call(this), setTimeout(reinit, 500), setTimeout(reinit, 1000);
            return (typeof callback === 'function') && callback.call(this);
        }, loading, tips);
    };

    /**
     * 加载HTML到弹出层
     * @param {type} url
     * @param {type} data
     * @param {type} callback
     * @param {type} loading
     * @param {type} tips
     * @returns {undefined}
     */
    _form.prototype.modal = function (url, data, callback, loading, tips) {
        data && (typeof (data) === 'object') && (data = $.param(data));
        data && (url += (url.indexOf('?') === -1 ? '?' : '&') + data);
        this.load(url, data, 'GET', function (res) {
            if (typeof (res) === 'object') {
                return $.msg.auto(res);
            }
            layer.open({
                area: "800px",
                content: res,
                btn: false,
                success: function (dom, index) {
                    var $container = $(dom);
                    /* 处理样式及返回按钮事件 */
                    $container.find('.wrapper').css('minWidth', '760px').find('[data-back]').off('click').on('click', function () {
                        layer.close(index);
                    });
                    /* 处理标题 */
                    $container.find('.layui-layer-title').html($container.find('.ibox-title').hide().find('h5').html());
                    /* 事件重载 */
                    $.form.reInit($container);
                }
            });
            return (typeof callback === 'function') && callback.call(this);
        }, loading, tips);
    };

    /**
     * 显示HTML到中主内容区
     * @param {type} html
     * @returns {undefined}
     */
    _form.prototype.show = function (html) {
        var $container = $('.layer-main-container').html(html);
        function reinit() {
            $.validate.listen.call(this);
            $container.find('h3').addClass('animated fadeIn container-animated');
        }
        reinit.call(this), setTimeout(reinit, 500), setTimeout(reinit, 1000);
    };

    /**
     * 打开一个iframe窗口
     * @param {type} url
     * @returns {unresolved}
     */
    _form.prototype.iframe = function (url, title) {
        return layer.open({title: title || '窗口', type: 2, area: ['800px', '530px'], fix: true, maxmin: false, content: url});
    };

    /**
     * 关闭FORM框
     * @returns {undefined}
     */
    _form.prototype.close = function () {
        return $(this._modal).modal('hide');
    };

    /*刷新当前页面*/
    _form.prototype.reload = function () {
        window.onhashchange.call(this);
    };

    /*!表单实例挂载*/
    $.form = new _form();

    /**
     * 定义模块函数
     * @returns {validate_L1.validate}
     */
    var validate = function () {
        // 模式检测
        this.isSupport = ($('<input type="email">').attr("type") === "email");
        // 表单元素
        this.inputTag = 'input,textarea,select';
        // 检测元素事件
        this.checkEvent = {change: true, blur: true, keyup: false};
    };

    /**
     *获取表单元素的类型
     */
    validate.prototype.getElementType = function (ele) {
        return (ele.getAttribute("type") + "").replace(/\W+$/, "").toLowerCase();
    };

    /**
     *去除字符串两头的空格
     */
    validate.prototype.trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };


    /**
     * 标签元素是否可见
     * @returns {Boolean}
     */
    validate.prototype.isVisible = function (ele) {
        return $(ele).is(':visible');
    };

    /**
     * 检测属性是否有定义
     * @param {type} ele
     * @param {type} prop
     * @param {type} undefined
     * @returns {Boolean}
     */
    validate.prototype.hasProp = function (ele, prop, undefined) {
        if (typeof prop !== "string") {
            return false;
        }
        var attrProp = ele.getAttribute(prop);
        return (attrProp !== undefined && attrProp !== null && attrProp !== false)
    };

    /**
     * 设置文件选择范围
     * @param {type} ele
     * @param {type} start
     * @param {type} end
     * @returns {validate_L1.validate.prototype}
     */
    validate.prototype.selectRange = function (ele, start, end) {
        if (ele.createTextRange) {
            var range = ele.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            //ele.focus();
            ele.setSelectionRange(start, end);
        }
        return this;
    };

    /**
     * 判断表单元素是否为空
     * @param {type} ele
     * @param {type} value
     * @returns {Boolean}
     */
    validate.prototype.isEmpty = function (ele, value) {
        value = value || ele.getAttribute('placeholder');
        var trimValue = ele.value;
        trimValue = this.trim(trimValue);
        if (trimValue === "" || trimValue === value) {
            return true;
        }
        return false;
    };

    /**
     * 正则验证表单元素
     * @param {type} ele
     * @param {type} regex
     * @param {type} params
     * @returns {Boolean}
     */
    validate.prototype.isRegex = function (ele, regex, params) {
        var self = this;
        // 原始值和处理值
        var inputValue = ele.value;
        var dealValue = inputValue;
        var type = this.getElementType(ele);

        if (type !== "password") {
            // 密码不trim前后空格
            dealValue = this.trim(inputValue);
            if (dealValue !== inputValue) {
                if (ele.tagName.toLowerCase() !== "textarea") {
                    ele.value = dealValue;
                } else {
                    ele.innerHTML = dealValue;
                }
            }
        }
        // 获取正则表达式，pattern属性获取优先，然后通过type类型匹配。注意，不处理为空的情况
        regex = regex || ele.getAttribute('pattern');
        if (dealValue === "" || !regex) {
            return true;
        }
        // multiple多数据的处理
        var isMultiple = this.hasProp(ele, 'multiple'), newRegExp = new RegExp(regex, params || 'i');
        // number类型下multiple是无效的
        if (isMultiple && !/^number|range$/i.test(type)) {
            var isAllPass = true;
            var dealValues = dealValue.split(",");
            for (var i in dealValues) {
                var partValue = self.trim(dealValues[i]);
                if (isAllPass && !newRegExp.test(partValue)) {
                    isAllPass = false;
                }
            }
            return isAllPass;
        } else {
            return newRegExp.test(dealValue);
        }
        return true;
    };

    /**
     * 检侧所的表单元素
     */
    validate.prototype.isAllpass = function (elements, options) {
        if (!elements) {
            return true;
        }
        var params = options || {};
        var allpass = true;
        var self = this;
        if (elements.size && elements.size() === 1 && elements.get(0).tagName.toLowerCase() === "form") {
            elements = $(elements).find(self.inputTag);
        } else if (elements.tagName && elements.tagName.toLowerCase() === "form") {
            elements = $(elements).find(self.inputTag);
        }
        elements.each(function () {
            if (self.checkInput(this, params) === false) {
                $(this).focus();
                allpass = false;
                return false;
            }
        });
        return allpass;
    };

    /**
     * 验证标志
     */
    validate.prototype.remind = function (input, type, tag) {
        var text = this.getInvalidErrMsg(input) || '';
        // 如果元素完全显示
        if (this.isVisible(input)) {
            if (type === "radio" || type === "checkbox") {
                this.errorPlacement(input, this.getErrMsg(input));
            } else if (tag === "select" || tag === "empty") {
                // 下拉值为空或文本框文本域等为空
                this.errorPlacement(input, (tag === "empty" && text) ? "您尚未输入" + text : this.getErrMsg(input));
            } else if (/^range|number$/i.test(type) && Number(input.value)) {
                // 整数值与数值的特殊提示
                this.errorPlacement(input, "值无效");
            } else {
                // 文本框文本域格式不准确
                var finalText = this.getErrMsg(input);
                if (text) {
                    finalText = "您输入的" + text + "格式不准确";
                }
                this.errorPlacement(input, finalText);
            }
        }
        return false;
    };

    /**
     * 检测表单单元
     */
    validate.prototype.checkInput = function (input, options) {		
        var type = this.getElementType(input);
        var tag = input.tagName.toLowerCase();
        var isRequired = this.hasProp(input, "required");
        var isNone = this.hasProp(input, 'data-auto-none');
		
        //无需要验证
        if (isNone || input.disabled || type === 'submit' || type === 'reset' || type === 'file' || type === 'image' || !this.isVisible(input)) {
            return;
        }
        var allpass = true;
        // 需要验证的有
        if (type === "radio" && isRequired) {
            var eleRadios = input.name ? $("input[type='radio'][name='" + input.name + "']") : $(input);
            var radiopass = false;
            eleRadios.each(function () {
                if (radiopass === false && $(this).is("[checked]")) {
                    radiopass = true;
                }
            });
            if (radiopass === false) {
                allpass = this.remind(eleRadios.get(0), type, tag);
            } else {
                this.successPlacement(input);
            }
        } else if (type === "checkbox" && isRequired && !$(input).is("[checked]")) {
            allpass = this.remind(input, type, tag);
        } else if (tag === "select" && isRequired && !input.value) {
            allpass = this.remind(input, type, tag);
        } else if ((isRequired && this.isEmpty(input)) || !(allpass = this.isRegex(input))) {
            allpass ? this.remind(input, type, "empty") : this.remind(input, type, tag);
            allpass = false;
        } else {
            this.successPlacement(input);
        }
        return allpass;
    };

    /**
     *获取错误提示的内容
     */
    validate.prototype.getErrMsg = function (ele) {
        return ele.getAttribute('title') || '';
    };
    
    /**
     *获取错误提示的内容
     */
    validate.prototype.getInvalidErrMsg = function (ele) {
        return ele.getAttribute('invalid_msg') || '';
    };

    /**
     * 错误消息显示
     * @param {type} ele
     * @param {type} content
     * @param {type} options
     * @returns {undefined}
     */
    validate.prototype.errorPlacement = function (ele, content) {
        $(ele).addClass('validate-error');
        this.insertErrorEle(ele);
        $($(ele).data('input-info')).addClass('fadeInRight animated').css({width: 'auto'}).html(content);
    };

    /**
     * 错误消息消除
     */
    validate.prototype.successPlacement = function (ele) {
        $(ele).removeClass('validate-error');
        this.insertErrorEle(ele);
        $($(ele).data('input-info')).removeClass('fadeInRight').css({width: '30px'}).html('');
    };

    /**
     * 错误消息标签插入
     * @param {type} ele
     * @returns {undefined}
     */
    validate.prototype.insertErrorEle = function (ele) {
        var $html = $('<span style="-webkit-animation-duration:.2s;animation-duration:.2s;padding-right:20px;color:#a94442;position:absolute;right:0;font-size:12px;z-index:2;display:block;width:34px;text-align:center;pointer-events:none"></span>');
        $html.css({top: $(ele).position().top + 'px', paddingTop: $(ele).css('paddingTop'), paddingBottom: $(ele).css('paddingBottom'), lineHeight: $(ele).css('lineHeight')});
        $(ele).data('input-info') || $(ele).data('input-info', $html.insertAfter(ele));
    };

    /**
     * 表单验证入口
     * @param {type} callback
     * @param {type} options
     * @returns {$|Function|Zepto}
     */
    validate.prototype.check = function (form, callback, options) {
        var self = this;
        var defaults = {
            // 取消浏览器默认的HTML验证
            novalidate: true,
            // 禁用submit按钮可用
            submitEnabled: true,
            // 额外的其他验证
            validate: function () {
                return true;
            }
        };
        var params = $.extend({}, defaults, options || {});
        if (this.isSupport) {
            if (params.novalidate) {
                $(form).attr("novalidate", "novalidate");
            } else {
                params.hasTypeNormally = true;
            }
        }

        // disabled的submit按钮还原
        if (params.submitEnabled) {
            $(form).find("[disabled]").each(function () {
                if (/^image|submit$/.test(this.type)) {
                    $(this).removeAttr("disabled");
                }
            });
        }
		
        //元素动态监听
        $(form).find(self.inputTag).map(function () {
            var func = function () {
                self.checkInput(this);
            };
            for (var i in self.checkEvent) {
                if (self.checkEvent[i] === true) {
                    $(this).off(i, func).on(i, func);
                }
            }
        });

        $(form).bind("submit", function (event) {
            var elements = $(this).find(self.inputTag);
            if (self.isAllpass(elements, params) && params.validate() && $.isFunction(callback)) {
                var sdata = {};
                var data = $(form).serializeArray();
                for (var i in data) {
                    var key = data[i].name, value = data[i].value;
                    if (sdata.hasOwnProperty(key)) {
                        if (typeof sdata[key] === 'object') {
                            sdata[key].push(value);
                        } else {
                            sdata[key] = [sdata[key], value];
                        }
                    } else {
                        sdata[key] = value;
                    }
                }
				
                callback.call(this, sdata);
            }
            event.preventDefault();
            return false;
        });
        return $(form).data('validate', this);
    };

    /**
     * 注册对象到Jq
     * @param {type} form
     * @param {type} callback
     * @param {type} options
     * @returns {undefined}
     */
    $.validate = function (form, callback, options) {
        return (new validate()).check(form, callback, options);
    };

    /**
     * 注册对象到JqFn
     * @param {type} callback
     * @param {type} options
     * @returns {jquery.validate_L1.$|Function|Zepto|$}
     */

    $.fn.validate = function (callback, options) {
        return (new validate()).check(this, callback, options);
    };

    $.validate.listen = function () {
        $('form[data-auto]').map(function () {
			
            if ($(this).attr('data-listen') === 'true') {
                return;
            }
			
            var callback = $(this).attr('data-callback');
            $(this).attr('data-listen', "true").validate(function (data) {
                $.form.load(this.getAttribute('action') || window.location.href, data,
                        this.getAttribute('method') || 'POST',
                        window[callback || '_default_callback'] || undefined, true,
                        this.getAttribute('data-tips') || undefined,
                        this.getAttribute('data-time') || undefined);
            });
        });
    };
    if ($.form && typeof $.form.load === 'function') {
        $.validate.listen.call(this);
    }

    return $;
});