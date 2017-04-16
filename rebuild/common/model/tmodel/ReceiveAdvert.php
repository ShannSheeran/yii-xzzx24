<?php

namespace common\model\tmodel;

use yii\db\ActiveRecord;

class ReceiveAdvert extends ActiveRecord {

    public static function getDb(){
        return \Yii::$app->toolsXzzxDb;
    }
    
    public static function tableName() {
        return 'receive_advert';
    }
}
