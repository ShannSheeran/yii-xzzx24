<?php

namespace admin\lib;

use bases\lib\Response;
use common\filter\ManagerAccessControl as Access;
use common\filter\UserAccessControl;
use Yii;
use yii\web\Controller;

/**
 * 主站基本控制器,主要封装了大量页面通用的登陆验证
 */
class
ManagerBaseController extends Controller {

    /**
     * 返回一个登陆验证过滤器配置,要求是PLAYER级别的用户才能使用
     * @see UserAccessControl
     * @return type array
     */
    public function behaviors() {
        return [
            'access' => [
                //登陆访问控制过滤
                'class' => Access::className(),
                'ruleConfig' => [
                    'class' => 'yii\filters\AccessRule',
                    'allow' => true,
                ],
                'rules' => [
                    [
                        'roles' => [Access::MANAGER],
                    ],
                ]
            ],
        ];
    }

    public function actions() {
        return [
            'error' => [
                'class' => 'bases\lib\ErrorAction',
            ],
        ];
    }

    /**
     * 公共输出子类有需要可以重写
     */
    public function actionIndex() {
        return $this->render('index', $this->getDataList());
    }

    /**
     * 获取数据
     */
    public function getDataList() {
        //使用表单模型验证输入信息
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        return $oBaseFormBehaviors->getDataList();
    }

    /**
     * 添加
     */
    public function actionAdd() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        return $oBaseFormBehaviors->add();
    }

    /**
     * 编辑
     */
    public function actionEditor() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        return $oBaseFormBehaviors->editor();
    }

    /**
     * 更新
     */
    public function actionUpdate() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        $result = $oBaseFormBehaviors->update();
        if (!is_numeric($result)) {
            return $result;
        }
        return new Response('数据成功修改！', 1);
    }

    /**
     * 数据删除
     */
    public function actionDel() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        //当field 为deleted 是执行的是删除操作
        $aPostData = Yii::$app->request->getBodyParams();
        $aPostData['field'] = 'deleted';
        Yii::$app->request->setBodyParams($aPostData);
        $result = $oBaseFormBehaviors->update();
        if (!is_numeric($result)) {
            return $result;
        }
        return new Response('数据成功删除！', 1);
    }

    /**
     * 禁用数据
     */
    public function actionForbid() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        $result = $oBaseFormBehaviors->update();
        if (!is_numeric($result)) {
            return $result;
        }
        return new Response('数据成功禁用！', 1);
    }

    /**
     * 启用数据
     */
    public function actionResume() {
        $oBaseFormBehaviors = $this->getBehavior('baseFormBehaviors');
        $result = $oBaseFormBehaviors->update();
        if (!is_numeric($result)) {
            return $result;
        }
        return new Response('数据成功启用！', 1);
    }

    /**
     * 过滤添加和编辑的数据方法
     * @param type $aData 模型的属性
     * @param type $scene form 中的模型场景（可以根据场景区分是添加还是修改）
     * @return array 返回数据模型插入的表字段
     */
    public function fiterParameter($aData, $scene) {
        return $aData;
    }

}
