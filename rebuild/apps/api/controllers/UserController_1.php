<?php

namespace api\controllers;

use api\lib\BaseController;
use bases\lib\PhoneValidator;
use bases\lib\Response;
use bases\lib\Xxtea;
use common\model\Agent;
use common\model\Member;
use common\model\MobileVerify;
use common\model\OtherUser;
use common\model\User;
use Yii;

/**
 * 用户控制器
 */
class UserController extends BaseController {

    const VERIFY_TIME_OUT = 30000;

    /**
     * 用户登录api
     * mobile 手机号码
     * password 密码
     * @return Response 成功返回用户加密token
     */
    public function loginUser() {
        $mobile = Yii::$app->request->post('mobile');
        $password = Yii::$app->request->post('password');
        $venderId = (int) Yii::$app->request->post('vender_id', 0);

        if (!(new PhoneValidator())->validate($mobile)) {
            return new Response('手机格式不正确', 1301);
        }
        if (!$password) {
            return new Response('缺少密码', 1302);
        }
        if (!$venderId) {
            return new Response('参数错误', 1302);
        }
        $mUser = User::getOneByAccountAndPassword($mobile, $password, $venderId);
        if (!$mUser) {
            return new Response('账号或密码错误', 1303);
        }
        return new Response('登录成功', 1, ['user_token' => static::createUserTokenByUserId($mUser->id)]);
    }

    /**
     * 用户注册
     * mobile 手机号码
     * password 密码
     * verify_code 短信验证码
     * @return Response 成功或者失败
     */
    public function registerUser() {
        $mobile = Yii::$app->request->post('mobile');
        $password = Yii::$app->request->post('password');
        $verifyCode = Yii::$app->request->post('verify_code');
        $venderId = (int) Yii::$app->request->post('vender_id', 0);
        $referencesId = (int) Yii::$app->request->post('references_id', 0);

        if (!(new PhoneValidator())->validate($mobile)) {
            return new Response('手机格式不正确', 1201);
        }
        if (!$password) {
            return new Response('缺少密码', 1202);
        }

        if (!$venderId) {
            return new Response('参数错误', 1202);
        }

        $verifyResult = static::checkCode($mobile, $verifyCode,$venderId);
        if (true !== $verifyResult) {
            return $verifyResult;
        }

        $mUser = User::getOneByAccountAndPassword($mobile, $password, $venderId);
        if ($mUser) {
            return new Response('该手机已被注册了', 1203);
        }

        $mUser = User::registerUser([
                    'mobile' => $mobile,
                    'password' => $password,
                    'create_time' => NOW_TIME,
                    'update_time' => NOW_TIME,
                    'vender_id' => $venderId,
                    'references_id' => $referencesId,
        ]);

        if (!$mUser) {
            return new Response('注册失败', 1204);
        }

        return new Response('注册成功', 1, ['user_token' => static::createUserTokenByUserId($mUser->id)]);
    }

    /**
     * 修改密码
     * @return Response
     */
    public function setNewPassword() {
        $mobile = Yii::$app->request->post('mobile');
        $password = Yii::$app->request->post('password');
        $verifyCode = Yii::$app->request->post('verify_code');
        $venderId = (int) Yii::$app->request->post('vender_id', 0);

        if (!(new PhoneValidator())->validate($mobile)) {
            return new Response('手机格式不正确', 1501);
        }
        if (!$password) {
            return new Response('缺少密码', 1502);
        }
        if (!$venderId) {
            return new Response('参数错误', 1202);
        }
        $verifyResult = static::checkCode($mobile, $verifyCode,$venderId);
        if (true !== $verifyResult) {
            return $verifyResult;
        }

        $mUser = User::findOne(['mobile' => $mobile, 'vender_id' => $venderId]);
        if (!$mUser) {
            return new Response('找不到用户信息', 1503);
        }
        $mUser->set('password', User::encryPassword($password));
        $mUser->save();

        return new Response('设置密码成功', 1, ['user_token' => static::createUserTokenByUserId($mUser->id)]);
    }

