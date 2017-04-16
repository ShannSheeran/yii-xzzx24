<?php
namespace home\models;

use common\lib\DbOrmModel;
use Yii;

/**
 * Login form
 */
class SnsLog extends DbOrmModel{
    public static function tableName(){
        return Yii::$app->db->parseTable('_@sms_log');
    }
}
