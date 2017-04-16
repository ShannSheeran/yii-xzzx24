<?php

namespace bases\lib;

use yii\base\Component;

/**
 * 发手机短信
 */
class Sms extends Component {

    public $username;
    public $password;

    public function send($mobile,$msg = null) {
        //http://106.ihuyi.cn/webservice/sms.php?method=Submit
        //&account=用户名
        //&password=密码
        //&mobile=手机号码
        //&content=您的验证码是：【变量】。请不要把验证码泄露给其他人。

        if (!$msg) {
            $msg = "您的验证码是：【12345】。请不要把验证码泄露给其他人。";
        }

        $api = "http://106.ihuyi.cn/webservice/sms.php?method=Submit";
        $data = array(
            "account" => $this->username, //"cf_ncs",
            "password" => md5($this->password), //md5("Whl2016_Q"),
            "mobile" => $mobile,
            "content" => $msg,
        );

        $url = $api . '&' . http_build_query($data);

        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $returnStatus = curl_exec($ch);
        curl_close($ch);
        $aResultData = $this->xml_to_array($returnStatus);
        if (isset($aResultData['SubmitResult']['code']) && $aResultData['SubmitResult']['code'] == 2) {
            return true;
        }
        return false;
    }

    public function xml_to_array($xml) {
        $reg = "/<(\w+)[^>]*>([\\x00-\\xFF]*)<\\/\\1>/";
        if (preg_match_all($reg, $xml, $matches)) {
            $count = count($matches[0]);
            for ($i = 0; $i < $count; $i++) {
                $subxml = $matches[2][$i];
                $key = $matches[1][$i];
                if (preg_match($reg, $subxml)) {
                    $arr[$key] = $this->xml_to_array($subxml);
                } else {
                    $arr[$key] = $subxml;
                }
            }
        }
        return $arr;
    }

}
