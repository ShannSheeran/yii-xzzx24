<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Response;
use bases\lib\Url;
use Yii;
use yii\helpers\FileHelper;
use yii\helpers\Html;

/**
 * 代码自动生成
 */
class AutoGenerateCodeController extends ManagerBaseController {

    public function actionIndex() {
        if (!Yii::$app->request->isPost) {
            return $this->render('show', ['aTabelList' => Yii::$app->db->getSchema()->getTableNames()]);
        }
        $nameSpace = (string)Yii::$app->request->post('namespace','');
        $contorllerName = (string)Yii::$app->request->post('contorller_name','');
        $contorllerParent = (string)Yii::$app->request->post('contorller_parent','');
        $tabelName = (string)Yii::$app->request->post('table','');
        $tabelPre = (string)Yii::$app->request->post('table_pre','');
        if (!$tabelName || !$contorllerName || !$nameSpace) {
            return new Response('缺少参数');
        }
        
        //debug(Yii::$app->request->post(),11);
        
        $oTabelField = Yii::$app->db->getSchema()->getTableSchema($tabelName);
        $basePath = PROJECT_PATH . '/rebuild/apps/' . lcfirst($nameSpace);        
        $templateBasePath =  PROJECT_PATH . '/rebuild/apps/admin/views/auto-generate-code';
       
        //表前缀处理
        $xTableName = $tabelName;
        if($tabelPre){
            $xTableName = str_replace($tabelPre, '', $tabelName);
        }
        $aTableName = array_map(function($v){
            return ucfirst($v);
        },explode('_', $tabelName));
        
        $xModelName = implode('', $aTableName);
        //1.生成mForm
        $formModelPath = $basePath . '/models/form/' . $xModelName . 'Form.php';
        $xMFormTemplatePath = $templateBasePath.'/M_Form.php';
        if (is_file($formModelPath)) {
            return new Response('数据操作模型已经存在');
        }
        
        $this->_dealTemplateReplace($xMFormTemplatePath, $formModelPath, [
            '{__NAME_SPACE}',
            '{__MFORMNAME__}',
            '{__TABLE_FIELD__}',
            '{__RULES__}',
            '{__SEARCH_CONDITION__}'
            ], [
                lcfirst($nameSpace),
                $xModelName,
                $this->_getAttrTabelField($oTabelField),
                $this->_getRulesTabelField($oTabelField),
                $this->_getSearchTabelField($oTabelField),
                
        ]);
        //2.生成mModel
        $modelPath = PROJECT_PATH . '/rebuild/common/model/' . implode('', $aTableName) . '.php';
        $xMModelTemplatePath = $templateBasePath.'/M_Model.php';
        if (is_file($modelPath)) {
            return new Response('数据模型已经存在');
        }
        
        $this->_dealTemplateReplace($xMModelTemplatePath, $modelPath, [
            '{__MMODEL_NAME__}',
            '{___TABEL_NAMW__}',
            ], [
                $xModelName,
                $tabelName,
                
        ]);
      
        //控制器生成
        $contorllerFile = $basePath . '/controllers/' . ucfirst($contorllerName) . 'Controller.php';        
        $xCcontrollerTemplatePath = $templateBasePath.'/C_Controller.php';
        if (is_file($contorllerFile)) {
            return new Response('控制器已经存在');
        }
        $this->_dealTemplateReplace($xCcontrollerTemplatePath, $contorllerFile, [
            '{__NAME_SPACE}',
            '{__MFORMNAME__}',
            '{__MMODEL_NAME__}',
            '{__CONTORLLER_NAME__}',
            '{__CONTORLLER_PARENT}',
            '{__SEARCH_PARAMETER__}'
            ], [
                lcfirst($nameSpace),
                $xModelName,
                $xModelName,
                ucfirst($contorllerName),
                $contorllerParent,
                $this->_getSearchParameterTabelField($oTabelField),
                
        ]);
        
        //视图生成
        //检测是生成文件夹        
        $viewTemplateBasePath = $basePath . '/views/' . self::humpToTag($contorllerName);
        if (is_dir($viewTemplateBasePath)) {
            return new Response('模板文件夹已经存在');
        }
        FileHelper::createDirectory($viewTemplateBasePath);
        $listViewFile = $viewTemplateBasePath . '/index.php';
        $xVViewListTemplatePath = $templateBasePath.'/V_index.php';
        $this->_dealTemplateReplace($xVViewListTemplatePath, $listViewFile, [
            '{__URL_NAME__}',
            '{__SEARCH_FIELD_INPUT__}',
            '{__TH_FIELD_NAME__}'
            ], [
                self::humpToTag($contorllerName),
                $this->_getSearchInputTabelField($oTabelField),
                $this->_getThTabelField($oTabelField),
                
        ]);
        
        $optViewFile = $viewTemplateBasePath . '/form.php';
        $xVViewOptTemplatePath = $templateBasePath.'/V_form.php';
        $this->_dealTemplateReplace($xVViewOptTemplatePath, $optViewFile, [
             '{__OPT_FIELD__}',
             ], [
                 $this->_getOptFieldTabelField($oTabelField),
         ]);
        
        //输出url 配置文件要添加的信息
        $xString = "<b style='color:green;'>所有代码操作全部生成成功<b><pre>请手动将下面url复制到 ". $basePath ."/config/url.php 文件里面<br>
        //".self::humpToTag($contorllerName)."路由配置
        '".self::humpToTag($contorllerName)."/list.html' => '". self::humpToTag($contorllerName) ."/index',
        '". self::humpToTag($contorllerName) ."/add.html' => '". self::humpToTag($contorllerName) ."/add',
        '". self::humpToTag($contorllerName) ."/editor.html' => '". self::humpToTag($contorllerName) ."/editor',
        '". self::humpToTag($contorllerName) ."/update.html' => '". self::humpToTag($contorllerName) ."/upate',
        '". self::humpToTag($contorllerName) ."/del.html' => '". self::humpToTag($contorllerName) ."/del',<br><br></pre>";
        
        return new Response('生成成功',1,$xString);
    }
    
