<?php

namespace api\controllers;

use api\lib\BaseController;
use api\lib\Response;
use common\model\App;
use common\model\MainUser;
use Yii;

/**
 * 用户控制器
 */
class UserController extends BaseController {

    /**
     * 微信渠道检测用户是否跟系统有关联
     */
    public function checkUnionid() {
        $unionid = (string) Yii::$app->request->post('unionid', '');
        if (!$unionid) {
            return new Response('缺少unionid', 10001);
        }
        $appCode = (string) Yii::$app->request->post('app_code');
         //校验appId
        $appId = App::decodeAppId($appCode);
        if (!$appId) {
            return new Response('app_id非法', 10003);
        }
        $mWxUser = MainUser::findOne(['unionid' => $unionid,'app_id'=>$appId]);
        if (!$mWxUser) {
            return new Response('该unionid尚未和系统绑定', 1, ['is_bind' => 0]);
        }
        return new Response('该unionid已经和系统绑定', 1, ['is_bind' => 1]);
    }

}
