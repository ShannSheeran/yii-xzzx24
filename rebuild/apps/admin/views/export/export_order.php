<?php
header("Content-type:application/vnd.ms-excel");
header("Content-Disposition:attachment; filename=订单列表".date('Y-m-d',NOW_TIME).".xls");
?>


<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />

<table cellspacing="0">
    <tr style="text-align:center;background-color: #96f2f4; border:1px solid #efefef;">
        <td nowrap>订单号</td>
        <td nowrap>下单时间</td>
        <td nowrap>用户名称</td>
        <td nowrap>商品总数量</td>
        <td nowrap>总价格</td>
        <td nowrap>付款时间</td>
        <td nowrap>支付方式</td>
        <td nowrap>收货人姓名</td>
        <td nowrap>联系号码1</td>
        <td nowrap>联系号码2</td>
        <td nowrap>订单地址</td>
        <td nowrap>物流公司</td>
        <td nowrap>物流单编号</td>
        <td nowrap>备注</td>
        <td nowrap>订单状态</td>
        <td nowrap>商品编号</td>
        <td nowrap>商品名称</td>
        <td nowrap>产品数量</td>
        <td nowrap>产品单价</td>
        <td nowrap>产品总价</td>
        <td nowrap>退货数</td>
        <td nowrap>退货时间</td>


    </tr>

    <?php

    foreach($aShopOrderList as $key => $value){

        $value['create_time'] = ($value['create_time'] != 0) ? date('Y-m-d H:i:s',$value['create_time']) : '';
        $value['pay_time'] = ($value['create_time'] != 0) ? date('Y-m-d H:i:s',$value['pay_time']) : '';
        $value['return_time'] = ($value['return_time'] != 0) ? date('Y-m-d H:i:s',$value['return_time']) : '';

        if($value['status'] == 0){
            $status = '未处理';
        }else if($value['status'] == 1){
            $status = '已发货';
        }else if($value['status'] == 2){
            $status = '已收货';
        }else if($value['status'] == 3){
            $status = '退货申请';
        }else{
            $status ='退货';
        }

        echo "<tr style='border:1px solid #efefef;'>
    <td style='vnd.ms-excel.numberformat:@' nowrap>".$value['order_id']."</td>
    <td nowrap>".$value['create_time']."</td>
    <td nowrap>".$value['manager_name']."</td>
    <td nowrap>".$value['goods_nums']."</td>
    <td nowrap>".$value['total_money']."</td>
    <td nowrap>".$value['pay_time']."</td>
    <td nowrap>".$value['pay_name']."</td>
    <td nowrap>".$value['consignee_name']."</td>
    <td nowrap>".$value['phone_no1']."</td>
    <td nowrap>".$value['phone_no2']."</td>
    <td nowrap>".$value['address']."</td>
    <td nowrap>".$value['express_name']."</td>
    <td nowrap>".(int)$value['express_number']."</td>
    <td nowrap>".$value['remark']."</td>
    <td nowrap>".$status."</td>
    <td nowrap>".$value['goods_id']."</td>
    <td nowrap>".$value['goods_name']."</td>
    <td nowrap>".$value['nums']."</td>
    <td nowrap>".$value['price']."</td>
    <td nowrap>".$value['total_price']."</td>
    <td nowrap>".$value['return_number']."</td>
    <td nowrap>".$value['return_time']."</td>
    </tr>";
    }
    ?>
</table>