<?php
namespace common\model\form;

use Yii;
use bases\lib\EasyResponse;
use admin\models\ExpressCode;
use admin\models\ShopOrder;

/**
 * 后台通用图片上传表单
 */
class CsvUploadForm extends \yii\base\Model{

	/**
	 * @var oCsv 文件对象
	 */
	public $oCsv = null;
	
	
	/**
	 * @inheritedoc
	 */
	public function rules(){
	    return [
	        [['oCsv'], 'safe'],
	    ];
	}

	/**
	 * 验证文件类型
	 * @param mixed $param
	 * @param string $attrName
	 * @return boolean
	 */
	public function customValidate() {
	    $info = pathinfo($this->oCsv);

		if( strtolower($info['extension']) == 'csv'){
			return false;
		}else{
			return true;
		}
	}

	/**
	 * 上传图片
	 * @return boolean
	 */
	public function upload_order(){
	    $handle = fopen($this->oCsv->tempName, 'r');
	    $result = $this->input_csv($handle); //解析csv
		$len_result = count($result);

	    if($len_result==0){
	        return new EasyResponse('CSV表为空',0,[],0);
	    }
	    $aInsertData = [];
	    $aFailData = [];//错误数据集合

		for ($i = 1; $i <= $len_result; $i++) { //循环获取各字段值
	        $order_id = iconv('gb2312', 'utf-8', $result[$i][0]); //中文转码
	        $express_code = iconv('gb2312', 'utf-8', $result[$i][1]);
	        $express_number = iconv('gb2312', 'utf-8', $result[$i][2]);

	        if($order_id == '' || $express_code == '' || $express_number == ''){
	            $aFailData[$i-1] = "订单号:".$order_id."导入失败";
	        }

			if(!ShopOrder::getCountNum(['and',['order_id' => $order_id],['status' => 0]])){
				$aFailData[$i-1] = "订单号:".$order_id."导入失败";
			}


			if(!isset($aFailData[$i-1])){
				if(ExpressCode::getCount("express like '%" . $express_code . "%' and status = 1" ) != 1){
					$aFailData[$i-1] = "订单号:".$order_id."导入失败";
				}

				$express_name = ExpressCode::select_one("express like '%" . $express_code ."%' and status = 1" , 'express');
				if(isset($express_name['express'])){
					$aInsertData = [
						'express_name' => $express_name['express'],
						'express_number' => $express_number,
						'delivery_time' => NOW_TIME,
						'status' => 1,
					];
				}

				if(!isset($aFailData[$i-1])){

					if(!ShopOrder::update($aInsertData , ['order_id' => $order_id])){
						$aFailData[$i-1] = "订单号:".$order_id."导入失败";
					}
				}
			}

		}
	    fclose($handle); //关闭指针


	    if($aFailData){
			$data = ['0'=>implode(',',$aFailData)];
			return new EasyResponse($data,0,[],0);

		}
		return new EasyResponse('上传成功',1,[],0);
	}
	
	//解析csv
	public function input_csv($csv_file) {
	    $result_arr = [];
	    $i = 0;
	    while ($data_line = fgetcsv($csv_file, 10000)) {
	        if($i == 0){
	            $csv_key_name_arr = $data_line;
	            $i++;
	            continue;
	        }
	
	        foreach($csv_key_name_arr as $csv_key_num => $csv_key_name){
	            $result_arr[$i][$csv_key_num] = $data_line[$csv_key_num];
	        }
	        $i++;
	    }
	    return $result_arr;
	}
}