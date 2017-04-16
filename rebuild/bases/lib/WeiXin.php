<?php

namespace bases\lib;

use bases\lib\Http;
use Yii;
use yii\base\Component;

/*
 * 微信功能，只适用于微信客户端的操作
 * author twl
 */

class WeiXin extends Component {

    /**
     * AppID(应用ID)
     */
    //const APP_ID = 'wxd97cdd3043da5cb9';
    public $appId = 'wx4dccf92d5d2591ea';

    /**
     * AppSecret(应用密钥)
     */
    //const APP_SECRET = 'a316496f3a38c7062fafc700b9cfdd32';
    public $appSecret = 'd7cacdc818a0726db8abf1d0edb77eb9';
    public $expiresIn = 7200;
    public $venderId = 0;

    //微信登录url
    const LOGIN_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect';
    const ACCESS_TOKEY_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code';
    const ACCESS_BASIC_TOKEY_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=SECRET';
    const GET_USER_INFOURL = 'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN';
    const GETUSERINFOURL = 'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN';
    const REFRESH_USER_ACCESS_TOKEY_URL = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN';
    const CKECK_ACCESS_TOKEY_URL = 'https://api.weixin.qq.com/sns/auth?access_token=ACCESS_TOKEN&openid=OPENID';
    const GET_USER_SUBSCRIBE = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN';
    //获取网页tokey
    const ACCESS_TOKEY_WEB_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET';
    const JSAPI_TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi';

    /**
     * 获取微信登陆跳转地址
     * @param type $callbackUrl
     * @return type
     */
    public function login($callbackUrl = '', $scope = 'snsapi_userinfo', $state = 1) {
        $loginUrl = str_replace(array('APPID', 'REDIRECT_URI', 'SCOPE', 'STATE'), array($this->appId, urlencode($callbackUrl), $scope, $state), self::LOGIN_URL);
        header("Location:" . $loginUrl);
    }

    /**
     * 获取网页授权access_token
     * @return type
     */
    public function getOauthAccessTokeyByCode() {
        $code = (string) Yii::$app->request->get('code', '');
        if (!$code) {
            Yii::error('没获取到微信发来的code');
            return false;
        }
        $getUserAccessTokeyUrl = str_replace(array('APPID', 'SECRET', 'CODE'), array($this->appId, $this->appSecret, $code), self::ACCESS_TOKEY_URL);
        $aAccessTokenResult = $this->_httpGet($getUserAccessTokeyUrl);
        if (isset($aAccessTokenResult['errcode']) && $aAccessTokenResult['errcode'] == 40029) {
            $aAccessTokenResult = $this->getRefreshAccessTokey();
        }
        //保存得到的access信息
//        {
//            "access_token":"ACCESS_TOKEN",
//            "expires_in":7200,
//            "refresh_token":"REFRESH_TOKEN",
//            "openid":"OPENID",
//            "scope":"SCOPE",
//            "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
//         }
        $expiresIn = isset($aAccessTokenResult['expires_in']) ? $aAccessTokenResult['expires_in'] - 100 : $this->expiresIn;
        Yii::$app->cache->set('web_access_token_' . $this->venderId, $aAccessTokenResult, $expiresIn);
        return $aAccessTokenResult;
    }

    /**
     * 获取基础access_token
     * @return type
     */
    public function getBasicAccessTokey() {
        //获取缓存中的基础access_token
        $aCacheAccessTokenResult = Yii::$app->cache->get('web_basic_access_token_' . $this->venderId);
        if ($aCacheAccessTokenResult) {
            return $aCacheAccessTokenResult;
        }
        $getUserAccessTokeyUrl = str_replace(array('APPID', 'SECRET'), array($this->appId, $this->appSecret), self::ACCESS_BASIC_TOKEY_URL);
        $aAccessTokenResult = $this->_httpGet($getUserAccessTokeyUrl);
        if (isset($aAccessTokenResult['errcode']) && $aAccessTokenResult['errcode'] == 40013) {
            Yii::error('appid无效');
            return false;
        }
        $expiresIn = isset($aAccessTokenResult['expires_in']) ? $aAccessTokenResult['expires_in'] - 100 : $this->expiresIn;
        Yii::$app->cache->set('web_basic_access_token_' . $this->venderId, $aAccessTokenResult, $expiresIn);
        return $aAccessTokenResult;
    }

