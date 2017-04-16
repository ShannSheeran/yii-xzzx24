<?php

namespace common\model;

use bases\lib\Xxtea;
use common\lib\DbOrmModel;
use Yii;

class App extends DbOrmModel {
    public static $_aSoftDelete = ['is_deleted',1];
    public static function tableName() {
        return Yii::$app->db->parseTable('_@app');
    }
    
    /**
     * 根据给到的用户token解密拿到用户id
     * @param type $userToken
     * @return int
     */
    public static function decodeAppId($userToken) {
        return Xxtea::decrypt($userToken);
    }

    /**
     * 生成用户token
     * @param type $uid 用户id
     * @return type 加密后的用户id
     */
    public static function encodeAppId($uid) {
        return Xxtea::encrypt($uid);
    }
}
