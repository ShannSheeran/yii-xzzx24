<?php
namespace common\lib;

class IResponse extends \yii\web\Response{

	public function __construct($message = '', $status = 0, $xData = '') {
		parent::__construct();
		$aData = [
			'msg' => $message,
			'status' => $status,
			'data' => $xData,
		];
		$this->format = self::FORMAT_JSON;
		$this->data = $aData;
	}

}