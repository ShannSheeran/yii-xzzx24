<?php
namespace common\model;

use Yii;

class WxUser extends \common\lib\DbOrmModel{

    public static function tableName(){
        return Yii::$app->db->parseTable('_@user_wx_infos');
    }	
}