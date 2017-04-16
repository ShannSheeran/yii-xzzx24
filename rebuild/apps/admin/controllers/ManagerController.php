<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Response;
use bases\lib\Url;
use common\model\Manager;
use Yii;

class ManagerController extends ManagerBaseController {

    /**
     * 表示不用检查权限就能访问的action
     * @var array
     */
    public static $aAllow = ['index','logout','change-password'];
    
    
    /**
     * 表示除了超级管理员其他用户都不能访问的action aDeny 的优先级别高于allow的优先级别
     * @var array
    */
    public static $aDeny = [];
    
    
    public function actionIndex() {
        $this->layout = 'layui';
        return $this->render('index');
    }

    public function actionLogout() {
        $mManager = Yii::$app->manager->getIdentity();
        if ($mManager) {
            Yii::$app->manager->logout($mManager);
        }
        return new Response('退出成功',1,[],Url::to(['login/index']));
    }
    
    public function actionChangePassword() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $this->layout = 'layui';
            return $this->render('change_password');
        }
        $password = (string) $oRequest->post('password', '');
        $checkPassword = (string) $oRequest->post('password', '');
        if (!$password) {
            return new Response('密码不能为空');
        }
        if (!$checkPassword) {
            return new Response('确认密码不能为空');
        }
        if ($checkPassword != $password) {
            return new Response('两次密码不一致');
        }
        $mManager = Yii::$app->manager->getIdentity();
        $mManager->set('password', Manager::encryPassword($password));
        $mManager->set('update_time', NOW_TIME);
        if ($mManager->save()) {
            return new Response('修改成功', 1, [], Url::to(['manager/logout']));
        }
        return new Response('修改失败');

    }

    public function actionLogin(){
        echo 111;die;
    }
}
