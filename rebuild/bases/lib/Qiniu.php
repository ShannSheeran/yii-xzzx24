<?php
namespace bases\lib;

use Yii;
use Qiniu\Auth as QiniuAuth;
use Qiniu\Storage\UploadManager;

class Qiniu extends \yii\base\Component {
	public $enable;
	public $accessKey;
	public $secretKey;
	public $bucket;
	public $privateDomain;
	
	public function init() {
		parent::init();
		require_once Yii::getAlias('@bases') . '/lib/Qiniu/autoload.php';
	}

	/**
	 * @param $filePath 上传文件的本地路径
	 * @doc http://developer.qiniu.com/code/v7/sdk/php.html#upload-callback
	 */
	public function uploadFile($filePath){
		$auth = new QiniuAuth($this->accessKey, $this->secretKey);
		$uptoken = $auth->uploadToken($this->bucket);
		$uploadMgr = new UploadManager();
		list($aReturn, $err) = $uploadMgr->putFile($uptoken, null, $filePath);
		if($err !== null){
			return false;
		}else{
			return $aReturn['key'];
		}
	}
	
	/**
	 * @param $fileKey 上传文件的返回的key
	 */
	public function downloadFile($fileKey, $savePath){
		$auth = new QiniuAuth($accessKey, $secretKey);
		//baseUrl构造成私有空间的域名/key的形式
		$baseUrl = 'http://' . $this->privateDomain . '/' . $fileKey;
		$authUrl = $auth->privateDownloadUrl($baseUrl);
		file_put_contents($savePath, file_get_contents($authUrl));
	}
	
	public function getUploadToken(){
		$auth = new QiniuAuth($this->accessKey, $this->secretKey);
		return $auth->uploadToken($this->bucket);
	}
}
