<?php

namespace bases\lib;

use Yii;
use bases\lib\Cookie;
use bases\lib\Xxtea;

/*
 * 微信功能，只适用于微信客户端的操作
 * author twl
 */

class WeiXin extends \yii\base\Object{

	/**
	 * AppID(应用ID)
	 */
	//const APP_ID = 'wxd97cdd3043da5cb9';
	public $appId = '';

	/**
	 * AppSecret(应用密钥)
	 */
	//const APP_SECRET = 'a316496f3a38c7062fafc700b9cfdd32';
	public $appSecret = '';
	
	/*
	 * 请访问http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html 教程
	 * return [
			openid			用户的唯一标识
			nickname		用户昵称
			sex				用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
			province		用户个人资料填写的省份
			city			普通用户个人资料填写的城市
			country			国家，如中国为CN
			headimgurl		用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
			privilege		用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
			unionid			只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。详见：获取用户个人信息（UnionID机制）

			subscribe		用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
			subscribe_time	用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
			remark			公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
			groupid			用户所在的分组ID
	 * ]
	 * Yii::$app->weiXin->userInfo
	 */
	public function getUserInfo(){
		$code = Yii::$app->request->get('code');
		//设置cookie名称
		$accessTokenName = Xxtea::xcrypt('wx_access_token');
		$refreshTokenName = Xxtea::xcrypt('wx_refresh_token');
		$openIdName = Xxtea::xcrypt('wx_openid');
		//$state = Yii::$app->request->get('state');
		//此处代码是用来预防code失效还被传过来报错-----start
		$codeOk = true;
		if(!Cookie::getDecrypt($accessTokenName) || !Cookie::getDecrypt($refreshTokenName) || !Cookie::getDecrypt($openIdName)){
			$codeOk = false;
		}
		//此处代码是用来预防code失效还被传过来报错-----end
		if(!$codeOk && !empty($code)){
			$tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . $this->appId . '&secret=' . $this->appSecret . '&code=' . $code . '&grant_type=authorization_code';
			$aResult = $this->_httpGet($tokenUrl);
			if(isset($aResult['errcode'])){
				Yii::error('"errcode": ' . $aResult['errcode'] . ' ,"errmsg": ' . $aResult['errmsg']);
				return false;
			}
			//保证access_token有效性，无效就重新请求, 
			$aToken = $this->_outmodedAccessToken($aResult['access_token'], $aResult['openid'], $aResult['refresh_token']);
			if(!$aToken){
				return false;
			}
			$aResult['access_token'] = $aToken['access_token'];
			$aResult['refresh_token'] = $aToken['refresh_token'];
			
			//存相关数据到cookie
			Cookie::setEncrypt($accessTokenName, $aResult['access_token']);
			Cookie::setEncrypt($refreshTokenName, $aResult['refresh_token']);
			Cookie::setEncrypt($openIdName, $aResult['openid']);
		}else{
			//throw Yii::$app->buildError('授权失败');
			//Yii::error('授权失败');
			$accessToken = Cookie::getDecrypt($accessTokenName);
			$refreshToken = Cookie::getDecrypt($refreshTokenName);
			$openId = Cookie::getDecrypt($openIdName);
			if(!$accessToken || !$refreshToken || !$openId){
				return false;
			}
			//保证access_token有效性，无效就重新请求, 
			$aToken = $this->_outmodedAccessToken($accessToken, $openId, $refreshToken);
			if(!$aToken){
				return false;
			}	
			$aResult = [
				'access_token' => $aToken['access_token'],
				'refresh_token' => $aToken['refresh_token'],
				'openid' => $openId,
			];
		}
		
		$basicUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' . $aResult['access_token'] . '&openid=' . $aResult['openid'] . '&lang=zh_CN';
		$aUserInfo = $this->_httpGet($basicUrl);
		if(isset($aUserInfo['errcode'])){
			Yii::error('"errcode": ' . $aUserInfo['errcode'] . ' ,"errmsg": ' . $aUserInfo['errmsg']);
			//return $aResult;
			return false;
		}
		
		//获取获取用户是否关注 的信息
		$codeName = 'access_token';
		$accessToken = $this->_getMsnVerifyCodeFromRedis($codeName);
		if(!$accessToken){
			$accessTokenBasicUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->appId . '&secret=' . $this->appSecret;
			//先获取access_token这个和上面的不一样，有效时间为2小时
			$aAccessData = $this->_httpGet($accessTokenBasicUrl);
			if(isset($aAccessData['errcode'])){
				Yii::error('"errcode": ' . $aAccessData['errcode'] . ' ,"errmsg": ' . $aAccessData['errmsg']);
				return false;
			}
			$this->_saveMsnVerifyCodeToRedis($codeName, $aAccessData['access_token']);
			$accessToken = $aAccessData['access_token'];
		}
		
		$subscribeUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' . $accessToken . '&openid=' . $aResult['openid'] . '&lang=zh_CN';
		$aSubscribe = $this->_httpGet($subscribeUrl);
		if(isset($aSubscribe['errcode'])){
			Yii::error('"errcode": ' . $aSubscribe['errcode'] . ' ,"errmsg": ' . $aSubscribe['errmsg']);
			//return $aResult;
			return false;
		}
		/*$aUserInfo['subscribe'] = $aSubscribe['subscribe'];
		$aUserInfo['subscribe_time'] = $aSubscribe['subscribe_time'];
		$aUserInfo['remark'] = $aSubscribe['remark'];
		$aUserInfo['groupid'] = $aSubscribe['groupid'];*/
		return array_merge($aUserInfo, $aSubscribe);
	}

