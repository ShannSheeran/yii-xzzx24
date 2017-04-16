<?php

namespace api\controllers;

use api\lib\BaseController;
use api\lib\Response;
use common\model\App;
use common\model\Consumption;
use common\model\MainUser;
use common\model\OrgCommission;
use Yii;

/**
 * 消费接口
 */
class OrderRecordController extends BaseController {

    /**
     * 微信渠道绑定公众号平台游戏消费记录接口
     */
    public function consumption() {
        $unionid = (string) Yii::$app->request->post('unionid', '');
        if (!$unionid) {
            return new Response('缺少unionid', 10001);
        }

        $orderSn = (string) Yii::$app->request->post('order_sn', '');
        $meny = (double) Yii::$app->request->post('money', 0.00);
        $desc = (string) Yii::$app->request->post('desc', '');
        if (!$orderSn) {
            return new Response('订单号不能为空', 20001);
        }
        if (!$meny) {
            return new Response('价格不能为空', 20002);
        }
        //校验appId
        $appCode = (string) Yii::$app->request->post('app_code', '');
        $appId = App::decodeAppId($appCode);
        if (!$appId) {
            return new Response('app_id非法', 10003);
        }

        $mMainUser = MainUser::findOne(['unionid' => $unionid, 'app_id' => $appId]);
        if (!$mMainUser) {
            return new Response('该unionid尚未和系统绑定', 0);
        }

        if (Consumption::findOne(['order_sn' => $orderSn, 'app_id' => $appId])) {
            return new Response('请勿重复提交', 0);
        }
        $aConmptionData = [
            'app_id' => $mMainUser->app_id,
            'uid' => $mMainUser->id,
            'ad_id' => $mMainUser->ad_id,
            'meny' => $meny,
            'desc' => $desc,
            'create_time' => NOW_TIME,
            'order_sn' => $orderSn,
            'rednet_id' => $mMainUser->rednet_id,//哪个网红
            'org_id' => $mMainUser->org_id,//哪个网红
        ];
        //处理
        $lastInertId = Consumption::insert($aConmptionData);      
        if (!$lastInertId) {
            Yii::error('游戏接口同步消费数据出错');
            return new Response('接口发生异常请联系管理员', 20003);
        }
        
        //分账打款
        //$this->_dealCashApplyAgame($aConmptionData);
        OrgCommission::cashApplyAgame($aConmptionData);
        return new Response('同步成功', 1);
    }
    
    

}
