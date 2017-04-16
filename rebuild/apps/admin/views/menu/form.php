<?php 
use yii\helpers\Url;
    
?>
<div class="wrapper">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5><?php echo Yii::$app->request->get('id',0) ? '编辑' : '添加'; ?></h5>
                </div>
                <div class="ibox-content fadeInUp animated">

                    <form onsubmit="return false;" data-callback='_optCallBack' data-auto action="<?php echo Yii::$app->request->url;?>" class='form-horizontal' style='padding-top:20px'>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">上级菜单</label>
                            <div class='col-sm-8'>
                                <select name="pid" class="form-control input-sm">
                                    <option value="0">=== 主菜单 ===</option>
                                    <?php foreach($aDataList as $aItem){
                                        $isSelect = '';
                                        if(isset($aData['pid']) && $aItem['id'] == $aData['pid']){
                                            $isSelect = 'selected = "selected"';
                                        }
                                        echo '<option  value="' . $aItem['id'] . '" '. $isSelect .'>' . '&nbsp;'.$aItem['html'] . $aItem['title'] . '</option>';
                                    } ?>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">菜单名称</label>
                            <div class='col-sm-8'>
                                <input required maxlength="20" title="请输入菜单名称" invalid_msg="菜单" name="title" value='<?php echo isset($aData['title']) ? $aData['title'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">链接地址</label>
                            <div class='col-sm-8'>
                                <input required title="请输入链接地址" maxlength="100" name="url" value='<?php echo isset($aData['url']) ? $aData['url'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">菜单图标</label>
                            <div class='col-sm-8'>
                                <input onchange='$(this).next("i").get(0).className = this.value;' name="icon" value='<?php echo isset($aData['icon']) ? $aData['icon'] : ''; ?>' type="hidden" class="form-control input-sm">
                                <i data-icon data-field='icon' style='font-size:30px;' class=''></i>
                                <a data-icon data-field='icon' style="margin-left:10px">选择</a>
                                <a  onclick="$('[name=icon]').val('').trigger('change')" style="margin-left:10px">清空</a>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>


                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">保存数据</button>
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
    _optCallBack = function (ret, res) {
        if (ret.status !== 1) {
            
        }
        return true;
    };
    $(function(){
        $('input[name="icon"]').change();
    })
</script>

