<?php
namespace home\controllers;

use bases\lib\Response;
use bases\lib\Url;
use Yii;
use yii\helpers\ArrayHelper;

class LoginController extends \yii\web\Controller{
	public function actions(){
		return [
			'error' => [
				'class' => 'bases\lib\ErrorAction',
			],
		];
	}

    public function actionIndex(){        
        $oApp = Yii::$app;
        $isRememberLogin = (bool)$oApp->request->post('rbl');
        $mUser = \common\model\User::findOne(1);
        if($oApp->user->login($mUser, $isRememberLogin ? 0 : 30)){
            $jumpUrl = Url::to(['site/index']);
            if($reference = $oApp->request->get('reference')){
                $jumpUrl = base64_decode(base64_decode($reference));
            }
            $oApp->response->redirect($jumpUrl);
        }
    }
}

