<?php

namespace home\controllers;

use bases\lib\Response;
use bases\lib\Response;
use bases\lib\StringHelper;
use common\model\AdRecommendedCode;
use common\model\Advert;
use common\model\App;
use common\model\MainUser;
use common\model\WxUser;
use Yii;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\Controller;

/**
 * 站点控制器
 */
class SiteController extends Controller {

    public $enableCsrfValidation = false;

    public function actions() {
        return [
            'error' => [
                'class' => 'bases\lib\ErrorAction',
            ],
        ];
    }

    public function actionIndex() {
        //网红id必须要传
        $rednetId = (int) Yii::$app->request->get('xz_rid', 0);
        if (!$rednetId) {
            return new Response('参数缺失');
        }
        //网红公会id必须要传
        $orgId = (int) Yii::$app->request->get('xz_oid', 0);
        if (!$orgId) {
            return new Response('参数缺失');
        }

        $advertId = (int) Yii::$app->request->get('aid', 0);
        if (!$advertId) {
            return new Response('数据不存在');
        }
        $mAdert = Advert::findOne($advertId);
        if (!$mAdert) {
            return new Response('数据不存在');
        }
        $mApp = App::findOne($mAdert->app_id);
        if(!$mApp){
            return new Response('数据不存在');
        }
        //第三方合作的游戏单独处理
        if($mApp->type){
            return $this->_dealOtherAgame($advertId,$rednetId,$orgId,$mAdert->app_id);
        }
        
        //自有游戏公众号搜权获取用户信息
        $redictUrl = Url::to(['site/callback', 'aid' => $advertId, 'rid' => $rednetId, 'org_id' => $orgId], true);
//        Yii::$app->weiXin->login('http://xinfuli.viphk.ngrok.org/getwx.html?aid=3&rid=88&org_id=100', 'snsapi_base');
        Yii::$app->weiXin->login($redictUrl, 'snsapi_base');
        return $this->render('index', ['index' => 'index']);
    }

    //非自有游戏处理
    private function _dealOtherAgame($advertId,$rednetId,$orgId,$appId){
        //生成x红人 x 广告的推荐码
        $mCode = AdRecommendedCode::findOne(['rednet_id'=>$rednetId,'ad_id'=>$advertId]);
        //生成推荐码
        if(!$mCode){
            $lastInsertId = AdRecommendedCode::insert([
                'rednet_id' => $rednetId,
                'ad_id' => $advertId,
                'org_id' => $orgId,
                'app_id' => $appId,
                'create_time'=>NOW_TIME,
                'code' => $this->_buildCode(),
            ]);
            if(!$lastInsertId){
                Yii::error('生成推荐出错');
                return false;
            }
            $mCode = AdRecommendedCode::findOne($lastInsertId);
        }
        debug('推荐码落地页>'.$mCode->code,11);
    }
    
    private function _buildCode(){
        $code = StringHelper::buildRandomString(7, 7, 20);
        if($this->_codeExist($code)){
            return $this->_buildCode();
        }
        return $code;
    }


    private function _codeExist($code){
        $mCode = AdRecommendedCode::findOne(['code'=>$code]);
        if($mCode){
            return true;
        }
        return false;
    }


    /**
     * 微信登录回调
     */
    public function actionCallback() {
        $cb = (string) Yii::$app->request->get('cb', '');
        $aAccessTokenResult = Yii::$app->weiXin->getOauthAccessTokeyByCode();
        $aBasicAccessTokenResult = Yii::$app->weiXin->getBasicAccessTokey();
        if (!isset($aAccessTokenResult['openid']) || !isset($aBasicAccessTokenResult['access_token'])) {
            return new Response('微信服务器登录返回数据异常');
        }
        $aWxUserInfo = Yii::$app->weiXin->getUserSubscribeByAccessTokey($aBasicAccessTokenResult['access_token'], $aAccessTokenResult['openid']);

        //登录失败重新请求
        if (!$aWxUserInfo || (isset($aWxUserInfo['errcode']) && $aWxUserInfo['errcode'] == 40003)) {
            return $this->redirect(['site/index']);
        }
        if (!isset($aWxUserInfo['openid'])) {
            Yii::error('微信服务器登录返回数据异常回调找不到openid');
            return new Response('微信服务器登录返回数据异常');
        }
        //网红id必须要传
        $rednetId = (int) Yii::$app->request->get('rid', 0);
        if (!$rednetId) {
            return new Response('参数缺失');
        }
        //网红公会id必须要传
        $orgId = (int) Yii::$app->request->get('org_id', 0);
        if (!$orgId) {
            return new Response('参数缺失');
        }

        $advertId = (int) Yii::$app->request->get('aid', 0);
        if (!$advertId) {
            return new Response('数据不存在');
        }
        $mAdert = Advert::findOne($advertId);
        if (!$mAdert) {
            return new Response('数据不存在');
        }
        if(!isset($aWxUserInfo['unionid'])){
            return new Response('先将微信号绑定到开发者中心');
        }
        
        //兼容未关注用户
        $aWxUserInfo['nickname'] = isset($aWxUserInfo['nickname']) ? $aWxUserInfo['nickname'] : '';
        $aWxUserInfo['sex'] = isset($aWxUserInfo['sex']) ? $aWxUserInfo['sex'] : '';
        $aWxUserInfo['province'] = isset($aWxUserInfo['province']) ? $aWxUserInfo['province'] : '';
        $aWxUserInfo['city'] = isset($aWxUserInfo['city']) ? $aWxUserInfo['city'] : '';
        $aWxUserInfo['country'] = isset($aWxUserInfo['country']) ? $aWxUserInfo['country'] : '';
        $aWxUserInfo['headimgurl'] = isset($aWxUserInfo['headimgurl']) ? $aWxUserInfo['headimgurl'] : '';
        $aWxUserInfo['subscribe'] = isset($aWxUserInfo['subscribe']) ? $aWxUserInfo['subscribe'] : 0;
        $aWxUserInfo['subscribe_time'] = isset($aWxUserInfo['subscribe_time']) ? date('Y-m-d H:i:s', $aWxUserInfo['subscribe_time']) : '';
        //判断是否是第一次进来的用户
        if (!$this->_isExistUser($aWxUserInfo, $mAdert->app_id, $rednetId, $advertId, $orgId)) {
            //处理用户关系
            $this->_dealMainUser($aWxUserInfo, $mAdert->app_id, $rednetId, $advertId, $orgId);
        }
        //跳转
        debug($mAdert->link, 11);
    }

