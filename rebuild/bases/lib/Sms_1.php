<?php

namespace bases\lib;
use common\model\Configuration;
use Yii;

/**
 * 发手机短信
 */
class Sms extends \yii\base\Component {

    public $venderId = 0;
    public $username;
    public $password;
    public $content;
    public $sendTo = null;

    public function send() {
        if (!$this->venderId) {
            return false;
        }
        if ($this->sendTo === null || !preg_match('/^1\d{10}$/', $this->sendTo)) {
            return false;
        }
        if ($this->content == '') {
            return false;
        }

        $mSetting = Configuration::findOne(['vender_id' => $this->venderId]);
        if (!$mSetting) {
            Yii::error('找不到商家配置信息');
            $mSetting = Configuration::findOne(['vender_id' => 1]);
        }
        if (!$mSetting->wj_uid || !$mSetting->wj_key) {
            $mSetting = Configuration::findOne(['vender_id' => 1]);
        }
        if (!$mSetting->wj_uid || !$mSetting->wj_key) {
            Yii::error('短信配置发生问题，请联系管理员');
            return false;
        }
        $this->username = $mSetting->wj_uid;
        $this->password = $mSetting->wj_key;
        $url = 'http://utf8.sms.webchinese.cn/?Uid=' . $this->username . '&Key=' . $this->password . '&smsMob=' . $this->sendTo . '&smsText=' . urlencode($this->content);
        //if (function_exists('file_get_contents')) {
        //	$returnStatus = file_get_contents($url);
        //} else {  //不使用file_get_contents时因为偶尔出现 failed to open stream: HTTP request failed! 错误
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $returnStatus = curl_exec($ch);
        curl_close($ch);
        //}
        if ($returnStatus > 0) {
            return true;
        }
        return false;
    }

}
