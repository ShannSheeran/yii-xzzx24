<?php

namespace common\lib;

use Yii;
use yii\base\InvalidCallException;
use yii\base\Model;
use yii\data\Pagination;

/**
 * 数据库form 模型
 */
abstract class FormBaseModel extends Model {

    public $page = 1;
    public $pageSize = 20;
    //默认排序
    public $order_by = []; //['create_time' => SORT_DESC];
    //排序字段
    public $sort = false;
    protected $mDataModel = null;
    
    public function __construct($mModelClassName, $config = array()) {
        $this->mDataModel = $mModelClassName;
        parent::__construct($config);
    }

    public function getList($aFeild = [], $pid = 0) {
        $aCondition = $this->getListCondition();

        $orderBy = [];
        //提供外部多个排序
        if ($this->order_by) {
            $orderBy = $this->order_by;
        }
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
            'order_by' => $orderBy,
        ];
        $aList = call_user_func_array([$this->mDataModel, 'getList'], [$aCondition, $aControl, $aFeild, $pid]);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return call_user_func_array([$this->mDataModel, 'getCount'], [$aCondition]);
    }

    /**
     * 检索条件组合
     * @return string
     */
    public function getListCondition() {
        return [];
    }

    public function getPageObject() {
        $aCondition = $this->getListCondition();
        $count = call_user_func_array([$this->mDataModel, 'getCount'], [$aCondition]);
        return new Pagination(['totalCount' => $count, 'pageSize' => $this->pageSize, 'pageSizeParam' => 'pageSize']);
    }

    /**
     * 校验输入信息是否合法
     * @param FormBaseModel $mForm  FormBaseModel的子类
     * @param type $scene 场景
     * @param type $aParams 校验的数据
     * @param type $method 如果没有数据通过什么方式获取
     * @return \common\lib\Response|boolean
     */
    public function alidateData($scene = false, $aParams = [], $method = 'get') {
        if ($scene) {
            $this->scenario = $scene;
        }
        //如果没有给定数据获取get 或者post 里面的数据
        if (!$aParams) {
            if ($method == 'get') {
                $aParams = Yii::$app->request->get();
            } else {
                $aParams = Yii::$app->request->post();
            }
        }

        if ($aParams && (!$this->load($aParams, '') || !$this->validate())) {
            return current($this->getErrors())[0];
        }
        return true;
    }

    public function getAlidateData() {
        return $this->toArray();
    }

}