    /**
     * 刷新token
     */
    public function getRefreshAccessTokey() {
        //获取缓存中的access_token接口返回的信息
        $aAccessTokenResultOld = Yii::$app->cache->get('web_access_token_' . $this->venderId);
        $getUserAccessTokeyUrl = str_replace(array('APPID', 'REFRESH_TOKEN'), array($this->appId, $aAccessTokenResultOld['refresh_token']), self::REFRESH_USER_ACCESS_TOKEY_URL);
        $aAccessTokenResult = $this->_httpGet($getUserAccessTokeyUrl);
        if (isset($aAccessTokenResult['errcode'])) {
            return header("Location:/other_login.html?type=1");
        }
        return $aAccessTokenResult;
    }

    public function getUserInfoByAccessTokey($accessTokey, $openId) {
        $getUserInfoUrl = str_replace(array('ACCESS_TOKEN', 'OPENID'), array($accessTokey, $openId), self::GETUSERINFOURL);
        $aUserInfo = $this->_httpGet($getUserInfoUrl);
        return $aUserInfo;
    }

    public function getUserSubscribeByAccessTokey($accessTokey, $openId) {
        $getUserInfoUrl = str_replace(array('ACCESS_TOKEN', 'OPENID'), array($accessTokey, $openId), self::GET_USER_SUBSCRIBE);
        $aUserInfo = $this->_httpGet($getUserInfoUrl);
        return $aUserInfo;
    }

    public function getSignPackage() {
        $jsapiTicket = $this->getJsApiTicket();
        // 注意 URL 一定要动态获取，不能 hardcode.
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

        $timestamp = time();
        $nonceStr = $this->createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
        $signature = sha1($string);

        $signPackage = array(
            "appId" => $this->appId,
            "nonceStr" => $nonceStr,
            "timestamp" => $timestamp,
            "url" => $url,
            "signature" => $signature,
            "rawString" => $string
        );
        return $signPackage;
    }

    public function createNonceStr($length = 16) {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

    /**
     * 获取网页基础access_token
     * @return type
     */
    public function getAccessToken() {
        $accessToken = Yii::$app->cache->get('wechat_access_token_' . $this->venderId);

        if ($accessToken) {
            return $accessToken;
        }
        $getWebAccessTokenUrl = str_replace(array('APPID', 'APPSECRET'), array($this->appId, $this->appSecret), self::ACCESS_TOKEY_WEB_URL);
        $aJsonResult = $this->_httpGet($getWebAccessTokenUrl);
        if (isset($aJsonResult['errcode'])) {
            Yii::error('调用access_token次数达到上限');
            return false;
        }
        if (!isset($aJsonResult['access_token'])) {
            Yii::error('微信傻B没返回接口约定字段access_token');
            return false;
        }
        $expiresIn = isset($aJsonResult['expires_in']) ? $aJsonResult['expires_in'] - 100 : $this->expiresIn;
        Yii::$app->cache->set('wechat_access_token_' . $this->venderId, $aJsonResult['access_token'], $expiresIn);
        return $aJsonResult['access_token'];
    }

    public function getJsApiTicket() {
        // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
        $ticket = Yii::$app->cache->get('wechat_ticket_' . $this->venderId);
        if ($ticket) {
            return $ticket;
        }
        $accessToken = $this->getAccessToken();

        // 如果是企业号用以下 URL 获取 ticket
        // $url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=$accessToken";
        $getWebTicketUrl = str_replace(array('ACCESS_TOKEN'), array($accessToken), self::JSAPI_TICKET_URL);
        //$url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
        $res = $this->_httpGet($getWebTicketUrl);

        if (isset($res['errcode']) && $res['errcode']) {
            Yii::error('调用ticket次数达到上限');
            return false;
        }
        if (!isset($res['ticket'])) {
            Yii::error('微信傻B没返回接口约定字段ticket', CLogger::LEVEL_ERROR);
            return false;
        }
        $expiresIn = isset($res['expires_in']) ? $res['expires_in'] - 100 : $this->expiresIn;
        Yii::$app->cache->set('wechat_ticket_' . $this->venderId, $res['ticket'], $expiresIn);
        return $res['ticket'];
    }

    private function _httpGet($url) {
        $oHttp = new Http($url);
        $oHttp->setAcceptType(Http::CONTENT_TYPE_JSON);
        return $oHttp->get();
    }

}