    /**
     * 修改用户信息，未全
     * @return Response
     */
    public function editUserInfo() {
        $userToken = Yii::$app->request->post('user_token');
        $userName = Yii::$app->request->post('user_name');

        if (!$userToken) {
            return new Response('缺少user_token', 1601);
        }
        $userId = static::getUserIdByUserToken($userToken);
        if (!$userId) {
            return new Response('解密失败，非法请求', 10081);
        }
        $mUser = User::findOne($userId);
        if (!$mUser) {
            return new Response('找不到用户信息', 1603);
        }
        $updateFlag = false;
        if ($userName) {
            $updateFlag = true;
            $mUser->set('user_name', $userName);
        }
        if ($updateFlag) {
            $mUser->save();
        }
        return new Response('保存成功', 1);
    }

    /**
     * 校验验证码
     * mobile 手机好
     * verify_code 验证码
     * @return Response 成功或者失败
     */
    public function verifyCode() {
        $mobile = Yii::$app->request->post('mobile');
        $verifyCode = Yii::$app->request->post('verify_code');
        $venderId = (int)Yii::$app->request->post('vender_id',0);
        if(!$venderId){
            return new Response('缺少校验参数', 10085);
        }

        if (!(new PhoneValidator())->validate($mobile)) {
            return new Response('手机格式不正确', 1401);
        }

        $verifyResult = static::checkCode($mobile, $verifyCode,$venderId);
        if (true !== $verifyResult) {
            return $verifyResult;
        }
        return new Response('验证成功', 1);
    }

    /**
     * 发生验证码
     * mobile 要发送验证码的号码
     * @return Response
     */
    public function sendVerifyCode() {
        $mobile = Yii::$app->request->post('mobile');
        $venderId = Yii::$app->request->post('vender_id');

        if (!(new PhoneValidator())->validate($mobile)) {
            return new Response('手机格式不正确', 1101);
        }

        $verifyCode = mt_rand(100000, 999999);
        $isNew = false;
        $mMobileVerify = MobileVerify::findOne(['mobile' => $mobile, 'vender_id' => $venderId]);
        if (!$mMobileVerify) {
            $isNew = true;
            $id = MobileVerify::insert([
                        'mobile' => $mobile,
                        'verify_code' => $verifyCode,
                        'create_time' => NOW_TIME,
                        'vender_id' => $venderId,
            ]);
            $mMobileVerify = MobileVerify::findOne($id);
        }
        if (NOW_TIME - $mMobileVerify->create_time < 60) {
            if (!$isNew) {
                return new Response('请1分钟后再试', 1102);
            }
        } else {
            $mMobileVerify->set('verify_code', $verifyCode);
            $mMobileVerify->set('create_time', NOW_TIME);
            $mMobileVerify->save();
        }
        $oSms = Yii::$app->sms;
        $oSms->venderId = $venderId;
        $oSms->sendTo = $mobile;
        $oSms->content = '您好，您的验证码是：' . $verifyCode;
        $returnCode = $oSms->send();
        if ($returnCode <= 0) {
            return new Response('发送失败', 1103);
        } else {
            return new Response('发送成功', 1);
        }
    }

    public function getUserInfo() {
        $userToken = Yii::$app->request->post('user_token');

        if (!$userToken) {
            return new Response('缺少user_token', 1701);
        }
        $userId = static::getUserIdByUserToken($userToken);
        if (!$userId) {
            return new Response('解密失败，非法请求', 10081);
        }
        $mUser = User::findOne($userId);
        if (!$mUser) {
            return new Response('找不到用户信息', 1702);
        }
        $userTitle = '无级别信息';
        $userCategory = Agent::findOne($mUser->category_id);
        if ($userCategory) {
            $userTitle = $userCategory->name;
        }
        $mUser->title = $userTitle;
        $aUser = $mUser->toArray(['id', 'user_name', 'mobile', 'email', 'money', 'score', 'references_id', 'category_id', 'vender_id', 'avatar', 'real_name', 'alipay', 'sex', 'flag']);

        return new Response('用户信息', 1, $aUser);
    }

    /**
     * 根据给到的用户token解密拿到用户id
     * @param type $userToken
     * @return int
     */
    public static function getUserIdByUserToken($userToken) {
        $str = Xxtea::decrypt($userToken);
        $aData = explode(':', $str);
        if (isset($aData[0]) && $aData[0]) {
            return $aData[0];
        }
        return 0;
    }

    /**
     * 生成用户token
     * @param type $uid 用户id
     * @return type 加密后的用户id
     */
    public static function createUserTokenByUserId($uid) {
        return Xxtea::encrypt($uid . ':' . NOW_TIME);
    }

