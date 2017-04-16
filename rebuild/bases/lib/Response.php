<?php
namespace bases\lib;

use Yii;

class Response extends \yii\web\Response{
	public function __construct($message = '', $status = 0, $xData = '',$jumbUrl = '') {
		parent::__construct();
		$aData = [
			'msg' => $message,
			'status' => $status,
			'notice' => Yii::$app->notifytion->aData,
			'data' => $xData,
			'token' => Yii::$app->request->csrfToken,
                        'referer' => $jumbUrl,
		];

		$oRequest = Yii::$app->request;
		$isAjax = $oRequest->isAjax || $oRequest->post('_is_ajax') || $oRequest->get('_is_ajax') || (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'POST');
		$isJsonp = $oRequest->get('callback',0);
                if(!Yii::$app->ui->isRequestByPageManager && $isAjax && !$isJsonp){
                    $this->format = self::FORMAT_JSON;
		}elseif ($isJsonp) {
                    $this->format = self::FORMAT_JSONP;
                    $aData['data'] = $aData;
                    $aData['callback'] = $isJsonp;
                }else{
			$this->format = self::FORMAT_HTML;
			$aData = Yii::$app->view->renderFile('@p.system_view/response.php', [
				'msg' => $message,
				'status' => $status,
				'xData' => $xData,
			]);
		}

		$this->data = $aData;
	}
}