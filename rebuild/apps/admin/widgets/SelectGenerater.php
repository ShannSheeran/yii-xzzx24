<?php
namespace admin\widgets;

use yii\base\InvalidConfigException;
use yii\base\Widget;
use yii\helpers\Html;

class SelectGenerater extends Widget{
    
        public $dataClass = null;
        public $method = null;
        public $aParams = [];
        public $selectField = [];
        public $aHtmlAttr = [];
	public function run(){
            if($this->dataClass == null || $this->method == null){
                throw new InvalidConfigException('必须配置获取数据和方法源');
            }
            $aDataList = call_user_func_array([$this->dataClass,$this->method],$this->aParams);
            $xList = '';
            foreach($aDataList as $aItems){
                if(isset($this->aHtmlAttr['value']) && $this->aHtmlAttr['value'] && $aItems[1] == $this->aHtmlAttr['value']){
                    $xList .= Html::tag('option', $aItems[0], ['value'=>$aItems[1],'selected'=>'selected']);
                }else{
                    $xList .= Html::tag('option', $aItems[0], ['value'=>$aItems[1]]);
                }
                
            }
            return Html::tag('select', $xList, $this->aHtmlAttr);
	}
}