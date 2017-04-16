<?php

namespace common\model;

use bases\lib\Query;
use common\lib\DbOrmModel;
use Yii;
use yii\helpers\ArrayHelper;

class Ad extends DbOrmModel {
    
    public static function getTess($xData){
        //$args = func_get_args();
        return [
            ['--结算状态--',''],
            ['已结算',1],
            ['未结算',2],
        ];
    }

    public static function tableName() {
        return Yii::$app->db->parseTable('_@advertisement');
    }

    public static function getList($aCondition = [], $aControl = [], $aFeild = [], $pid = 0) {
        $aWhere = self::_parseWhereCondition($aCondition);
        $oQuery = new Query();
        $oQuery->from(static::tableName())->select($aFeild)->where($aWhere);
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
        if ($aCondition) {
            $aWhere = ArrayHelper::merge($aWhere, $aCondition);
        }
        return $aWhere;
    }

}
