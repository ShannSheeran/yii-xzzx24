<?php
namespace bases\lib\WechatPay;

use Yii;
use bases\lib\Cookie;
use bases\lib\Xxtea;
use bases\lib\Url;
use bases\lib\StringHelper;
/*
 * PC版微信支付功能
 */

require_once dirname(__FILE__)."/lib/WxPay.Api.php";
require_once dirname(__FILE__)."/example/WxPay.NativePay.php";
require_once dirname(__FILE__).'/example/log.php';
require_once dirname(__FILE__)."/example/WxPay.JsApiPay.php";

class WechatPay extends \yii\base\Component{
    
    
    public function buildJsPidParameters($aParameters,$openId = null) {
        
        //①、获取用户openid
        $tools = new \JsApiPay();
        if($openId === null){
            $openId = $tools->GetOpenid();
        }
        //②、统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody($aParameters['title']); //设置商品或支付单简要描述
        $input->SetAttach($aParameters['attach']); //设置附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        $input->SetOut_trade_no($aParameters['order_sn']); //设置商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号
        $input->SetTotal_fee($aParameters['money']); //设置订单总金额，只能为整数，详见支付金额
        $input->SetTime_start(date("YmdHis")); //设置订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
       // $input->SetTime_expire(date("YmdHis", time() + 1800)); //设置订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。其他详见时间规则
        $input->SetGoods_tag($aParameters['tag']); //设置商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠
        $input->SetNotify_url($aParameters['cb']); //设置接收微信支付异步通知回调地址
        $input->SetTrade_type("JSAPI"); //设置取值如下：JSAPI，NATIVE，APP，详细说明见参数规定
        $input->SetOpenid($openId); //设置trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid。 
        $order = \WxPayApi::unifiedOrder($input);
        //构建页面所需的参数
        return $tools->GetJsApiParameters($order);
    }
    
    public function test(){        
        return Url::to(['notify.html'], true);
    }
    
    
    public function scanPay($aParam){
        ini_set('date.timezone','Asia/Shanghai');
//        $orderId = 'CD'.StringHelper::buildRandomString(3, 5, 4) . date('Ymd', NOW_TIME);  //生成订单编号
        //error_reporting(E_ERROR);
       
        //模式一
        /**
         * 流程：
         * 1、组装包含支付信息的url，生成二维码
         * 2、用户扫描二维码，进行支付
         * 3、确定支付之后，微信服务器会回调预先配置的回调地址，在【微信开放平台-微信支付-支付配置】中进行配置
         * 4、在接到回调通知之后，用户进行统一下单支付，并返回支付信息以完成支付（见：native_notify.php）
         * 5、支付完成之后，微信服务器会通知支付成功
         * 6、在支付成功通知中需要查单确认是否真正支付成功（见：notify.php）
         */
        
        $notify = new \NativePay();
        //$url1 = $notify->GetPrePayUrl("123456789");
        
        //模式二
        /**
         * 流程：
         * 1、调用统一下单，取得code_url，生成二维码
         * 2、用户扫描二维码，进行支付
         * 3、支付完成之后，微信服务器会通知支付成功
         * 4、在支付成功通知中需要查单确认是否真正支付成功（见：notify.php）
        */
        $input = new \WxPayUnifiedOrder();
//        $input->SetBody($aPayData['name']);//订单描述
//        $input->SetAttach($aPayData['mark']);//备注
//        $input->SetOut_trade_no($aPayData['purchase_order']);//订单号
//        $input->SetTotal_fee($aPayData['totle']*100);//金额（分）
//        $input->SetTime_start(date("YmdHis",NOW_TIME));//提交时间
//        //$input->SetTime_expire(date("YmdHis",NOW_TIME+1000));//结束时间
//        //$input->SetGoods_tag("test");//商品标记，代金券或立减优惠功能的参数(没啥用)
//        $input->SetNotify_url($aPayData['notify_url']);//支付结果通知地址
//        $input->SetTrade_type("NATIVE");//交易类型（NATIVE=二维码,其他看手册）
//        $input->SetProduct_id($aPayData['purchase_order']);//商品ID（固定订单号）
        
        
        $input->SetBody('北斗系统扫码支付使用');//订单描述
        $input->SetAttach('北斗系统扫码支付使用');//备注
        $input->SetOut_trade_no($aParam['order_id']);//订单号
        $input->SetTotal_fee($aParam['money']*100);//金额（分）
        $input->SetTime_start(date("YmdHis",NOW_TIME));//提交时间
//        $input->SetTime_expire(date("YmdHis",NOW_TIME+1000));//结束时间
        //$input->SetGoods_tag("test");//商品标记，代金券或立减优惠功能的参数(没啥用)
        $input->SetNotify_url('http://www.bdstarts.com/notify.html');//支付结果通知地址
        $input->SetTrade_type("NATIVE");//交易类型（NATIVE=二维码,其他看手册）
        $input->SetProduct_id($aParam['order_id']);//商品ID（固定订单号）
        
        
        $result = $notify->GetPayUrl($input);
        if(!isset($result['code_url'])){ 
            return $result;
        }
        $url2 = $result["code_url"];
        return $url2;
    }
    
    //严重商户号是否正确
    public function verificationPay($appid = '',$mch_id = ''){
        $input = new \WxPayApi();
        return $input->verification($appid,$mch_id);
    }
}