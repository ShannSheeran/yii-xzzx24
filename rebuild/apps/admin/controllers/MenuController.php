<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\helper\Category;
use bases\lib\Response;
use common\model\form\SystemsMenuForm as mForm;
use common\model\SystemsMenu as mModel;
use Yii;
use yii\helpers\ArrayHelper;

class MenuController extends ManagerBaseController {

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
    
    
    public function getDataList() {
        //使用表单模型验证输入信息
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_GET_DATA_LIST);
        if (true !== $isValidate) {
            return $isValidate;
        }
        $aList = Category::unlimitedForLevel($mForm->getList(), '&nbsp;&nbsp;├');
        $oPage = $mForm->getPageObject();
        return [
            'aDataList' => $aList,
            'oPage' => $oPage,
        ];
    }



    public function actionAdd() {
        if (!Yii::$app->request->isPost) {
            return $this->render('form', $this->getDataList());
        }
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_ADD, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $lastInsertId = mModel::insert([
                    'title' => (string) Yii::$app->request->post('title', ''),
                    'pid' => (int) Yii::$app->request->post('pid', 0),
                    'url' => (string) Yii::$app->request->post('url', ''),
                    'icon' => (string) Yii::$app->request->post('icon', ''),
                    'status' => 1,
                    'create_at' => NOW_TIME,
        ]);
        if ($lastInsertId) {
            return new Response('操作成功', 1);
        }
        return new Response('操作失败');
    }
    
    
    public function actionEditor() {
        $mModel = mModel::findOne((int) Yii::$app->request->get('id', 0));
        if (!$mModel) {
            return new Response('数据不存在');
        }
        if (!Yii::$app->request->isPost) {
            return $this->render('form', ArrayHelper::merge($this->getDataList(), ['aData' => $mModel->toArray()]));
        }
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_EDITOR, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $mModel->set('title', (string) Yii::$app->request->post('title', ''));
        $mModel->set('pid', (int) Yii::$app->request->post('pid', 0));
        $mModel->set('url', (string) Yii::$app->request->post('url', ''));
        $mModel->set('icon', (string) Yii::$app->request->post('icon', ''));
        if ($mModel->save()) {
            return new Response('操作成功', 1);
        }
        return new Response('操作失败');
    }
    
    public function actionForbid() {
        $id = (int) Yii::$app->request->post('id');
        $mModel = mModel::findOne($id);
        if (!$mModel) {
            return new Response('找不到数据', 0);
        }
        $mModel->set('status', (int) Yii::$app->request->post('value', 0));
        if (!$mModel->save()) {
            return new Response('操作失败', 0);
        }
        return new Response('操作成功', 1);
    }

    public function actionDel() {
        $id = (string) Yii::$app->request->post('id', '');
        $aId = explode(',', $id);
        if(!count($aId)){
            return new Response('数据不存在');
        }
        $nums = 0;
        foreach ($aId as $dId) {
            $mModel = mModel::findOne($dId);
            if (!$mModel) {
                continue;
            }
            if ($mModel->delete()) {
                $nums++;
            }
        }
        return new Response('本次操作成功，影响的数据有' . $nums, 1);
    }

}
