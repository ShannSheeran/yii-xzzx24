<?php

namespace admin\controllers;

use bases\lib\Response;
use bases\lib\Url;
use common\model\Manager;
use Yii;
use yii\captcha\CaptchaValidator;
use yii\web\Controller;

class LoginController extends Controller {

    public function actions() {
        return [
            'error' => [
                'class' => 'bases\lib\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'height' => 50,
                'width' => 80,
                'minLength' => 4,
                'maxLength' => 4
            ],
        ];
    }

    public function actionIndex() {
        $this->layout = 'layui';
        return $this->render('manager');
    }

    public function actionManagerLogin() {

        $account = (string) Yii::$app->request->post('account');
        $password = (string) Yii::$app->request->post('password');
        $code = (string) Yii::$app->request->post('code');

        if (!$account) {
            return new Response('请填写账号', -1);
        }
        if (!$password) {
            return new Response('请填写密码', -1);
        }
        /*if (!$code) {
            return new Response('请填写验证码', -1);
        }
        $caprcha = new CaptchaValidator();
        $caprcha->captchaAction = 'login/captcha';
        if(!$caprcha->validate($code)){
            return new Response('验证码错误', -1);
        }*/
        $mManager = Manager::getManagerByAccountAndPassword($account, $password);

        if (!$mManager) {
            return new Response('账号或密码不正确', -1);
        }
        if (!Yii::$app->manager->login($mManager)) {
            return new Response('登录失败', 0);
        }

        return new Response('登录成功', 3, [],  Url::to(['manager/index']));
    }

}
