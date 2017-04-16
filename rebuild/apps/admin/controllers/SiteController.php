<?php
namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Url;

/**
 * 站点控制器
 */
class SiteController extends ManagerBaseController{

    public function actionIndex(){
        return $this->render('index');
    }

    public function actionShowHome(){
        echo Url::to(['site/show-home']);
    }

}
