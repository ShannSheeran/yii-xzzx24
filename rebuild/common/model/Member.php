<?php

namespace common\model;

use bases\lib\Xxtea;
use common\lib\DbOrmModel;
use Yii;

class Member extends DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@users');
    }

    /**
     * 根据给到的用户token解密拿到用户id
     * @param type $userToken
     * @return int
     */
    public static function decodeUserIdByUserToken($userToken) {
        $str = Xxtea::decrypt($userToken);
        $aData = explode(':', $str);
        if (isset($aData[0]) && $aData[0]) {
            return $aData[0];
        }
        return 0;
    }

    /**
     * 根据给到的用户token解密拿到用户id 的token 时间
     * @param type $userToken
     * @return int
     */
    public static function decodeUserTokenTimeByUserToken($userToken) {
        $str = Xxtea::decrypt($userToken);
        $aData = explode(':', $str);
        if (isset($aData[1]) && $aData[1]) {
            return $aData[1];
        }
        return 0;
    }

    /**
     * 生成用户token
     * @param type $uid 用户id
     * @return type 加密后的用户id
     */
    public static function encodeUserTokenByUserId($uid) {
        return Xxtea::encrypt($uid . ':' . NOW_TIME);
    }

}
