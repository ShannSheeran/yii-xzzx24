<?php
namespace api\controllers;

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
                //echo '请登录！！！';
		//$mUser = \common\model\User::findOne(2);
		//Yii::$app->user->login($mUser);
    }
}

