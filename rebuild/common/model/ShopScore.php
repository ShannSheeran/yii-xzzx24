<?php

namespace common\model;

use Yii;
use bases\lib\Query;

class ShopScore extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_score');
    }

}
