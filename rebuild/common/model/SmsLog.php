<?php

namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class SmsLog extends DbOrmModel {
    public static $_aSoftDelete = [];
    public static function tableName() {
        return Yii::$app->db->parseTable('_@sms_log');
    }
}
