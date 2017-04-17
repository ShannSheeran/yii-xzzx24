<?php
/**
 * Created by PhpStorm.
 * User: sheeran
 * Date: 2017/04/17/017
 * Time: 17:28
 */

namespace common\model;


use common\lib\DbOrmModel;

class Test extends DbOrmModel
{
    public static function tableName()
    {
        return Yii::$app->db->parseTable('_@rednet');
    }
    
}