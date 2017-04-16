<?php

namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class Advert extends DbOrmModel {

    public static $_aSoftDelete = ['is_deleted', 1];

    public static function tableName() {
        return Yii::$app->db->parseTable('_@advert');
    }

    public static function getSelectAdvertDataList() {
        $aList = static::findAll();
        $aDataList = [];
        foreach ($aList as $aData) {
            $aDataList[] = [$aData['title'], $aData['id']];
        }
        return $aDataList;
    }

}
