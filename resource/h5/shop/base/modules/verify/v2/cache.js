define(function(require, exports, module){	
	var $ = window.$ || window.jQuery || window.Zepto || require('jQuery');
	var md_Cache = function(c) {
        if (! (this instanceof md_Cache)) {
            return new md_Cache(c)
        }
        this._cache = []
    };
    $.augment(md_Cache, {
        init: function() {
            return this
        },
        set: function(d, c) {
            if ($.isString(c)) {
                this.del(c, d[c])
            }
            this._cache.push(d);
            return this
        },
        getIndex: function(d, e) {
            var c = 0;
            while (this._cache[c] && this._cache[c][d] !== e) {
                c++
            }
            return c >= this._cache.length ? -1 : c
        },
        get: function(e, f) {
            var d = this.getIndex(e, f);
            var c = d >= 0 ? this._cache[d] : null;
            return c
        },
        del: function(d, e) {
            var c = this.getIndex(d, e);
            if (c >= 0) {
                this._cache.splice(c, 1)
            }
        }
    });
	return md_Cache;
})