<?php
namespace common\assets;

/**
 * layer插件资源包
 */
class LayerAsset extends \bases\lib\AssetBundle
{

    public $css = [
         '@r.css.layer',
         '@r.css.layer.page',
    ];

    public $js = [
        '@r.js.layer',
        '@r.js.layer.page',
    ];

	public $depends = [
		'common\assets\JQueryAsset'
	];
}
