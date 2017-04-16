<?php

namespace common\model;

use Yii;
use bases\lib\Query;

class ShopSetting extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_setting');
    }

}
