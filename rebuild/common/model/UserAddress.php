<?php

namespace common\model;

use Yii;
use bases\lib\Query;

class UserAddress extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_user_address');
    }
    

    public static function getList($aCondition = [], $aControl = []) {
        $aWhere = self::_parseWhereCondition($aCondition);
        $oQuery = new Query();
        $oQuery->from(static::tableName())->where($aWhere);
//        $command = (new \yii\db\Query())
//            ->select('*')
//            ->from('agent_category')
//            ->where($aCondition)
//            ->limit(10)
//            ->createCommand();

        // show the SQL statement
        //echo $command->sql;exit;
        if (isset($aControl['order_by'])) {
            $oQuery->orderBy($aControl['order_by']);
        }
        if (isset($aControl['page']) && isset($aControl['page_size'])) {
            $offset = ($aControl['page'] - 1) * $aControl['page_size'];
            $oQuery->offset($offset)->limit($aControl['page_size']);
        }
        $aList = $oQuery->all();
        return $aList;
    }

    public static function getCount($aCondition = []) {
        $aWhere = self::_parseWhereCondition($aCondition);
        return (new Query())->from(self::tableName())->where($aWhere)->count();
    }

    private static function _parseWhereCondition($aCondition = []) {
        $aWhere = [];
        if($aCondition){
           $aWhere =  \yii\helpers\ArrayHelper::merge($aWhere, $aCondition);
        }
        return $aWhere;
    }

}
