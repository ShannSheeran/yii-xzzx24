<?php

namespace common\role;

use common\filter\ManagerAccessControl;
use common\model\Manager as User;
use Yii;
use yii\base\Component;
use yii\base\InvalidParamException;

/**
 * 权限验证管理者
 */
class AuthManager extends Component {

    /**
     * 检查一个用户是否有指定的权限
     * @param int $userId 后台用户ID
     * @param string $permissionName 权限标识名称
     * @return boolean
     * @throws InvalidParamException
     */
    public function checkAccess($userId, $permissionName) {
        if (!$userId) {
            return false;
        }
        $mUser = null;
        if ($permissionName == ManagerAccessControl::MANAGER) {
            $mUser = User::findOne($userId);
        }

        if (!$mUser) {
            throw new InvalidParamException('无效的用户ID');
        }
        return Yii::$app->rbacAuth->checkRule($userId);
    }

}
