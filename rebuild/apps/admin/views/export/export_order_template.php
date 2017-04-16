<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header("Content-Disposition: attachment;filename=订单模板".date('Y-m-d',NOW_TIME).".csv");

$rs = [
    ["订单号（必填）", "物流公司（必填）","物流单号（必填）"],
];

$i=1;
foreach ($aOrderId as $key => $value) {
    $rs[$i]=[$value['order_id'],'',''];
    $i++;
}

$str = '';
foreach ($rs as $row) {
    $str_arr = array();
    foreach ($row as $column) {
        $str_arr[] = '"' . str_replace('"', '""', iconv("UTF-8", "GB2312//IGNORE", $column) ) . '"';
    }
    $str.=implode(',', $str_arr) . PHP_EOL;
}
echo $str;

?>
