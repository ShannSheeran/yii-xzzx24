<?php

namespace common\model;

use bases\lib\PhoneValidator;
use common\lib\DbOrmModel;
use Yii;
use yii\base\NotSupportedException;
use yii\validators\EmailValidator;
use yii\web\IdentityInterface;

class Manager extends DbOrmModel implements IdentityInterface {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@manager');
    }

    public function allow($permissionName) {
        return true;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id) {
        return static::findOne($id);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null) {
        throw new NotSupportedException('根据令牌找用户 的方法未实现');
    }

    /**
     * 根据密码重置口令获取模型
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token) {
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
    public static function isPasswordResetTokenValid($token) {
        
    }

    /**
     * @inheritdoc
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey() {
        return $this->_authKey;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey) {
        return $this->getAuthKey() === $authKey;
    }

    public static function encryPassword($password) {
        return md5($password);
    }

    public static function getManagerByAccountAndPassword($account, $password) {
        if (!$account) {
            return false;
        }
        if (!$password) {
            return false;
        }

        $isEmail = (new EmailValidator())->validate($account);
        $isMobile = (new PhoneValidator())->validate($account);
        $mManager = null;

        if ($isEmail) {
            $mManager = self::findOne([
                        'email' => $account,
                        'password' => self::encryPassword($password)
            ]);
        }

        if ($isMobile) {
            $mManager = self::findOne([
                        'mobile' => $account,
                        'password' => self::encryPassword($password)
            ]);
        }

        if (!$isEmail && !$isMobile) {
            $mManager = self::findOne([
                        'user_name' => $account,
                        'password' => self::encryPassword($password)
            ]);
        }
        return $mManager;
    }

}
