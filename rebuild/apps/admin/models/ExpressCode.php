<?php

namespace admin\models;

use Yii;
use bases\lib\Query;

class ExpressCode extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_express_company_code');
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
    
    public static function getList($aCondition = [], $aControl = []) {
    
        $oQuery = new Query();
        $oQuery->from(static::tableName())->where($aCondition);
    
        if (isset($aControl['order_by'])) {
            $oQuery->orderBy($aControl['order_by']);
        }
    
        $aList = $oQuery->all();
        return $aList;
    }
    
    public static function getCount($aCondition = []) {
        return (new Query())->from(self::tableName())->where($aCondition)->count();
    }


    public static function Combobox($condition=[],$value = null) {
        $oQuery = new Query();
        $oQuery->from(static::tableName())->select($condition);

        $oQuery->where(['status' => 1]);

        if($value != null){
            $oQuery->groupBy($value);
        }

        $rows = $oQuery->all();
        return $rows;
    }

    public static function update($aData = [],$aWhere = []){
        return (new Query())->createCommand()->update(static::tableName(), $aData, $aWhere)->execute();
    }
    
    public static function insert($aData = []){
        return (new Query())->createCommand()->insert(static::tableName(), $aData)->execute();
    }

    public static function delete_data($aWhere = []) {
        $oQuery = new Query();
        return $command = $oQuery
        ->createCommand()
        ->delete(static::tableName(),$aWhere)
        ->execute();
    }
}
