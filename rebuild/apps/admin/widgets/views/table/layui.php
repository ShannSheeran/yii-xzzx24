<?php
/* @var $this View */

use yii\helpers\Html;
use yii\web\View;
use yii\widgets\LinkPager;
//使用示例
//[
//    'title'=> '广告列表',
//    'aOpt'=>[
//        [
//            'title'=>'批量审核通过',
//            'icon_class'=>'glyphicon glyphicon-eye-open',
//            //这里定义的任何属性都会加到元素里面
//            'data-open'=>  bases\lib\Url::to(['ad/index']),
//        ],
//        [
//            'title'=>'批量审核驳回',
//            'icon_class'=>'glyphicon glyphicon-eye-open'
//        ],
//        [
//            'title'=>'批量禁用',
//            'icon_class'=>'glyphicon glyphicon-eye-close'
//        ],
//        [
//            'title'=>'批量启用',
//            'icon_class'=>'fa  fa-file-excel-o'
//        ],
//    ],
//    'aSearch' => [
//        'action' => Url::to(['ad/list']),
//        'aFieldList'=>  [
//            [
//                'name' => 'namedd',
//                'type' => 'text',
//                'field_type' => 'input',
//                'value' => '1',
//                'placeholder' => '广告名称',
//                'pclass' => 'col-xs-3',
//                'class'=>'input-sm form-control',
//            ],
//            [
//                'name' => 'radio',
//                'type' => 'other',
//                'field_type' => 'input',
//                'content'=>'<div class="col-xs-3">
//                    <div class="form-control way">
//                        <span class="" style="margin-right:5px;">通讯方式</span>
//                                            <label for="手机"><input type="checkbox" value="phone" id="手机" class="way_ck"> 手机</label>
//                                                <label for="邮箱"><input type="checkbox" value="email" id="邮箱" class="way_ck"> 邮箱</label>
//
//                        <input type="hidden" name="way" value="">
//                    </div>
//                </div>',
//            ],
//            [
//                //指定去某个类静态方法获取数据
//                'name' => 'fff',
//                'field_type' => 'select',
//                'value' => '',
//                'placeholder' => '广告名称',
//                'pclass' => 'col-xs-2',
//                'class'=>'input-sm form-control',
//                'data_provides' => [
//                    'class' => '\common\model\ad',
//                    'method' => 'getTess',
//                    'params' => ['aa'],
//                    'options' => [
//                        'useEmpty' => true,
//                        'emptyText' => '请选择',
//                        'emptyValue' => ''
//                    ]
//                ]
//            ],
//             [
//                'name' => 'create_time_start',
//                'type' => 'laydate',
//                'format'=>'YYYY-MM-DD hh:mm:ss',
//                'field_type' => 'input',
//                'value' => '',
//                'placeholder' => '广告开始时间',
//                'pclass' => 'col-xs-2',
//                'class'=>'input-sm form-control',
//            ],
//             [
//                'name' => 'create_time_end',
//                'type' => 'laydate',
//                'field_type' => 'input',
//                'format'=>'YYYY-MM-DD',
//                'value' => '',
//                'placeholder' => '广告结束时间',
//                'pclass' => 'col-xs-2',
//                'class'=>'input-sm form-control',
//            ],
//             [
//                'name' => 'other',
//                'type' => 'other',
//                'content'=>function(){
//                    return '<div class="col-xs-3"><div class="form-group"><input type="text" class="input-sm form-control" name="eeee" value="" placeholder="广告名称"></div></div>';
//                }
//            ],
//        ]
//    ],
//    'aColumns' =>[
//        'fBuildRowId'=>function($aRowData){
//            return $aRowData['id'];
//        },
//        'isCheckBox'=>true,
//        'aColumnsList' => [
//            'title' => ['title' => '广告名称'],
//            'status' => [
//                'title' => '广告状态',
//                'content' => function($aData) {
//                    $str = '启用';
//                    if ($aData == 0) {
//                        $str = '禁用';
//                    }
//                    return $str;
//                }
//            ],
//            'pay_status' => [
//                'title' => '付款状态',
//                'content' => function($aData) {
//                    return '已付款';
//                }
//            ],
//            'send_status' => [
//                'title' => '发货状态',
//                'content' => function($aData) {
//                    return '未发货';
//                }
//            ],
//            'cpc' => [
//                'title' => 'cpc',
//            ],
//            //当操作中出现data-action、data-url、data-load、data-modal会自动进行权限认证，没有授权的会自动被删除
//            'operation' => [
//                'title' => '操作',
//                'class' => 'col-sm-1',
//                'content' => function($aData) {
//                    return '<a href="javascript:;" onclick="showOrder(' . $aData['id'] . ');">查看</a>';
//                }
//            ],
//        ],
//    ],
//    'aDataList' => $aOrderList,
//    'oPage'=>$oPage,
//]
?>
<div class="wrapper wrapper-content">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox-title">
                <h5 class="pull-left"><?php echo $title; ?></h5>
                <div class="pull-right">
                    <?php 
                    function getHtmlUrl($aData){
                        $url = '';
                        if(isset($aData['data-modal'])){
                            $url = $aData['data-modal'];
                        }else if(isset($aData['data-action'])){
                            $url = $aData['data-action'];
                        }else if(isset($aData['data-load'])){
                            $url = $aData['data-load'];
                        }else if(isset($aData['data-open'])){
                            $url = $aData['data-open'];
                        }
                        return $url;
                    }
                    
                    function replaceDataHtml($content,$htmlTag){
                        $aTempContent = [];
                        preg_match_all('#<a.*data\-'.$htmlTag.'\="\/(.*)".*>.*</a>#Ui', $content, $aTempContent);
                        if (!isset($aTempContent[1])) {
                           return $content;
                        }                        
                        foreach ($aTempContent[1] as $aTemp) {
                            if (isset($aTempContent[0])) {
                                unset($aTempContent[0]);
                            }
                            $u1 = '';
                            $fullUrl = $aTemp;
                            $p1 = strpos($fullUrl, "?");
                            if ($p1 !== false) {
                                $u1 = substr($fullUrl, 0, $p1);
                                $fullUrl = str_replace('?', '\?', $fullUrl);
                            }
                            if(!$u1){
                                $u1 = $fullUrl;
                            }

                            if ($u1 && !Yii::$app->rbacAuth->checkMenu(Yii::$app->manager->id, Yii::$app->rbacAuth->parseRequest($u1))) {
                                $content = preg_replace('#<a.*data\-'.$htmlTag.'\=["|\']{1}\/' . $fullUrl . '["|\']{1}.*>.*</a>#iU', '', $content);
                            }
                        }
                        return $content;
                    }
                    
                    /**
                     * 去掉没权限的操作
                     * @param type $content 要替换的操作内容
                     * @return string
                     */
                    function replaceAuthOpt($content) {
                        $content = replaceDataHtml($content,'action');
                        $content = replaceDataHtml($content,'open');
                        $content = replaceDataHtml($content,'load');
                        $content = replaceDataHtml($content,'url');
                        return $content;
                    }
                    
                    foreach ($aOpt as $aOptItem) {?>                    
                     <?php
                            if(!Yii::$app->rbacAuth->checkMenu(Yii::$app->manager->id,Yii::$app->rbacAuth->parseRequest(getHtmlUrl($aOptItem)))){
                                continue;
                            }
                            $aButtonOptions = [];
                            //生成操作按钮
                            $aButtonOptions['class'] = 'btn btn-white btn-sm navbar-btn';
                            foreach($aOptItem as $dataName => $dataValue){
                                $aButtonOptions[$dataName] = $dataValue;
                            }
                            $aIconOptions = [];
                            if (isset($aOptItem['icon_class'])) {
                                $aIconOptions['class'] = $aOptItem['icon_class'];
                            } else {
                                $aIconOptions['class'] = 'glyphicon glyphicon-eye-close';
                            }
                            if(isset($aButtonOptions['icon_class'])){
                                unset($aButtonOptions['icon_class']);
                            }
                            $buttonContent = Html::tag('i', '', $aIconOptions) . $aOptItem['title'];
                            echo Html::tag('button', $buttonContent, $aButtonOptions);
                        ?>
                    <?php }?>
                </div>
            </div>
            <div class="ibox-content fadeInUp animated">
                <?php  if(isset($aSearch['aFieldList'])){?>
                <form class="animated form-search" onsubmit="return false;" data-form-href="" action="<?php echo isset($aSearch['action']) ? $aSearch['action'] : Yii::$app->request->url;?>" method="GET">
                    <div class="row">
                    <?php 
                    
                        //检索字段
                        foreach($aSearch['aFieldList'] as $aFieldItem){
                             //判断是不是自定义格式
                            if(isset($aFieldItem['type']) && $aFieldItem['type'] == 'other'){
                                echo is_callable($aFieldItem['content']) ? $aFieldItem['content']() : $aFieldItem['content'];
                                continue;
                            }
                            $aFeildAttr = [];
                            $aRowAttr = [];
                            //获取检索值
                            $searchVaue = Yii::$app->request->get($aFieldItem['name'],false);
                            if($searchVaue){
                                $aFieldItem['value'] = $searchVaue;
                            }                           
                           if($aFieldItem['value'] == ''){
                               unset($aFieldItem['value']);
                           }
                            //获取所有input 属性
                            foreach($aFieldItem as $fieldAttr => $rowVal){                                
                                if($fieldAttr == 'pclass'){
                                    $aRowAttr['class'] = $rowVal;
                                    continue;
                                }
                                $aFeildAttr[$fieldAttr] = $rowVal;
                            }                            
                            $tag = 'input';
                            //获取生成标签
                            if(isset($aFeildAttr['field_type'])){
                               $tag = $aFeildAttr['field_type'];
                               unset( $aFeildAttr['field_type']);
                            }
                            //如果配置提供数据源直接获取数据源
                            $aSelectData = [];
                            if(isset($aFieldItem['data_provides']['data'])){
                                $aSelectData = $aFieldItem['data_provides']['data'];
                                unset($aFeildAttr['data_provides']);
                            }else if(isset($aFieldItem['data_provides']['class']) && isset($aFieldItem['data_provides']['method'])){
                                //指定类方法获取
                                //func_get_args();用这个来获取传递过去的参数
                                $selectClass = [$aFieldItem['data_provides']['class'],$aFieldItem['data_provides']['method']];
                                $selectParams = isset($aFieldItem['data_provides']['params'])?$aFieldItem['data_provides']['params']:[];
                                $aSelectData = call_user_func_array($selectClass,$selectParams);
                                $defaultShowTag = isset($aFieldItem['data_provides']['options']['emptyText']) ? $aFieldItem['data_provides']['options']['emptyText'] : '';
                                $defaultShowValue = isset($aFieldItem['data_provides']['options']['emptyValue']) ? $aFieldItem['data_provides']['options']['emptyValue'] : '';
                                if($defaultShowTag){
                                    array_unshift($aSelectData, [$aFieldItem['data_provides']['options']['emptyText'],$defaultShowValue]);
                                }
                                unset($aFeildAttr['data_provides']);
                            }
                            
                            //下拉选择
                            $fielContent = '';
                            if($tag == 'select'){
                                $aOptions = [];                                
                                foreach($aSelectData as $optionValue){
                                    $defaultSelect = Yii::$app->request->get($aFieldItem['name'],false);
                                    if(isset($optionValue[1]) && $optionValue[1] != $defaultSelect){
                                        $aOptions[] = Html::tag('option', isset($optionValue[0]) ? $optionValue[0] : '',['value'=>isset($optionValue[1])?$optionValue[1]:'']);
                                    }else{
                                        //给默认值
                                        if($defaultSelect != '' &&  $defaultSelect != 'all' && isset($optionValue[1]) && $defaultSelect == $optionValue[1]){
                                            $aOptions[] = Html::tag('option', isset($optionValue[0]) ? $optionValue[0] : '',['selected'=>'select','value'=>isset($optionValue[1])?$optionValue[1]:'']);
                                        }else{
                                            $aOptions[] = Html::tag('option', isset($optionValue[0]) ? $optionValue[0] : '',['value'=>isset($optionValue[1])?$optionValue[1]:'']);
                                        }
                                        
                                    }
                                    
                                }
                                $fielContent = implode('', $aOptions);
                            }
                            //日期
                            if(isset($aFieldItem['type']) && $aFieldItem['type'] == 'laydate'){
                                $format = 'YYYY-MM-DD hh:mm:ss';
                                if(isset($aFieldItem['format'])){
                                    $format = $aFieldItem['format'];
                                }
                                //兼用layui用法
                                $max = isset($aFieldItem['max']) ? $aFieldItem['max'] : 'laydate.now(+1)';
                                $min = isset($aFieldItem['min']) ? $aFieldItem['min'] : '';
                                $aFeildAttr['onclick'] = 'var $this = this; var oldVal = $($this).val(); layui.use("laydate", function(){
                                    layui.laydate({elem: $this, issure: true, istime: true, max: '. $max .',format: "'. $format .'",min:"'. $min .'"});oldVal == "" && $($this).val("");
                                  });';
                            }
                            
                            $fieldTag =  Html::tag($tag, $fielContent ,$aFeildAttr);
                            $colRowContent = Html::tag('div', $fieldTag,['class'=>'form-group']);                            
                            echo Html::tag('div', $colRowContent,$aRowAttr);
                           
                        } 
                        ?>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <button class="btn btn-sm btn-primary "><i class="fa fa-search"></i> 搜索</button>
                            </div>
                        </div>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <a class="btn btn-sm btn-warning" onclick="$(':input',$(this).closest('form')).not(':button, :submit, :reset, :hidden').val('') .removeAttr('checked') .removeAttr('selected');">重置</a>
                            </div>
                        </div>
                    </div>

                </form>
                <?php  }?>

                <form onsubmit="return false;" data-auto="" method="POST" action="jvascript:void(0);" data-listen="true" novalidate="novalidate">
                    <input type="hidden" value="resort" name="action">
                    <table class="table table-center table-hover">
                       <thead>
                            <tr>
                                <?php if($aColumns['isCheckBox']){?>
                                <th class="list-table-check-td">
                                    <input data-none-auto="" data-check-target=".list-check-box" type="checkbox">
                                </th>
                                <?php }?>
                                    <?php foreach($aColumns['aColumnsList'] as $columnId => $aColumn){
                                            $aOptions = [];
                                            if(isset($aColumn['class'])){
                                                    $aOptions['class'] = $aColumn['class'];
                                            }else{
                                                    $aOptions['class'] = 'col-xs-';
                                            }

                                            echo Html::tag('th', $aColumn['title'], $aOptions);
                                    } ?>
                            </tr>
                        </thead>
                        <tbody>
                                <?php
                                //获取唯一识别
                                $fBuildRowId = $aColumns['fBuildRowId'];
                                $customId = is_callable($fBuildRowId);               
                                foreach($aDataList as $i => $aData){
                                    $rowId = 0;
                                    if($customId){
                                        $rowId = $fBuildRowId($aData);
                                    }
                                ?>
                                    <tr class="J-row">
                                        <?php if($aColumns['isCheckBox']){?>
                                            <td class="list-table-check-td">
                                                <input data-none-auto="" value="<?php echo $rowId; ?>" class="list-check-box" type="checkbox">
                                            </td>
                                        <?php }?>
                                            <?php                                            
                                            foreach($aColumns['aColumnsList'] as $columnId => $aColumn){
                                                    $aItemOptions = [];
                                                    if(isset($aColumn['item'])){
                                                        $aItemOptions = $aColumn['item'];
                                                    }
                                                    //配合权限认证把方法提前调用之后得到内容直接返回给解析器parseColumnItemContent不再调用
                                                    if('operation' == $columnId ){
                                                        if(is_callable($aColumn['content'])){
                                                                echo ob_get_clean();
                                                                ob_start();
                                                                $content = $aColumn['content']($aData, $i);
                                                                $outputContent = ob_get_clean();
                                                                if(is_null($content)){
                                                                        $content = $outputContent;
                                                                }
                                                                ob_start();
                                                        }elseif(is_scalar($aColumn['content'])){
                                                                $content = $aColumn['content'];
                                                        }                                                        
                                                        $aColumn['content'] = replaceAuthOpt($content);
                                                        $aItemOptions['class'] = 'nowrap';
                                                   }
                                                    $content = $this->context->parseColumnItemContent($aData, $i, $aColumn, $columnId);
                                                    echo Html::tag('td', $content, $aItemOptions);
                                            } ?>
                                    </tr>
                                <?php } ?>
                        </tbody>                        
                    </table>
                </form>

                <div>
                    <div class="dataTables_info pull-left block nowrap" style="line-height:28px">
                        共<?php echo $oPage->totalCount; ?>条记录,已显示<?php echo ($oPage->getPage() + 1); ?>/<?php echo $oPage->getPageCount(); ?>页,每页 <select onchange="$.form.open(this.options[this.selectedIndex].value)">
                            <option <?php if($oPage->pageSize == 20){ echo  'selected="selected"'; } ?> value="<?php echo $oPage->createUrl(0,20); ?>">20</option>
                            <option <?php if($oPage->pageSize == 30){ echo   'selected="selected"'; } ?> value="<?php echo $oPage->createUrl(0,30); ?>">30</option>
                            <option <?php if($oPage->pageSize == 50){ echo  'selected="selected"'; } ?> value="<?php echo $oPage->createUrl(0,50); ?>">50</option>
                            <option <?php if($oPage->pageSize == 80){ echo  'selected="selected"'; } ?> value="<?php echo $oPage->createUrl(0,80); ?>">80</option>
                            <option <?php if($oPage->pageSize == 100){ echo  'selected="selected"'; } ?>  value="<?php echo $oPage->createUrl(0,100); ?>">100</option>
                        </select> 条记录.
                    </div>
                    <style>
                        .pagination,pull-right{
                            margin:0;
                        }
                    </style>
                    <?php echo str_replace('href=', 'data-open=', LinkPager::widget(['pagination' => $oPage, 'hideOnSinglePage' => true,'options'=>['class' => 'pagination pull-right']]));?>
                    <div style="clear:both"></div>
                </div>
            </div>
        </div>

    </div>
</div>