	/*
	 * 微信JSDDK信息获取， Yii::$app->weiXin->jSDDKInfo
	 */
	public function getJSDDKInfo(){
		//先获取access_token，时效是7200秒
		$codeName = 'access_token';
		$accessToken = $this->_getMsnVerifyCodeFromRedis($codeName);
		if(!$accessToken){
			$accessTokenBasicUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->appId . '&secret=' . $this->appSecret;
			//先获取access_token这个和上面的不一样，有效时间为2小时
			$aAccessData = $this->_httpGet($accessTokenBasicUrl);
			if(isset($aAccessData['errcode'])){
				Yii::error('"errcode": ' . $aAccessData['errcode'] . ' ,"errmsg": ' . $aAccessData['errmsg']);
				return false;
			}
			$this->_saveMsnVerifyCodeToRedis($codeName, $aAccessData['access_token']);
			$accessToken = $aAccessData['access_token'];
		}
		
		//通过access_token获得jsapi_ticket，时效是7200秒
		$jsapiTicketName = 'jsapi_ticket';
		$jsapiTicket = $this->_getMsnVerifyCodeFromRedis($jsapiTicketName);
		if(!$jsapiTicket){
			$jsapiTicketBasicUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' . $accessToken;
			//先获取access_token这个和上面的不一样，有效时间为2小时
			$aJsapiTicketData = $this->_httpGet($jsapiTicketBasicUrl);
			if(isset($aJsapiTicketData['errcode']) && $aJsapiTicketData['errcode']){
				Yii::error('"errcode": ' . $aJsapiTicketData['errcode'] . ' ,"errmsg": ' . $aJsapiTicketData['errmsg']);
				return false;
			}
			$this->_saveMsnVerifyCodeToRedis($jsapiTicketName, $aJsapiTicketData['ticket']);
			$jsapiTicket = $aJsapiTicketData['ticket'];
		}
		//https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken;

		//组织url
		//注意URL一定要动态获取，不能 hardcode.
		//$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
		//$protocol = (Yii::$app->request->isSecureConnection || Yii::$app->request->serverPort == 443) ? 'https://' : 'http://';
		//$url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		$url = Yii::$app->request->hostInfo . Yii::$app->request->pathInfo;
		//时间戳
		$timestamp = time();
		$nonceStr = $this->_createNonceStr();

		// 这里参数的顺序要按照 key 值 ASCII 码升序排序
		$string = 'jsapi_ticket=' . $jsapiTicket . '&noncestr=' . $nonceStr . '&timestamp=' . $timestamp . '&url=' . $url;

		$signature = sha1($string);

		$signPackage = [
		  'appId'     => $this->appId,
		  'nonceStr'  => $nonceStr,
		  'timestamp' => $timestamp,
		  'url'       => $url,
		  'signature' => $signature,
		  'rawString' => $string
		];
		return $signPackage; 
	  }
	
