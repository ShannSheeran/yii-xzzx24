<?php 

use bases\lib\Url;

?>
<div class="wrapper">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>代码自动生成</h5>
                </div>
                <div class="ibox-content fadeInUp animated">

                    <form onsubmit="return false;" data-callback='_optCallBack' data-auto action="<?php echo Yii::$app->request->url;?>" class='form-horizontal' style='padding-top:20px'>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">命名空间</label>
                            <div class='col-sm-8'>
                                <input required maxlength="20" placeholder="例如:Admin" title="请输入命名空间" invalid_msg="命名空间" name="namespace" value='Admin' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">控制器名称</label>
                            <div class='col-sm-8'>
                                <input required maxlength="20" placeholder="例如:Test" title="请输入控制器名称" invalid_msg="控制器名称" name="contorller_name" value='' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">控制器继承父类</label>
                            <div class='col-sm-8'>
                                <input required maxlength="20" placeholder="\xx\xx\xxController" title="请输入控制器继承父类" invalid_msg="控制器继承父类" name="contorller_parent" value='\admin\lib\ManagerBaseController' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">表前缀</label>
                            <div class='col-sm-8'>
                                <input placeholder="pre_" name="table_pre" value='' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">对应表</label>
                            <div class='col-sm-8'>
                                <select name="table" class="form-control input-sm">
                                    <option value="">请选择表</option>
                                    <?php 
                                    foreach($aTabelList as $tableName){
                                        echo '<option value="'. $tableName .'">'. $tableName .'</option>';
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group J-selectInfo" style="display: none;">
                            <label  class="col-xs-3 control-label no-padding-right">对应表</label>
                            <div class="col-xs-9 col-sm-5">
                                <div class="control-group">
                                    <div class="col-xs-12">
                                        <!-- PAGE CONTENT BEGINS -->
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <table id="simple-table" class="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                             <th>字段</th>
                                                            <th class="center">
                                                                是否编辑器
                                                            </th>
                                                            <th class="center">
                                                                是否日期
                                                            </th>
                                                            <th class="center">
                                                                是否图片
                                                            </th>
                                                            <th>是否下拉</th>
                                                            <th>是否删除字段</th>
                                                           
                                                            <th>数据显示名称</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody class="J-showSelectItemList">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>                
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">生成</button>
                                    <button data-back type="button" class="btn btn-warning navbar-btn">&nbsp&nbsp&nbsp返&nbsp回&nbsp&nbsp&nbsp</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>

</div>
<script>
    function _buildSelectOption(aDataLists){
        var aDataList = aDataLists.columns;
        var html = '';
        for (var item in aDataList) {
            var field = item;
            var alias = aDataList[item].comment == '' ? field : aDataList[item].comment;
            html += '<tr>\
                        <td>\
                            '+ field +'\
                        </td>\
                        <td class="center">\
                            <label class="pos-rel">\
                                <input type="checkbox" class="ace J-cbox" value="'+ field +'" name= ed['+ field +']>\
                                <span class="lbl"></span>\
                            </label>\
                        </td>\
                        <td class="center">\
                            <label class="pos-rel">\
                                <input type="checkbox" class="ace  J-cbox" value="'+ field +'" name= date['+ field +']>\
                                <span class="lbl"></span>\
                            </label>\
                        </td>\
                        <td class="center">\
                            <label class="pos-rel">\
                                <input type="checkbox" class="ace  J-cbox" value="'+ field +'" name= image['+ field +']>\
                                <span class="lbl"></span>\
                            </label>\
                        </td>\
                        <td class="center">\
                            <label class="pos-rel">\
                                <input type="checkbox" class="ace  J-cbox" value="'+ field +'" name= select['+ field +']>\
                                <span class="lbl"></span>\
                            </label>\
                        </td>\
                        <td class="center">\
                            <label class="pos-rel">\
                                <input type="checkbox" class="ace  J-cbox" value="'+ field +'" name= deleted['+ field +']>\
                                <span class="lbl"></span>\
                            </label>\
                        </td>\
                        <td><input type="text" class="ace  J-cbox" value="'+ alias +'" name= alias['+ field +']></td>\
                    </tr>';
            }
            return html;
    }
    _optCallBack = function (ret, res) {
        if (ret.status == 1) {
            $.msg.alert(ret.data);
            return false;
        }
        return true;
    };
    $(function () {
        $('select[name="table"]').change(function(){
                ajax({
                    data:{table_name:$(this).val()},
                    url:'<?php echo Url::to(['auto-generate-code/get-tabel-field']);?>',
                    success:function(aData){
                        $('.J-selectInfo').show();
                        var $dom = $(_buildSelectOption(aData.data));
                        $('.J-showSelectItemList').empty().append($dom);
                        $dom.find('.J-cbox').each(function(){
                            $(this).change(function(){
                                if($(this).prop("checked")){
                                    var ll = $(this).closest('tr').find('.J-cbox:checked').length;
                                    if(ll > 1){
                                        $(this).attr("checked",false);
                                        return $.msg.error('不能选择两个属性');
                                    }
                                }
                            });
                        });
                    }
                });
        });
    })
</script>

