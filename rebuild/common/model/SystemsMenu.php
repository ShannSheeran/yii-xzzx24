<?php
namespace common\model;

use Yii;

class SystemsMenu extends \common\lib\DbOrmModel{

    public static function tableName(){
        return Yii::$app->db->parseTable('_@system_menu');
    }	
}