<?php

namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class WechatConfig extends DbOrmModel {
    public static function tableName() {
        return Yii::$app->db->parseTable('_@wechat_config');
    }
}
