<?php
/**
 * Created by PhpStorm.
 * User: sheeran
 * Date: 2017/04/17/017
 * Time: 14:29
 */

namespace admin\controllers;


use admin\lib\ManagerBaseController;
use admin\models\form\TestForm;
use common\model\Test;


class TestController extends ManagerBaseController
{
    public function actionIndex()
    {
        $mForm = new TestForm(Test::className());
        $oPage = $mForm->getPageObject();
        $list  = $mForm->getList();
        print_r($mForm);die;
        return $this->render('index', ['page'=>$oPage, 'list'=>$list]);
    }

    public function actionAdd()
    {
        return $this->render('add', []);
    }

    public function actionDel()
    {
        return $this->render('del', []);
    }

    public function actionEditor()
    {
        return $this->render('editor', []);
    }
}