<?php

namespace api\controllers;

use api\lib\BaseController;
use bases\lib\ApiResponse as Response;
use bases\lib\Xxtea;
use common\model\App;
use common\model\Member;
use Yii;

/**
 * api统一对外接口控制器
 */
class ApiController extends BaseController {
    /**
     * 消费记录接口
     */
    use api\OrderRecordApi;

    private $_version = '1.0.0';
    public $enableCsrfValidation = false;

    //用户token失效时间
    const USER_TOKEN_TIME_DURATION = 60000;

    /*
      接口Http POST请求权限参数：
      1、version:版本号		string(10) 如：1.0
      2、api_name:接口名称	string(50) 如：getUserInfo
      3、timestamp:时间戳		string(20) 如：2016-05-28 11:04:32
      4、app_code:应用标识	string(20) 如：android_diyshop	ios_diyshop
      5、app_key:应用码(隐)	string(50) 如：Android:ce854c997d463edcfb54ac4e0732d139	IOS:538982ef3dcdad018e59d2884fd8add1
      6、token:数据有效签名	string(50) 如：md5(app_code + timestamp + api_name + app_key)
     */

    public function actionIndex() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Max-Age: 1000');
        $_SERVER['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';

        $version = (string) Yii::$app->request->post('version');
        $apiName = (string) Yii::$app->request->post('api_name');
        $timeStamp = (string) Yii::$app->request->post('timestamp');
        $appCode = (string) Yii::$app->request->post('app_code');
        $token = (string) Yii::$app->request->post('token');
        $userToken = (string) Yii::$app->request->post('user_token', false);

        if (!$version) {
            return new Response('缺少版本号', 1000);
        }
        if ($version != $this->_version) {
            return new Response('版本号错误', 1001);
        }
        if (!$appCode) {
            return new Response('缺少app_code标识', 1002);
        }

        if (!$timeStamp) {
            return new Response('缺少时间戳', 1004);
        }
        if (!preg_match('/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/', $timeStamp)) {
            return new Response('时间戳格式错误', 1005);
        }
        if (!$token) {
            return new Response('缺少token', 1006);
        }
        //校验appId
        $appId = App::decodeAppId($appCode);
        if (!$appId) {
            return new Response('app_id非法', 10003);
        }
        //使用缓存减轻校验负担
        $mAppModel = App::findOne($appId);
        if (!$mAppModel) {
            return new Response('app_id错误', 10004);
        }

        if ($token != md5($appCode . $timeStamp . $apiName . $mAppModel->code)) {
            return new Response('数据有效签名错误', 1007);
        }
        
        
        if (!$apiName) {
            return new Response('缺少接口名称', 1008);
        }
        if (!method_exists($this, $apiName)) {
            return new Response('接口名称错误', 1009);
        }

        if ($userToken) {
            $preTokenTime = Member::decodeUserTokenTimeByUserToken($userToken);
            if (!$preTokenTime) {
                return new Response('无效的用户token', 10000);
            }
            //判断用户token是否已经失效
            if ((NOW_TIME - $preTokenTime) > self::USER_TOKEN_TIME_DURATION && 0 > 1) {
                return new Response('用户token已经失效请重新获取', 10001);
            }
        }

        return $this->$apiName();
    }

    /**
     * 检测unoinid是否跟系统已经绑定
     */
    public function checkUnionid() {
        return (new UserController($this->id, Yii::$app))->checkUnionid();
    }


    public function actionTest() {

        //getUserInfo
        $aParams = [
            'api_name' => 'getUserInfo',
            'user_token' => Member::encodeUserTokenByUserId(1),
            'country_id' => 2
        ];
        //checkUnionid
        $aParams = [
            'api_name' => 'checkUnionid',
            'unionid' => 'oo7pqwwAOJ6sPyF1ggj5dPxU_kDU',
        ];
        $aParams = [
            'api_name' => 'consumption',
            'unionid' => 'oo7pqwwAOJ6sPyF1ggj5dPxU_kDU',
            'order_sn' => NOW_TIME,
            'money' => 100.00,
            'desc' => '充值道具',
        ];
        
        $aParams = [
            'api_name' => 'checkRecommendedCode',
            'recommended_code' => 'eAPd840',
        ];
        $aParams = [
            'api_name' => 'recommendedCodeConsumption',
            'order_sn' => NOW_TIME,
            'money' => 100.00,
            'recommended_code' => 'eAPd840',
            'desc' => '第三方合作',
        ];
       

        return $this->render('test', ['aReturn' => $this->_createTestData($aParams)]);
    }
    public function actionTestApp() {
        
        $aParams = [
            'api_name' => 'consumption',
            'unionid' => 'oo7pqwwAOJ6sPyF1ggj5dPxU_kDU',
            'order_sn' => NOW_TIME,
            'money' => 100.00,
            'desc' => '充值道具',
        ];

        return $this->render('test_app', ['aReturn' => $this->_createTestData($aParams)]);
    }

    private function _createTestData($aParams) {
        $version = '1.0.0';
        $appCode = App::encodeAppId(1);
        $timestamp = date('Y-m-d H:i:s');

        $aData = [
            'version' => $version,
            'timestamp' => $timestamp,
            'app_code' => $appCode,
            'token' => md5($appCode . $timestamp . $aParams['api_name'] . '59e7c925b70ed0ad4c9afe060739db1a'),
        ];
        return array_merge($aData, $aParams);
    }

}
