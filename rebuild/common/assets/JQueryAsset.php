<?php
namespace common\assets;

/**
 * jQuery插件资源包
 */
class JQueryAsset extends \bases\lib\AssetBundle{
	public $js = [
		'@r.js.jquery',
	];

	public $jsOptions = [
		'position' => \yii\web\View::POS_HEAD,
	];
}