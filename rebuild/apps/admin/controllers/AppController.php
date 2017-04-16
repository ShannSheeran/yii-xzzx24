<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use admin\models\form\AppForm;
use common\lib\behaviors\BaseFormBehaviors;
use common\model\App;
use yii\helpers\ArrayHelper;

class AppController extends ManagerBaseController {

    /**
     * 表示不用检查权限就能访问的action
     * @var array
     */
    public static $aAllow = [];

    /**
     * 表示除了超级管理员其他用户都不能访问的action aDeny 的优先级别高于allow的优先级别
     * @var array
     */
    public static $aDeny = [];

    public function behaviors() {
        return ArrayHelper::merge(parent::behaviors(), [
                    'baseFormBehaviors' => [
                        'class' => BaseFormBehaviors::className(),
                        'dataModel' => App::className(),
                        'dataFormModel' => AppForm::className(),
                    ]
        ]);
    }

    /**
     * 在添加和就修改数据之前过滤和修改参数
     * @param array $aData
     * @param string $scene 是添加还是修改的场景
     * @return array 返回给父类处理入库操作
     */
    public function fiterParameter($aData, $scene) {
        //处理未null的值
        if ($aData['status'] == null) {
            $aData['status'] = 0;
        }
        if ($scene == AppForm::SCENE_ADD) {
            $aData['create_time'] = $aData['update_time'] = NOW_TIME;
            return $aData;
        }
        $aData['update_time'] = NOW_TIME;
        return $aData;
    }

}