    /**
     * 驼峰转中划线
     * @param type $str
     * @return type
     */
    public static function humpToTag($str,$tag = '-') {

        $array = array();
        for ($i = 0; $i < strlen($str); $i++) {
            if ($str[$i] == strtolower($str[$i])) {
                $array[] = $str[$i];
            } else {
                if ($i > 0) {
                    $array[] = $tag;
                }
                $array[] = strtolower($str[$i]);
            }
        }

        $result = implode('', $array);
        return $result;
    }

    
    private function _getAttrTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $xAttrString = '';
        foreach($aColumns as $key => $aItem){
            $xAttrString .= 'public $'. $key  .';
    ';
        }
        return $xAttrString;
    }
    
    private function _getRulesTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $xAttrString = '[';
        foreach($aColumns as $key => $aItem){
            $xAttrString .= '\''. $key .'\',';
        }
        $xAttrString .= ']';
        return $xAttrString;
    }
    
    private function _getSearchTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $xAttrString = '';
        foreach($aColumns as $key => $aItem){
            $type = $aItem->phpType;
            if($type == 'integer'){
                 $xAttrString .= '
        if ($this->' . $key . ' != \'\') {
            $aCondition[] = [\'' . $key . '\' => (int)$this->' . $key . '];
        }';
                continue;
            }else if($type == 'string'){
                $xAttrString .= '
        if ($this->' . $key . ') {
            $aCondition[] = [\'like\', \'' . $key . '\', $this->' . $key . '];
        }';
            }
            
           
        }
        return $xAttrString;
    }
    
    
    private function _getSearchParameterTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $primaryKey = $aTabelField->primaryKey;
        $xAttrString = '';
        $aDateField = (array)Yii::$app->request->post('date',[]);
        foreach($aColumns as $key => $aItem){
            $type = $aItem->phpType;
            if(isset($primaryKey[0]) && ($key == $primaryKey[0])){
                continue;
            }
             //日期处理
            if(isset($aDateField[$key]) && $aDateField[$key]){
                $xAttrString .= '\''. $key .'\' => strtotime((string) $oRequest->post(\'' .$key. '\',\'\')),
                ';
                continue;
            }
            if($type == 'integer'){
                $xAttrString .= '\''. $key .'\' => (int) $oRequest->post(\'' .$key. '\',0),
                ';
            }else{
                $xAttrString .= '\''. $key .'\' => (string) $oRequest->post(\'' .$key. '\',\'\'),
                ';
            }
            
           
        }
        return $xAttrString;
    }
    
    private function _getSearchInputTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $primaryKey = $aTabelField->primaryKey;
        $aAlias = (array)Yii::$app->request->post('alias',[]);
        $aDateField = (array)Yii::$app->request->post('date',[]);
        $aDeletedField = (array)Yii::$app->request->post('deleted',[]);
        $aSelectField = (array)Yii::$app->request->post('select',[]);
        $aRadioField = (array)Yii::$app->request->post('radio',[]);
        $xAttrString = '';
        foreach($aColumns as $key => $aItem){
            $type = $aItem->phpType;
            $commentName = (isset($aAlias[$key]) ?  $aAlias[$key] : $aItem->comment);
            if(isset($primaryKey[0]) && ($key == $primaryKey[0])){
                continue;
            }
            if(isset($aDeletedField[$key])){
                continue;
            }
            
            //日期处理
            if(isset($aDateField[$key]) && $aDateField[$key]){                
                $xAttrString .= '[
                    \'name\'=>\'start_'. $key .'\',
                    \'type\' => \'laydate\',
                    \'format\' => \'YYYY-MM-DD hh:mm:ss\',
                    \'field_type\' => \'input\',
                    \'value\' => \'\',
                    \'placeholder\' => \''. $commentName .'\',
                    \'pclass\' => \'col-xs-2\',
                    \'class\' => \'input-sm form-control\',
                ],
                ';
                $xAttrString .= '[
                    \'name\'=>\'end_'. $key .'\',
                    \'type\' => \'laydate\',
                    \'format\' => \'YYYY-MM-DD hh:mm:ss\',
                    \'field_type\' => \'input\',
                    \'value\' => \'\',
                    \'placeholder\' => \'到:'. $commentName .'\',
                    \'pclass\' => \'col-xs-2\',
                    \'class\' => \'input-sm form-control\',
                ],
                ';
                continue;
            }
            
            //下拉选择处理
            if(isset($aSelectField[$key]) && $aSelectField[$key]){                
                $xAttrString .= "[
                    'name'=>'". $key ."',
                    'field_type' => 'select',
                    'value' => '',
                    'placeholder' => '". $commentName ."',
                    'pclass' => 'col-xs-2',
                    'class' => 'input-sm form-control',
                    'data_provides' => [
                        'data'=>[['-". $key ."-','']],
                    ]
                ],
                ";
                continue;
            }
            
            //radio
            if(isset($aRadioField[$key]) && $aRadioField[$key]){                
                $xAttrString .= "[
                'name' => '". $key ."',
                'type' => 'other',
                'field_type' => 'input',
                'content'=>'<div class='col-xs-3'>
                    <div class='form-control way'>
                        <span class='' style='margin-right:5px;'>". $commentName ."</span>
                            <label for='". $key ."'><input type='checkbox' value='' id='". $key ."' class='way_ck'> ". $commentName ."</label>
                            <label for='". $key ."'><input type='checkbox' value='' id='". $key ."' class='way_ck'> ". $commentName ."</label>
                    </div>
                </div>',
            ],
            ";
                continue;
            }
            
            //普通文本处理
            $xAttrString .= '[
                \'name\'=>\''. $key .'\',
                \'type\' => \'text\',
                \'field_type\' => \'input\',
                \'value\' => \'\',
                \'placeholder\' => \''. $commentName .'\',
                \'pclass\' => \'col-xs-3\',
                \'class\' => \'input-sm form-control\',
            ],
            ';
            
           
        }
        return $xAttrString;
    }
    private function _getOptFieldTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $primaryKey = $aTabelField->primaryKey;
        $xAttrString = '';
        
        $aAlias = (array)Yii::$app->request->post('alias',[]);
        $aDateField = (array)Yii::$app->request->post('date',[]);
        $aDeletedField = (array)Yii::$app->request->post('deleted',[]);
        $aSelectField = (array)Yii::$app->request->post('select',[]);
        $aRadioField = (array)Yii::$app->request->post('radio',[]);
        foreach($aColumns as $key => $aItem){
            $type = $aItem->phpType;
            $commentName = (isset($aAlias[$key]) ?  $aAlias[$key] : $aItem->comment);
            if(isset($primaryKey[0]) && ($key == $primaryKey[0])){
                continue;
            }
            if(isset($aDateField[$key]) && $aDateField[$key]){
                $click = 'var $this = this; layui.use(\'laydate\', function(){
                    layui.laydate({elem: $this, istime: true, max: laydate.now(+1),format: \'YYYY-MM-DD hh:mm:ss\',min:\'\'});
                  });';              
                 //日期这些单独处理
                $xAttrString .= '<div class="form-group">
                                <label class="col-sm-2 control-label">'. $commentName .'</label>
                                <div class=\'col-sm-8\'>
                                    <input onclick="' . $click . '" placeholder="'. $commentName .'" title="'. $commentName .'" invalid_msg="'. $commentName .'" name="'. $key .'" value=\'<?php echo isset($aData[\''. $key .'\']) ? date(\'Y-m-d H:i:s\',$aData[\''. $key .'\']) : \'\'; ?>\' type="text" class="form-control input-sm">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                ';
                continue;
            }
            //日期这些单独处理
            $xAttrString .= '<div class="form-group">
                            <label class="col-sm-2 control-label">'. $commentName .'</label>
                            <div class=\'col-sm-8\'>
                                <input required placeholder="'. $commentName .'" title="'. $commentName .'" invalid_msg="'. $commentName .'" name="'. $key .'" value=\'<?php echo isset($aData[\''. $key .'\']) ? $aData[\''. $key .'\'] : \'\'; ?>\' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            ';
            
           
        }
        return $xAttrString;
    }
    private function _getThTabelField($aTabelField){
        if(!isset($aTabelField->columns)){
            return '';
        }
        $aColumns = $aTabelField->columns;
        $primaryKey = $aTabelField->primaryKey;
        $xAttrString = '';
        
        $aAlias = (array)Yii::$app->request->post('alias',[]);
        $aDateField = (array)Yii::$app->request->post('date',[]);
        $aDeletedField = (array)Yii::$app->request->post('deleted',[]);
        $aSelectField = (array)Yii::$app->request->post('select',[]);
        $aRadioField = (array)Yii::$app->request->post('radio',[]);
        foreach($aColumns as $key => $aItem){
            $type = $aItem->phpType;
            if(isset($primaryKey[0]) && ($key == $primaryKey[0])){
                continue;
            }
            $commentName = (isset($aAlias[$key]) ?  $aAlias[$key] : $aItem->comment);
            if(isset($aDateField[$key]) && $aDateField[$key]){
                //日期单独处理
                $xAttrString .= '\''. $key .'\' => [
                    \'title\'=>\''. $commentName .'\',
                    \'class\' => \'text-center\',
                    "content" => function($aData){
                        return isset($aData[\'' . $key . '\']) ? date("Y-m-d H:i:s",$aData[\'' . $key . '\']) : "未知";
                    }
                ],
                ';
                continue;
            }
            //普通文本
            $xAttrString .= '\''. $key .'\' => [
                \'title\'=>\''. $commentName .'\',
                \'class\' => \'text-center\',
            ],
            ';
            
           
        }
        return $xAttrString;
    }


    /**
     * 模板替换生成
     * @param string $filePath 指定模板文件
     * @param string $outPath 生成模板文件
     * @param array $aSearchTag 替换标识
     * @param array $aReplaceTag 替换值
     */
    private function _dealTemplateReplace($filePath,$outPath,$aSearchTag,$aReplaceTag){
        $xString = file_get_contents($filePath);
        $xFinallyStringString = str_replace($aSearchTag, $aReplaceTag, $xString);
        return file_put_contents($outPath, $xFinallyStringString);
    }


    public function actionGetTabelField() {
        $tabelName = (string) Yii::$app->request->post('table_name', '');
        if(!$tabelName){
           return new Response('',1,[]);
        }
        $aTabelField = Yii::$app->db->getSchema()->getTableSchema($tabelName);
        return new Response('',1,$aTabelField);
    }

    public function actionShowHome() {
        echo Url::to(['site/show-home']);
    }

}
