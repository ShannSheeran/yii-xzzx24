<?php
namespace admin\assets;

/**
 * uploader资源包
 */
class UploadAsset extends \bases\lib\AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public $css = [
            '@r.css.uploader.webuploader',
            '@r.css.uploader.uploader',
    ];

    public $js = [
            '@r.js.uploader.webuploader',
            '@r.js.uploader.upload',
                
    ];

	public $depends = [
		'common\assets\JQueryAsset',
	];
}
