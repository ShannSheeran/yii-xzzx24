<?php

namespace common\model\xmodel;

use yii\db\ActiveRecord;

class CashCountAgame extends ActiveRecord {

    /**
     * 红人所占百分比
     */
    const REDNET_CASH_PRECENT = 0.4;
    
    public static function getDb(){
        return \Yii::$app->xzzxdb;
    }
    
    public static function tableName() {
        return 'cash_count_agame';
    }
}
