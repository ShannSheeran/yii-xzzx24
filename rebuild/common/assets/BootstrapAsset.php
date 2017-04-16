<?php
namespace common\assets;

class BootstrapAsset extends \bases\lib\AssetBundle{
	public $css = [
		'@r.css.bootstrap',
                '@r.css.awesome',
//		'@r.css.sb.admin',
	];

	public $js = [
//		'@r.js.bootstrap',
		'@r.js.bootstrap.min',
//		'@r.jquery.bootstrap.teninedialog.v3',
	];

	public $depends = [
		'common\assets\JQueryAsset'
	];
}