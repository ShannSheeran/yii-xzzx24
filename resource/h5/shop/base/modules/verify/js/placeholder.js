define(function(require, exports, module){
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery');
	var md_placeholder = function(d) {
        this.input = d.input && $(d.input);
        this.placeholder = d.placeholder && $(d.placeholder);
        this.blurCls = d.blurCls || "ph_blur"
    };
    var md_fn_placeholder = function(d) {
        return new md_placeholder(d)
    };
    $.augment(md_placeholder, {
        init: function() {
            if (!this.input || !this.placeholder || this.input.val()) {
                return this
            }
            var d = this;
            this.placeholder.show();
            this.fix();
            this.placeholder.on("click",
            function() {
                d.input.trigger("focus")
            });
            this.input.on("change paste keyup",
            function() {
                if (d.input.val().length) {
                    d.placeholder.hide()
                } else {
                    d.placeholder.show();
                    d.fix();
                    d.placeholder.addClass(d.blurCls)
                }
            }).on("blur",
            function() {
                if (!d.input.val().length) {
                    d.placeholder.show();
                    d.fix();
                    d.placeholder.removeClass(d.blurCls)
                }
            }).on("focus",
            function() {
                if (d.input.val().length) {
                    d.placeholder.hide()
                } else {
                    d.placeholder.show();
                    d.fix();
                    d.placeholder.addClass(d.blurCls)
                }
            });
            $(window).on("resize",
            function() {
                d.fix()
            });
            return this
        },
        fix: function() {
			
            var d = this.input.position();
            this.placeholder.css({
                position: "absolute",
                left: d.left + 7
            }).css({
                top: d.top + Math.floor((this.input[0].clientHeight + 2 - this.placeholder[0].clientHeight) / 2)
            })
        }
    });
	return md_fn_placeholder;
})