<?php

namespace {__NAME_SPACE}\controllers;

use {__NAME_SPACE}\models\form\{__MFORMNAME__}Form as mForm;
use bases\lib\Response;
use common\model\{__MMODEL_NAME__} as mModel;
use Yii;
use yii\helpers\ArrayHelper;

class {__CONTORLLER_NAME__}Controller extends {__CONTORLLER_PARENT} {

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

    /**
     * 提供数据和分页器
     */
    public function getDataList() {
        //使用表单模型验证输入信息
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_GET_DATA_LIST);
        if (true !== $isValidate) {
            return $isValidate;
        }
        $oPage = $mForm->getPageObject();
        return [
            'aDataList' => $mForm->getList(),
            'oPage' => $oPage,
        ];
    }

    /**
     * 添加数据
     */
    public function actionAdd() {
        if (!Yii::$app->request->isPost) {
            return $this->render('form', $this->getDataList());
        }
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_ADD, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $lastInsertId = mModel::insert(ArrayHelper::merge($this->_getParameter(), []));
        if ($lastInsertId) {
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
    }
    
    private function _getParameter(){
        $oRequest = Yii::$app->request;
        return [
            {__SEARCH_PARAMETER__}
        ];
    }

    /**
     * 编辑
     */
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
        $aSaveData = $this->_getParameter();
        foreach($aSaveData as $field => $xVale){
            $mModel->hasProperty($field) && $mModel->set($field,$xVale);
        }
        if ($mModel->save()) {
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
    }

    /**
     * 更新修改（支持批量）
     */
    public function actionUpate() {
        $id = (string) Yii::$app->request->post('id', '');
        $aId = explode(',', $id);
        if (!count($aId)) {
            return new Response('数据不存在');
        }
        $field = (string) Yii::$app->request->post('field', 0);
        $val = (int) Yii::$app->request->post('value', 0);
        $count = mModel::saveAll(['in', 'id', $aId], [$field => $val]);
        if (!$count) {
            return new Response('操作失败', 0);
        }
        return new Response('操作成功', 1);
    }

    /**
     * 删除（支持批量）
     */
    public function actionDel() {
        $id = (string) Yii::$app->request->post('id', '');
        $aId = explode(',', $id);
        if (!count($aId)) {
            return new Response('数据不存在');
        }
        $nums = mModel::deleteAll(['in', 'id', $aId]);
        return new Response('本次操作成功，影响的数据有' . $nums, 1);
    }

}
