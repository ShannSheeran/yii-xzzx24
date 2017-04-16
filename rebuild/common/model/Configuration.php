<?php

namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class Configuration extends DbOrmModel {

    public static $aConfigList = [];
    public static function tableName() {
        return Yii::$app->db->parseTable('_@system_config');
    }
    
    public static function getConfigValue($key) {
        $value = '';
        $aConfigData = static::getConfig();
        foreach ($aConfigData as $k => $aValue) {
            if($aValue['code'] == $key){
                $value = $aValue['value'];
                break;
            }
        }
        return $value;
    }
    
    public static function getConfig() {
        if (static::$aConfigList) {
            return static::$aConfigList;
        }
        static::$aConfigList = static::findAll();
        return static::$aConfigList;
    }
    
    public static function saveByCode($code, $value) {
        $mData = static::findOne(['code' => $code]);
        if (!$mData) {
            return false;
        }
        $mData->set('value', $value);
        return $mData->save();
    }

}
