<?php
namespace api\lib;

use Yii;
use common\filter\UserAccessControl as Access;

/**
 * 主站基本控制器,主要封装了大量页面通用的登陆验证
 */
class Controller extends \yii\web\Controller{
	/**
	 * 返回一个登陆验证过滤器配置,要求是PLAYER级别的用户才能使用
	 * @see \common\filter\UserAccessControl
	 * @return type array
	 */
	public function behaviors(){
		return [
			'access' => [
				//登陆访问控制过滤
				'class' => Access::className(),
				'ruleConfig' => [
					'class' => 'yii\filters\AccessRule',
					'allow' => true,
				],
				'rules' => [
					[
						'roles' => [Access::PLAYER],
					],
				]
			],
		];
	}

	public function init(){
		if(!Yii::$app->client->isComputer && Yii::$app->id == 'home'){
			$remoteUrl = Yii::$app->urlManagerLogin->createUrl(['site/index']);
			$this->redirect($remoteUrl);
			Yii::$app->response->send();
		}
		parent::init();
	}
}