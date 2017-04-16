<?php

namespace common\model;

use Yii;
use bases\lib\Query;

class ShopPay extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_pay');
    }

}
