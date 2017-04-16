<?php
namespace common\filter;

use Yii;
/**
 * 用户访问控制过滤器
 */
class VenderAccessControl extends \yii\filters\AccessControl{
	public $user = 'vender';	//控制哪个APP用户组件的访问
	public $aUmRules = [];		//自定义的规则
	public $denyMessage = '';

	//用户角色标记
	const VENDER = 'vender';

	public function beforeAction($action){
		$actionId = $action->id;
		if($aUmRules = $this->aUmRules){
			$isSpecialFlag = false;
			foreach($aUmRules as $key => $aUmRule){
				if(in_array($actionId, $aUmRule['actions'])){
					if(isset($aUmRule['msg'])){
						$this->denyMessage = $aUmRule['msg'];
					}
				}
				if(isset($aUmRule['msg'])){
					unset($aUmRules[$key]['msg']);
				}
			}
			foreach($aUmRules as $aUmRule){
				if(in_array($actionId, $aUmRule['actions'])){
					$this->rules = $aUmRules;
					$isSpecialFlag = true;
					break;
				}
			}
			if($isSpecialFlag){
				foreach ($this->rules as $i => $rule) {
					if (is_array($rule)) {
						$this->rules[$i] = Yii::createObject(array_merge($this->ruleConfig, $rule));
					}
				}
			}
		}
		return parent::beforeAction($action);
	}

	/**
	 * 权限验证不通过的回调
	 * @param type $oWebUser WEB用户对象,未登陆的时候任何人都可能是,登陆的时候就是用户
	 * @throws ForbiddenHttpException
	 * @return type mixed
	 */
    protected function denyAccess($oWebUser)
    {
		$isGuest = $oWebUser->getIsGuest();
        if($isGuest){
            return $oWebUser->loginRequired();
		}else{
            throw new \yii\web\ForbiddenHttpException(\Yii::t('yii', 'You are not allowed to perform this action.'));
        }
    }
}