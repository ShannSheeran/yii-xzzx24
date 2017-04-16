<?php
namespace bases\lib;

use Yii;

class Kuaidi extends \yii\base\Component{
   
    public $url;
    public $authKey;

    public function getTypeList() {
        return [
            'yuantong' => ['name' => '圆通速递'],
            'ems' => ['name' => 'EMS'],
            'shentong' => ['name' => '申通'],
            'shunfeng' => ['name' => '顺丰'],
            'zhongtong' => ['name' => '中通速递'],
            'zhaijisong' => ['name' => '宅急送'],
            'youzhengguonei' => ['name' => '邮政包裹（国内）'],
            'youzhengguoji' => ['name' => '邮政小包（国际）'],
            'yunda' => ['name' => '韵达快运'],
            'huitongkuaidi' => ['name' => '百世汇通'],
            'tiantian' => ['name' => '天天快递'],
            'quanfengkuaidi' => ['name' => '全峰快递'],
            'rufengda' => ['name' => '凡客如风达'],
        ];
    }

    public function query($type, $postid) {
        $aResult = json_decode($this->_doHttpResponseGet($this->url, [
                    'type' => $type,
                    'postid' => $postid,
                    'id' => $this->authKey,
                    'valicode' => '',
                    'temp' => NOW_TIME,
                ]), true);

        if (!$aResult) {
            $aResult = [
                'status' => 404,
                'message' => '网络请求出错，请重新再试！',
            ];
        }
        return $aResult;
    }

    /**
     * 发送Http get请求
     * @param string $url
     * @param string $para
     * @return string $responseText
     */
    private function _doHttpResponseGet($url, $para) {
        $curl = curl_init($url . '?' . http_build_query($para));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true); // SSL证书认证
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); // 严格认证
        curl_setopt($curl, CURLOPT_HEADER, 0);  // 过滤HTTP头
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 显示输出结果
        $responseText = curl_exec($curl);
        curl_close($curl);

        return $responseText;
    }

}
