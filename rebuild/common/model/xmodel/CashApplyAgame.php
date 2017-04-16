<?php

namespace common\model\xmodel;

use Yii;
use yii\db\ActiveRecord;

class CashApplyAgame extends ActiveRecord {

    const REDNET_CASH_PRECENT = 0.4;
    
    public static function getDb(){
        return Yii::$app->xzzxdb;
    }
    
    public static function tableName() {
        return 'cash_apply_agame';
    }
    
    public static function xx(){
        $sql0 = "SELECT  COUNT(DISTINCT ra.advert_id)  AS num,rd.`name` as rname,rd.id as rid,o.`name` FROM receive_advert  AS ra 
            LEFT JOIN rednet AS rd ON rd.id = ra.rednet_id 
            LEFT JOIN organizations AS o ON o.id = rd.`org` 
            WHERE ra.`create_at` >= '2017-01-01 00:00:00' AND ra.`create_at` < '2017-04-01 00:00:00'
            GROUP BY ra.rednet_id ORDER BY num DESC limit 0,1000";
        $aRedInfoList = Yii::$app->xzzxdb->createCommand($sql0)->queryAll();
        foreach($aRedInfoList as $k => $aRedItem){
            $sql11 = "SELECT sum(red_cpc)  AS num FROM view_log where rednet_id = ".$aRedItem['rid'] ." and (is_effective = 1 or is_effective = 2)";
            $aMeny = Yii::$app->xzzxdb->createCommand($sql11)->queryAll();
            $meny = isset($aMeny[0]['num']) ? $aMeny[0]['num'] : 0;
            $aRedInfoList[$k]['meny'] = $meny;
        }
        
        echo '<table>';
        foreach($aRedInfoList as $aItem){
            echo '<tr><td>'. $aItem['rname'] .'</td><td>'. $aItem['name'] .'</td><td>'. $aItem['num'] .'</td><td>'. $aItem['meny'] .'</td></tr>';
        }
        echo '</table>';die;
        debug($aRedInfoList,11);
        $sql = 'SELECT  COUNT(ra.id)  AS num,o.`name`,o.id FROM receive_advert  AS ra 
        LEFT JOIN rednet AS rd ON rd.id = ra.rednet_id 
        LEFT JOIN organizations AS o ON o.id = rd.`org` 
        GROUP BY o.id ORDER BY num DESC';
        $aData = Yii::$app->xzzxdb->createCommand($sql)->queryAll();        
        
        $sql1 = "SELECT  COUNT(ra.id)  AS num,o.`name`,o.id FROM receive_advert  AS ra 
LEFT JOIN rednet AS rd ON rd.id = ra.rednet_id 
LEFT JOIN organizations AS o ON o.id = rd.`org` 
WHERE ra.`create_at` >= '2017-01-01 00:00:00' AND ra.`create_at` < '2017-02-01 00:00:00'
GROUP BY o.id ORDER BY num DESC";
        $aData1 = Yii::$app->xzzxdb->createCommand($sql1)->queryAll();
        
        $sql2 = "SELECT  COUNT(ra.id)  AS num,o.`name`,o.id FROM receive_advert  AS ra 
LEFT JOIN rednet AS rd ON rd.id = ra.rednet_id 
LEFT JOIN organizations AS o ON o.id = rd.`org` 
WHERE ra.`create_at` >= '2017-02-01 00:00:00' AND ra.`create_at` < '2017-03-01 00:00:00'
GROUP BY o.id ORDER BY num DESC";
        $aData2 = Yii::$app->xzzxdb->createCommand($sql2)->queryAll();
        
        $sql3 = "SELECT  COUNT(ra.id)  AS num,o.`name`,o.id FROM receive_advert  AS ra 
LEFT JOIN rednet AS rd ON rd.id = ra.rednet_id 
LEFT JOIN organizations AS o ON o.id = rd.`org` 
WHERE ra.`create_at` >= '2017-03-01 00:00:00' AND ra.`create_at` < '2017-04-01 00:00:00'
GROUP BY o.id ORDER BY num DESC";
        $aData3 = Yii::$app->xzzxdb->createCommand($sql3)->queryAll();

        foreach($aData as $k =>$allData){
            $aData[$k]['k1'] = 0;
            $aData[$k]['k2'] = 0;
            $aData[$k]['k3'] = 0;
            foreach($aData1 as $a1){
                if($a1['id'] == $allData['id']){
                    $aData[$k]['k1'] = $a1['num'];
                }
            }
            foreach($aData2 as $a2){
                if($a2['id'] == $allData['id']){
                    $aData[$k]['k2'] = $a2['num'];
                }
            }
            foreach($aData3 as $a3){
                if($a3['id'] == $allData['id']){
                    $aData[$k]['k3'] = $a3['num'];
                }
            }
        }
        echo '<table>';
        foreach($aData as $aItem){
            $aa1 = $aItem['k1'] + $aItem['k2'];
            $aa2 = $aItem['k2'] + $aItem['k3'];
            $tag = '上升';
            if($aa1 > $aa2){
                $tag = '下降';
            }
            echo '<tr><td>'. $aItem['name'] .'</td><td>'. $aItem['k1'] .'</td><td>'. $aItem['k2'] .'</td><td>'. $aItem['k3'] .'</td><td>'. $aItem['num'] .'</td><td>'. $tag .'</td></tr>';
        }
        echo '</table>';die;
        
    }
}
