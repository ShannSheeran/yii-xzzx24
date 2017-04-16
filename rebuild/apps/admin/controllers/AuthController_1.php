<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use admin\models\Auth as mAuth;
use bases\helper\Category;
use bases\lib\Response;
use Yii;
use yii\helpers\Json;

class AuthController extends ManagerBaseController {

    public function actionShowUser() {
        return $this->render('show_user');
    }

    public function actionAddUser() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $this->layout = 'layout_other';
            return $this->render('add_user');
        }

        $aGroupId = (array) $oRequest->post('group_id', []);
        if (!$aGroupId) {
            return new Response('请选择分组');
        }

        $aData['name'] = $oRequest->post('name');
        $aData['password'] = static::createPassWord($oRequest->post('password'));
        $aData['create_time'] = $aData['update_time'] = NOW_TIME;
        $aData['mobile'] = $oRequest->post('mobile');
        $aData['user_name'] = (string)$oRequest->post('user_name','');
        $aData['from_user'] = (string)$oRequest->post('from_user','');
        $aData['gid'] = isset($aGroupId[0]) ? $aGroupId[0] : 0;
        //$aData['reg_ip'] = $oRequest->getUserHostAddress();
        if (mAuth::checkUserNameExist($aData['name'])) {
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
            return new Response('添加成功', 1,['uid'=>$lastInserId]);
        }
        return new Response('添加分组失败');
    }

    public function actionEditorUser() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $uid = $oRequest->get('id', 0);
            if (!$uid) {
                return new Response('非法操作');
            }
            $aUserData = mAuth::getUserData($uid, ['id', 'name', 'status']);
            if (!$aUserData) {
                return new Response('数据不存在');
            }
            $aGroupsList = mAuth::getGroupAccessList(['uid' => $uid], ['group_id']);
            $aGroupIds = array();
            foreach ($aGroupsList as $aGroup) {
                $aGroupIds[] = $aGroup['group_id'];
            }
            unset($aGroupsList);
            $aUserData['group'] = implode(',', $aGroupIds);
            $this->layout = 'layout_other';
            return $this->render('editor_user', ['aData' => $aUserData]);
        }

        //表单提交
        $uid = $oRequest->post('id', 0);
        if (!$uid) {
            return new Response('非法操作');
        }
        $aUserData = mAuth::getUserData($uid, ['id', 'name', 'status']);
        if (!$aUserData) {
            return new Response('数据不存在');
        }
        if ($uid == Yii::$app->authManager->AUTH_CONFIG['ADMINISTRATOR']) {
            return new Response('没权限操作');
        }

        $aData['name'] = $oRequest->post('name');
        $aData['status'] = (int) $oRequest->post('status');
        $uid = (int) $oRequest->post('id');
        $aGroupsIds = $oRequest->post('group_id');
        if (empty($aGroupsIds)) {
            return new Response('至少选择一个分组');
        }
        if ($aUserData['name'] != $aData['name'] && mAuth::checkUserNameExist($aData['name'])) {
            return new Response('用户已存在');
        }
        $reslut1 = mAuth::saveUser($aData, ['id' => $uid]);

        //删除所有该用户的分组
        mAuth::delUserAccessByUId($uid);
        $aUserAndGroupData = array();
        if (is_array($aGroupsIds)) {
            foreach ($aGroupsIds as $groupId) {
                $aUserAndGroupData[] = array(
                    'uid' => $uid,
                    'group_id' => $groupId,
                );
            }
        } else {
            $aUserAndGroupData[] = array(
                'uid' => $uid,
                'group_id' => $aGroupsIds,
            );
        }
        $reslut2 = mAuth::addGroupAccess($aUserAndGroupData);
        if ($reslut1 || $reslut2) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败');
    }

    public function actionDelUser() {
        $uid = (int) Yii::$app->request->post('id', 0);
        if (!$uid) {
            return new Response('缺失参数');
        }
        if ($uid == Yii::$app->authManager->AUTH_CONFIG['ADMINISTRATOR']) {
            return new Response('不能删除该用户');
        }
        $result = mAuth::delUser(['id' => $uid]);
        if (!$result) {
            return new Response('删除失败,发生未知错误');
        }
        //删除分组数据
        mAuth::delUserAccessByUId($uid);
        return new Response('删除成功', 1);
    }

    private function addUserGroups($aData) {
        return M('auth_group_access')->addAll($aData);
    }

    public function actionGetGroupList() {
        $oRequest = Yii::$app->request;
        $groupsIds = $oRequest->get('groupsIds', 0);
        $aData = mAuth::getGroupList();
        !$aData && $aData = [];
        if ($groupsIds) {
            $aGroupsIds = explode(',', $groupsIds);
            foreach ($aData as $k => $aGoups) {
                $aData[$k]['checked'] = false;
                if (in_array($aGoups['id'], $aGroupsIds)) {
                    $aData[$k]['checked'] = true;
                }
            }
        }
        exit(Json::encode($aData));
    }

    public function actionGetUserList() {
        $request = Yii::$app->request;
        $page = (int) $request->post('page', 1);
        $pageSize = (int) $request->post('rows', 10);
        $aCondition = [];
        $aUserList = mAuth::getUserList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
        foreach ($aUserList as $key => $aUser) {
            unset($aUserList[$key]['password']);
            $aGroups = array();
            $aUserAndGoups = Yii::$app->authManager->getGroups($aUser['id']);
            foreach ($aUserAndGoups as $aTemp) {
                $aGroups[] = $aTemp['title'];
            }
            unset($aUserAndGoups);
            $aUserList[$key]['group'] = $aGroups;
        }
        Response::easyUiArrayToeasyDataGrid(mAuth::countUser($aCondition), $aUserList);
    }

    public function actionShowGroups() {
        return $this->render('show_groups');
    }

    public function actionGetGroupsList() {
        $request = Yii::$app->request;
        $page = (int) $request->post('page', 1);
        $pageSize = (int) $request->post('rows', 10);
        $aCondition = [];
        $aGroupsList = mAuth::getGroupsList($aCondition, ['page' => $page, 'page_size' => $pageSize]);
        Response::easyUiArrayToeasyDataGrid(mAuth::countGroups($aCondition), $aGroupsList);
    }

    public function actionAddGroups() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $this->layout = 'layout_other';
            return $this->render('add_groups');
        }
        $name = $oRequest->post('title', 0);
        if (!$name) {
            return new Response('分组名称不能为空');
        }
        if (mAuth::checkGroupsNameExist($name)) {
            return new Response('分组已经存在');
        }
        $aData['title'] = $name;
        $aData['status'] = $oRequest->post('status', 1);
        if (mAuth::addGroups($aData)) {
            return new Response('添加成功', 1);
        }
        return new Response('添加失败');
    }

    public function actionEditorGroups() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $gid = $oRequest->get('id', 0);
            if (!$gid) {
                return new Response('非法操作');
            }
            $aGroupsData = mAuth::getGroupsData(['id' => $gid], ['id', 'title', 'status']);
            if (!$aGroupsData) {
                return new Response('数据不存在');
            }
            $this->layout = 'layout_other';
            return $this->render('editor_groups', ['aData' => $aGroupsData]);
        }

        $gid = $oRequest->post('id', 0);
        if (!$gid) {
            return new Response('非法操作');
        }
        $aGroupsData = mAuth::getGroupsData(['id' => $gid], ['id', 'title', 'status']);
        if (!$aGroupsData) {
            return new Response('数据不存在');
        }
        $name = $oRequest->post('title', 0);
        if (!$name) {
            return new Response('分组名称不能为空');
        }
        if ($aGroupsData['title'] != $name && mAuth::checkGroupsNameExist($name)) {
            return new Response('分组已经存在');
        }
        $aData['title'] = $name;
        $aData['status'] = $oRequest->post('status', 1);
        if (mAuth::saveGroups($aData, ['id' => $gid])) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败');
    }

    public function actionDelGroups() {
        $oRequest = Yii::$app->request;
        $gid = $oRequest->post('id', 0);
        if (!$gid) {
            return new Response('非法操作');
        }
        if (mAuth::checkGroupsHaveUser(['group_id' => $gid])) {
            return new Response('该分组下面有用户请先转移用户');
        }
        if (mAuth::delGroups(['id' => $gid])) {
            return new Response('删除成功', 1);
        }
        return new Response('删除失败');
    }

    /**
     * 展示授权
     */
    public function actionShowAccessList() {
        $oRequest = Yii::$app->request;
        $gid = $oRequest->get('gid', 0);
        if (!$gid) {
            return new Response('非法操作');
        }
        $aGroups = mAuth::getGroupsData(['id' => $gid], ['id', 'title', 'rules']);
        if (!$aGroups) {
            return new Response('分组不存在');
        }
        $this->layout = 'layout_other';
        return $this->render('show_access_list', ['aGroups' => $aGroups]);
    }

    public function actionShowNodes() {
        return $this->render('show_nodes');
    }

    public function getNodesList() {
        $mTabel = M('auth_rule');
        $page = (int) I('post.page', 1);
        $pageSize = (int) I('post.rows', 10);
        $aData = $mTabel->page($page, $pageSize)->select();
        Respone::arrayToeasyDataGrid($mTabel->where($where)->count(), $aData);
    }

    public function actionAddNodes() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            $pid = $oRequest->get('pid', 0);
            $this->layout = 'layout_other';
            return $this->render('add_node', ['pid' => $pid]);
        }
        $name = $oRequest->post('name', '');
        if (mAuth::checkRuleNameExist($name)) {
            return new Response('节点已经存在');
        }
        $aData['name'] = $name;
        $aData['title'] = $oRequest->post('title', '');
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
            $this->layout = 'layout_other';
            return $this->render('editor_node', ['aData' => $aData]);
        }
        $id = $oRequest->post('id', 0);
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
            return new Response('你家的父亲能生出你父亲？不能就不能指定所属分类是自己');
        }
        $aData['id'] = $id;
        $aData['name'] = $name;
        $aData['title'] = $oRequest->post('title', '');
        $aData['pid'] = (int) $oRequest->post('pid', 0);
        $aData['status'] = (int) $oRequest->post('status', 1);
        if (mAuth::saveRules($aData, ['id' => $id])) {
            return new Response('修改成功', 1);
        }
        return new Response('修改失败');
    }

    public function actionDelNodes() {
        $oRequest = Yii::$app->request;
        if (!$oRequest->isPost) {
            return new Response('非法请求');
        }
        $id = $oRequest->post('id', 0);
        if (!$id) {
            return new Response('非法请求');
        }
        //删除当前节点
        if (mAuth::delNodes(['id' => $id])) {
            //同时删除所有本节点的之类
            mAuth::delNodes(['pid' => $id]);
            return new Response('删除成功', 1);
        }
        return new Response('删除失败');
    }

    public function actionGroupsAccess() {
        $oRequest = Yii::$app->request;
        $gid = $oRequest->post('group_id', 0);
        $aRules = (array) $oRequest->post('rules_id', []);
        if (!$gid) {
            return new Response('非法请求');
        }
        if (!$aRules) {
            return new Response('请选择权限');
        }

        $aUpdateData = array(
            'rules' => implode(',', $aRules),
        );
        if (mAuth::saveAuthGroup($aUpdateData, ['id' => $gid])) {
            return new Response('授权成功', 1);
        }
        return new Response('授权没发生变化');
    }

    public function actionGetNodeListJson() {
        $oRequest = Yii::$app->request;
        $aRulesIds = (array) $oRequest->post('rules', []);
        $aData = mAuth::getAuthRule([], ['id', 'name', 'title', 'pid']);
        if (!$aData) {
            $aData = [];
        }
        $aNodesList = [];
        foreach ($aData as $key => $aNodes) {
            $check = in_array($aNodes['id'], $aRulesIds) ? true : false;
            $aNodesList[] = array(
                'id' => $aNodes['id'],
                'text' => $aNodes['title'],
                'name' => $aNodes['name'],
                'pid' => $aNodes['pid'],
                'checked' => $check,
            );
        }
        foreach ($aNodesList as $aNod) {
            if (!$aNod['checked']) {
                foreach ($aNodesList as $k => $aN) {
                    if ($aNod['pid'] == $aN['id']) {
                        $aNodesList[$k]['checked'] = false;
                    }
                }
            }
        }
        foreach ($aNodesList as $aNod) {
            if (!$aNod['checked']) {
                foreach ($aNodesList as $k => $aN) {
                    if ($aNod['pid'] == $aN['id']) {
                        $aNodesList[$k]['checked'] = false;
                    }
                }
            }
        }
        unset($aData);
        $aCategory = Category::unlimitedForLayer($aNodesList, 'children', 0);
        exit(Json::encode($aCategory));
    }

    public static function createPassWord($password){
        return md5($password);        
    }
}
