<?php
namespace home\controllers;

use home\models\Rednet;
use home\models\SnsLog;
use Yii;
use yii\web\Controller;

/**
 * 站点控制器
 */
class ToolsController extends Controller {

    public $enableCsrfValidation = false;

    public function actions() {
        return [
            'error' => [
                'class' => 'bases\lib\ErrorAction',
            ],
        ];
    }

    public function actionSendsns() {
        set_time_limit(0);
        $aFailRedlist = Rednet::findAll(['status' => 2], ['phone', 'audit_fail_msg']);
        $aFailRedlist[] = ['phone' => '13570486522', 'audit_fail_msg' => ''];
        $aFailRedlist[] = ['phone' => '15807657230', 'audit_fail_msg' => ''];
        $aFailRedlist[] = ['phone' => '13760798145', 'audit_fail_msg' => ''];
//        $aFailRedlist = [
//            ['phone' => '13570486522'],
//            ['phone' => '15807657230']
//        ];
        $aResultData = [];
        $msg = '我们的APP更新啦！请各位小主自行更新到最新版本，以便领取广告投放，更新不影响广告结算。更新完毕后记得重新填写资料哦！';
        foreach ($aFailRedlist as $aPhone) {
            if (isset($aPhone['phone']) && $aPhone['phone'] && !SnsLog::findOne(['phone' => $aPhone['phone'], 'type' => 1])) {
                $result = Yii::$app->sms->send($aPhone['phone'], $msg);
                $aInsertData = [
                    'phone' => $aPhone['phone'],
                    'msg' => $msg,
                    'create_time' => NOW_TIME,
                    'status' => $result ? 0 : 1,
                    'type'=>1
                ];
                SnsLog::insert($aInsertData);
                $aResultData[] = $aInsertData;
            }
        }
        debug($aResultData,11);
        return;
        debug(Yii::$app->sms->send('15807657230'),11);
    }
}
