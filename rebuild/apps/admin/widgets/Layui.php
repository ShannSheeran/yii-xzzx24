<?php
namespace admin\widgets;

use bases\helper\Category;
use common\model\SystemsMenu;
use Yii;
use yii\base\Widget;

class Layui extends Widget{
	public function run(){
		$aUser = [];
		$role = '';
		$mManager = Yii::$app->manager->getIdentity();
		if($mManager){
			$aUser = $mManager->toArray();
			$role = 'manager';
		}
		$aMenuConfig = SystemsMenu::findAll();
                $aMenuConfig = Category::unlimitedForLayer($aMenuConfig);
		return $this->render('layui', [
			'aUser' => $aUser,
			'role' => $role,
			'aMenuConfig' => $aMenuConfig,
		]);
	}
}