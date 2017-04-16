<?php
namespace bases\lib;

use Yii;
use bases\lib\ServerErrorHttpException;
use bases\lib\BaseErrorException;

class ErrorAction extends \yii\web\ErrorAction{
	public function run(){
		//$this->id = 'error_mobile'; 通过设置此属性可以配合客户端不同来设置不同的错误模板
        if (($oException = Yii::$app->getErrorHandler()->exception) === null) {
			return '发生未知错误,请联系站点管理员!';
        }
        $message = $oException->getMessage();
		$isSendToUser = false;
		if(!YII_ENV_PROD){
			$isSendToUser = true;
		}elseif(
			($oException instanceof ServerErrorHttpException
			|| $oException instanceof BaseErrorException)
			&& $oException->isSendToUser
		){
			$isSendToUser = true;
		}

        if (Yii::$app->getRequest()->getIsAjax()){
			if($isSendToUser){
				return $message;
			}else{
				//!!!!!以下$aMarkData处理为临时代码,BUG解决后可去除
				$aMarkData = Yii::$app->notifytion->get(\home\modules\bbs\controllers\ThreadController::MARK_UPLOAD_DEBUG);
				if($aMarkData){
					$oException = Yii::$app->buildError('监测到BBS上传文件出错', false, $aMarkData);
					Yii::error((string)$oException);
				}
				return Yii::$app->ui->getTips('error.common');
			}

        } else {
			/*$this->controller->id = 'error';
			$errorView = '404';
			if($oException instanceof ServerErrorHttpException){
				$errorView = '500';
			}*/

            return Yii::$app->view->renderFile('@p.system_view/error.php', [
                'message' => $message,
                'isSendToUser' => $isSendToUser,
                'oException' => $oException,
            ]);
        }
	}
}