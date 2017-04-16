<?php
namespace common\assets;

class StandAlonePageAsset extends \bases\lib\AssetBundle{
	public $js = [
		'@r.js.core',
		'@r.js.stand-alone-page',
	];

    public $depends = [
		'common\assets\JQueryAsset',
    ];

	public $jsOptions = [
		'position' => \yii\web\View::POS_HEAD,
	];
}