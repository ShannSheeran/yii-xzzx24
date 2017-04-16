<?php
namespace admin\assets;

/**
 * layui资源包
 */
class LayuiAsset extends \bases\lib\AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public $css = [
        '@r.css.bootstrap',
        '@r.css.awesome',
        '@r.css.layui.animate',
        '@r.css.layui.console',
        
    ];
    public $js = [
            '///cdn.bootcss.com/require.js/2.2.0/require.min.js',
            '@r.js.layui.app',
                
    ];

	public $depends = [
		'common\assets\JQueryAsset',
	];
}
