<?php

namespace admin\models;

use Yii;
use bases\lib\Query;

class OrderColor extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@order_color');
    }
    
    public static function select_one($aWhere = [],$aField = '*'){
        $oQuery = new Query();
        $oQuery->from(static::tableName())
        ->select($aField)
        ->where($aWhere);
         
        $rows = $oQuery->one();
        return $rows;
    }
    
    public static function select_all($aWhere = [],$value = '*'){
        $oQuery = new Query();
        $oQuery->from(static::tableName())
        ->select($value)
        ->where($aWhere);
         
        $rows = $oQuery->all();
        return $rows;
    }
    
    public static function update($aData = [],$aWhere = []){
    	return (new Query())->createCommand()->update(static::tableName(), $aData, $aWhere)->execute();
    }

}
