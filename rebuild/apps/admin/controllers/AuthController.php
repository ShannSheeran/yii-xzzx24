<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use admin\models\Auth as mAuth;
use bases\helper\Category;
use bases\lib\Response;
use common\model\Manager;
use Yii;
use yii\data\Pagination;
use yii\helpers\ArrayHelper;

class AuthController extends ManagerBaseController {

    public function actionAddUser() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $aGourpList = mAuth::getGroupList();
            return $this->render('user_form', ['aGourpList' => $aGourpList]);
        }

        $aGroupId = (array) $oRequest->post('role_ids', []);
        if (!$aGroupId) {
            return new Response('请选择分组');
        }

        $aData['name'] = (string) $oRequest->post('name', '');
        $aData['email'] = (string) $oRequest->post('email', '');
        $aData['password'] = mAuth::createPassWord($oRequest->post('password'));
        $aData['create_time'] = $aData['update_time'] = NOW_TIME;
        $aData['mobile'] = (string) $oRequest->post('mobile');
        $aData['user_name'] = (string) $oRequest->post('user_name', '');
        //$aData['reg_ip'] = $oRequest->getUserHostAddress();
        if (mAuth::checkUserNameExist($aData['user_name'])) {
            return new Response('用户已存在');
        }
        $lastInserId = mAuth::addUser($aData);
        if (!$lastInserId) {
            return new Response('添加失败');
        }
        $aUserAndGroupData = [];
        foreach ($aGroupId as $groupId) {
            $aUserAndGroupData[] = [
                'uid' => $lastInserId,
                'group_id' => $groupId,
            ];
        }
        if (mAuth::addGroupAccess($aUserAndGroupData)) {
            return new Response('添加成功', 1, ['uid' => $lastInserId]);
        }
        return new Response('添加失败');
    }

    public function actionEditorUser() {
        $uid = (int) Yii::$app->request->get('id', 0);
        if (!$uid) {
            return new Response('非法操作');
        }
        $mManagerUser = Manager::findOne($uid);
        if (!$mManagerUser) {
            return new Response('用户不存在', 1, [], 'back');
        }
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $aGourpList = mAuth::getGroupList();
            $aUserGroup = Yii::$app->rbacAuth->getGroups($mManagerUser['id']);
            return $this->render('user_form', ['aGourpList' => $aGourpList, 'aUserInfo' => $mManagerUser, 'aUserGroups' => ArrayHelper::getColumn($aUserGroup, 'group_id')]);
        }

        $aGroupId = (array) $oRequest->post('role_ids', []);
        if (!$aGroupId) {
            return new Response('请选择角色');
        }

        $name = (string) $oRequest->post('name', '');
        $email = (string) $oRequest->post('email', '');
        $password = (string) $oRequest->post('password', '');
        $mobile = (string) $oRequest->post('mobile');
        $userName = (string) $oRequest->post('user_name', '');
        if ($userName != $mManagerUser->user_name && mAuth::checkUserNameExist($userName)) {
            return new Response('用户已存在');
        }
        $mManagerUser->set('name', $name);
        $mManagerUser->set('email', $email);
        if ($password) {
            $mManagerUser->set('password', mAuth::createPassWord($password));
        }
        $mManagerUser->set('update_time', NOW_TIME);
        $mManagerUser->set('mobile', $mobile);
        $mManagerUser->set('user_name', $userName);

        if (!$mManagerUser->save()) {
            return new Response('修改失败');
        }
        //删除所有该用户的分组
        if (!mAuth::delUserAccessByUId($mManagerUser->id)) {
            Yii::error('修改用户组删除现有用户的角色失败');
        }
        $aUserAndGroupData = [];
        foreach ($aGroupId as $groupId) {
            $aUserAndGroupData[] = [
                'uid' => $mManagerUser->id,
                'group_id' => $groupId,
            ];
        }
        if (mAuth::addGroupAccess($aUserAndGroupData)) {
            return new Response('修改成功', 1, ['uid' => $mManagerUser->id]);
        }
        return new Response('修改失败');
    }
    
    public function actionUserForbid() {
        $oRequest = Yii::$app->request;
        $gid = (string) $oRequest->post('id', '');
        if (!$gid) {
            return new Response('非法操作');
        }
        $aId = explode(',', $gid);
        if (!count($aId)) {
            return new Response('数据不存在');
        }

        foreach ($aId as $uid) {
            $mUser = Manager::findOne($uid);
            if (!$mUser || $mUser->id == Yii::$app->rbacAuth->AUTH_CONFIG['ADMINISTRATOR']) {
                continue;
            }
            $mUser->set('status', (int) $oRequest->post('value', 1));
            if (!$mUser->save()) {
                Yii::error('启用或者禁用用户操作失败');
            }
        }
        return new Response('操作成功', 1);
    }
    
    public function actionDelUser() {
        $oRequest = Yii::$app->request;
        $gid = (string) $oRequest->post('id', '');
        if (!$gid) {
            return new Response('非法操作');
        }
        $aId = explode(',', $gid);
        if (!count($aId)) {
            return new Response('数据不存在');
        }

        foreach ($aId as $uid) {
            $mUser = Manager::findOne($uid);
            if (!$mUser || $mUser->id == Yii::$app->rbacAuth->AUTH_CONFIG['ADMINISTRATOR']) {
                continue;
            }
            if (!$mUser->delete()) {
                Yii::info('删除用户成功');
            }
        }
        return new Response('操作成功', 1);
    }

    public function actionShowUser() {
        $request = Yii::$app->request;
        $page = (int) $request->get('page', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $userName = (string) $request->get('user_name', '');
        $email = (string) $request->get('email', '');
        $mobile = (string) $request->get('mobile', '');
        $name = (string) $request->get('name', '');
        $aCondition = [];
        $userName && $aCondition['user_name'] = $userName;
        $email && $aCondition['email'] = $email;
        $mobile && $aCondition['mobile'] = $mobile;
        $name && $aCondition['name'] = $name;
        $aUserList = mAuth::getUserList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
        foreach ($aUserList as $key => $aUser) {
            unset($aUserList[$key]['password']);
            $aGroups = array();
            $aUserAndGoups = Yii::$app->rbacAuth->getGroups($aUser['id']);
            foreach ($aUserAndGoups as $aTemp) {
                $aGroups[] = $aTemp['title'];
            }
            unset($aUserAndGoups);
            $aUserList[$key]['group'] = $aGroups;
        }

        return $this->render('show_user', [
                    'aDataList' => $aUserList,
                    'oPage' => $this->getPageObeject(mAuth::countUser($aCondition), $pageSize),
        ]);
    }

    public static function getGroupList() {
        $aGourpList = mAuth::getGroupList();
        $aSelectData = [['所属角色', '']];
        foreach ($aGourpList as $aItem) {
            $aSelectData[] = [$aItem['title'], $aItem['id']];
        }
        return $aSelectData;
    }

    public function actionShowGroups() {
        $request = Yii::$app->request;
        $page = (int) $request->get('page', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $aCondition = [];
        $aGroupsList = mAuth::getGroupsList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
        return $this->render('groups_list', [
                    'aDataList' => $aGroupsList,
                    'oPage' => $this->getPageObeject(mAuth::countGroups($aCondition), $pageSize),
        ]);
    }

    public function actionAddRole() {
        $oRequest = Yii::$app->request;
        $name = (string) $oRequest->post('name', '');
        if (!$name) {
            return new Response('角色名称不能为空');
        }
        if (mAuth::checkGroupsNameExist($name)) {
            return new Response('角色已经存在');
        }
        $aData['title'] = $name;
        $aData['status'] = (int) $oRequest->post('status', 1);
        $aData['create_time'] = NOW_TIME;
        if (mAuth::addGroups($aData)) {
            return new Response('添加成功', 1);
        }
        return new Response('添加失败');
    }

    public function actionRoleEditor() {
        $oRequest = Yii::$app->request;
        $gid = (int) $oRequest->post('id', 0);
        if (!$gid) {
            return new Response('非法操作');
        }
        $aGroupsData = mAuth::getGroupsData(['id' => $gid], ['id', 'title', 'status']);
        if (!$aGroupsData) {
            return new Response('数据不存在');
        }
        $name = (string) $oRequest->post('name', '');
        if (!$name) {
            return new Response('角色名称不能为空');
        }
        if ($aGroupsData['title'] != $name && mAuth::checkGroupsNameExist($name)) {
            return new Response('角色已经存在');
        }
        $aData['title'] = $name;
        $aData['status'] = $oRequest->post('status', 1);
        $aData['update_time'] = NOW_TIME;
        if (mAuth::saveGroups($aData, ['id' => $gid])) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败');
    }

    public function actionRoleForbid() {
        $oRequest = Yii::$app->request;
        $gid = (string) $oRequest->post('id', '');
        if (!$gid) {
            return new Response('非法操作');
        }
        $aId = explode(',', $gid);
        if (!count($aId)) {
            return new Response('数据不存在');
        }
        $aGroupsData = mAuth::getGroupsData(['in', 'id', $aId], ['id', 'title', 'status']);
        if (!$aGroupsData) {
            return new Response('数据不存在');
        }
        $aData['status'] = (int) $oRequest->post('value', 1);
        $aData['update_time'] = NOW_TIME;
        if (mAuth::saveGroups($aData, ['in', 'id', $aId])) {
            return new Response('操作成功', 1);
        }
        return new Response('操作失败');
    }

    public function actionAccessNodes() {
        return $this->render('show_nodes_roles');
    }

    /**
     * 获取ztree数
     */
    public function actionNodesGetZtree() {
        $aAuthRule = mAuth::getAuthRule([], ['id', 'name as node', 'title', 'pid']);
        $id = (int) Yii::$app->request->get('id', 0);
        $xGroupsAuth = mAuth::getGroupsData(['id' => $id], ['rules']);
        $aSelectRules = [];
        if ($xGroupsAuth) {
            $aGroupsAuth = explode(',', $xGroupsAuth['rules']);
            foreach ($aAuthRule as $aItem) {
                if (in_array($aItem['id'], $aGroupsAuth)) {
                    $aSelectRules[] = $aItem['node'];
                }
            }
        }
        $aNodeData['check'] = $aSelectRules;
        $aNodeData['nodes'] = Category::unlimitedForLayer($aAuthRule, '_sub_');
        return new Response('获取成功', 1, $aNodeData);
    }

    /**
     * 分组授权
     */
    public function actionAuthRule() {
        $gid = (int) Yii::$app->request->get('id', 0);
        $aRules = (array) Yii::$app->request->post('nodes', []);
        if (!$gid) {
            return new Response('非法请求');
        }

        if (mAuth::saveAuthGroup(['rules' => implode(',', $aRules)], ['id' => $gid])) {
            return new Response('授权成功', 1);
        }
        return new Response('授权没发生变化');
    }
    
    public function actionShowNodes(){
        $request = Yii::$app->request;
        $page = (int) $request->get('page', 1);
        $pageSize = (int) $request->get('pageSize', 999999999);
        $aCondition = [];
        $aDataList = mAuth::getNodeList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
        $aDataList = Category::unlimitedForLevel($aDataList, '&nbsp;&nbsp;├');
        return $this->render('show_nodes', [
            'aDataList' => $aDataList,
            'oPage' => $this->getPageObeject(mAuth::countNodes($aCondition), $pageSize),
        ]);
    }
    
    public function actionAddNodes() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $page = (int) $oRequest->get('page', 1);
            $pageSize = (int) $oRequest->get('pageSize', 9999999999);
            $aCondition = [];
            $aDataList = mAuth::getNodeList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
            $aDataList = Category::unlimitedForLevel($aDataList, '&nbsp;&nbsp;├');
            return $this->render('node_form',[
                'aDataList' => $aDataList,
            ]);
        }
        $name = $oRequest->post('name', '');
        if (mAuth::checkRuleNameExist($name)) {
            return new Response('节点已经存在');
        }
        $aData['name'] = $name;
        $aData['title'] = (string)$oRequest->post('title', '');
        $aData['pid'] = (int) $oRequest->post('pid', 0);
        $aData['status'] = (int) $oRequest->post('status', 1);
        if (mAuth::addRules($aData)) {
            return new Response('添加成功', 1);
        }
        return new Response('添加失败');
    }
    
    public function actionEditorNodes() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $id = $oRequest->get('id', 0);
            if (!$id) {
                return new Response('非法请求');
            }
            $aData = mAuth::getAuthRuleData(['id' => $id], []);
            if (!$aData) {
                return new Response('参数有误');
            }
            $page = (int) $oRequest->get('page', 1);
            $pageSize = (int) $oRequest->get('pageSize', 9999999999);
            $aCondition = [];
            $aDataList = mAuth::getNodeList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
            $aDataList = Category::unlimitedForLevel($aDataList, '&nbsp;&nbsp;├');
            return $this->render('node_form', [
                'aData' => $aData,
                'aDataList' => $aDataList,
            ]);
        }
        $id = (int)$oRequest->get('id', 0);
        if (!$id) {
            return new Response('非法请求');
        }
        $aRulesData = mAuth::getAuthRuleData(['id' => $id], []);
        if (!$aRulesData) {
            return new Response('参数有误');
        }
        $name = $oRequest->post('name', '');
        if ($aRulesData['name'] != $name && mAuth::checkRuleNameExist($name)) {
            return new Response('节点已经存在');
        }
        if ((int) $oRequest->post('pid', 0) == $id) {
            return new Response('不能指定所属分类是自己');
        }
        $aData['id'] = $id;
        $aData['name'] = $name;
        $aData['title'] = (string)$oRequest->post('title', '');
        $aData['pid'] = (int) $oRequest->post('pid', 0);
        $aData['status'] = (int) $oRequest->post('status', 1);
        if (mAuth::saveRules($aData, ['id' => $id])) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败');
    }
    
    public function actionDelNodes() {
        $oRequest = Yii::$app->request;
        $gid = (string) $oRequest->post('id', '');
        if (!$gid) {
            return new Response('非法操作');
        }
        $aId = explode(',', $gid);
        if (!count($aId)) {
            return new Response('数据不存在');
        }

        foreach ($aId as $id) {
            //删除当前节点
            if (mAuth::delNodes(['id' => $id])) {
                //同时删除所有本节点的之类
                if (!mAuth::delNodes(['pid' => $id])) {
                    Yii::info('删除权限节点失败成功');
                }
            }
        }
        return new Response('操作成功', 1);
    }

    private function getPageObeject($count, $pageSize) {
        return new Pagination(['totalCount' => $count, 'pageSize' => $pageSize, 'pageSizeParam' => 'pageSize']);
    }

}
