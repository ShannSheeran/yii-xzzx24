<?php
namespace admin\lib;

use Yii;
use common\filter\UserAccessControl as Access;

/**
 * 主站基本控制器,主要封装了大量页面通用的登陆验证
 */
class VenderController extends \yii\web\Controller{
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
						'roles' => [Access::VENDER],
					],
				]
			],
		];
	}
}