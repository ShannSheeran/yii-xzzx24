<?php

namespace common\model;

use Yii;
use bases\lib\Query;

class Register extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@register');
    }
    
    public static function update($aData = [],$aWhere = []){
    	return (new Query())->createCommand()->update(static::tableName(), $aData, $aWhere)->execute();
    }

}