    private function _isExistUser($aWxUserInfo, $appId, $rednetId, $advertId, $orgId) {
        $mMainUser = MainUser::findOne(['unionid' => $aWxUserInfo['unionid'], 'app_id' => $appId]);
        if (!$mMainUser) {
            return false;
        }
        //非首次(同一个游戏app和同一个unionid)
        $mWxUser = WxUser::findOne(['user_id' => $mMainUser->id]);
        if (!$mWxUser) {
            $this->_insertWxUser($mMainUser->id, $aWxUserInfo);
            return true;
        }
        //如果存在就用户更新用户信息
        $mWxUser->set('wx_nick_name', $aWxUserInfo['nickname']);
        $mWxUser->set('wx_sex', $aWxUserInfo['sex']);
        $mWxUser->set('province', $aWxUserInfo['province']);
        $mWxUser->set('city', $aWxUserInfo['city']);
        $mWxUser->set('country', $aWxUserInfo['country']);
        $mWxUser->set('headimgurl', $aWxUserInfo['headimgurl']);
        $mWxUser->set('subscribe', $aWxUserInfo['subscribe']);
        $mWxUser->set('subscribe_time', $aWxUserInfo['subscribe_time']);
        $mWxUser->set('updatetime', NOW_TIME);
        if (!$mWxUser->save()) {
            Yii::error('用户非第一次点击游戏广告进来更新微信表保存失败');
        }
        return true;
    }

    private function _dealMainUser($aWxUserInfo, $appId, $rednetId, $advertId, $orgId) {
        //创建主表数据并且区分游戏用户
        $mUid = MainUser::insert([
                    'org_id' => $orgId, //机构id
                    'ad_id' => $advertId,
                    'rednet_id' => $rednetId,
                    'username' => $aWxUserInfo['nickname'],
                    'app_id' => $appId,
                    'sex' => $aWxUserInfo['sex'],
                    'createtime' => NOW_TIME,
                    'updatetime' => NOW_TIME,
                    'unionid' => isset($aWxUserInfo['unionid']) ? $aWxUserInfo['unionid'] : '',
        ]);
        if (!$mUid) {
            Yii::error('用户第一次点击游戏广告进来插入主表失败');
            return false;
        }
        return $this->_insertWxUser($mUid, $aWxUserInfo);
    }

    private function _insertWxUser($mUid, $aWxUserInfo) {
        //存表
        $lastInsertId = WxUser::insert([
                    'user_id' => $mUid,
                    'openid' => $aWxUserInfo['openid'],
                    'wx_nick_name' => $aWxUserInfo['nickname'],
                    'wx_sex' => $aWxUserInfo['sex'],
                    'province' => $aWxUserInfo['province'],
                    'city' => $aWxUserInfo['city'],
                    'country' => $aWxUserInfo['country'],
                    'headimgurl' => $aWxUserInfo['headimgurl'],
                    'subscribe' => $aWxUserInfo['subscribe'],
                    'subscribe_time' => $aWxUserInfo['subscribe_time'],
                    'remark' => $aWxUserInfo['remark'],
                    'unionid' => isset($aWxUserInfo['unionid']) ? $aWxUserInfo['unionid'] : '',
                    'createtime' => NOW_TIME,
                    'updatetime' => NOW_TIME,
        ]);
        if (!$lastInsertId) {
            Yii::error('用户第一次点击游戏广告进来插入微信表失败');
            return false;
        }
        return true;
    }

    public function actionWeixinVerify() {
        $fileName = Yii::$app->request->get('filename', '');
        if (!$fileName) {
            return;
        }
        $this->layout = false;
        echo Html::encode($fileName);
    }

}
