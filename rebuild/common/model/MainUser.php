<?php
namespace common\model;

use Yii;

class MainUser extends \common\lib\DbOrmModel{

    public static function tableName(){
        return Yii::$app->db->parseTable('_@users');
    }	
}