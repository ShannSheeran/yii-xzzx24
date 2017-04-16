
/*required: "必选字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.format("请输入一个长度最多是 {0} 的字符串"),
        minlength: jQuery.format("请输入一个长度最少是 {0} 的字符串"),
        rangelength: jQuery.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.format("请输入一个最大为 {0} 的值"),
        min: jQuery.format("请输入一个最小为 {0} 的值")

        data-options="required:true,validType:'length[1,3]'" ;//输入字符长度1-3位
*/
$.extend($.fn.validatebox.defaults.rules, {
    equalTo: { validator: function (value, param) { return $(param[0]).val() == value; }, message: '字段不匹配' }
});
$.extend($.fn.validatebox.defaults.rules, {
    isCN: {
        validator: function (value) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: "只能输入汉字"
    },
    idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length: {validator: function (value, param) {
            var len = $.trim(value).length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码
        validator: function (value) {
            return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            return /^(13|15|18)\d{9}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    intOrFloat: {// 验证整数或小数
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {        
        validator: function (value) {
            return /^\d+$/i.test(value);
            // 验证整数 可正负数
            //return /^[+]?[1-9]+\d*$/i.test(value);            
            //return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message: '年龄必须是0到120之间的整数'
    },
    chinese: {// 验证中文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真
        validator: function (value) {
            //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
            return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码
        validator: function (value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    date: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            //格式yyyy-MM-dd或yyyy-M-d
            return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
        },
        message: '请输入合适的日期格式'
    },
    same: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            } else {
                return true;
            }
        },
        message: '两次输入的密码不一致！'
    }
});
/**
 * 去除为空的key
 * @param {type} aData 数组
 * @returns {undefined}
 */
function clearDataNullWorth(aData) {
    for (var i in aData) {
        if (aData[i] == '') {
            delete aData[i];
        }
    }
}
/**
 * 去除为all的key
 * @param {type} aData 数组
 * @returns {undefined}
 */
function clearDataIsAllWorth(aData) {
    for (var i in aData) {
        if (aData[i] == 'all') {
            delete aData[i];
        }
    }
}

/**
 * 将serializeArray 得到的数据变成key_value格式
 * @param {type} aData serializeArray数组
 * @returns {undefined}
 */
function getFormJson(aData) {
    var oData = {};
    $.each(aData, function () {
        if (oData[this.name] !== undefined) {
            if (!oData[this.name].push) {
                oData[this.name] = [oData[this.name]];
            }
            oData[this.name].push(this.value || '');
        } else {
            oData[this.name] = this.value || '';
        }
    });
    return oData;
}

function validataForm($formDom) {
    var leg = $formDom.length;
    if (leg > 1) {
        var max = (leg - 1);
        $formDom.each(function (index) {
            if (max != index) {
                $(this).remove();
            }
        });
    }
    try {
        if (!$formDom.form('validate')) {
            return false;
        }
    } catch (e) {
        return true;
    }
    return true;
}

function ajaxForm($formDom, url, successFun, $clickDom,ueditorFileName) {
    var leg = $formDom.length;
    if (leg > 1) {
        var max = (leg - 1);
        $formDom.each(function (index) {
            if (max != index) {
                $(this).remove();
            }
        });
    }
    try {
        if (!$formDom.form('validate')) {
            return;
        }
    } catch (e) {
        UBox.show('网络出错,请重试', 0);
        return;
    }
    if (url === undefined) {
        UBox.show('缺少参数', -1);
        return;
    }
    var aData = getFormJson($formDom.serializeArray());
    if(ueditorFileName != undefined){
        aData[ueditorFileName] = aData.editorValue;
        delete aData.editorValue;
    }
    var beforeSend = function () {};
    if ($clickDom !== undefined) {
        beforeSend = function () {
            if ($clickDom.data('status') != undefined && !$clickDom.data('status')) {
                return false;
            }
            $clickDom.html('数据提交中..');
            $clickDom.data('status', false);
        }
    }
    ajax({
        url: url,
        data: aData,
        beforeSend: beforeSend,
        success: function (aResult) {
            UBox.show(aResult.msg, aResult.status);
            if (successFun !== undefined) {
                successFun(aResult);
            }
            if ($clickDom !== undefined) {
                $clickDom.html('保存');
                $clickDom.data('status', true);
            }

        }
    });

}

function windowsClose($dom) {
    if ($dom !== undefined) {
        try {
            $('#groupWindow').empty().append('<div id="'+$dom.attr('id')+'"></div>');
            $dom.window('close');
            $dom.remove();
            //$dom.window('destroy');
        } catch (e) {
            $.error('the dom not available');
        }
        return;
    }
    updateWindow();
    $('#opendWindows').window('close');

}
function updateWindow($dom) {
    if ($dom !== undefined) {
        $dom.window('refresh');
        return;
    }
    $('#opendWindows').window('refresh');
}

function ajaxSend($formDom, ajaxOption) {
    if ($formDom.attr('url') == undefined && ajaxOption.url == undefined) {
        $.error('url is not defined');
    }
    var aData = getFormJson($formDom.serializeArray());
    for (var i in aData) {
        var $this = $formDom.find('input[name="' + i + '"]');
        if ($this.length == 0) {
            $this = $formDom.find('select[name="' + i + '"]');
        }
        if ($this.length == 0) {
            $this = $formDom.find('textarea[name="' + i + '"]');
        }
        if ($this.data('required')) {
            if ($this.val() == "") {
                UBox.show("该字段不能为空");
                $this.focus();
                return;
            }
        }
        var pattern = $this.data('pattern');
        if (pattern !== undefined && $this.val() != "") {
            if (!new RegExp(pattern).test($this.val())) {
                if ($this.data('error_info') != undefined) {
                    UBox.show($this.data('error_info'));
                } else {
                    UBox.show("请正确填写该字段");
                }
                $this.focus();
                return;
            }
        }
    }
    clearDataNullWorth(aData);
    ajaxOption.data = aData;
    ajax(ajaxOption);
}

/*test
 var obj={name:'tom','class':{className:'class1'},classMates:[{name:'lily'}]};
 parseParam(obj);
 //output: "name=tom&class.className=class1&classMates[0].name=lily"
 parseParam(obj,'stu');
 //output: "stu.name=tom&stu.class.className=class1&stu.classMates[0].name=lily"
 */
function parseParam(param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    } else {
        $.each(param, function (i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + parseParam(this, k);
        });
    }
    return paramStr.substr(1);
}
/**
 * 传递一个formjquery对象返回剔除空值的
 * @param {type} $formDom
 * @returns {String}
 */
function getFromDataClearNullWorthToUrl($formDom) {
    var aData = getFormJson($formDom.serializeArray());
    clearDataNullWorth(aData);
    return parseParam(aData);
}

/**
 * 创建一个窗口
 * @param {type} url 获取内容url
 * @param {type} title 窗口标题
 * @param {type} option windows自带参数
 * @param {type} $dom 生成到哪个dom
 */
function createWindow(url, title, option, $dom) {
    if (option === undefined) {
        var option = {};
    }
    (option.loadingMessage == undefined) && (option.loadingMessage = '数据加载中。。');
    (option.width == undefined) && (option.width = 900);
    (option.height == undefined) && (option.height = 600);
    (option.cache == undefined) && (option.cache = false);
    if(option.type == undefined){
        if (option.frame !== undefined) {
            option.content = '<iframe src=' + url + ' width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"  allowtransparency="yes"></iframe>';
        } else {
            option.href = url;
        }       
    }else{
        option.href = null;
    }  
    
    option.title = title;
    option.modal = true;
    option.resizable = false;
    if ($dom !== undefined) {
        option.onBeforeClose = function () {
            $dom.empty();
        };
        try {
            $dom.window(option);
        } catch (e) {
            $.error('the dom is not defined');
        }
        return;
    }
    try{
        $('#opendWindows').window('close');
    }catch(e){}
    if ($('#opendWindows').length == 0) {
        $('<div id="opendWindows"></div>').append('body').window(option);
    } else {
        $('#opendWindows').window(option);
    }
    
}

/**
 * 统一封装生成dataGrid
 * @param {type} $dom 哪个dom需要生成
 * @param {type} oOption datagrid原始参数一致
 * oEidtor:{
 * isOpen:true,
 * saveUrl:'',//自动提交到的url
 * save:function(aData){},自定义提交方式如果填写了save回调，则不会自动提交
 * deleteUrl:'',//自动提交到删除的url
 * deleteCb:function(aData){},自定义提交方式如果填写了deleteCb回调，则deleteUrl不会自动提交
 * }要启用编辑模式
 * @returns $dom
 */
function createDataGrid($dom, oOption) {
    if ($dom == undefined) {
        return $.error('createDataGrid function parameter is 必须');
    }

    var _aCofing = {
        url: '',
        pagination: true,
        fitColumns: true,
        singleSelect: true,
        columns: [],
        loadMsg: '一大波数据正向你袭来,请稍后......',
        queryParams: {
            _csrf: $('meta[name="csrf-token"]').attr('content')
        },
        onLoadSuccess: function (data) {
            if (data.rows.length == 0) {
                UBox.show('抱歉找不到数据。。', -1);
                var body = $(this).data().datagrid.dc.body2;
                var aCoumnFields = $dom.datagrid('getColumnFields');
                body.find('table tbody').append('<tr><td colspan="'+ aCoumnFields.length +'" style="height: 25px; text-align: center; line-height:25px;">实在抱歉系统检索不到数据。。。</td></tr>');
            }
        }
    };
    var oDataGridConfig = $.extend({}, _aCofing, oOption);
    if(oDataGridConfig.queryParams._csrf == undefined){
        oDataGridConfig.queryParams._csrf = $('meta[name="csrf-token"]').attr('content');
    }
    if(oDataGridConfig.oEidtor != undefined){
        if(oDataGridConfig.oEidtor.isOpen == undefined){
            oDataGridConfig.oEidtor.isOpen = true;
        }
        if(oDataGridConfig.oEidtor.isOpen){                    
           oDataGridConfig = $.extend({}, oDataGridConfig, {                
                onEndEdit:function(index,row){
                    //回调
                    if(oDataGridConfig.oEidtor.save != undefined){
                        return oDataGridConfig.oEidtor.save(row);
                    }
                    
                    //自动提交
                    if(oDataGridConfig.oEidtor.saveUrl != undefined){
                        ajax({
                            url:oDataGridConfig.oEidtor.saveUrl,
                            data:row,
                            success:function(aResult){
                               return UBox.show(aResult.msg,aResult.status);
                                //return $dom.datagrid('reload');
                            }
                        });
                    }
                },
                onBeforeEdit:function(index,row){
                    row.editing = true;
                    $dom.data('editor_index',index);
                    $(this).datagrid('refreshRow', index);
                },
                onAfterEdit:function(index,row){
                    row.editing = false;
                    $(this).datagrid('refreshRow', index);
                },
                onCancelEdit:function(index,row){
                    row.editing = false;
                    $(this).datagrid('refreshRow', index);
                },
                onDblClickRow:function(index,row){
                    $dom.datagrid('beginEdit', index);
                },
            });
            if(oDataGridConfig.columns[0] != undefined){
                oDataGridConfig.columns[0].push({field:'action',title:'操作',width:80,align:'center',
                      formatter:function(value,row,index){
                          if (row.editing){
                              var s = '<a href="javascript:void(0)" data-dom="'+ $dom.attr('id') +'" onclick="_saverow(this)">保存</a> ';
                              var c = '<a href="javascript:void(0)" data-dom="'+ $dom.attr('id') +'" onclick="_cancelrow(this)">取消</a>';
                              return s+c;
                          } else {
                            var d = '',e='';
                            if (oDataGridConfig.oEidtor.save != undefined || oDataGridConfig.oEidtor.saveUrl != undefined) {
                                e = '<a href="javascript:void(0)" data-dom="'+ $dom.attr('id') +'" onclick="_editrow(this)">编辑</a> ';
                            }
                            if (oDataGridConfig.oEidtor.deleteCb != undefined || oDataGridConfig.oEidtor.deleteUrl != undefined) {
                                d = '<a href="javascript:void(0)" data-dom="' + $dom.attr('id') + '" onclick="_deleterow(this)">删除</a>';
                            }
                            return e+d;
                          }
                      }
                });
            }
            
            if(oDataGridConfig.toolbar.length > 0){
                oDataGridConfig.toolbar.push({
                    text: '取消全部',
                    iconCls: 'icon-redo',
                    plain: true,
                    handler: function (e) {
                        easyuiConfirm('确定取消当前正在编辑的数据?',function(){
                            $('.datagrid-row').each(function(){
                                var index = $(this).attr('datagrid-row-index');
                                $dom.datagrid('cancelEdit', index);
                            });
                        });
                    }
                });
            }

            if (oDataGridConfig.oEidtor.deleteCb != undefined) {
                if (typeof (oDataGridConfig.oEidtor.deleteCb) == 'function') {
                    $dom.data('delete_cb', oDataGridConfig.oEidtor.deleteCb);
                }
            } else if (oDataGridConfig.oEidtor.deleteUrl != undefined) {
                $dom.data('delete_url', oDataGridConfig.oEidtor.deleteUrl);
            }
            
        }
    }
    
    $dom.datagrid(oDataGridConfig);
    var p = $dom.datagrid('getPager');
    p.pagination({
        beforePageText: '第',
        afterPageText: '页共 {pages} 页',
        displayMsg: '当前显示 {from}- {to} 条记录共 {total} 条记录',
        layout: ['list', 'sep', 'first', 'prev', 'links', 'next', 'last', 'sep', 'refresh']
    });
    return $dom;
}

function getRowIndex(target){
    var tr = $(target).closest('tr.datagrid-row');
    return parseInt(tr.attr('datagrid-row-index'));
}

function getRowIdByRowThis(target){
    var $trDom = $(target).closest('tr.datagrid-row');
    var $idDom = $trDom.find('[field="id"]');
    return parseInt($idDom.find('div').html());
}
function _editrow(index){
    var $dom = $('#'+$(index).data('dom'));
    $dom.datagrid('beginEdit', getRowIndex(index));
}
function _deleterow(index){
    var $dom = $('#'+$(index).data('dom'));
    var url = $dom.data('delete_url');
    var cb = $dom.data('delete_cb');
    if(url == undefined && cb == undefined){
        return;
    }
    $.messager.confirm('提醒','确定删除当前选中行数据?',function(r){
        if (r){
            var id = getRowIdByRowThis(index);
            var data = $dom.datagrid('getData');
            var rows = data.rows;
            for (var i in rows) {
                if (rows[i].id == id) {
                    //优先处理回调一旦设置回调将不在自动提交deleteUrl
                    if (typeof (cb) == 'function') {
                        cb(rows[i]);
                        break;
                    }
                    if (url != undefined) {
                        delDataGridRow($dom, url, {id: rows[i].id}, undefined, function (result) {
                            UBox.show(result.msg, result.status);
                            if (result.status == 1) {
                                $dom.datagrid('deleteRow', getRowIndex(index));
                            }
                        });
                        break;
                    }
                    break;
                }
            }
        }
    });
}

function easyuiConfirm(msg,okFun,onFun){
    $.messager.confirm('提醒',msg,function(r){
        if (r){
            if(okFun != undefined){
                return okFun();
            }
        }        
        if(onFun != undefined){
            return onFun();
        }
    });
}
function prompt(title,msg,cb){
    if(title == undefined){
        title = '操作提示';
    }
    if(msg == undefined){
        title = '您确定要执行操作吗';
    }
    if(cb == undefined){
        cb = function(){
            if (data) {  
                alert("确定");  
            }  
            else {  
                alert("取消");  
            }  
        }
    }
    $.messager.prompt(title,msg,cb);  
}

function _saverow(index){
    var $dom = $('#'+$(index).data('dom'));
    $dom.datagrid('endEdit', getRowIndex(index));
}
function _cancelrow(index){
    var $dom = $('#'+$(index).data('dom'));
    $dom.datagrid('cancelEdit', getRowIndex(index));
}

/**
 * 删除datagrid一行数据会自动获取选中当前行
 * @param {type} $dom dataGridDom
 * @param {type} url 处理rul
 * @param {type} msg 窗口标题
 * @param {type} callback 回调
 */
function delDataGridRowById($dom, url, msg, callback) {
    if ($dom == undefined) {
        return $.error('delDataGridRowById function parameter  $dom is 必须');
    }
    var oData = $dom.datagrid('getSelected');
    if (!oData) {
        return UBox.show('请先选择要编辑的列', -1);
    }
    if (msg == undefined) {
        var msg = '确定要删除选中的数据';
        if (oData.id != undefined) {
            msg = '确定要删除id为<br />(&nbsp;<b style="color:red">' + oData.id + '&nbsp;</b>)<br />确定删除?';
        }
    }
    $.messager.confirm("确认", msg, function (r) {
        if (r) {
            ajax({
                url: url,
                data: oData,
                success: function (result) {
                    if (callback != undefined) {
                        return callback(result);
                    }
                    UBox.show(result.msg, result.status);
                    if (result.status == 1) {
                        $dom.datagrid('reload');
                    }
                }
            });
        }
    });
}

/**
 * 弹窗处理一行数据会自动获取选中当前行
 * @param {type} $dom dataGridDom
 * @param {type} url 处理rul
 * @param {type} msg 窗口标题
 * @param {type} callback 回调
 */
function dealConfirmRowById($dom, url, msg, callback) {
    if ($dom == undefined) {
        return $.error('delDataGridRowById function parameter  $dom is 必须');
    }
    var oData = $dom.datagrid('getSelected');
    if (!oData) {
        return UBox.show('请先选择要编辑的列', -1);
    }
    if (msg == undefined) {
        var msg = '确定要处理选中的数据';
        if (oData.id != undefined) {
            msg = '确定要处理id为<br />(&nbsp;<b style="color:red">' + oData.id + '&nbsp;</b>)<br />的数据?';
        }
    }
    $.messager.confirm("确认", msg, function (r) {
        if (r) {
            ajax({
                url: url,
                data: oData,
                success: function (result) {
                    if (callback != undefined) {
                        return callback(result);
                    }
                    UBox.show(result.msg, result.status);
                    if (result.status == 1) {
                        $dom.datagrid('reload');
                    }
                }
            });
        }
    });
}

/**
 * 上次datagrid数据
 * @param {type} $dom datagridDom
 * @param {type} url 发送给后端处理地址
 * @param {type} oData 搜东获取数据传递id
 * @param {type} msg 删除时候的提示
 * @param {type} callback 回调函数
 */
function delDataGridRow($dom, url, oData, msg, callback) {
    if ($dom == undefined) {
        return $.error('delDataGridRow function parameter  $dom is 必须');
    }
    if (msg == undefined) {
        var msg = '确定要删除选中的数据';
        if (oData.id != undefined) {
            msg = '确定要删除id为<br />(&nbsp;<b style="color:red">' + oData.id + '&nbsp;</b>)<br />确定删除?';
        }

    }
    $.messager.confirm("确认", msg, function (r) {
        if (r) {
            ajax({
                url: url,
                data: oData,
                success: function (result) {
                    if (callback != undefined) {
                        return callback(result);
                    }
                    UBox.show(result.msg, result.status);
                    if (result.status == 1) {
                        $dom.datagrid('reload');
                    }
                }
            });
        }
    });
}

/**
 * datagrid编辑点击事件
 * @param {type} $dom datagridDom
 * @param {type} title 窗口名称
 * @param {type} url url
 * @param {type} oOption 属性
 */
function editorDataGridRowById($dom, title, url, oOption) {
    if ($dom == undefined) {
        return $.error('editorDataGridRowById function parameter  $dom is 必须');
    }
    if (oOption == undefined) {
        var oOption = {width: ($(document).width() - 200), height: ($(document).height() - 200)};
    }
    var row = $dom.datagrid('getSelected');
    if (!row) {
        return UBox.show('请先选择要编辑的数据列', -1);
    }
    return createWindow(url + "?id=" + row.id, title, oOption);
}

/**
 * 点击datagrid 添加事件
 * @param {type} title 窗口名称
 * @param {type} url 请求的url地址
 * @param {type} oOption windows option
 */
function addDataGridRow(title, url, oOption) {
    if (oOption == undefined) {
        var oOption = {width: ($(document).width() - 200), height: ($(document).height() - 200)};
    }
    return createWindow(url, title, oOption);
}


function createTreeGrid($dom,oOption){
     if ($dom == undefined) {
        return $.error('createDataGrid function parameter is 必须');
    }

    var _aCofing = {
        url:'',
        idField:'id',
        treeField:'name',
        lines: true,
        height:($(document).height() - 100),
        columns: [],
        queryParams: {
            _csrf: $('meta[name="csrf-token"]').attr('content')
        },
    };
    var oDataGridConfig = $.extend({}, _aCofing, oOption);
    $dom.treegrid(oDataGridConfig);
    return $dom;
}

function createPanel($dom,oOption){
     if ($dom == undefined) {
        return $.error('createPanel function parameter is necessary');
    }

    var _aCofing = {
        width:500,
        height:150,
        title:'My Panel',
        tools:[
        {iconCls:'icon-add', handler:function(){alert('new')} },
        {iconCls:'icon-save',handler:function(){alert('save')}}
        ]
    };
    var oDataGridConfig = $.extend({}, _aCofing, oOption);
    $dom.panel(oDataGridConfig);
    return $dom;
}

function ajaxUpload($dom,url,name,callback){
    if(callback == undefined){
        callback = function(aResult){
            if(aResult.status == 1){
                console.log(aResult.data);
            }else{
                UBox.show(aResult.msg, aResult.status);
            }
        }
    }
    if(name == undefined){
        name = 'image'
    }
    $dom.AjaxUpload({
            uploadUrl : url,
            fileKey : name,
            callback : function(aResult){
                callback(aResult);
            }
    });
}

function getCsrfToken(){
    var csrfToken = $('meta[name="csrf-token"]').attr('content');
    if(csrfToken != undefined){
        return csrfToken;
    }
    return false;
}

function searchDataGrid($domDatagrid, $formDom) {
    $domDatagrid.datagrid('load', getSearchCondition($formDom));
}


function getSearchCondition($formDom) {
    var aData = getFormJson($formDom.serializeArray());
    clearDataNullWorth(aData);
    clearDataIsAllWorth(aData);
    var csrfToken = getCsrfToken();
    if(!csrfToken){
        return UBox.show('会话信息已过期,请刷新重试');
    }
    aData._csrf = csrfToken;
    return aData;
}

/**
 * 1.<textarea class='J-content' name="content" style="width:600px;height:500px;visibility:hidden;"></textarea>
 * 2.在页面加载完成加入 aEditorList.push({content : createKineditor($('textarea[name="content"]'))});
 * 3.在提交之前加上
 * getEContent();
 */
function createKineditor($dom,KuploadJson,KfileManagerJson){
    return KindEditor.create($dom, {
            urlType:'domain',
            uploadJson : KuploadJson,
            fileManagerJson : KfileManagerJson,
            allowFileManager : true
    });
    prettyPrint();
}

function getEContent(aEditorList){
    //如果有编辑器
    for(var i in aEditorList){
        var aItmes = aEditorList[i];
        for (var item in aItmes) {
            $('textarea[name="'+ item +'"]').html(aItmes[item].html());
            $('textarea[name="'+ item +'"]').val(aItmes[item].html());
        }
    }
}
