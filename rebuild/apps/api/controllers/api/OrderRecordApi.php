<?php
namespace api\controllers\api;

use api\lib\Response;
use common\model\AdRecommendedCode;
use common\model\App;
use common\model\Consumption;
use common\model\MainUser;
use Yii;

trait OrderRecordApi {

    /**
     * 微信渠道绑定公众号平台游戏消费记录接口
     */
    private function consumption() {
        $unionid = (string) Yii::$app->request->post('unionid', '');
        if (!$unionid) {
            return new Response('缺少unionid', 10001);
        }

        $orderSn = (string) Yii::$app->request->post('order_sn', '');
        $money = (double) Yii::$app->request->post('money', 0.00);
        $desc = (string) Yii::$app->request->post('desc', '');
        if (!$orderSn) {
            return new Response('订单号不能为空', 20001);
        }
        if (!$money) {
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
            'money' => $money,
            'desc' => $desc,
            'create_time' => NOW_TIME,
            'order_sn' => $orderSn,
            'rednet_id' => $mMainUser->rednet_id, //哪个网红
            'org_id' => $mMainUser->org_id, //哪个网红
        ];
        //处理
        $lastInertId = Consumption::insert($aConmptionData);
        if (!$lastInertId) {
            Yii::error('游戏接口同步消费数据出错');
            return new Response('接口发生异常请联系管理员', 20003);
        }
        
        //分账打款
        //OrgCommission::cashApplyAgame($aConmptionData);
        return new Response('同步成功', 1);
    }
    
    /**
     * 优惠码形式
     * 第三方游戏消费记录同步
     */
    private function recommendedCodeConsumption() {
        $code = (string) Yii::$app->request->post('recommended_code', '');
        $orderSn = (string) Yii::$app->request->post('order_sn', '');
        $money = (double) Yii::$app->request->post('money', 0.00);
        $desc = (string) Yii::$app->request->post('desc', '');
        $appCode = (string) Yii::$app->request->post('app_code', '');
        if (!$code) {
            return new Response('缺少推荐码', 10001);
        }
        if (!$orderSn) {
            return new Response('订单号不能为空', 20001);
        }
        if (!$money) {
            return new Response('价格不能为空', 20002);
        }
        //校验appId        
        $appId = App::decodeAppId($appCode);
        if (!$appId) {
            return new Response('app_id非法', 10003);
        }

        //根据推荐码找到相应红人信息
        $mAdRecommendedCode = AdRecommendedCode::findOne(['code' => $code, 'status' => 0]);
        if (!$mAdRecommendedCode) {
            return new Response('该推荐码无效', 0);
        }
        if (Consumption::findOne(['order_sn' => $orderSn, 'app_id' => $appId])) {
            return new Response('请勿重复提交', 0);
        }

        //分账        
        $aConmptionData = [
            'app_id' => $mAdRecommendedCode->app_id,
            'uid' => 0, //第三方合作游戏uid用0
            'ad_id' => $mAdRecommendedCode->ad_id,
            'money' => $money,
            'desc' => $desc,
            'create_time' => NOW_TIME,
            'order_sn' => $orderSn,
            'rednet_id' => $mAdRecommendedCode->rednet_id, //哪个网红
            'org_id' => $mAdRecommendedCode->org_id, //哪个网红
            'type' => 1, //哪个网红
        ];
        //处理
        $lastInertId = Consumption::insert($aConmptionData);
        if (!$lastInertId) {
            Yii::error('游戏接口同步消费数据出错');
            return new Response('接口发生异常请联系管理员', 20003);
        }
        return new Response('同步成功', 1);
    }

    /**
     * 检测推荐码是否在本系统
     */
    private function checkRecommendedCode() {
        $code = (string) Yii::$app->request->post('recommended_code', '');
        $appCode = (string) Yii::$app->request->post('app_code', '');
        if (!$code) {
            return new Response('缺少推荐码', 10001);
        }
        //校验appId        
        $appId = App::decodeAppId($appCode);
        if (!$appId) {
            return new Response('app_id非法', 10003);
        }        
        $mAdRecommendedCode = AdRecommendedCode::findOne(['code' => $code, 'status' => 0]);
        if (!$mAdRecommendedCode) {
            return new Response('该推荐码不合法');
        }
        return new Response('该推荐码有效', 1);
    }
}
