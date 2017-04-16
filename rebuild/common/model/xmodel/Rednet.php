<?php

namespace common\model\xmodel;

use yii\db\ActiveRecord;

class Rednet extends ActiveRecord {

    public static function getDb(){
        return \Yii::$app->xzzxdb;
    }
}
