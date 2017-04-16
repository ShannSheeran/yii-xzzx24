<?php

namespace common\lib\behaviors;

use bases\lib\ArrayFilter;
use bases\lib\Response;
use Yii;
use yii\base\Behavior;
use yii\base\InvalidCallException;

/**
 * 模型扩展类行为
 */
class BaseFormBehaviors extends Behavior {

    public $dataModel;
    public $dataFormModel;

    /**
     * 子类必须重写该方法
     */
    public function getDataList() {
        //使用表单模型验证输入信息
        $mForm = new $this->dataFormModel($this->dataModel);
        $formModelclassNameSpace = $this->dataFormModel;
        $isValidate = $mForm->alidateData($formModelclassNameSpace::SCENE_GET_DATA_LIST);
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
    public function add() {
        $oChilderClass = $this->owner;
        if (!Yii::$app->request->isPost) {
            return $oChilderClass->render('form', $this->getDataList());
        }
        $mForm = new $this->dataFormModel($this->dataModel);
        $formModelclassNameSpace = $this->dataFormModel;
        $isValidate = $mForm->alidateData($formModelclassNameSpace::SCENE_ADD, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }

        $dataModelClassNameSpace = $this->dataModel;
        $aOldData = $this->_fiterData($mForm->getAttributes(), $formModelclassNameSpace::SCENE_ADD);
        //构建输入数据
        $aInsertData = $oChilderClass->hasMethod('fiterParameter') ? $oChilderClass->fiterParameter($aOldData, $formModelclassNameSpace::SCENE_ADD) : $aOldData;
        //构建输入数据
        $lastInsertId = $dataModelClassNameSpace::insert($aInsertData);
        if ($lastInsertId) {
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
    }

    /**
     * 编辑
     */
    public function editor() {
        $dataModelClassNameSpace = $this->dataModel;
        $mModel = $dataModelClassNameSpace::findOne((int) Yii::$app->request->get('id', 0));
        if (!$mModel) {
            return new Response('数据不存在');
        }
        $oChilderClass = $this->owner;
        if (!Yii::$app->request->isPost) {
            return $oChilderClass->render('form', ['aData' => $mModel->toArray()]);
        }
        $formModelclassNameSpace = $this->dataFormModel;
        $mForm = new $formModelclassNameSpace($dataModelClassNameSpace);
        $isValidate = $mForm->alidateData($formModelclassNameSpace::SCENE_EDITOR, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $aOldData = $this->_fiterData($mForm->getAttributes(), $formModelclassNameSpace::SCENE_EDITOR);

        //构建输入数据
        $aSaveData = $oChilderClass->hasMethod('fiterParameter') ? $oChilderClass->fiterParameter($aOldData, $formModelclassNameSpace::SCENE_EDITOR) : $aOldData;
        foreach ($aSaveData as $key => $val) {
            $mModel->hasProperty($key) && $mModel->set($key, $val);
        }
        if ($mModel->save()) {
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
    }
    
    /**
     * 数据字段更新集成处理
     * @param type $table	数据表名
     * @param type $pkey 数据表查询条件字段
     * @param type $aAllowFields 允许修改的字段
     * @return type
     */
    public function update($table = '', $pkey = 'id', $aAllowFields = ['deleted', 'status', 'is_deleted', 'examine_status', 'is_black']) {
        $dataModelClassNameSpace = $table ? $table::className() : $this->dataModel;
        $xIds = (string) Yii::$app->request->post($pkey, '');
        $field = (string) Yii::$app->request->post('field', '');
        $value = (string) Yii::$app->request->post('value', '');
        if (!$xIds) {
            return new Response('没有需要操作的数据！');
        }
        if (!in_array($field, $aAllowFields)) {
            return new Response('不能操作安全规则以外的数据！');
        }
        $aIds = explode(',', $xIds);
        $aDataList = $dataModelClassNameSpace::findAll(['in', $pkey, $aIds], [$pkey]);
        if (!$aDataList) {
            return new Response('数据不存在或者已经被删除！');
        }
        //删除
        if ('deleted' == $field) {
            return $dataModelClassNameSpace::deleteAll(['in', $pkey, $aIds]);
        }
        //更新
        return $dataModelClassNameSpace::saveAll(['in', $pkey, $aIds], [$field => $value]);
    }

    public function init() {
        parent::init();
        if (!class_exists($this->dataModel)) {
            throw new InvalidCallException('表模型不存在,该处理模型必须继承common\model\DbOrmModel 模型');
        }
        if (!class_exists($this->dataFormModel)) {
            throw new InvalidCallException('表单模型不存在,该处理模型必须继承model');
        }
    }

    /**
     * 过滤掉干扰字段
     * @param type $aInputData
     * @param type $scene
     * @return type
     */
    public function _fiterData($aInputData, $scene) {
        $aFiterData = ['page', 'pageSize', 'order_by', 'sort', 'sort_order'];
        $formModelclassNameSpace = $this->dataFormModel;
        foreach ($aInputData as $k => $val) {
            if (in_array($k, $aFiterData) || (($scene == $formModelclassNameSpace::SCENE_ADD) && $k == 'id')) {
                unset($aInputData[$k]);
            }
        }
        //这里不能用isset 因为isset 会吧 值为null的认定为false
        if (array_key_exists('id', $aInputData) && $aInputData['id'] == null && $scene == $formModelclassNameSpace::SCENE_EDITOR) {
            $aInputData['id'] = (int) Yii::$app->request->get('id', 0);
        }
        return $aInputData;
    }

}
