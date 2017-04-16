<?php

namespace admin\controllers;

use Yii;
use admin\lib\ManagerController;
use bases\lib\Response;
use common\model\form\ImageUploadForm;
use yii\web\UploadedFile;
use common\model\Member;
use bases\lib\EasyResponse;
use common\model\form\MemberForm;
use bases\helper\Category as CategoryTool;
use common\model\Agent;

/**
 * 分类控制器
 */
class MemberController extends ManagerController {



    /**
     * 显示用户列表视图
     */
    public function actionShowMember() {
        return $this->render('show_member_list');
    }

    /**
     * 显示用户详细信息视图
     */
    public function actionShowMemberDetail() {
        $oRequest = Yii::$app->request;
        $id = (int) $oRequest->get('id',0);
        if(!$id){
            return new Response('用户不存在');
        }
        $mMember = Member::getListDetail($id);
        if(!$mMember){
            Yii::$app->response->format = Response::FORMAT_HTML;
            return '该用户没用更多信息';
        }
        $mMember['sex'] = Member::getSexNameByValue($mMember['sex']);
        $mMember['subscribe_time'] = date('Y-m-d H:i:s', $mMember['subscribe_time']);
        return $this->render('show_member_detail', ['aData' => $mMember, 'id' => $id]);
    }

    /**
     * 获取用户列表数据
     */
    public function actionGetMemberList() {
        //使用表单模型验证输入信息
        $mMemberForm = new MemberForm();
        $aParams = Yii::$app->request->post();
        $mMemberForm->scenario = MemberForm::SCENE_GET_MEMBER;
        if ($aParams && (!$mMemberForm->load($aParams, '') || !$mMemberForm->validate())) {
            return new Response(current($mAgentForm->getErrors())[0]);
        }
        $aMemberList = $mMemberForm->getList();
        return new EasyResponse('获取用户信息成功', 1, ['total' => 10, 'rows' => $aMemberList], EasyResponse::EASY_RESPONSE_DATA_TYPE_COMBOBOX);
    }

    /**
     * 处理编辑用户action
     */
    public function actionEditorMember() {
        $oRequest = Yii::$app->request;
        //展示表单
        if (!$oRequest->isPost) {
            $this->layout = false;
            $id = (int) $oRequest->get('id');
            $mMember = Member::findOne($id);
            if(!$mMember){
               return new Response('用户不存在');
            }
            $mAgentCategory = Agent::findOne($mMember->category_id);
            $mMember['category_name'] = Member::MEMBER_LEVEL_NORMAL;
            if($mAgentCategory){
               $mMember['category_name'] = $mAgentCategory->name;
            }
            return $this->render('opt_member', ['aData' => $mMember->toArray()]);
        }
        //数据校验操作
//        $isSuccess = $this->_alidateData();
//        if($isSuccess !== true){
//            return $isSuccess;
//        }

        $user_name = $oRequest->post('user_name');
        $mobile = $oRequest->post('mobile');
        $email = $oRequest->post('email');
        $money = $oRequest->post('money');
        $score = $oRequest->post('score');
        $category_id = $oRequest->post('category_name');
        $mMember = Member::findOne((int) $oRequest->post('id'));
        if (!$mMember) {
            return new Response('用户不存在');
        }
        $mMember->set('user_name', $user_name);
        $mMember->set('mobile', $mobile);
        $mMember->set('email', $email);
        $mMember->set('money', $money);
        $mMember->set('score', $score);
        $mMember->set('category_id', $category_id);
        $mMember->set('update_time', NOW_TIME);
        if ($mMember->save()) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败', 1);
    }

    /**
     * 删除
     */
    public function actionDelete() {
        $id = (int) Yii::$app->request->post('id');
        $mMember = Member::findOne($id);
        if (!$mMember) {
            return new Response('找不到用户信息', 0);
        }
        if (!$mMember->delete()) {
            return new Response('删除失败', 0);
        }
        return new Response('删除成功', 1);
    }

    public function actionGetComboboxList() {
        $aAgentList = Agent::findAll(null, ['id', 'name as text']);
        array_unshift($aAgentList, ['id' => 0, 'text' => Member::MEMBER_LEVEL_NORMAL]);
        return new EasyResponse('combobox', 1, $aAgentList, EasyResponse::EASY_RESPONSE_DATA_TYPE_COMBOBOX);
    }

}