	//随机字符串
	private function _createNonceStr($length = 16){
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		$str = '';
		for($i = 0; $i < $length; $i++){
		  $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
		}
		return $str;
	}
	
	/*
	 * 保证access_token有效性，无效就重新请求, 
	 * @param $accessToken  网页授权接口调用凭证
	 * @param $openid  用户的唯一标识
	 */
	private function _outmodedAccessToken($accessToken, $openid, $refreshToken){
		$url = 'https://api.weixin.qq.com/sns/auth?access_token=' . $accessToken . '&openid=' . $openid;
		$aResult = $this->_httpGet($url);
		if(!$aResult['errcode']){
			return [
				'access_token' => $accessToken,
				'refresh_token' => $refreshToken,
			];
		}
		//如果失效就重新请求access_token
		$url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' . $this->appId . '&grant_type=refresh_token&refresh_token=' . $refreshToken;
		$aResult = $this->_httpGet($url);
		if(isset($aResult['errcode'])){
			Yii::error('"errcode": ' . $aResult['errcode'] . ' ,"errmsg": ' . $aResult['errmsg']);
			return [];
		}
		return [
			'access_token' => $aResult['access_token'],
			'refresh_token' => $aResult['refresh_token'],
		];
	}

	private function _httpGet($url){
		$oHttp = new Http($url);
		$oHttp->setAcceptType(Http::CONTENT_TYPE_JSON);
		return $oHttp->get();
	}
	
	/**
	 * 组装redis的键
	 * @author jay
	 * @return string
	 */
	private function _getRedisKeyString($name){
		return 'msn_verify_code_' . $name;
	}

	/**
	 * 保存access_tolen到redis
	 * @author jay
	 * @param $name access_tolen名字
	 * @param $code 验证码
	 * @return null
	 */
	private function _saveMsnVerifyCodeToRedis($name, $code){
		$expireTime = 3600;
		$key = $this->_getRedisKeyString($name);
		$aResult = Yii::$app->redisCache->getOne($key);
		$aParam = [
			'code' => $code,
			'create_time' => NOW_TIME,
		];
		if(!$aResult){
			Yii::$app->redisCache->add($key, $aParam);
		}else{
			Yii::$app->redisCache->update($key, $aParam);
		}
		Yii::$app->redisCache->expireOne($key, $expireTime);
	}

	/**
	 * 从redis获取access_tolen
	 * @author jay
	 * @param $mobile 手机号码
	 * @return string 验证码
	 */
	private function _getMsnVerifyCodeFromRedis($name){
		$key = $this->_getRedisKeyString($name);
		$aResult = Yii::$app->redisCache->getOne($key);
		if(isset($aResult['code']) && $aResult['code']){
			return $aResult['code'];
		}

		return '';
	}

	/**
	 * 从redis获取access_tolen创建时间
	 * @author jay
	 * @param $mobile 手机号码
	 * @return string 验证码
	 */
	private function _getMsnVerifyCodeSaveTimeFromRedis($name){
		$key = $this->_getRedisKeyString($name);
		$aResult = Yii::$app->redisCache->getOne($key);
		if(isset($aResult['create_time']) && $aResult['create_time']){
			return $aResult['create_time'];
		}

		return '';
	}
}
