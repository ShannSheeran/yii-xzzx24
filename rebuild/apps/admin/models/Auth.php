<?php

namespace admin\models;

use bases\lib\Query;
use common\lib\DbOrmModel;
use Yii;
use yii\helpers\Json;

class Auth extends DbOrmModel {
    
    const GROUP_STORY = 2;

    public static function tableName() {
        return Yii::$app->db->parseTable('_@manager');
    }

    public static function tableGroupName() {
        return Yii::$app->db->parseTable('_@sy_auth_group');
    }

    public static function tableGroupAcessName() {
        return Yii::$app->db->parseTable('_@sy_auth_group_access');
    }

    public static function tableRuleName() {
        return Yii::$app->db->parseTable('_@sy_auth_rule');
    }

    public static function countUser($aCondition) {
        $aWhere = self::_parseWhereForUserList($aCondition);
        return (new Query())->from(static::tableName())->where($aWhere)->count();
    }

    public static function getUserList($aCondition, $aControl) {
        $aWhere = self::_parseWhereForUserList($aCondition);
        $oQuery = new Query();
        if (isset($aControl['select'])) {
            $oQuery->select($aControl['select']);
        }
        $oQuery->from(self::tableName())->where($aWhere);
        if (isset($aControl['order'])) {
            $oQuery->orderBy($aControl['order']);
        }
        $offset = ($aControl['page'] - 1) * $aControl['page_size'];
        $aUserList = $oQuery->offset($offset)->limit($aControl['page_size'])->all();
        if (!$aUserList) {
            return [];
        }
        return $aUserList;
    }

    public static function getGroupList() {
        return (new Query())->from(static::tableGroupName())->select(['id', 'title'])->all();
    }

    public static function addUser($aData) {
        (new Query())->createCommand()->insert(self::tableName(), $aData)->execute();
        return Yii::$app->db->getLastInsertID();
    }

    public static function saveUser($aData, $aWhere) {
        return (new Query())->createCommand()->update(self::tableName(), $aData, $aWhere)->execute();
    }

    public static function delUserAccessByUId($uid) {
        //由于id用于redis 一系列操作，如果表字段没有id update 和delete建议使用sql操作
        return Yii::$app->db->createCommand('DELETE FROM ' . static::tableGroupAcessName() . ' WHERE uid=' . $uid)->execute();
        //return (new Query())->createCommand()->delete(static::tableGroupAcessName(), $aWhere)->execute();
    }

    public static function delUser($aWhere) {
        $result = (new Query())->createCommand()->delete(static::tableName(), $aWhere)->execute();
        if ($result) {
            Yii::info(Yii::$app->manager->id . '删除用:' . Json::encode(Yii::$app->db->getLastSqls(1)));
        }
        return $result;
    }

    public static function addGroupAccess($aData) {
        return Yii::$app->db->createCommand()->batchInsert(static::tableGroupAcessName(), ['uid', 'group_id'], $aData)->execute();
    }

    public static function checkUserNameExist($name) {
        return (new Query())->from(static::tableName())->where(['user_name' => $name])->exists();
    }

    public static function getUserData($uid, $aFeild = []) {
        return (new Query())->from(static::tableName())->where(['id' => $uid])->select($aFeild)->one();
    }

    public static function getGroupAccessList($aCondition, $aFeild) {
        return (new Query())->from(static::tableGroupAcessName())->where($aCondition)->select($aFeild)->all();
    }

    public static function getGroupsList($aCondition, $aControl) {
        $aWhere = self::_parseWhereForGroupsList($aCondition);
        $oQuery = new Query();
        if (isset($aControl['select'])) {
            $oQuery->select($aControl['select']);
        }
        $oQuery->from(self::tableGroupName())->where($aWhere);
        if (isset($aControl['order'])) {
            $oQuery->orderBy($aControl['order']);
        }
        $offset = ($aControl['page'] - 1) * $aControl['page_size'];
        $aUserList = $oQuery->offset($offset)->limit($aControl['page_size'])->all();
        if (!$aUserList) {
            return [];
        }
        return $aUserList;
    }

    public static function countGroups($aCondition) {
        $aWhere = self::_parseWhereForGroupsList($aCondition);
        return (new Query())->from(static::tableGroupName())->where($aWhere)->count();
    }

    public static function checkGroupsNameExist($name) {
        return (new Query())->from(static::tableGroupName())->where(['title' => $name])->exists();
    }

    public static function addGroups($aData) {
        (new Query())->createCommand()->insert(self::tableGroupName(), $aData)->execute();
        return Yii::$app->db->getLastInsertID();
    }

