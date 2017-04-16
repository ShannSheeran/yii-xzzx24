<?php
namespace common\model;

use bases\lib\Query;
use common\lib\DbOrmModel;
use Yii;

/**
 * Login form
 */
class AdRecommendedCode extends DbOrmModel{
    public static function tableName(){
        return Yii::$app->db->parseTable('_@ad_recommended_code');
    }
}
