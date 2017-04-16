<?php

namespace api\models;

use Yii;
use bases\lib\Query;

class VisitRecord extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@visit_record');
    }
}