    /**
     * 统一校验验证码
     * @param type $mobile
     * @param type $verifyCode
     * @return boolean|Response
     */
    public static function checkCode($mobile, $verifyCode, $venderId = 0) {
        if (!$verifyCode) {
            return new Response('验证码不能为空', 1405);
        }
        $mMobileVerify = MobileVerify::findOne(['mobile' => $mobile, 'vender_id' => $venderId]);
        if (!$mMobileVerify) {
            return new Response('找不到验证码', 1402);
        }
        if (NOW_TIME - $mMobileVerify->create_time > static::VERIFY_TIME_OUT) {
            return new Response('验证码超时', 1403);
        }
        if ($mMobileVerify->verify_code != $verifyCode) {
            return new Response('验证码不正确', 1404);
        }
        return true;
    }

    public function updateAvatar() {
        $request = Yii::$app->request;
        //传过来的token值
        $userToken = $request->post('user_token');
        $venderId = (int) $request->post('vender_id', 0);
        $avatar = (string) $request->post('avatar', '');

        if (!$userToken) {
            return new Response('用户token 已经失效或者不合法，请重新获取', 1801);
        }
        if (!$avatar) {
            return new Response('参数错误，请刷新重试', 1801);
        }
        //获取用户id
        $userId = Member::decodeUserIdByUserToken($userToken);
        if (!$userId) {
            return new Response('用户id不存在，请按套路出牌', 1808);
        }
        $mUser = User::findOne(['id' => $userId, 'vender_id' => $venderId]);
        if (!$mUser) {
            return new Response('找不到用户信息', 1702);
        }
        $mUser->set('avatar', $avatar);
        if ($mUser->save()) {
            return new Response('修改头像成功', 1);
        }
        return new Response('网络繁忙，请稍后重试', 0);
    }

    public function updateUserInfo() {
        $request = Yii::$app->request;
        //传过来的token值
        $userToken = $request->post('user_token');
        $venderId = (int) $request->post('vender_id', 0);
        $avatar = (string) $request->post('avatar', '');
        $userName = (string) $request->post('user_name', '');
        $realName = (string) $request->post('real_name', '');
        $mobile = (string) $request->post('mobile', '');
        $email = (string) $request->post('email', '');
        $alipay = (string) $request->post('alipay', '');
        $sex = (int) $request->post('sex', 0);
        if (!$userToken) {
            return new Response('用户token 已经失效或者不合法，请重新获取', 1801);
        }
        //获取用户id
        $userId = Member::decodeUserIdByUserToken($userToken);
        if (!$userId) {
            return new Response('用户id不存在，请按套路出牌', 1808);
        }
        $mUser = User::findOne(['id' => $userId, 'vender_id' => $venderId]);
        if (!$mUser) {
            return new Response('找不到用户信息', 1702);
        }
        $mUser->set('avatar', $avatar);
        $mUser->set('user_name', $userName);
        $mUser->set('real_name', $realName);
        $mUser->set('mobile', $mobile);
        $mUser->set('email', $email);
        $mUser->set('alipay', $alipay);
        $mUser->set('sex', $sex);
        $mUser->set('update_time', time());
        if ($mUser->save()) {
            return new Response('修改个人资料成功', 1);
        }
        return new Response('网络繁忙，请稍后重试!', 0);
    }

