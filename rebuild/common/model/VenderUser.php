<?php
namespace common\model;

use Yii;
use bases\lib\Query;
use yii\helpers\ArrayHelper;
use yii\web\IdentityInterface;
use yii\base\NotSupportedException;
use yii\validators\EmailValidator;
use bases\lib\PhoneValidator;

class VenderUser extends \common\lib\DbOrmModel implements IdentityInterface{
    
   public $userToken;
    
    public static function tableName(){
            return '';
    }

    public function allow($permissionName){
            return true;
    }
    
    /**
     * 通过接口登录用户
     * @param type $token
     * @return \static
     */
    public static function getUserModelByUserToken($userToken) {
        return new static(['userToken' => $userToken]);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($userToken){
        return new static(['userToken' => $userToken]);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null){
        throw new NotSupportedException('根据令牌找用户 的方法未实现');
    }

    /**
     * 根据密码重置口令获取学生模型
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token){
        if (!static::isPasswordResetTokenValid($token)) {
            return false;
        }
		/*
        return static::findOne([
            'password_reset_token' => $token,
        ]);
		*/
    }

    /**
     * 验证重置密码口令是否过期
     * @param string $token password reset token
     * @return boolean
     */
    public static function isPasswordResetTokenValid($token){
    }

    /**
     * 通过接口登录获取用户userToken
     */
    public function getId()
    {
        return $this->userToken;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey(){
        return $this->_authKey;
    }
    
    

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey){
        return $this->getAuthKey() === $authKey;
    }
    
    public static function encryPassword($password) {
        return md5($password);
    }

    public static function getOneByAccountAndPassword($account, $password) {
        if (!$account) {
            return false;
        }
        if (!$password) {
            return false;
        }

        $isEmail = (new EmailValidator())->validate($account);
        $isMobile = (new PhoneValidator())->validate($account);
        $mUser = null;
        if ($isEmail) {
            $mUser = self::findOne([
                'email' => $account,
                'password' => self::encryPassword($password)
            ]);
        }
        if ($isMobile) {
            $mUser = self::findOne([
                'mobile' => $account,
                'password' => self::encryPassword($password)
            ]);
        }
        if (!$isEmail && !$isMobile) {
            $mUser = self::findOne([
                'user_name' => $account,
                'password' => self::encryPassword($password)
            ]);
        }
        return $mUser;
    }
    
    public static function registerUser($aData) {
        if (isset($aData['password']) && $aData['password']) {
            $aData['password'] = self::encryPassword($aData['password']);
        }
        (new Query())->createCommand()->insert(static::tableName(), $aData)->execute();
        return self::findOne(Yii::$app->db->getLastInsertID());
    }

}