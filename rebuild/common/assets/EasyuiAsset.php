<?php
namespace common\assets;

/**
 * jQuery插件资源包
 */
class EasyuiAsset extends \bases\lib\AssetBundle{
	public $js = [
            '@r.js.easyui',
            '@r.js.easyui_common',
            '@r.js.easyui_lang',
            '@r.js.minicolors',
            '@r.js.easyui_detailview',
	];
        public $css = [
            '@r.css.easyui.theme.bootstrap.easyui',
            '@r.css.easyui.icon',
            '@r.css.admin_common',
            '@r.css.minicolors',
	];

	public $jsOptions = [
            'position' => \yii\web\View::POS_END,
	];
        public $depends = [
            'common\assets\JQueryAsset',
            'common\assets\UBoxAsset',
	];
}