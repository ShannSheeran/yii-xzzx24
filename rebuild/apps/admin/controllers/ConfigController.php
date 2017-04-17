<?php
namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Response;
use common\model\Configuration;
use common\model\WechatConfig;
use Yii;

/**
 * 公用颜色选择器
 */
class ConfigController extends ManagerBaseController {

    
    public function actionSite() {
        return $this->render('site');
    }

    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionApp() {
        return $this->render('app');
    }

    public function actionFile() {
        return $this->render('file');
    }

    public function actionMail() {
        return $this->render('mail');
    }

    public function actionSms() {
        return $this->render('sms');
    }
    
    //微信配置
    public function actionWechatPay() {
        $mWechat = $this->_getWechatConfig();
        if (!$mWechat) {
            return new Response('配置出问题请联系开发任意');
        }
        return $this->render('wx_pay', ['mWechat' => $mWechat]);
    }
    public function actionWechatConfig() {
        $mWechat = $this->_getWechatConfig();
        if (!$mWechat) {
            return new Response('配置出问题请联系开发任意');
        }
        return $this->render('wx_config', ['mWechat' => $mWechat]);
    }

    private function _getWechatConfig(){
        return WechatConfig::findOne(10000);
    }

    public function actionWechatSave() {
        $mWechat = $this->_getWechatConfig();
        if (!$mWechat) {
            return new Response('配置出问题请联系开发任意');
        }
        $aData = Yii::$app->request->post();
        foreach ($aData as $key => $val) {
            $mWechat->hasProperty($key) && $mWechat->set($key, $val);
        }
        if ($mWechat->save()) {
            return new Response('操作成功', 1);
        }
        return new Response('数据没发生变化');
    }

    public function actionSave() {
        $aData = Yii::$app->request->post();
        $result = 0;
        unset($aData['csrf']);
        foreach ($aData as $k => $value) {
            if (Configuration::saveByCode($k, $value)) {
                $result = 1;
            }
        }
        if ($result) {
            return new Response('操作成功', 1);
        }
        return new Response('数据没发生变化');
    }

}