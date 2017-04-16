<?php
namespace common\model;

use common\lib\DbOrmModel;
use common\lib\event\ConsumptionEventConfig;
use common\model\xmodel\CashApplyAgame;
use common\model\xmodel\CashCountAgame;
use common\model\xmodel\Organizations;
use Yii;

class OrgCommission extends DbOrmModel{

    public static function tableName(){
        return Yii::$app->db->parseTable('_@org_commission');
    }
    
    public static function dealConsumptionCheckEvent(ConsumptionEventConfig $oEventData){
        if (!$oEventData->aConsumptionId) {
            return;
        }
        $aConsumptionIdList = Consumption::findAll(['in', 'id', $oEventData->aConsumptionId]);
        foreach ($aConsumptionIdList as $aItems) {
            static::cashApplyAgame($aItems);
        }
    }
    
    public static function getCommissionRate($orgId) {
        $mOrgCommission = self::findOne(['org_id' => $orgId]);
        if ($mOrgCommission && $mOrgCommission->commision_rate > 0) {
            return $mOrgCommission->commision_rate;
        }
        $mOrganizations = Organizations::findOne($orgId);
        if (!$mOrganizations) {
            return false;
        }
        return $mOrganizations->commision_rate;
    }

    //同步到小主打款
    public static function cashApplyAgame($aConmptionData) {
        //红人所得
        $rednetCash = $aConmptionData['money'] * CashCountAgame::REDNET_CASH_PRECENT;
        !static::insertCashCountAgame($aConmptionData['rednet_id'], $aConmptionData['org_id'], $rednetCash, 1) && Yii::error('游戏所得分账网红部分插入失败');
        $orgCommissionRate = static::getCommissionRate($aConmptionData['org_id']);
        if ($orgCommissionRate === false) {
            Yii::info('公会两个系统没设置公会佣金');
            return;
        }
        //公会所得
        $orgCash = $rednetCash * ($orgCommissionRate / 100);
        !static::insertCashCountAgame($aConmptionData['rednet_id'], $aConmptionData['org_id'], $orgCash, 3) && Yii::error('游戏所得分账公会部分插入失败');
    }

    /**
     * 插入小主系统的cash_count_agame表
     * @param type $rednetId 红人id
     * @param type $orgId 公会id
     * @param type $cash 佣金
     * @param type $type 1个人单独结算 3公会提现佣金
     * @return bool 
     */
    public static function insertCashCountAgame($rednetId,$orgId,$cash,$type){
        $mCashCountAgame = new CashCountAgame();
        //advert_id 小主系统的广告id
        //$mCashCountAgame->advert_id = '';
        //申请打款处理的id app 端申请打款之后改掉该字段
        //$mCashCountAgame->apply_id = '';
        $mCashCountAgame->rednet_id = $rednetId;
        $mCashCountAgame->org_id = $orgId;
        $mCashCountAgame->type = $type;
        $mCashCountAgame->money = $cash;
        $mCashCountAgame->is_withdrawls = 0;        
        $mCashCountAgame->is_deleted = 0;
        $mCashCountAgame->create_at = date('Y-m-d H:i:s');
        $mCashCountAgame->create_month = date('Y-m');
        return $mCashCountAgame->save();
    }

    public static function insertCashApply($aConmptionData, $cash, $type = 0) {
        $mCashApplyAgame = new CashApplyAgame;
        $mCashApplyAgame->order_no = '';
        $mCashApplyAgame->rednet_id = $aConmptionData['rednet_id'];
        $mCashApplyAgame->org_id = $aConmptionData['org_id'];
        $mCashApplyAgame->type = $type;
        $mCashApplyAgame->cash = $cash;
        $mCashApplyAgame->status = 0;
        $mCashApplyAgame->create_at = date('Y-m-d H:i:s');
        $mCashApplyAgame->create_month = date('Y-m');
        return $mCashApplyAgame->save();
    }

}