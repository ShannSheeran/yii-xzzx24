<?php

namespace bases\lib;

use Yii;

/**
 * easyui 返回结果特定类
 */
class EasyResponse extends \yii\web\Response {

    const EASY_RESPONSE_DATA_TYPE_DATA_GRID = 1;
    const EASY_RESPONSE_DATA_TYPE_COMBOBOX = 2;
    
    private $_aSpecial = [
        self::EASY_RESPONSE_DATA_TYPE_COMBOBOX,
    ];

    public function __construct($message = '', $status = 0, $xData = '', $type = 1) {
        parent::__construct();

        $aData = $this->getEasyDataTypeData($type, $xData);
        if(!in_array($type, $this->_aSpecial)){
            $aData['msg'] = $message;
            $aData['status'] = $status;
            $aData['token'] = Yii::$app->request->csrfToken;
        }
        
        $oRequest = Yii::$app->request;
        $isAjax = $oRequest->isAjax || $oRequest->post('_is_ajax') || $oRequest->get('_is_ajax');
        if (!Yii::$app->ui->isRequestByPageManager && $isAjax) {
            $this->format = self::FORMAT_JSON;
        } else {
            $this->format = self::FORMAT_HTML;
            $aData = Yii::$app->view->renderFile('@p.system_view/response.php', [
                'msg' => $message,
                'status' => $status,
                'xData' => $xData,
            ]);
        }

        $this->data = $aData;
    }

    public function getEasyDataTypeData($type, $xData = []) {
        if ($type == static::EASY_RESPONSE_DATA_TYPE_DATA_GRID) {
            return [
                'total' => $xData['total'],
                'rows' => $xData['rows'],
            ];
        }
        
        if ($type == static::EASY_RESPONSE_DATA_TYPE_COMBOBOX) {
            return $xData;
        }
    }
    
    public static function easyUiArrayToeasyDataGrid($total, $aData) {
        $aResult = array(
            'total' => $total,
            'rows' => $aData,
            'token' => Yii::$app->request->csrfToken,
        );
        exit(json_encode($aResult));
    }

    public static function easyUiArrayTreeGrid($total, $aData) {
        $aResult = array(
            'total' => $total,
            'rows' => $aData,
            'token' => Yii::$app->request->csrfToken,
        );
        exit(json_encode($aResult));
    }

    public static function easyUiArrayCombobox($aData, $id = null) {

        foreach ($aData as $k => $v) {
            if ($v['id'] == $id) {
                $aData[$k]['selected'] = 'true';
            }
        }

        header("Access-Control-Allow-Origin: *");
        exit(json_encode($aData));
    }

}
