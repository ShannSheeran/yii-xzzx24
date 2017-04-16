<?php

namespace common\model;

use Yii;
use yii\helpers\ArrayHelper;

class Consumption extends \common\lib\DbOrmModel {
    
    public static $aOptFeild = [
        'status' => [0, 1, 2, 3],
    ];

    /**
     * 待审核
     */
    const STATUS_CHECK_WAIT = 0;
    
    /**
     * 已经审核
     */
    const STATUS_CHECK_END = 1;
    
    /**
     * 无效
     */
    const STATUS_INVALID = 3;
    
    const EVENT_AFTER_STATUS_CHECK_END = 'afterCheckStatusEnd';

    public static function tableName() {
        return Yii::$app->db->parseTable('_@ad_consumption');
    }

    public static function parseWhereCondition($aCondition = []) {
        return $aCondition;
    }

}
