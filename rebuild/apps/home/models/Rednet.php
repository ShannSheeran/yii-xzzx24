<?php
namespace home\models;

use bases\lib\Query;
use common\lib\DbOrmModel;
use Yii;

/**
 * Login form
 */
class Rednet extends DbOrmModel{
    public static function tableName(){
        return Yii::$app->db->parseTable('_@rednet');
    }
}