    public static function getGroupsData($aWhere = [], $aFeild = []) {
        return (new Query())->from(static::tableGroupName())->where($aWhere)->select($aFeild)->one();
    }

    public static function saveGroups($aData, $aWhere) {
        return (new Query())->createCommand()->update(self::tableGroupName(), $aData, $aWhere)->execute();
    }

    public static function delGroups($aWhere) {
        $result = (new Query())->createCommand()->delete(static::tableGroupName(), $aWhere)->execute();
        if ($result) {
            Yii::info(Yii::$app->manager->id . '删除分组:' . Json::encode(Yii::$app->db->getLastSqls(1)));
        }
        return $result;
    }

    public static function checkGroupsHaveUser($aWhere) {
        return (new Query())->from(static::tableGroupAcessName())->where($aWhere)->exists();
    }

    public static function saveAuthGroup($aData, $aWhere) {
        return (new Query())->createCommand()->update(self::tableGroupName(), $aData, $aWhere)->execute();
    }

    public static function checkRuleNameExist($name) {
        return (new Query())->from(static::tableRuleName())->where(['name' => $name])->exists();
    }

    public static function getAuthRule($aCondition, $aFeild) {
        return (new Query())->from(static::tableRuleName())->where($aCondition)->select($aFeild)->all();
    }
    
    public static function getNodeList($aCondition, $aControl) {
        $aWhere = self::_parseWhereForNodeList($aCondition);
        $oQuery = new Query();
        if (isset($aControl['select'])) {
            $oQuery->select($aControl['select']);
        }
        $oQuery->from(self::tableRuleName())->where($aWhere);
        if (isset($aControl['order'])) {
            $oQuery->orderBy($aControl['order']);
        }
        $offset = ($aControl['page'] - 1) * $aControl['page_size'];
        $aUserList = $oQuery->offset($offset)->limit($aControl['page_size'])->all();
        if (!$aUserList) {
            return [];
        }
        return $aUserList;
    }
     public static function countNodes($aCondition) {
        $aWhere = self::_parseWhereForNodeList($aCondition);
        return (new Query())->from(static::tableRuleName())->where($aWhere)->count();
    }


    public static function getAuthRuleData($aWhere = [], $aFeild = []) {
        return (new Query())->from(static::tableRuleName())->where($aWhere)->select($aFeild)->one();
    }

    public static function addRules($aData) {
        (new Query())->createCommand()->insert(self::tableRuleName(), $aData)->execute();
        return Yii::$app->db->getLastInsertID();
    }

    public static function saveRules($aData, $aWhere) {
        return (new Query())->createCommand()->update(self::tableRuleName(), $aData, $aWhere)->execute();
    }

    public static function delNodes($aWhere) {
        $result = (new Query())->createCommand()->delete(static::tableRuleName(), $aWhere)->execute();
        if ($result) {
            Yii::info(Yii::$app->manager->id . '删除:' . Json::encode(Yii::$app->db->getLastSqls(1)));
        }
        return $result;
    }

    private static function _parseWhereForUserList($aCondition) {
        $aWhere = ['and'];
        if (isset($aCondition['email'])) {
            $aWhere[] = ['like','email',$aCondition['email']];
        }
        if (isset($aCondition['mobile'])) {
            $aWhere[] = ['like','mobile',$aCondition['mobile']];
        }
        if (isset($aCondition['user_name'])) {
            $aWhere[] = ['like','user_name',$aCondition['user_name']];
        }
        if (isset($aCondition['name'])) {
            $aWhere[] = ['like','name',$aCondition['name']];
        }

        return $aWhere;
    }

    private static function _parseWhereForGroupsList($aCondition) {
        $aWhere = ['and'];
        if (isset($aCondition['id'])) {
            $aWhere[] = ['id' => $aCondition['id']];
        }

        return $aWhere;
    }
    private static function _parseWhereForNodeList($aCondition) {
        $aWhere = ['and'];
        if (isset($aCondition['id'])) {
            $aWhere[] = ['id' => $aCondition['id']];
        }

        return $aWhere;
    }

    public static function getCount($aCondition = []) {
        $aWhere = self::_parseWhereCondition($aCondition);
        return (new Query())->from(self::tableName())->where($aWhere)->count();
    }

    private static function _parseWhereCondition($aCondition = []) {
        $aWhere = ['and'];
        if (isset($aCondition['id'])) {
            $aWhere[] = ['id' => $aCondition['id']];
        }
        if ($aCondition) {
            $aWhere[] = $aCondition;
            // $aWhere =  \yii\helpers\ArrayHelper::merge($aWhere, $aCondition);
        }

        return $aWhere;
    }
    
    public static function createPassWord($password){
        return md5($password);        
    }

}