    /**
     * 微信第三方登录更新信息
     */
    public function setUserInfoByOpenId() {
        $openId = (string) Yii::$app->request->post('open_id', '');
        $nickname = (string) Yii::$app->request->post('nickname', '');
        $sex = (string) Yii::$app->request->post('sex', '');
        $province = (string) Yii::$app->request->post('province', '');
        $city = (string) Yii::$app->request->post('city', '');
        $country = (string) Yii::$app->request->post('country', '');
        $headimgurl = (string) Yii::$app->request->post('headimgurl', '');
        $privilege = (array) Yii::$app->request->post('privilege', []);
        $unionid = (string) Yii::$app->request->post('unionid', '');
        $subscribe = (string) Yii::$app->request->post('subscribe', '');
        $venderId = (int) Yii::$app->request->post('vender_id');

        if (!$openId) {
            return new Response('找不到该openId', 9001);
        }
        if (!$venderId) {
            return new Response('找不到该venderId', 9008);
        }
        $mOtherUser = OtherUser::findOne(['openid' => $openId, 'vender_id' => $venderId]);

        if (!$mOtherUser) {
            $lastInsertId = OtherUser::insert([
                        'openid' => $openId,
                        'nickname' => $nickname,
                        'sex' => $sex,
                        'province' => $province,
                        'city' => $city,
                        'country' => $country,
                        'headimgurl' => $headimgurl,
                        'privilege' => json_encode($privilege),
                        'unionid' => $unionid,
                        'create_time' => NOW_TIME,
                        'login_time' => NOW_TIME,
                        'uid' => 0,
                        'subscribe' => $subscribe,
                        'vender_id' => $venderId,
            ]);
            !$lastInsertId && Yii::error('微信登录插入第三方表数据失败');
            return new Response('设置成功', 1, ['aUserInfo' => OtherUser::findOne(['id' => $lastInsertId])->toArray(), 'uid' => 0]);
        }

        $mOtherUser->set('nickname', $nickname);
        $mOtherUser->set('sex', $sex);
        $mOtherUser->set('province', $province);
        $mOtherUser->set('city', $city);
        $mOtherUser->set('country', $country);
        $mOtherUser->set('headimgurl', $headimgurl);
        $mOtherUser->set('privilege', json_encode($privilege));
        $mOtherUser->set('unionid', $unionid);
        $mOtherUser->set('login_time', $unionid);
        $mOtherUser->set('subscribe', $subscribe);
        !$mOtherUser->save() && Yii::error('微信登录更新第三方数据失败');
        $uid = 0;
        if ($mOtherUser->uid) {
            $uid = static::createUserTokenByUserId($mOtherUser->uid);
        }
        return new Response('设置成功1', 1, ['aUserInfo' => $mOtherUser->toArray(), 'uid' => $uid]);
    }

    public function bindLoginInfo() {
        $oRequest = Yii::$app->request;
        $userName = (string) $oRequest->post('user_name');
        $openId = (string) $oRequest->post('open_id');
        $venderId = (int) $oRequest->post('vender_id');
        $mobile = (string) $oRequest->post('mobile');
        $verifyCode = (string) $oRequest->post('verify_code');
        $password = (string) $oRequest->post('password');
        if (!$mobile) {
            return new Response('手机号码不能为空', 600001);
        }
        if (!$venderId) {
            return new Response('venderId不能为空', 600009);
        }
        if (!$password) {
            return new Response('缺少密码', 600002);
        }
        $verifyResult = static::checkCode($mobile, $verifyCode, $venderId);
        if (true !== $verifyResult) {
            return $verifyResult;
        }

        $mOtherUser = OtherUser::findOne(['openid' => $openId, 'vender_id' => $venderId]);

        if (!$mOtherUser) {
            return new Response('第三方数据丢失请重新登录', 600005);
        }

        $mUser = Member::findOne(['mobile' => $mobile, 'vender_id' => $venderId]);

        //如果存在，则绑定当前登陆的第三方用户到本地用户
        if ($mUser) {
            $aWxUser = OtherUser::findOne(['uid' => $mUser->id, 'vender_id' => $venderId]);
            //已经绑定了
            if ($aWxUser) {
                return new Response('该手机号码已经被绑定', 600003);
            }
            $mUser->set('update_time', NOW_TIME);
            $mUser->set('password', User::encryPassword($password));
            if (!$mUser->save()) {
                Yii::error('微信登录绑定登录数据失败');
                return new Response('数据绑定失败', 600004);
            }

            $mOtherUser->set('uid', $mUser->id);
            if (!$mOtherUser->save()) {
                Yii::error('更新绑定用户Uid失败');
                return new Response('数据绑定失败', 600010);
            }
            return new Response('绑定成功', 1, ['uid' => self::createUserTokenByUserId($mUser->id)]);
        }

        //新建用户
        $lastInsertId = Member::insert([
                    'user_name' => $userName,
                    'mobile' => $mobile,
                    'password' => User::encryPassword($password),
                    'create_time' => NOW_TIME,
                    'update_time' => NOW_TIME,
                    'vender_id' => $venderId,
                    'sex' => $mOtherUser->sex,
                    'last_login_time' => NOW_TIME,
        ]);

        if (!$lastInsertId) {
            return new Response('绑定失败请重试', 600011);
        }

        $mOtherUser->set('uid', $lastInsertId);
        if (!$mOtherUser->save()) {
            Yii::error('更新绑定用户Uid失败');
            return new Response('数据绑定失败', 600010);
        }
        return new Response('绑定成功', 1, ['uid' => self::createUserTokenByUserId($lastInsertId)]);
    }

}
