<?php

namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class {__MMODEL_NAME__} extends DbOrmModel {
    public static $_aSoftDelete = [];
    public static function tableName() {
        return Yii::$app->db->parseTable('_@{___TABEL_NAMW__}');
    }
}
