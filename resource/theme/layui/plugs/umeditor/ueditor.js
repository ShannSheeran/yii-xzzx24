define(['jquery',App.url.resource +'/static/plugin/umeditor/umeditor.min.js'], function () {
	
    /**
     * 全局编辑器生成器
     * @param {type} selector
     * @param {type} type
     * @returns {unresolved}
     */
    window.createEditor = function (selector,oConfig, type) {
        type = type || 'basic';
		oConfig = oConfig || {};
        var id = '_ueditor_id_' + Math.floor(Math.random() * 100000000), config = new Object();
        switch (type || 'basic') {
            case 'basic':
                config = {
                    zIndex: 9000,
                    topOffset: 50,
                    wordCount: false,
                    maxInputCount: 0,
                    minFrameHeight: 250,
                    enableAutoSave: false,
                    autoFloatEnabled: true,
                    autoHeightEnabled: true,
                    initialFrameWidth: null,
                    initialFrameHeight: 500,
                    elementPathEnabled: false,
                    catchRemoteImageEnable: false,
                    toolbars: [[
                            'source', //源代码
                            'undo', //撤销
                            'redo', //重做
                            'fontfamily', //字体
                            'fontsize', //字号
                            'paragraph', //段落格式
                            'bold', //加粗
                            'italic', //斜体
                            'underline', //下划线
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            'indent', //首行缩进
                            'justifyleft', //居左对齐
                            'justifyright', //居右对齐
                            'justifycenter', //居中对齐
                            'justifyjustify', //两端对齐
                            'formatmatch', //格式刷
                            'autotypeset', //自动排版
                            'uimage', //单图上传
                            'umimage', //单图上传
                            'removeformat', //清除格式
                            'link', //超链接
                            'unlink', //取消链接
                            'emotion', //表情
                            'map', //Baidu地图
                            'imagenone', //默认
                            'imageleft', //左浮动
                            'imageright', //右浮动
                            'imagecenter', //居中
                            'lineheight', //行间距
                            'scrawl', //涂鸦
                            'inserttable' //插入表格
                        ]]
                };
                break;
        }
        $('.animated').removeClass('animated');
		var config = $.extend(config,oConfig);
        return $(selector).attr('id', id), UM.getEditor(id, config);
    };
});
