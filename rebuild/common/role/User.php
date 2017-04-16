<?php

namespace common\role;

use Yii;
use bases\lib\Cookie;
use bases\lib\Url;
use \common\model\User as UserModel;

/**
 * 用户登陆控制类
 */
class User extends \yii\web\User {

    public $allowMultipleToken = false;
    public $reloginOvertime = 0;

    /**
     * @var int 默认的记住登陆时长(秒数),如果login方法传入的登陆时长为0则用这个值
     */
    public $rememberLoginTime = 1800;
    private $_oIdentity = false; //false未检查过身份,null未登陆,object已经登陆
    private $_id = null;  //用户id

    /**
     * 判断当前用户是否游客
     * @return type
     */

    public function getIsGuest() {
        $oIdentity = $this->getIdentity();
        return !($oIdentity instanceof \yii\web\IdentityInterface);
    }

    /**
     * 登陆检查不通过的回调
     * @param type $checkAjax
     */
    public function loginRequired($checkAjax = true) {
        $loginUrl = '';
        if (is_string($this->loginUrl)) {
            $loginUrl = $this->loginUrl;
        } elseif (is_array($this->loginUrl)) {
            $loginUrl = Url::to($this->loginUrl);
        } elseif (is_callable($this->loginUrl)) {
            $function = $this->loginUrl;
            $loginUrl = $function();
        }
        Yii::$app->response->redirect($loginUrl);
        Yii::$app->response->send();
    }

    /**
     * 获取当前用户ID
     * @return type
     */
    public function getId() {
        if ($this->_oIdentity === false) {
            $this->_oIdentity = $this->initLoginStatus();
        }

        if (!$this->_id && is_object($this->_oIdentity)) {
            $this->_id = $this->_oIdentity->getId();
        }

        return $this->_id;
    }

    /**
     * 获取身份
     * @param type $autoRenew
     * @return type
     */
    public function getIdentity($autoRenew = true) {
        if ($this->_oIdentity === false) {
            //未加载过登陆口令
            $this->_oIdentity = $this->initLoginStatus();
        }
        return $this->_oIdentity;
    }

    public function login(\yii\web\IdentityInterface $oUser, $duration = 0) {
        Yii::info('开始进行登陆', 'login');
        $userId = (int) $oUser->getId();
        $this->setIdentity($oUser);

        //写入cookie
        Cookie::setEncrypt('userId', $userId, NOW_TIME + $this->rememberLoginTime);

        return true;
    }

    /**
     * 设置身份
     * @param \common\role\IdentityInterface $oIdentity
     * @throws \yii\base\InvalidValueException
     */
    public function setIdentity($oIdentity) {
        if ($oIdentity instanceof \yii\web\IdentityInterface) {
            $this->_oIdentity = $oIdentity;
        } elseif ($oIdentity === null) {
            $this->_oIdentity = null;
        } else {
            throw new \yii\base\InvalidValueException('设置用户身份时被传入了一个非 IdentityInterface 接口的实现参数!');
        }
    }

    /**
     * 获取cookie如果cookie 中存在teacherId则设置user模型对象
     * @return boolean
     */
    public function initLoginStatus() {
        Yii::info('进行登陆检查', 'login');
        $userId = (int) Cookie::getDecrypt('userId');
        if (!$userId) {
            Yii::info('cookie里没有用户id', 'login');
            return false;
        }

        if (!$oIdentity = UserModel::findOne($userId)) {
            Yii::info('登陆检查时找不到该用户!', 'login');
            return false;
        }

        $this->setIdentity($oIdentity);
        //延长cookie时间
        Cookie::setEncrypt('userId', $userId, NOW_TIME + $this->rememberLoginTime);
        return $oIdentity;
    }

    /**
     * 退出登陆
     * @return bool 是否已经为退出状态
     */
    public function logout($destroySession = true) {
        $oIdentity = $this->getIdentity();
        if (!$oIdentity) {
            $oIdentity = $this->initLoginStatus();
            if (!$oIdentity) {
                return true;
            }
        }

        //删除客户端保存的令牌
        Cookie::delete('userId');
        $this->setIdentity(null); //清除身份
        return $this->getIsGuest();
    }

    /**
     * 生成随机登陆密钥
     * @param type $aElements
     * @return type string 登陆密钥
     */
    private function _buildLoginToken($aElements) {
        return md5($aElements['ip'] . $aElements['user_id'] . mt_rand($aElements['user_id'], 9999999999));
    }

}
